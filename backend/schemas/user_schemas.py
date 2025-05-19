from pydantic import BaseModel, EmailStr, Field, UUID4
from typing import Optional, List, Dict, Any
from datetime import date, datetime


class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: UUID4
    username: Optional[str] = None


class TokenData(BaseModel):
    user_id: Optional[UUID4] = None


class ProfileBase(BaseModel):
    name: str
    birthday: Optional[date] = None
    favorite_food: Optional[str] = None
    favorite_movie: Optional[str] = None


class ProfileCreate(ProfileBase):
    user_id: UUID4


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    birthday: Optional[date] = None
    favorite_food: Optional[str] = None
    favorite_movie: Optional[str] = None


class HobbyBase(BaseModel):
    hobby_name: str


class HobbyCreate(HobbyBase):
    profile_id: UUID4


class Hobby(HobbyBase):
    hobby_id: UUID4
    profile_id: UUID4

    class Config:
        orm_mode = True


class RelationshipBase(BaseModel):
    partner_id: UUID4
    anniversary: Optional[date] = None
    status: str = "active"


class RelationshipCreate(RelationshipBase):
    user_id: UUID4


class RelationshipUpdate(BaseModel):
    anniversary: Optional[date] = None
    status: Optional[str] = None


class Relationship(RelationshipBase):
    relationship_id: UUID4
    user_id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class UserPreferenceBase(BaseModel):
    dietary_needs: List[str] = []
    transit_preferences: List[str] = []
    budget_preference: str = "medium"


class UserPreferenceCreate(UserPreferenceBase):
    user_id: UUID4


class UserPreferenceUpdate(BaseModel):
    dietary_needs: Optional[List[str]] = None
    transit_preferences: Optional[List[str]] = None
    budget_preference: Optional[str] = None


class UserPreference(UserPreferenceBase):
    preference_id: UUID4
    user_id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class ActivityBase(BaseModel):
    name: str
    image_url: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    price_range: Optional[str] = None


class ActivityCreate(ActivityBase):
    pass


class Activity(ActivityBase):
    activity_id: UUID4
    created_at: datetime
    tags: Optional[List[str]] = []

    class Config:
        orm_mode = True


class RestaurantBase(BaseModel):
    name: str
    image_url: Optional[str] = None
    cuisine: Optional[str] = None
    rating: Optional[float] = None
    price_range: Optional[str] = None
    location: Optional[str] = None
    distance: Optional[str] = None


class RestaurantCreate(RestaurantBase):
    pass


class Restaurant(RestaurantBase):
    restaurant_id: UUID4
    created_at: datetime
    tags: Optional[List[str]] = []

    class Config:
        orm_mode = True


class DatePlanBase(BaseModel):
    title: str
    scheduled_for: Optional[datetime] = None
    status: str = "planned"
    location: Optional[str] = None
    budget: Optional[str] = None
    notes: Optional[str] = None


class DatePlanCreate(DatePlanBase):
    user_id: UUID4


class DatePlanUpdate(BaseModel):
    title: Optional[str] = None
    scheduled_for: Optional[datetime] = None
    status: Optional[str] = None
    location: Optional[str] = None
    budget: Optional[str] = None
    notes: Optional[str] = None


class DatePlanDetailBase(BaseModel):
    date_plan_id: UUID4
    restaurant_id: Optional[UUID4] = None
    activity_id: Optional[UUID4] = None
    detail_order: int


class DatePlanDetailCreate(DatePlanDetailBase):
    pass


class DatePlanDetail(DatePlanDetailBase):
    detail_id: UUID4
    created_at: datetime

    class Config:
        orm_mode = True


class DatePlan(DatePlanBase):
    date_plan_id: UUID4
    user_id: UUID4
    created_at: datetime
    updated_at: datetime
    details: Optional[List[DatePlanDetail]] = []

    class Config:
        orm_mode = True


class DateHistoryBase(BaseModel):
    date_plan_id: UUID4
    completed_at: Optional[datetime] = None
    rating: Optional[int] = None
    notes: Optional[str] = None
    photos: List[str] = []


class DateHistoryCreate(DateHistoryBase):
    pass


class DateHistory(DateHistoryBase):
    history_id: UUID4
    created_at: datetime

    class Config:
        orm_mode = True


class LocalEventBase(BaseModel):
    name: str
    description: Optional[str] = None
    location: Optional[str] = None
    event_date: Optional[date] = None
    event_time: Optional[str] = None
    price: Optional[str] = None
    image_url: Optional[str] = None
    external_link: Optional[str] = None


class LocalEventCreate(LocalEventBase):
    pass


class LocalEvent(LocalEventBase):
    event_id: UUID4
    created_at: datetime

    class Config:
        orm_mode = True


class NotificationBase(BaseModel):
    user_id: UUID4
    type: str
    message: str
    related_id: Optional[UUID4] = None
    read: bool = False


class NotificationCreate(NotificationBase):
    pass


class Notification(NotificationBase):
    notification_id: UUID4
    created_at: datetime

    class Config:
        orm_mode = True


class Profile(ProfileBase):
    profile_id: UUID4
    user_id: UUID4
    created_at: datetime
    updated_at: datetime
    hobbies: Optional[List[Hobby]] = []

    class Config:
        orm_mode = True


class User(UserBase):
    user_id: UUID4
    created_at: datetime
    last_login: Optional[datetime] = None
    profile: Optional[Profile] = None
    relationships: Optional[List[Relationship]] = []
    preferences: Optional[UserPreference] = None
    date_plans: Optional[List[DatePlan]] = []

    class Config:
        orm_mode = True