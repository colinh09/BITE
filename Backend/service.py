import googlemaps
import csv
from geopy.geocoders import Nominatim
import time

# Initialize the client
client = googlemaps.Client('AIzaSyCpNT8X2EQ48kkPJEvAuLCWBYqPkyApfC0')

# NYC Zipcodes to search
zipcodes = [10001, 10002, 10003]


# Ratings to search
ratings = [4.0, 4.5, 5.0]

# Define the output file name
output_file = 'restaurant_data.csv'

# Define the headers for the CSV file
headers = ['Name', 'Address']

# Geolocator
geolocator = Nominatim(user_agent="myGeocoder")

# initialize some stuff
restaurants_seen = list()

# Write the headers to the CSV file
with open(output_file, 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(headers)

count = 0

# WHY ARE THERE SO MANY RESTAURANTS WITH CHINESE LETTERS???
# -*- coding: utf-8 -*-
def isEnglish(s):
    try:
        s.encode(encoding='utf-8').decode('ascii')
    except UnicodeDecodeError:
        return False
    else:
        return True

# Loop through each zipcode and rating
for zipcode in zipcodes:
    location = geolocator.geocode(zipcode)
    # Make the API request

    places = client.places(query='restaurant', location=(location.latitude, location.longitude), radius = 1000, type='restaurant', language='english')
    # Loop through each result and write to the CSV file
    with open(output_file, 'a', newline='') as file:
            writer = csv.writer(file)
            for place in places['results']:
                if not place['name'] in restaurants_seen and isEnglish(place['name']):
                    restaurants_seen.append(place['name'])
                    writer.writerow([place['name'], place['formatted_address']])
    
    # get more results, but the API will only allow for 40 so only do it once
    # page_token = places['next_page_token']
    # time.sleep(2)
    # places = client.places(query='restaurant', location=(location.latitude, location.longitude), radius = 1000, type='restaurant', page_token=page_token)
    # with open(output_file, 'a', newline='') as file:
    #         writer = csv.writer(file)
    #         for place in places['results']:
    #             if not place['name'] in restaurants_seen:
    #                 restaurants_seen.append(place['name'])
    #                 writer.writerow([place['name'], place['formatted_address']])
print(restaurants_seen)
print("Length of list")
print(len(restaurants_seen))