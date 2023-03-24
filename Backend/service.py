import googlemaps
import csv
from geopy.geocoders import Nominatim
import time

# Initialize the client
client = googlemaps.Client('AIzaSyCpNT8X2EQ48kkPJEvAuLCWBYqPkyApfC0')

# NYC Zipcodes to search
zipcodes = [10001, 10002, 10003, 10004, 10005, 10006, 10007, 10009, 10010, 10011, 10012, 10013, 10014, 10015, 
            10016, 10017, 10018, 10019, 10020, 10021, 10022, 10023, 10024, 10025, 10026, 10027, 10028, 10029, 
            10030, 10031, 10032, 10033, 10034, 10035, 10036, 10037, 10038, 10039, 10040, 10041, 10044, 10045, 
            10048, 10055, 10060, 10069, 10090, 10095, 10098, 10099, 10103, 10104, 10105, 10106, 10107, 10110, 
            10111, 10112, 10115, 10118, 10119, 10120, 10121, 10122, 10123, 10128, 10151, 10152, 10153, 10154, 
            10155, 10158, 10161, 10162, 10165, 10166, 10167, 10168, 10169, 10170, 10171, 10172, 10173, 10174, 
            10175, 10176, 10177, 10178, 10199, 10451, 10452, 10453, 10454, 10455, 10456, 10457, 10458, 10459, 
            10460, 10461, 10462, 10463, 10464, 10465, 10466, 10467, 10468, 10469, 10470, 10471, 10472, 10473, 
            10474, 10475, 11201, 11203, 11204, 11205, 11206, 11207, 11208, 11209, 11210, 11211, 11212, 11213, 
            11214, 11215, 11216, 11217, 11218, 11219, 11220, 11221, 11222, 11223, 11224, 11225, 11226, 11228, 
            11229, 11230, 11231, 11232, 11233, 11234, 11235, 11236, 11237, 11238, 11239, 11241, 11242, 11243, 
            11249, 11252, 11256]

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
# check for only english
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
    places = client.places(
            query='restaurant', 
            location=(location.latitude, location.longitude), 
            radius=100000, 
            type='restaurant', 
            region='ny'
        )
    # Loop through each result and write to the CSV file
    with open(output_file, 'a', newline='') as file:
            writer = csv.writer(file)
            for place in places['results']:
                if place.get('formatted_address') is None:
                    if not place['name'] in restaurants_seen and isEnglish(place['name']):
                        restaurants_seen.append(place['name'])
                        writer.writerow([place['name'], 'No address available'])
                else:
                    if not place['name'] in restaurants_seen and isEnglish(place['name']) and isEnglish(place['formatted_address']):
                        restaurants_seen.append(place['name'])
                        writer.writerow([place['name'], place['formatted_address']])                     
    
    # get more results, but the API will only allow for 40 so only do it once
    page_token = places['next_page_token']
    time.sleep(2)
    places = client.places(query='restaurant', location=(location.latitude, location.longitude), radius = 1000, type='restaurant', region='ny', page_token=page_token)
    with open(output_file, 'a', newline='') as file:
            writer = csv.writer(file)
            for place in places['results']:
                if not place['name'] in restaurants_seen and isEnglish(place['name']) and isEnglish(place['formatted_address']):
                    restaurants_seen.append(place['name'])
                    writer.writerow([place['name'], place['formatted_address']])
print(restaurants_seen)
print("Length of list")
print(len(restaurants_seen))