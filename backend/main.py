import os
from dotenv import load_dotenv

load_dotenv()
from fastapi import FastAPI, WebSocket, HTTPException, Request, Depends, status
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import cv2
import base64  
from pymongo import MongoClient
import numpy as np 
import utils, json, pprint, time
from bson import ObjectId
from schemas import serialize_victim,  serialize_found_person
import os
from db import db
from fastapi.security import  OAuth2PasswordRequestForm
from authenticate import Token,  authenticate_user, create_access_token, UserInDB, get_password_hash, get_authorised_user
from datetime import datetime, timedelta
from typing import Annotated
from pymongo import MongoClient
import os



origins=[os.getenv("FRONTEND_URL")]

# MongoDB connection

MONGO_URI = os.getenv("MONGODB_URI")

client = MongoClient(MONGO_URI)   
# db = client["facetrace"]         present in db.py
victims_collection = db["victims"]
senders_collection = db["senders"]

found_collection = db["found"]
users_collection = db["users"]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def home():
    return {"message": "Backend running"}

from fastapi.staticfiles import StaticFiles

# Get the absolute path to the static folder
script_dir = os.path.dirname(__file__)
static_path = os.path.join(script_dir,"static")
app.mount("/static", StaticFiles(directory=static_path), name="static")

@app.on_event("startup")
def on_startup():
    global facetrace_model
    try:
        facetrace_model = utils.get_model()
        print("model loaded")
    except Exception as e:
        print("MODEL LOAD FAILED:", e)





