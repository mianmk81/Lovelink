import os
import httpx
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

def get_weather_and_pollen(location):
    try:
        geo_url = "https://maps.googleapis.com/maps/api/geocode/json"
        params = {"address": location, "key": API_KEY}
        geo_resp = httpx.get(geo_url, params=params).json()
        coords = geo_resp["results"][0]["geometry"]["location"]
        lat, lng = coords["lat"], coords["lng"]

        # Simulated weather and pollen summary
        weather_summary = f"Partly cloudy, around 68°F, low chance of rain"
        pollen_level = "moderate pollen count"

        return f"{weather_summary}, {pollen_level} in {location}"
    except Exception as e:
        return f"Weather and pollen info unavailable for {location}."