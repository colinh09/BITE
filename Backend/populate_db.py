import pandas as pd
from pymongo import MongoClient

client = MongoClient("mongodb+srv://colin:<password>@cluster0.zqayzpq.mongodb.net/?retryWrites=true&w=majority")
db = client.BITE
restaurant_collection = db["restaurants"]

# Read CSV file
data = pd.read_csv("restaurant_data.csv")

# Iterate through each row and insert into the 'restaurants' collection
for index, row in data.iterrows():
    restaurant_document = {
        "name": row["Name"],
        "location": row["Address"],
        "average_user_rating": row["Rating [1-5]"],
        "average_price_rating": row["Price Level [1-4]"]
    }
    restaurant_collection.insert_one(restaurant_document)