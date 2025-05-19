import os
import httpx
import json
from dotenv import load_dotenv
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()
API_KEY = os.getenv("TICKETMASTER_API_KEY")

print(f"API Key loaded: {API_KEY[:5]}...{API_KEY[-5:]}")

# Base URL for Ticketmaster API
base_url = "https://app.ticketmaster.com/discovery/v2/events.json"

# Simple parameters for testing
params = {
    "apikey": API_KEY,
    "keyword": "concert",
    "size": 5
}

print(f"Making request to: {base_url}")
print(f"With parameters: {params}")

try:
    # Make the API request
    response = httpx.get(base_url, params=params)
    
    # Print status code
    print(f"Status code: {response.status_code}")
    
    # Parse response
    if response.status_code == 200:
        data = response.json()
        
        # Check if events were found
        if "_embedded" in data and "events" in data.get("_embedded", {}):
            events = data["_embedded"]["events"]
            print(f"Success! Found {len(events)} events")
            
            # Print first event details
            if events:
                event = events[0]
                print(f"\nFirst event: {event.get('name')}")
                if "dates" in event and "start" in event["dates"]:
                    print(f"Date: {event['dates']['start'].get('localDate')}")
                if "_embedded" in event and "venues" in event["_embedded"]:
                    venue = event["_embedded"]["venues"][0]
                    print(f"Venue: {venue.get('name')}")
                    if "city" in venue:
                        print(f"City: {venue['city'].get('name')}")
        else:
            print("No events found in response")
            print("Response keys:", list(data.keys()))
    else:
        print(f"Error response: {response.text}")
        
except Exception as e:
    print(f"Exception occurred: {e}")
