import os
import httpx
from dotenv import load_dotenv
from datetime import datetime, timedelta
from services.providers.ticketmaster import get_upcoming_events as get_ticketmaster_events
from utils.gemini import generate_gemini_response
import json

load_dotenv()
EVENTBRITE_TOKEN = os.getenv("EVENTBRITE_OAUTH_TOKEN")

def get_upcoming_events(location: str, interests: list):
    """Get upcoming events using Ticketmaster as primary source with fallbacks"""
    
    # First try: Ticketmaster API
    events = get_ticketmaster_events(location, interests)
    if events:
        print(f"[Events INFO] Found {len(events)} events via Ticketmaster")
        return events
    
    # Second try: Eventbrite API (kept as fallback)
    events = get_eventbrite_events(location, interests)
    if events:
        print(f"[Events INFO] Found {len(events)} events via Eventbrite")
        return events
    
    # Final fallback: Generate AI suggestions
    events = generate_ai_event_suggestions(location, interests)
    if events:
        print(f"[Events INFO] Generated {len(events)} AI event suggestions")
        return events
    
    # If all else fails, return empty list
    return []

def get_eventbrite_events(location: str, interests: list):
    """Legacy Eventbrite integration kept as fallback"""
    base_url = "https://www.eventbriteapi.com/v3/events/search"
    headers = {"Authorization": f"Bearer {EVENTBRITE_TOKEN}"}
    now = datetime.utcnow()
    next_week = now + timedelta(days=7)

    query = " ".join(interests) or "date night couples"
    params = {
        "location.address": location,
        "q": query,
        "sort_by": "date",
        "start_date.range_start": now.isoformat() + "Z",
        "start_date.range_end": next_week.isoformat() + "Z",
        "token": EVENTBRITE_TOKEN  # Try including token as parameter too
    }

    try:
        response = httpx.get(base_url, headers=headers, params=params)
        data = response.json()

        if response.status_code != 200:
            print(f"[Eventbrite ERROR {response.status_code}] {data.get('error_description') or data}")
            return []

        events = data.get("events", [])
        if not events:
            print("[Eventbrite INFO] No events found for query:", query)
            return []

        return [{
            "title": e["name"]["text"],
            "date": e["start"]["local"],
            "venue": "Venue details unavailable",
            "address": "Address unavailable",
            "price_range": "Price unavailable",
            "url": e["url"],
            "type": "Event"
        } for e in events[:3]]

    except Exception as e:
        print(f"[Eventbrite EXCEPTION] {e}")
        return []

def generate_ai_event_suggestions(location: str, interests: list):
    """Generate AI-powered event suggestions as a fallback"""
    interests_text = ", ".join(interests) if interests else "romantic activities, dining, entertainment"
    
    prompt = f"""
    Suggest 3 realistic events that might be happening in {location} that would appeal to couples interested in {interests_text}.
    For each event, include:
    1. A realistic event name
    2. A plausible venue
    3. A fictional date within the next week
    4. A brief description
    5. Why it would appeal to the given interests
    
    Format as JSON array with these exact fields:
    [
      {{
        "title": "event name",
        "date": "YYYY-MM-DD at HH:MM PM",
        "venue": "venue name",
        "address": "fictional but realistic address in {location}",
        "price_range": "$XX - $YY",
        "url": "#",
        "type": "type of event (Concert, Theater, etc.)"
      }}
    ]
    
    Respond ONLY with the JSON array, nothing else.
    """
    
    try:
        response = generate_gemini_response(prompt)
        # Try to extract only the JSON block
        import re
        match = re.search(r'\[.*\]', response, re.DOTALL)
        if match:
            events = json.loads(match.group())
            # Add AI-generated flag
            for event in events:
                event["ai_generated"] = True
            return events
        return []
    except Exception as e:
        print(f"[AI Events EXCEPTION] {e}")
        return []