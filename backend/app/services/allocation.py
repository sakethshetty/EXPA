from pymongo.database import Database
import datetime
from typing import Dict

def allocate(db: Database):
    camps = db['camp'].find()
    for camp in camps:
        camp_date = camp["date"]
        if camp_date == (datetime.datetime.now() + datetime.timedelta(days=21)).date():
            finalize_allocation(camp["_id"], camp, db)

def finalize_allocation(camp_id, camp: Dict, db: Database):
    trainer_count = camp["camp_size"]
    trainers = list(db['temp_alloc'].find({"camp_id": camp_id}))
    
    male_trainers = sorted([t for t in trainers if t['gender'] == 'male'], key=lambda x: x['experience'], reverse=True)[:trainer_count // 2]
    female_trainers = sorted([t for t in trainers if t['gender'] == 'female'], key=lambda x: x['experience'], reverse=True)[:trainer_count // 2]

    assigned_trainers = male_trainers + female_trainers
    
    # Update status of male trainers
    db['temp_alloc'].update_many(
        {"_id": {"$in": [trainer["_id"] for trainer in male_trainers]}},
        {"$set": {"status": "assigned"}}
    )
    
    # Update status of female trainers
    db['temp_alloc'].update_many(
        {"_id": {"$in": [trainer["_id"] for trainer in female_trainers]}},
        {"$set": {"status": "assigned"}}
    )
    
    # Update status of remaining trainers
    db['temp_alloc'].update_many(
        {"_id": {"$nin": [trainer["_id"] for trainer in assigned_trainers]}},
        {"$set": {"status": "cancelled"}}
    )
    
    # Call add_route for each assigned trainer
    for trainer in assigned_trainers:
        add_route(trainer['src'], trainer['dst'], camp["date"])

from fastapi import Request
from amadeus import Client, ResponseError

# Replace with your actual API key and secret
amadeus_api_key = 'TmSeUb2EcQ8ZHeS0V34hA9D2K0VJHOI1'
amadeus_api_secret = 'CKB5yd1siRGJGdee'

import requests

# Replace with your actual ExchangeRate API key
exchange_rate_api_key = '9128c96195259d2b5f19c52c'

def get_exchange_rate(api_key, from_currency, to_currency):
    url = f"https://v6.exchangerate-api.com/v6/{api_key}/latest/{from_currency}"
    response = requests.get(url)
    if response.status_code == 200:
        rates = response.json().get('conversion_rates', {})
        return rates.get(to_currency)
    else:
        print("Failed to fetch exchange rates:", response.status_code)
        return None

def get_flight_prices_with_times(src, dst, date, exchange_rate):
    amadeus = Client(
        client_id=amadeus_api_key,
        client_secret=amadeus_api_secret
    )
    try:
        response = amadeus.shopping.flight_offers_search.get(
            originLocationCode=src,
            destinationLocationCode=dst,
            departureDate=date,
            adults=1
        ).data
        
        if response:
            flight_data = []
            for offer in response:
                price_in_eur = float(offer['price']['total'])
                price_in_inr = price_in_eur * exchange_rate
                segments = offer['itineraries'][0]['segments']
                segment_data = []
                for segment in segments:
                    segment_data.append({
                        "departure_airport": segment['departure']['iataCode'],
                        "departure_time": segment['departure']['at'],
                        "arrival_airport": segment['arrival']['iataCode'],
                        "arrival_time": segment['arrival']['at']
                    })
                
                flight_data.append({
                    "price_in_inr": price_in_inr,
                    "segments": segment_data
                })
            return flight_data
        else:
            print("No flights found for the given route and date.")
            return None
    
    except ResponseError as error:
        print(f"An error occurred: {error}")
        return None

def add_route(src, dst, date):

    exchange_rate = get_exchange_rate(exchange_rate_api_key, 'EUR', 'INR')
    if exchange_rate:
        route_data = get_flight_prices_with_times(src, dst, date, exchange_rate)
        if route_data:
            # Create a list of dictionaries with the required information
            formatted_flight_data = []
            for flight in route_data:
                for segment in flight['segments']:
                    formatted_flight_data.append({
                        "src": segment['departure_airport'],
                        "dst": segment['arrival_airport'],
                        "departure_time": segment['departure_time'],
                        "arrival_time": segment['arrival_time'],
                        "price": flight['price_in_inr']
                    })
                break
            # Print the formatted flight data
            for data in formatted_flight_data:
                print(data)
        else:
            print("No route data available.")
    result = requests.app.database['route'].insert_one(data)
    return {"status": "success", "inserted_id": str(result.inserted_id)}