import os
from dotenv import load_dotenv
from services.providers.ticketmaster import get_upcoming_events

# Load environment variables
load_dotenv()

# Check if Ticketmaster API key is set
api_key = os.getenv("TICKETMASTER_API_KEY")
if not api_key:
    print("Warning: TICKETMASTER_API_KEY not found in .env file")
    print("Please get an API key from https://developer.ticketmaster.com/ and add it to your .env file:")
    print("TICKETMASTER_API_KEY=your_api_key_here")
else:
    print(f"Ticketmaster API key found: {api_key[:5]}...{api_key[-5:] if len(api_key) > 10 else ''}")

# Test the API with a sample location and interests
print("\nTesting Ticketmaster API with sample data...")
location = "Atlanta, GA"  # Search for events in Atlanta
interests = ["concert", "music", "show"]  # Use common event keywords

events = get_upcoming_events(location, interests)

if events:
    print(f"\nSuccess! Found {len(events)} events in {location}:")
    for i, event in enumerate(events, 1):
        print(f"\nEvent {i}: {event['title']}")
        print(f"Date: {event['date']}")
        print(f"Venue: {event['venue']}, {event['address']}")
        print(f"Price: {event['price_range']}")
        print(f"Link: {event['url']}")
else:
    print(f"\nNo events found in {location} or API error occurred.")
    print("Check the console output above for error details.")


