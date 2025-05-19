from services.providers.events import get_upcoming_events
from services.providers.places import get_nearby_places, get_nearby_foods
from services.logic.preference_filter import filter_options
from services.logic.fallback_gemini import get_fallback_gemini_plan
import random
import time

def suggest_plan(request):
    """
    Generate a date plan based on user preferences
    Returns data in the format expected by the frontend:
    {
        "activities": [...],
        "restaurants": [...],
        "surprise": {...}
    }
    """
    # Start with mock data as a fallback
    result = create_mock_data(request)
    
    try:
        # Set a timeout for real data fetching
        start_time = time.time()
        timeout = 10  # Increase timeout to 10 seconds
        
        # Try to get real data from providers with timeout check
        try:
            events = get_upcoming_events(request.location, request.interests)
            # Check if we're approaching timeout
            if time.time() - start_time > timeout:
                raise TimeoutError("Events lookup timeout")
                
            places = get_nearby_places(request.location, request.interests)
            # Check if we're approaching timeout
            if time.time() - start_time > timeout:
                raise TimeoutError("Places lookup timeout")
                
            foods = get_nearby_foods(request.location, request.dietary_restrictions)
            
            # Apply preference filters if we have time
            if time.time() - start_time <= timeout:
                places = filter_options(places, request.preferences)
                foods = filter_options(foods, request.preferences)
            
            # If we have real data, convert it to the expected format
            if places or foods:
                # Reset result to empty structure
                result = {
                    "activities": [],
                    "restaurants": [],
                    "surprise": result["surprise"]  # Keep the surprise from mock data
                }
                
                # Map places to activities (up to 2)
                for i, place in enumerate(places[:2]):
                    result["activities"].append({
                        "id": i + 1,
                        "name": place.get("name", f"Activity in {request.location}"),
                        "image": "https://images.unsplash.com/photo-1511882150382-421056c89033",
                        "type": place.get("type", "Entertainment"),
                        "tags": [place.get("type", "Fun"), "Local"],
                        "description": f"Enjoy this local activity in {request.location}"
                    })
                
                # Map foods to restaurants (up to 2)
                for i, food in enumerate(foods[:2]):
                    result["restaurants"].append({
                        "id": i + 1,
                        "name": food.get("name", f"Restaurant in {request.location}"),
                        "image": food.get("image", "https://images.unsplash.com/photo-1555126634-323283e090fa"),
                        "cuisine": food.get("cuisine", "Local"),
                        "rating": food.get("rating", 4.5),
                        "distance": food.get("distance", "1.2 miles from center"),
                        "vibe": food.get("vibe", ["Cozy", "Friendly"]),
                        "dietary_friendly": food.get("dietary_friendly", "Various options"),
                        "things_to_order": food.get("things_to_order", "Chef's choice"),
                        "price_level": food.get("price_level", 2),
                        "budget_range": food.get("budget_range", "$$")
                    })
        except Exception as e:
            print(f"Error fetching real data: {e}")
            # We'll use the mock data initialized at the beginning
            pass
            
        # Ensure we have at least 2 activities and 2 restaurants
        if len(result["activities"]) < 2:
            mock_data = create_mock_data(request)
            # Add missing activities from mock data
            for i in range(len(result["activities"]), 2):
                result["activities"].append(mock_data["activities"][i])
                
        if len(result["restaurants"]) < 2:
            mock_data = create_mock_data(request)
            # Add missing restaurants from mock data
            for i in range(len(result["restaurants"]), 2):
                result["restaurants"].append(mock_data["restaurants"][i])
        
        return result
    
    except Exception as e:
        print(f"Error in suggestion engine: {e}")
        # Return mock data if anything fails
        return create_mock_data(request)

def create_mock_data(request):
    """Create mock data based on the request parameters"""
    return {
        "activities": [
            {
                "id": 1,
                "name": f"Explore {request.location}",
                "image": "https://images.unsplash.com/photo-1511882150382-421056c89033",
                "type": "Outdoor",
                "tags": ["Romantic", "Adventurous"],
                "description": f"Take a romantic walk through the beautiful streets of {request.location} and discover hidden gems together."
            },
            {
                "id": 2,
                "name": "Movie Night",
                "image": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
                "type": "Entertainment",
                "tags": ["Relaxed", "Indoor", "Cozy"],
                "description": f"Enjoy a classic film at a vintage theater in {request.location}."
            }
        ],
        "restaurants": [
            {
                "id": 1,
                "name": f"{request.location} Bistro",
                "image": "https://images.unsplash.com/photo-1555126634-323283e090fa",
                "cuisine": "French",
                "rating": 4.7,
                "distance": f"0.8 miles from center of {request.location}",
                "vibe": ["Romantic", "Intimate"]
            },
            {
                "id": 2,
                "name": "Retro Diner",
                "image": "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
                "cuisine": "American",
                "rating": 4.5,
                "distance": f"1.2 miles from center of {request.location}",
                "vibe": ["Nostalgic", "Casual"]
            }
        ],
        "surprise": {
            "id": 1,
            "name": "Mixtape Creation",
            "description": f"Create a custom digital mixtape of songs that remind you of each other. Find a local record store in {request.location} to browse for inspiration.",
            "image": "https://images.unsplash.com/photo-1619983081563-430f63602796"
        }
    }