import httpx
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta

# Load Eventbrite OAuth token
load_dotenv()
token = os.getenv("EVENTBRITE_OAUTH_TOKEN")
print(f"Token loaded: {'Yes' if token else 'No'}")

# API Endpoint - Try without trailing slash
url = "https://www.eventbriteapi.com/v3/events/search"

# Time range: today to 7 days later
now = datetime.utcnow()
week_later = now + timedelta(days=7)

params = {
    "location.address": "Atlanta",
    "q": "couples date night",
    "sort_by": "date",
    "start_date.range_start": now.isoformat() + "Z",
    "start_date.range_end": week_later.isoformat() + "Z",
    "expand": "venue",
    "token": token  # Try including token as a parameter as well
}

headers = {
    "Authorization": f"Bearer {token}"
}

# Print the full URL and token for debugging (remove in production)
print(f"Using URL: {url}")
print(f"Using token: {token[:5]}...{token[-5:] if token and len(token) > 10 else ''}")
print(f"Full request URL with params: {url}?{'&'.join([f'{k}={v}' for k, v in params.items() if k != 'token'])}")

# Make API request
try:
    response = httpx.get(url, headers=headers, params=params)
    
    # Print status and data
    print(f"🔎 Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        for i, event in enumerate(data.get("events", []), 1):
            print(f"\n🎟️ Event {i}: {event['name']['text']}")
            print(f"🕒 Date: {event['start']['local']}")
            print(f"📍 Venue: {event.get('venue', {}).get('address', {}).get('localized_address_display', 'N/A')}")
            print(f"🔗 Link: {event['url']}")
    else:
        print("❌ Error:", response.json())
        
        # Try alternative approach without headers
        print("\nTrying alternative approach without Authorization header...")
        alt_params = params.copy()
        alt_response = httpx.get(url, params=alt_params)
        print(f"Alternative Status: {alt_response.status_code}")
        if alt_response.status_code != 200:
            print("Alternative Error:", alt_response.json())
        else:
            print("Alternative approach succeeded!")
            
except Exception as e:
    print(f"Exception occurred: {e}")