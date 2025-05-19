from fastapi import APIRouter, Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from typing import Optional, Dict, Any
import uuid
import os

from schemas.user_schemas import UserCreate, UserLogin, Token, User, ProfileCreate
from utils.supabase import (
    sign_up, sign_in, sign_out,
    get_user, update_user, delete_user, get_all_users,
    save_user_preferences, get_user_preferences,
    save_favorite_date, remove_favorite_date, get_favorite_dates
)

router = APIRouter()

@router.get("/supabase-config")
async def get_supabase_config():
    """Provide Supabase configuration to the frontend"""
    return {
        "url": os.getenv("SUPABASE_URL", ""),
        "key": os.getenv("SUPABASE_KEY", "")
    }


@router.post("/register", response_model=Token)
async def register_user(user_data: UserCreate):
    # Register user with Supabase
    result = await sign_up(user_data.email, user_data.password, {"username": user_data.username})
    
    # Check for errors
    if "error" in result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"]
        )
    
    # Get user data from result
    user = result.get("user", {})
    user_id = user.get("id", "")
    access_token = result.get("access_token", "")
    
    if not user_id or not access_token:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user account"
        )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user_id,
        "username": user_data.username
    }


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Sign in with Supabase
    # Note: OAuth2PasswordRequestForm uses username field, but we're treating it as email
    result = await sign_in(form_data.username, form_data.password)
    
    # Check for errors
    if "error" in result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user data
    user = result.get("user", {})
    user_id = user.get("id", "")
    access_token = result.get("access_token", "")
    
    if not user_id or not access_token:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to authenticate user"
        )
    
    # Get user profile data
    user_profile = await get_user(user_id)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user_id,
        "username": user_profile.get("username", "")
    }
