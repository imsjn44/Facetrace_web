import os
import cv2
import numpy as np
import tensorflow as tf
import keras
from keras import layers, utils
from fastapi import WebSocket
import base64
from bson import ObjectId
import asyncio

# Assign aliases for clearer class definitions
Layer = layers.Layer
register_keras_serializable = utils.register_keras_serializable

def save_image(image:str, id:str, folder:str) -> str:
    filename = str(id) + '.jpg'
    encoded_data = image.split(',')[1]
    binary_image = base64.b64decode(encoded_data)
    image_np = np.frombuffer(binary_image, dtype=np.uint8)
    image_cv = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

    # Use absolute path for saving
    base_dir = os.path.dirname(os.path.abspath(__file__))
    path = os.path.join(base_dir, 'static', folder, filename)
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(path), exist_ok=True)
    cv2.imwrite(path, image_cv)
    return path

async def get_bounding_boxes(image, socket:WebSocket, model=None, victims_collection=None):
    faces = get_faces(image)
    if not faces:
        print('no face detected')
        return None
    
    print('face checking')
    positive_paths = get_positive_paths(victims_collection)
    if not positive_paths:
        return 
        
    for victim_id, img_path in positive_paths.items():
        print('ready to run the model hehe')
        img = cv2.imread(img_path)
        if img is None: continue
        
        img = cv2.resize(img, (224, 224))
        img = preprocess_image(img)
        img = np.expand_dims(img, axis=0)

        for face in faces:
            x, y, w, h = face["x"], face["y"], face["w"], face["h"]
            crop = image[y:y + h, x:x + w]
            crop = cv2.resize(crop, (224, 224))
            anchor = preprocess_image(crop)
            anchor = np.expand_dims(anchor, axis=0)
                        
            prediction = model.predict([img, anchor])
            print(prediction)
            
            if int(prediction[0][0]) == 1:
                print('found')
                return (victim_id, crop)

def crop_face(image):
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5)
    for (x, y, w, h) in faces:
        crop = image[y:y + h, x:x + w]
        crop = cv2.resize(crop, (224, 224))
        return crop

def get_faces(image):
    bounding_boxes = []
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5)
    for (x, y, w, h) in faces:
        bounding_boxes.append({
            "x": int(x),
            "y": int(y),
            "w": int(w),
            "h": int(h),
            "confidence": 0
        })
    return bounding_boxes if bounding_boxes else None

def get_positive_paths(victims_collection):
    paths = dict()
    base_dir = os.path.dirname(os.path.abspath(__file__))
    root = os.path.join(base_dir, 'static', 'positive_images')
    
    if not os.path.exists(root):
        return paths

    for path in os.listdir(root):
        victim_id = path.split('.')[0] 
        try:
            victim = victims_collection.find_one({'_id': ObjectId(victim_id)})
            if victim and victim.get('status') == 'matched':
                continue
            paths[victim_id] = os.path.join(root, path)
        except:
            continue
    return paths

def preprocess_image(img):
    img = tf.keras.applications.vgg16.preprocess_input(img)
    return img

def get_model():
    @register_keras_serializable()
    class DistanceLayer(Layer):
        def __init__(self, **kwargs):
            super().__init__(**kwargs)

        def call(self, source_representation, test_representation):
            euclidean_distance = source_representation - test_representation
            euclidean_distance = tf.multiply(euclidean_distance, euclidean_distance)
            euclidean_distance = tf.reduce_sum(euclidean_distance, axis=1)
            euclidean_distance = tf.sqrt(euclidean_distance)
            euclidean_distance = tf.reshape(euclidean_distance, (-1, 1))
            return euclidean_distance
        
    @register_keras_serializable()
    class ThresholdLayer(Layer):
        def __init__(self, threshold=0.5, **kwargs):
            super().__init__(**kwargs)
            self.threshold = threshold
        
        def call(self, distances):
            return tf.map_fn(fn=lambda t: float(t <= self.threshold), elems=distances)

    print("load_model")
    
    # Absolute Path Logic
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, 'static', 'model', 'facetrace1.h5')
    
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model not found at: {model_path}")

    model = tf.keras.models.load_model(model_path, custom_objects={
        "DistanceLayer": DistanceLayer,
        "ThresholdLayer": ThresholdLayer
    })
    return model

def get_base_64_image(image):
    success, buffer = cv2.imencode('.jpg', image)
    if success:
        return 'data:image/jpeg;base64,' + base64.b64encode(buffer).decode('utf-8')
    return None

def remove_image(id, sender_id):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    victim_paths = [
        os.path.join(base_dir, 'static', 'victims', str(id) + '.jpg'), 
        os.path.join(base_dir, 'static', 'positive_images', str(id) + '.jpg')
    ]
    for path in victim_paths:
        if os.path.exists(path):
            os.remove(path)
            
    sender_path = os.path.join(base_dir, 'static', 'senders', str(sender_id) + '.jpg')
    if os.path.exists(sender_path):
        os.remove(sender_path)
        return True
    return False
