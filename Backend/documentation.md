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

## Routes

### Ratings

#### Search Ratings

* Route: `/search-ratings`
* Method: `GET`
* Query Parameters:
  * `publicOnly`: If 'true', only returns public ratings.
  * `privateOnly`: If 'true', only returns private ratings.
  * `userId`: The user ID for the current user.
* Description: Get a list of ratings based on specified query parameters.

#### Get All Ratings

* Route: `/`
* Method: `GET`
* Description: Get a list of all ratings.

#### Add a New Rating

* Route: `/`
* Method: `POST`
* Description: Add a new rating.

#### Get a Specific Rating

* Route: `/:id`
* Method: `GET`
* Description: Get a specific rating by ID.

#### Update a Rating

* Route: `/:id`
* Method: `PATCH`
* Description: Update a specific rating by ID.

#### Delete a Rating

* Route: `/:id`
* Method: `DELETE`
* Description: Delete a specific rating by ID.

### Users

#### Get All Users

* Route: `/`
* Method: `GET`
* Description: Get a list of all users.

#### Add a New User

* Route: `/`
* Method: `POST`
* Description: Add a new user.

#### Get a Specific User

* Route: `/:id`
* Method: `GET`
* Description: Get a specific user by ID.

#### Update a User

* Route: `/:id`
* Method: `PATCH`
* Description: Update a specific user by ID.

#### Delete a User

* Route: `/:id`
* Method: `DELETE`
* Description: Delete a specific user by ID and remove associated data.

#### Get All Ratings by a Specific User

* Route: `/:id/ratings`
* Method: `GET`
* Description: Get all ratings by a specific user.

#### Add a Restaurant to WantsToTry

* Route: `/:id/wants-to-try/add`
* Method: `PUT`
* Description: Add a restaurant to the wantsToTry list for a specific user.

#### Delete a Restaurant from WantsToTry

* Route: `/:id/wants-to-try/delete`
* Method: `PUT`
* Description: Delete a restaurant from the wantsToTry list for a specific user.

#### Add a Restaurant to HaveBeenTo

* Route: `/:id/have-been-to/add`
* Method: `PUT`
* Description: Add a restaurant to the haveBeenTo list for a specific user.

#### Delete a Restaurant from HaveBeenTo

* Route: `/:id/have-been-to/delete`
* Method: `PUT`
* Description: Delete a restaurant from the haveBeenTo list for a specific user.

#### View a Friend's HaveBeenTo and WantToTry Lists

* Route: `/:id/friends/:friendId/lists`
* Method: `GET`
* Description: View a friend's haveBeenTo and wantToTry lists.

#### Add Friend

* Route: `/:id/friends/add`
* Method: `PUT`
* Description: Add a friend to a specific user's friend list.

#### Delete Friend

* Route: `/:id/friends/delete`
* Method: `PUT`
* Description: Delete a friend from a specific user's friend list.

### Restaurants

#### Search Restaurants

* Route: `/search-restaurants`
* Method: `GET`
* Description: Retrieve restaurants based on their star and price ratings.
* Query Parameters:
  * `minStar`: Minimum star rating (float)
  * `maxStar`: Maximum star rating (float)
  * `minPrice`: Minimum price rating (float)
  * `maxPrice`: Maximum price rating (float)

#### Get All Restaurants

* Route: `/restaurants`
* Method: `GET`
* Description: Get all restaurants.

#### Add a New Restaurant

* Route: `/restaurants`
* Method: `POST`
* Description: Create a new restaurant.
* Request Body:
  * `name`: Restaurant name (string)
  * `location`: Restaurant location (string)
  * `average_user_rating`: Average user rating (float)
  * `average_price_rating`: Average price rating (float)

#### Get a Specific Restaurant

* Route: `/restaurants/:id`
* Method: `GET`
* Description: Get a specific restaurant by ID.
* URL Parameters:
  * `id`: Restaurant ID (string)

#### Update a Restaurant

* Route: `/restaurants/:id`
* Method: `PATCH`
* Description: Update a restaurant by ID.
* URL Parameters:
  * `id`: Restaurant ID (string)
* Request Body:
  * `name` (optional): Restaurant name (string)
  * `location` (optional): Restaurant location (string)
  * `average_user_rating` (optional): Average user rating (float)
  * `average_price_rating` (optional): Average price rating (float)

#### Delete a Restaurant

* Route: `/restaurants/:id`
* Method: `DELETE`
* Description: Delete a restaurant by ID.
* URL Parameters:
  * `id`: Restaurant ID (string)
