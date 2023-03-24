import requests
from bs4 import BeautifulSoup
from time import sleep

# define the range of zip codes to search
start_zip = 10001
end_zip = 11120

# construct the URL for searching restaurants in this zip code
url = f'https://www.google.com/maps/search/restaurants+{10001}'
# make a GET request to the URL and parse the HTML content
response = requests.get(url)
soup = BeautifulSoup(response.content, 'html.parser')

# find the elements that contain the restaurant information 
restaurant_cards = soup.find_all('div', {'class': 'section-result'})
# extract the desired information from each restaurant card
for card in restaurant_cards:
    name = card.find('h3', {'class': 'section-result-title'}).text
    price_range = card.find('span', {'class': 'section-result-cost'}).text
    location = card.find('span', {'class': 'section-result-location'}).text
    print("HELLO")
    # store the information in a data structure like a list or dictionary
    restaurant_info = {
        'name': name,
        'price_range': price_range,
        'location': location
    }
    print(restaurant_info)
    # do something with the restaurant_info object, such as write it to a file
