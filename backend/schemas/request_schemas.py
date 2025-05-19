from pydantic import BaseModel, UUID4
from typing import List, Optional, Dict, Any
from datetime import date, datetime


class DatePlanGenerationRequest(BaseModel):
    location: str
    budget: str
    interests: List[str]
    dietary_restrictions: Optional[List[str]] = []
    preferences: Optional[List[str]] = []  # e.g. ['walkable', 'free_parking', 'transit_friendly']
    # Options: romantic, adventurous, cozy, nostalgic, playful, sophisticated, spontaneous, relaxed
    vibe: Optional[str] = "romantic"
    # Options: casual, elevated, trendy, vintage, formal, bohemian, sporty, edgy
    style_preference: Optional[str] = "casual"
    available_clothing: Optional[List[str]] = []  # items like "white sneakers", "denim jacket"
    user_id: Optional[UUID4] = None


class ProfileSetupRequest(BaseModel):
    name: str
    birthday: Optional[date] = None
    favorite_food: Optional[str] = None
    favorite_movie: Optional[str] = None
    hobbies: Optional[List[str]] = []


class PartnerSetupRequest(BaseModel):
    name: str
    birthday: Optional[date] = None
    favorite_food: Optional[str] = None
    favorite_movie: Optional[str] = None
    hobbies: Optional[List[str]] = []
    anniversary: Optional[date] = None


class RelationshipSetupRequest(BaseModel):
    partner: PartnerSetupRequest
    anniversary: Optional[date] = None


class UserPreferenceRequest(BaseModel):
    dietary_needs: Optional[List[str]] = []
    transit_preferences: Optional[List[str]] = []
    budget_preference: Optional[str] = "medium"


class DatePlanRequest(BaseModel):
    title: str
    scheduled_for: Optional[datetime] = None
    location: Optional[str] = None
    budget: Optional[str] = None
    notes: Optional[str] = None
    restaurant_id: Optional[UUID4] = None
    activity_id: Optional[UUID4] = None


class DateHistoryRequest(BaseModel):
    date_plan_id: UUID4
    completed_at: Optional[datetime] = None
    rating: Optional[int] = None
    notes: Optional[str] = None
    photos: Optional[List[str]] = []
