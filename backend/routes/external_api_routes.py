from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.providers.places import get_nearby_places, get_nearby_foods
from services.providers.ticketmaster import get_upcoming_events

router = APIRouter()

# Request models
class PlacesSearchRequest(BaseModel):
    location: str
    query: Optional[str] = None
    radius: Optional[int] = 5000
    type: Optional[str] = None
    interests: Optional[List[str]] = []

class EventsSearchRequest(BaseModel):
    location: str
    startDateTime: Optional[str] = None
    endDateTime: Optional[str] = None
    keyword: Optional[str] = None
    interests: Optional[List[str]] = []

@router.post("/places/search")
def search_places(request: PlacesSearchRequest):
    """
    Search for places using Google Maps API
    """
    try:
        print(f"Received places search request: {request}")
        
        # Use the existing places provider
        if request.query and request.query.lower() == "restaurants":
            # If specifically looking for restaurants
            results = get_nearby_foods(
                location=request.location, 
                dietary_restrictions=request.interests
            )
        else:
            # For other place types
            results = get_nearby_places(
                location=request.location,
                interests=request.interests or [request.type] if request.type else ["attractions"]
            )
        
        return results
    except Exception as e:
        print(f"Error in places search: {e}")
        raise HTTPException(status_code=500, detail=f"Error searching places: {str(e)}")

@router.post("/events/search")
def search_events(request: EventsSearchRequest):
    """
    Search for events using Ticketmaster API
    """
    try:
        print(f"Received events search request: {request}")
        
        # Use the existing ticketmaster provider
        results = get_upcoming_events(
            location=request.location,
            interests=request.interests or ([request.keyword] if request.keyword else [])
        )
        
        return results
    except Exception as e:
        print(f"Error in events search: {e}")
        raise HTTPException(status_code=500, detail=f"Error searching events: {str(e)}")
