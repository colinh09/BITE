from pymongo import MongoClient

client = MongoClient("mongodb+srv://colin:<password>@cluster0.zqayzpq.mongodb.net/?retryWrites=true&w=majority")
db = client.BITE

user_collection = db["users"]
restaurant_collection = db["restaurants"]
rating_collection = db["ratings"]

user_document = {
    "username": "Boo Choi",
    "email": "boo@gmail.com",
    "password": "pinkawoo1234!"
}

user_result = user_collection.insert_one(user_document)
user_object_id = user_result.inserted_id

restaurant_document = {
    "name": "boo cafe",
    "location": "boo land",
    "cuisine_type": "fwish",
    "average_price_rating": 3.5,
    "average_user_rating": 4.2
}

restaurant_result = restaurant_collection.insert_one(restaurant_document)
restaurant_object_id = restaurant_result.inserted_id

rating_document = {
    "user_id": user_object_id,
    "restaurant_id": restaurant_object_id,
    "review_content": "vewy good",
    "star_rating": 4,
    "price_level": 3,
    "repeat_visit": True,
    "public_review": True
}

rating_collection.insert_one(rating_document)