#Register and Login
ACCESS_TOKEN_EXPIRE_MINUTES = 30
@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm= Depends()):
    user = authenticate_user(users_collection, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

class Registration(BaseModel):
    first_name: str
    last_name: str
    username: str
    password: str


from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
from pymongo import MongoClient




# Password hashing (IMPORTANT FIX)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")



@app.post("/register")
async def register(data: Registration):
    try:
        print("REGISTER HIT")  # DEBUG

        user_data = data.model_dump()

        if users_collection.find_one({"username": user_data["username"]}):
            raise HTTPException(status_code=400, detail="Username already taken")

        hashed_password = get_password_hash(user_data["password"])

        new_user = {
            "first_name": user_data["first_name"],
            "last_name": user_data["last_name"],
            "username": user_data["username"],
            "hashed_password": hashed_password,
        }

        users_collection.insert_one(new_user)

        return {"status": "success"}

    except Exception as e:
        print("REGISTER ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/victim-submit/")
async def form_submit(data: dict):
    victim_details = data.get('victim_details')
    sender_details = data.get('sender_details')
    victim_image = victim_details.pop('victim_image')
    sender_citizenship = sender_details.pop('citizenship_card')

    verification_data= {
        'firstname': victim_details['firstname'],
        'lastname': victim_details['lastname'],
        'gender': victim_details['gender'],
        'age': victim_details['age']
    }
    if victims_collection.find_one(verification_data):
        raise HTTPException(status_code=503, detail="Victim already registered")

    sender_details =  senders_collection.insert_one(sender_details)
    sender_id = sender_details.inserted_id
    victim_details['sender_id'] = sender_id
    victim_details['status'] = 'pending'
    victim_details =  victims_collection.insert_one(victim_details)
    victim_id = victim_details.inserted_id

    utils.save_image(victim_image, victim_id, folder='victims')
    utils.save_image(sender_citizenship, sender_id, folder='senders')


    return {'status':'successfully registered'}





class BoundingBox(BaseModel):
    x: int
    y: int
    w: int
    h: int
    confidence: int

@app.websocket("/ws/face-detect/")
async def facedetect(websocket: WebSocket):
    await websocket.accept()
    while True:
        req = await websocket.receive_text()
        req  = json.loads(req)

        if req.get('type') == 'init':
            print(req)

        elif req.get('type') == 'image':
            data = req.get('value')
            date_time = req.get('datetime')
            encoded_data = data.split(',')[1]
            binary_data = base64.b64decode(encoded_data)
            image = np.frombuffer(binary_data, dtype=np.uint8)
            image = cv2.imdecode(image, cv2.IMREAD_COLOR)
            match = await utils.get_bounding_boxes(image, socket=websocket, model=facetrace_model, victims_collection=victims_collection)
            if match:
                victim_id, match_img = match   #match_img is from webcam
                #after match remove the image from positive images
                # positive_path = os.path.join('static','positive_images', victim_id + '.jpg')
                # if os.path.exists():
                #     os.remove(positive_path)


                victim = victims_collection.find_one({'_id': ObjectId(victim_id)})

                if victim and victim.get('status') == 'matched':
                    print('already matched')
                    continue
                print('first match')
                victims_collection.update_one({'_id': ObjectId(victim_id)}, {'$set': {'status': 'matched'}})
                found_collection.insert_one({'victim_id': victim_id, 'sender_id': victim.get('sender_id'), 'found_datetime': date_time})
                anchor_img = cv2.imread(f'static/positive_images/{victim_id}.jpg')                                
                anchor_img = utils.get_base_64_image(anchor_img)
                match_img = utils.get_base_64_image(match_img)

                await websocket.send_json({'type': 'match', 'victim_img': anchor_img, 'match_img': match_img, 'datetime':date_time})
            








@app.post("/accept-victim/")
async def accept_person(id:dict[str, str]):
    id = id.get('id')
    
    #crop and save in positive images
    filename = id + '.jpg'
    image = cv2.imread(os.path.join('static','victims',filename))
    if image is None:
        raise HTTPException(status_code=400, detail="Bad Request")
    face = utils.crop_face(image)
    if len(face):
        cv2.imwrite(os.path.join('static','positive_images', filename), face)
    victims_collection.find_one_and_update({'_id': ObjectId(id)}, {'$set': {'status': 'accepted'}})
    return{'status':'successfully accepted'}


@app.get('/api/found-victims/')
async def get_found_victims(request: Request):
    if not found_collection.count_documents({}):
        print('no found victims')
        return []
    found_victims = found_collection.find()
    # return []
    response_data = []
    for victim in found_victims:
        data = serialize_found_person(victim, victims_collection, senders_collection, request) 
        if data:
            response_data.append(data)
   
    return  response_data
@app.post("/api/delete-victim/")
async def delete_victim(data: dict):
    victim_id = data.get('id')
    if not victim_id:
        raise HTTPException(status_code=400, detail="ID is required")

    # 1. Find victim to get sender_id before deleting
    victim = victims_collection.find_one({'_id': ObjectId(victim_id)})
    if not victim:
        raise HTTPException(status_code=404, detail="Victim not found")

    sender_id = victim.get('sender_id')

    # 2. Delete from MongoDB
    victims_collection.delete_one({'_id': ObjectId(victim_id)})
    if sender_id:
        senders_collection.delete_one({'_id': ObjectId(sender_id)})

    # 3. Delete Physical Images to prevent 404 loops in frontend
    folders = ['victims', 'positive_images']
    for folder in folders:
        file_path = os.path.join(static_path, folder, f"{victim_id}.jpg")
        if os.path.exists(file_path):
            os.remove(file_path)

    return {"status": "successfully deleted"}
@app.get("/api/victims")
async def get_victims(
    data: dict, 
    request: Request,  # Add this to get the request object
    current_user: Annotated[UserInDB, Depends(get_authorised_user)]
):
    status_filter = data.get("status")
    
    query = {"status": status_filter} if status_filter else {}
    victims = victims_collection.find(query)
    
    # Pass the required arguments to the serializer
    serialized_victims = []
    for victim in victims:
        serialized_victims.append(
            serialize_victim(victim, senders_collection, request)
        )
        
    return serialized_victims








