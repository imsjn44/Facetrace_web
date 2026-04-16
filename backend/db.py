from pymongo import MongoClient

client = MongoClient("mongodb+srv://facetrace:facetrace%40123@cluster0.etbyca0.mongodb.net/?appName=Cluster0")
db = client["facetrace"]

