import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")

if not MONGO_URI:
    raise Exception("MONGODB_URI is not set in environment variables")

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.server_info()  # forces connection test
    db = client["facetrace"]
    print("MongoDB connected successfully")
except Exception as e:
    print("MongoDB connection failed:", repr(e))
    db = None