from utils.gemini import generate_gemini_response
from utils.weather import get_weather_and_pollen
import re

def generate_date_plan(data):
    weather_summary = get_weather_and_pollen(data.location)

    prompt = f"""
You are a romantic AI concierge. Respond ONLY in valid JSON format.

Generate a romantic date plan for a couple based on:
- Location: {data.location}
- Budget: {data.budget}
- Interests: {data.interests}
- Vibe: {data.vibe}
- Weather and pollen: {weather_summary}

The couple prefers:
- Parking at a free or cheap spot near the first activity
- Walking between locations if possible
- Using public transit if walkable options are limited
- Food options that match dietary preferences (Halal, Kosher, Vegetarian, Vegan, Balanced diet) if such keywords appear in their interests

Respond in this exact JSON format:

{{
  "afternoon_activity": {{
    "place": "string",
    "budget_range": "string",
    "walkable_from": "string",
    "transit_suggestion": "string",
    "parking_tip": "string"
  }},
  "afternoon_food": {{
    "place": "string",
    "things_to_order": "string",
    "budget_range": "string",
    "diet_friendly": "string"
  }},
  "evening_activity": {{
    "place": "string",
    "budget_range": "string",
    "walkable_from": "string",
    "transit_suggestion": "string",
    "parking_tip": "string"
  }},
  "evening_food": {{
    "place": "string",
    "things_to_order": "string",
    "budget_range": "string",
    "diet_friendly": "string"
  }},
  "gift_idea": {{
    "name": "string",
    "budget": "string"
  }},
  "surprise": "string"
}}
"""

    response = generate_gemini_response(prompt)

    # Try to extract only the JSON block
    match = re.search(r'{.*}', response, re.DOTALL)
    if match:
        return match.group()
    else:
        return '{ "error": "Gemini did not return JSON as expected." }'