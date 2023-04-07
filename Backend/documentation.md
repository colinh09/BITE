## Schema Overview

This backend application consists of 3 main collections:

1. Users
2. Restaurants
3. Ratings

### User

The `User` collection represents the users of the application. Each user has the following properties:

- **username** (String, required): The username of the user.
- **email** (String, required): The email address of the user.
- **password** (String, required): The password of the user (hashed and stored securely).

### Restaurant

The `Restaurant` collection represents the restaurants that can be reviewed and rated by the users. Each restaurant has the following properties:

- **name** (String, required): The name of the restaurant.
- **location** (String, required): The location of the restaurant.
- **average_price_rating** (Number): The average price rating of the restaurant, based on user ratings.
- **average_user_rating** (Number): The average star rating of the restaurant, based on user ratings.

### Rating

The `Rating` collection represents the ratings and reviews submitted by users for different restaurants. Each rating has the following properties:

- **user_id** (ObjectId, required): A reference to the User who submitted the rating. 
- **restaurant_id** (ObjectId, required): A reference to the Restaurant being rated.
- **review_content** (String, required): The text content of the review.
- **star_rating** (Number, required): The star rating given by the user (e.g., 1 to 5).
- **price_level** (Number, required): The price level rating given by the user.
- **repeat_visit** (Boolean, required): Whether the user would visit the restaurant
- **public_review** (Boolean, required): Whether the review is publicly visible or not.