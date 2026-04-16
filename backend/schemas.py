from pydantic import BaseModel
from datetime import date
from fastapi import Request
from fastapi.responses import FileResponse
import os
from bson import ObjectId
import pprint
from db import db

class Victim(BaseModel):
    firstname: str
    lastname: str
    age: int
    gender: str
    address: str
    lastlocation: str
    moredetails: str
    phone: str
    date: date
    victim_image: str

class Sender(BaseModel):
    firstname: str
    lastname: str
    address: str
    phone: str
    relationship: str
    citizenship_card: str



def serialize_victim(victim,senders_collection, request: Request) -> dict:
    id = str(victim['_id'])
    image = str(request.base_url) + os.path.join('static','victims', id + '.jpg')
    sender_id = str(victim['sender_id'])
    sender = senders_collection.find_one({'_id': ObjectId(sender_id)})
    sender_citizenship = str(request.base_url) + os.path.join('static','senders', sender_id + '.jpg')
    return {
        '_id': id,
        'firstname': victim['firstname'],
        'lastname': victim['lastname'],
        'age': victim['age'],
        'address': victim['address'],
        'date': victim['date'],
        'phone': victim['phone'],
        'more_details': victim['moredetails'],
        'gender': victim['gender'],
        'last_location': victim['lastlocation'],
        'sender':{
            '_id': sender_id,
            'firstname': sender['firstname'],
            'lastname': sender['lastname'],
            'address': sender['address'],
            'phone': sender['phone'],
            'relationship': sender['relationship']
        },
        'status': victim['status'],
        'image': image,
        'sender_citizenship': sender_citizenship
        
    }

def serialize_found_person(victim, victims_collection, senders_collection, request: Request) -> dict:
    id = str(victim['victim_id'])
    found_date = victim['found_datetime']
    image = str(request.base_url) + os.path.join('static','victims', id + '.jpg')
    sender_id = str(victim['sender_id'])
    sender_citizenship = str(request.base_url) + os.path.join('static','senders', sender_id + '.jpg')

    victim = victims_collection.find_one({'_id': ObjectId(id)})
    sender = senders_collection.find_one({'_id': ObjectId(sender_id)})

    if not sender or not victim:
        print('no sender or victim')
        return None
    return {
        '_id': id,
        'firstname': victim['firstname'],
        'lastname': victim['lastname'],
        'found_date': found_date,
        'found_location': 'Banepa',
        'age': victim['age'],
        'address': victim['address'],
        'date': victim['date'],
        'phone': victim['phone'],
        'more_details': victim['moredetails'],
        'gender': victim['gender'],
        'last_location': victim['lastlocation'],
        'status': victim['status'],
        'sender':{
            '_id': sender_id,
            'firstname': sender['firstname'],
            'lastname': sender['lastname'],
            'address': sender['address'],
            'phone': sender['phone'],
            'relationship': sender['relationship']
        },
        'image': image,
        'sender_citizenship': sender_citizenship
        
    }