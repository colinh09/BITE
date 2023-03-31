import pandas as pd
from pymongo import MongoClient

client = MongoClient("mongodb+srv://colin:boobadiboo@cluster0.zqayzpq.mongodb.net/?retryWrites=true&w=majority")
db = client.BITE
restaurant_collection = db["restaurants"]

# Read CSV file
data = pd.read_csv("restaurant_data.csv")

# Iterate through each row and insert into the 'restaurants' collection
for index, row in data.iterrows():
    restaurant_document = {
        "name": row["name"],
        "location": row["address"],
        "average_user_rating": row["rating"],
        "average_price_rating": row["price_level"]
    }
    restaurant_collection.insert_one(restaurant_document)