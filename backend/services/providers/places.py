import os
import httpx
from dotenv import load_dotenv

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

PLACES_API_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json"

def get_nearby_places(location: str, interests: list):
    results = []
    for interest in interests:
        params = {
            "query": f"{interest} in {location}",
            "key": GOOGLE_API_KEY
        }
        try:
            resp = httpx.get(PLACES_API_URL, params=params).json()
            places = resp.get("results", [])[:2]
            for p in places:
                results.append({
                    "name": p["name"],
                    "type": interest,
                    "address": p.get("formatted_address", ""),
                    "rating": p.get("rating", "N/A"),
                    "walkable_from": "TBD",
                    "transit_suggestion": "TBD",
                    "parking_tip": "TBD"
                })
        except Exception as e:
            print(f"[Places Error] {e}")
    return results

def get_nearby_foods(location: str, dietary_restrictions: list):
    query_term = " ".join(dietary_restrictions or ["restaurants"])
    params = {
        "query": f"{query_term} food in {location}",
        "key": GOOGLE_API_KEY
    }
    
    try:
        resp = httpx.get(PLACES_API_URL, params=params).json()
        places = resp.get("results", [])[:5]
        
        results = []
        for p in places:
            # Convert price_level to budget_range
            price_level = p.get("price_level", 2)
            budget_range = ""
            if price_level == 1:
                budget_range = "$10-$20"
            elif price_level == 2:
                budget_range = "$15-$30"
            elif price_level == 3:
                budget_range = "$25-$40"
            elif price_level == 4:
                budget_range = "$40+"
            
            # Generate dietary friendly options based on query
            dietary_friendly = []
            if dietary_restrictions:
                for diet in dietary_restrictions:
                    if diet.lower() in ["vegetarian", "vegan", "gluten-free", "halal", "kosher"]:
                        dietary_friendly.append(diet.capitalize())
            
            if not dietary_friendly:
                # Add some default options if none specified
                if "italian" in p.get("name", "").lower() or "pizza" in p.get("name", "").lower():
                    dietary_friendly = ["Vegetarian options"]
                elif "asian" in p.get("name", "").lower() or "chinese" in p.get("name", "").lower():
                    dietary_friendly = ["Gluten-free options"]
                else:
                    dietary_friendly = ["Various options"]
            
            # Generate things to order based on restaurant type
            things_to_order = "Chef's choice"
            if "pizza" in p.get("name", "").lower():
                things_to_order = "Classic Cheese, Meat Lover's"
            elif "sushi" in p.get("name", "").lower() or "japanese" in p.get("name", "").lower():
                things_to_order = "Sushi Rolls, Ramen"
            elif "burger" in p.get("name", "").lower():
                things_to_order = "Burgers, Milkshakes"
            elif "italian" in p.get("name", "").lower():
                things_to_order = "Pasta, Tiramisu"
            elif "mexican" in p.get("name", "").lower():
                things_to_order = "Tacos, Guacamole"
            
            # Generate a vibe based on restaurant type and rating
            vibe = []
            if p.get("rating", 0) >= 4.5:
                vibe.append("Upscale")
            elif p.get("rating", 0) >= 4.0:
                vibe.append("Cozy")
            else:
                vibe.append("Casual")
                
            if "cafe" in p.get("name", "").lower():
                vibe.append("Relaxed")
            elif "bistro" in p.get("name", "").lower():
                vibe.append("Intimate")
            elif "diner" in p.get("name", "").lower():
                vibe.append("Nostalgic")
            else:
                vibe.append("Romantic")
            
            # Get a random image from Unsplash based on cuisine
            cuisine_type = "restaurant"
            if "pizza" in p.get("name", "").lower():
                cuisine_type = "pizza"
            elif "sushi" in p.get("name", "").lower():
                cuisine_type = "sushi"
            elif "burger" in p.get("name", "").lower():
                cuisine_type = "burger"
            elif "italian" in p.get("name", "").lower():
                cuisine_type = "italian food"
            
            image_url = f"https://source.unsplash.com/random/800x600/?{cuisine_type}"
            
            results.append({
                "id": len(results) + 1,
                "name": p["name"],
                "image": image_url,
                "cuisine": p.get("types", ["restaurant"])[0].replace("_", " ").title() if p.get("types") else "Restaurant",
                "rating": p.get("rating", 4.0),
                "distance": f"{round(0.1 + (len(results) * 0.3), 1)} miles from {location}",
                "vibe": vibe,
                "dietary_friendly": ", ".join(dietary_friendly),
                "things_to_order": things_to_order,
                "price_level": price_level,
                "budget_range": budget_range
            })
        
        return results
    except Exception as e:
        print(f"[Places Error] {e}")
        return []