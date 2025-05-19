import os
import httpx
import json
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()
TICKETMASTER_API_KEY = os.getenv("TICKETMASTER_API_KEY")

def get_upcoming_events(location: str, interests: list):
    """
    Fetch upcoming events from Ticketmaster API based on location and interests.
    
    Args:
        location (str): City or location name
        interests (list): List of keywords/interests to search for
        
    Returns:
        list: List of event dictionaries with details
    """
    base_url = "https://app.ticketmaster.com/discovery/v2/events.json"
    
    # If no API key is set, return empty list
    if not TICKETMASTER_API_KEY:
        print("[Ticketmaster ERROR] No API key found. Set TICKETMASTER_API_KEY in .env file.")
        return []
    
    # Calculate date range (today to 2 weeks from now)
    start_date = datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")
    end_date = (datetime.now() + timedelta(days=14)).strftime("%Y-%m-%dT%H:%M:%SZ")
    
    # Combine interests into keywords, or use default romantic keywords
    keywords = " ".join(interests) if interests else "date night couples romantic"
    
    params = {
        "apikey": TICKETMASTER_API_KEY,
        "keyword": keywords,
        "startDateTime": start_date,
        "endDateTime": end_date,
        "size": 20,  # Increase number of results
        "sort": "date,asc"  # Sort by date ascending
    }
    
    # Only add city parameter if location is provided
    if location:
        # Try to parse city and state if provided in format "City, State"
        location_parts = location.split(",")
        city = location_parts[0].strip()
        params["city"] = city
    
    try:
        response = httpx.get(base_url, params=params)
        data = response.json()
        
        if response.status_code != 200:
            print(f"[Ticketmaster ERROR {response.status_code}] {data.get('errors') or data}")
            return []
        
        # Check if events were found
        if "_embedded" not in data or "events" not in data.get("_embedded", {}):
            print(f"[Ticketmaster INFO] No events found for {location} with keywords: {keywords}")
            return []
        
        events = []
        for event in data["_embedded"]["events"]:
            # Get venue details if available
            venue_name = "Venue TBD"
            venue_address = "Address TBD"
            
            if "_embedded" in event and "venues" in event["_embedded"] and event["_embedded"]["venues"]:
                venue = event["_embedded"]["venues"][0]
                venue_name = venue.get("name", "Venue TBD")
                
                address_parts = []
                if "address" in venue and "line1" in venue["address"]:
                    address_parts.append(venue["address"]["line1"])
                if "city" in venue and "name" in venue["city"]:
                    address_parts.append(venue["city"]["name"])
                if "state" in venue and "name" in venue["state"]:
                    address_parts.append(venue["state"]["name"])
                
                venue_address = ", ".join(address_parts) if address_parts else "Address TBD"
            
            # Format the event date
            event_date = "Date TBD"
            if "dates" in event and "start" in event["dates"]:
                start_info = event["dates"]["start"]
                if "localDate" in start_info:
                    event_date = start_info["localDate"]
                    if "localTime" in start_info:
                        event_date += f" at {start_info['localTime']}"
            
            # Get price range if available
            price_range = "Price TBD"
            if "priceRanges" in event and event["priceRanges"]:
                min_price = event["priceRanges"][0].get("min")
                max_price = event["priceRanges"][0].get("max")
                currency = event["priceRanges"][0].get("currency", "USD")
                
                if min_price and max_price:
                    price_range = f"${min_price} - ${max_price} {currency}"
                elif min_price:
                    price_range = f"From ${min_price} {currency}"
            
            events.append({
                "title": event.get("name", "Event Name TBD"),
                "date": event_date,
                "venue": venue_name,
                "address": venue_address,
                "price_range": price_range,
                "url": event.get("url", "#"),
                "image": event.get("images", [{}])[0].get("url") if event.get("images") else None,
                "type": event.get("classifications", [{}])[0].get("segment", {}).get("name", "Event") if event.get("classifications") else "Event"
            })
        
        return events[:3]  # Return top 3 events
        
    except Exception as e:
        print(f"[Ticketmaster EXCEPTION] {e}")
        return []

def test_ticketmaster_api(location="New York"):
    """Test function to verify Ticketmaster API is working"""
    events = get_upcoming_events(location, ["concert", "theater"])
    
    if events:
        print(f"✅ Found {len(events)} events in {location}:")
        for i, event in enumerate(events, 1):
            print(f"\n🎟️ Event {i}: {event['title']}")
            print(f"🕒 Date: {event['date']}")
            print(f"📍 Venue: {event['venue']}, {event['address']}")
            print(f"💰 Price: {event['price_range']}")
            print(f"🔗 Link: {event['url']}")
    else:
        print(f"❌ No events found in {location} or API error occurred.")

if __name__ == "__main__":
    # Run test if this file is executed directly
    test_ticketmaster_api()
