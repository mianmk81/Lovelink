import os
from typing import Dict, Any, Optional, List
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase_service_key = os.getenv("SUPABASE_SERVICE_KEY")

# Check if credentials are set
if not supabase_url or not supabase_key:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in .env file")

# Initialize Supabase client
supabase: Client = create_client(supabase_url, supabase_key)

# Service client with admin privileges (for server-side operations)
supabase_admin: Optional[Client] = None
if supabase_service_key:
    supabase_admin = create_client(supabase_url, supabase_service_key)


# User Authentication Functions
async def sign_up(email: str, password: str, user_data: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Register a new user with email and password
    
    Args:
        email: User's email
        password: User's password
        user_data: Additional user data to store in the users table
        
    Returns:
        User data and session
    """
    try:
        # Register the user with Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": email,
            "password": password,
        })
        
        # If registration successful and we have additional user data
        if auth_response.user and user_data and supabase_admin:
            user_id = auth_response.user.id
            
            # Add user data to the users table
            username = user_data.get("username", "User")
            
            user_record = {
                "user_id": user_id,
                "username": username,
                "email": email,
                "password_hash": "HASHED_IN_SUPABASE"  # Password is handled by Supabase Auth
            }
            
            supabase_admin.table("users").insert(user_record).execute()
        
        return {
            "user": auth_response.user.model_dump() if auth_response.user else {},
            "access_token": auth_response.session.access_token if auth_response.session else "",
        }
    except Exception as e:
        return {"error": str(e)}


async def sign_in(email: str, password: str) -> Dict[str, Any]:
    """
    Sign in a user with email and password
    
    Args:
        email: User's email
        password: User's password
        
    Returns:
        User data and session
    """
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        return {
            "user": auth_response.user.model_dump() if auth_response.user else {},
            "access_token": auth_response.session.access_token if auth_response.session else "",
        }
    except Exception as e:
        return {"error": str(e)}


async def sign_out(jwt: str) -> Dict[str, Any]:
    """
    Sign out a user
    
    Args:
        jwt: User's JWT token
        
    Returns:
        Success message
    """
    try:
        # Set the auth token for the client
        supabase.auth.set_session(jwt)
        
        # Sign out
        supabase.auth.sign_out()
        
        return {"message": "Successfully signed out"}
    except Exception as e:
        return {"error": str(e)}


async def get_user(user_id: str) -> Dict[str, Any]:
    """
    Get user data by ID
    
    Args:
        user_id: User's ID
        
    Returns:
        User data
    """
    try:
        if not supabase_admin:
            return {"error": "Admin client not initialized"}
        
        # Get user from users table
        response = supabase_admin.table("users").select("*").eq("user_id", user_id).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]
        
        return {"error": "User not found"}
    except Exception as e:
        return {"error": str(e)}


async def update_user(user_id: str, update_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Update a user's information
    
    Args:
        user_id: User's ID
        update_data: Dictionary containing fields to update
        
    Returns:
        Updated user data
    """
    try:
        if not supabase_admin:
            return {"error": "Admin client not initialized"}
        
        response = supabase_admin.table("users").update(update_data).eq("user_id", user_id).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]
        
        return {"error": "User not found or update failed"}
    except Exception as e:
        return {"error": str(e)}


async def delete_user(user_id: str) -> Dict[str, Any]:
    """
    Delete a user
    
    Args:
        user_id: User's ID
        
    Returns:
        Success message
    """
    try:
        if not supabase_admin:
            return {"error": "Admin client not initialized"}
        
        # First delete from users table (cascade will handle related tables)
        user_response = supabase_admin.table("users").delete().eq("user_id", user_id).execute()
        
        # Then delete from auth.users if needed
        # This requires special admin privileges and might need a different approach
        # depending on your Supabase setup
        
        return {"message": "User deleted successfully"}
    except Exception as e:
        return {"error": str(e)}


async def get_all_users() -> Dict[str, Any]:
    """
    Get all users
    
    Returns:
        List of user data dictionaries
    """
    try:
        if not supabase_admin:
            return {"error": "Admin client not initialized"}
        
        response = supabase_admin.table("users").select("*").execute()
        
        return {"users": response.data}
    except Exception as e:
        return {"error": str(e)}


# Profile Functions
async def create_profile(profile_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Create a user profile
    
    Args:
        profile_data: Profile data including user_id, name, etc.
        
    Returns:
        Created profile data
    """
    try:
        if not supabase_admin:
            return {"error": "Admin client not initialized"}
        
        response = supabase_admin.table("profiles").insert(profile_data).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]
        
        return {"error": "Failed to create profile"}
    except Exception as e:
        return {"error": str(e)}


async def get_profile(profile_id: str) -> Dict[str, Any]:
    """
    Get profile by ID
    
    Args:
        profile_id: Profile ID
        
    Returns:
        Profile data
    """
    try:
        if not supabase_admin:
            return {"error": "Admin client not initialized"}
        
        response = supabase_admin.table("profiles").select("*").eq("profile_id", profile_id).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]
        
        return {"error": "Profile not found"}
    except Exception as e:
        return {"error": str(e)}


async def get_user_profile(user_id: str) -> Dict[str, Any]:
    """
    Get profile by user ID
    
    Args:
        user_id: User ID
        
    Returns:
        Profile data
    """
    try:
        if not supabase_admin:
            return {"error": "Admin client not initialized"}
        
        response = supabase_admin.table("profiles").select("*").eq("user_id", user_id).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]
        
        return {"error": "Profile not found"}
    except Exception as e:
        return {"error": str(e)}


async def update_profile(profile_id: str, update_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Update a profile
    
    Args:
        profile_id: Profile ID
        update_data: Dictionary containing fields to update
        
    Returns:
        Updated profile data
    """
    try:
        if not supabase_admin:
            return {"error": "Admin client not initialized"}
        
        response = supabase_admin.table("profiles").update(update_data).eq("profile_id", profile_id).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]
        
        return {"error": "Profile not found or update failed"}
    except Exception as e:
        return {"error": str(e)}


# Hobbies Functions
async def add_hobby(hobby_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Add a hobby to a profile
    
    Args:
        hobby_data: Hobby data including profile_id and hobby_name
        
    Returns:
        Created hobby data
    """
    try:
        if not supabase_admin:
            return {"error": "Admin client not initialized"}
        
        response = supabase_admin.table("hobbies").insert(hobby_data).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]
        
        return {"error": "Failed to add hobby"}
    except Exception as e:
        return {"error": str(e)}


async def get_profile_hobbies(profile_id: str) -> Dict[str, Any]:
    """
    Get all hobbies for a profile
    
    Args:
        profile_id: Profile ID
        
    Returns:
        List of hobbies
    """
    try:
        if not supabase_admin:
            return {"error": "Admin client not initialized"}
        
        response = supabase_admin.table("hobbies").select("*").eq("profile_id", profile_id).execute()
        
        return {"hobbies": response.data}
    except Exception as e:
        return {"error": str(e)}


# Relationship Functions
async def create_relationship(relationship_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Create a relationship between a user and a partner
    
    Args:
        relationship_data: Relationship data including user_id, partner_id, anniversary, etc.
        
    Returns:
        Created relationship data
    """
    try:
        if not supabase_admin:
            return {"error": "Admin client not initialized"}
        
        response = supabase_admin.table("relationships").insert(relationship_data).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]
        
        return {"error": "Failed to create relationship"}
    except Exception as e:
        return {"error": str(e)}


async def get_user_relationships(user_id: str) -> Dict[str, Any]:
    """
    Get all relationships for a user
    
    Args:
        user_id: User ID
        
    Returns:
        List of relationships
    """
    try:
        if not supabase_admin:
            return {"error": "Admin client not initialized"}
        
        response = supabase_admin.table("relationships").select("*").eq("user_id", user_id).execute()
        
        return {"relationships": response.data}
    except Exception as e:
        return {"error": str(e)}


# User Preferences Functions
async def save_user_preferences(user_id: str, preferences: Dict[str, Any]) -> Dict[str, Any]:
    """
    Save user preferences
    
    Args:
        user_id: User's ID
        preferences: Dictionary of preferences
        
    Returns:
        Saved preferences data
    """
    try:
        if not supabase_admin:
            return {"error": "Admin client not initialized"}
        
        # Check if preferences already exist
        check_response = supabase_admin.table("user_preferences").select("preference_id").eq("user_id", user_id).execute()
        
        if check_response.data and len(check_response.data) > 0:
            # Update existing preferences
            preference_id = check_response.data[0]["preference_id"]
            response = supabase_admin.table("user_preferences").update(preferences).eq("preference_id", preference_id).execute()
        else:
            # Create new preferences
            preferences["user_id"] = user_id
            response = supabase_admin.table("user_preferences").insert(preferences).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]
        
        return {"error": "Failed to save preferences"}
    except Exception as e:
        return {"error": str(e)}


async def get_user_preferences(user_id: str) -> Dict[str, Any]:
    """
    Get user preferences
    
    Args:
        user_id: User's ID
        
    Returns:
        User preferences
    """
    try:
        if not supabase_admin:
            return {"error": "Admin client not initialized"}
        
        response = supabase_admin.table("user_preferences").select("*").eq("user_id", user_id).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]
        
        return {"error": "Preferences not found"}
    except Exception as e:
        return {"error": str(e)}


# Date Plan Functions
async def create_date_plan(date_plan_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Create a date plan
    
    Args:
        date_plan_data: Date plan data including user_id, title, etc.
        
    Returns:
        Created date plan data
    """
    try:
        if not supabase_admin:
            return {"error": "Admin client not initialized"}
        
        response = supabase_admin.table("date_plans").insert(date_plan_data).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]
        
        return {"error": "Failed to create date plan"}
    except Exception as e:
        return {"error": str(e)}


async def get_user_date_plans(user_id: str) -> Dict[str, Any]:
    """
    Get all date plans for a user
    
    Args:
        user_id: User ID
        
    Returns:
        List of date plans
    """
    try:
        if not supabase_admin:
            return {"error": "Admin client not initialized"}
        
        response = supabase_admin.table("date_plans").select("*").eq("user_id", user_id).execute()
        
        return {"date_plans": response.data}
    except Exception as e:
        return {"error": str(e)}


async def get_date_plan(date_plan_id: str) -> Dict[str, Any]:
    """
    Get a date plan by ID
    
    Args:
        date_plan_id: Date plan ID
        
    Returns:
        Date plan data
    """
    try:
        if not supabase_admin:
            return {"error": "Admin client not initialized"}
        
        response = supabase_admin.table("date_plans").select("*").eq("date_plan_id", date_plan_id).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]
        
        return {"error": "Date plan not found"}
    except Exception as e:
        return {"error": str(e)}


async def add_date_plan_detail(detail_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Add a detail to a date plan
    
    Args:
        detail_data: Detail data including date_plan_id, restaurant_id or activity_id, etc.
        
    Returns:
        Created detail data
    """
    try:
        if not supabase_admin:
            return {"error": "Admin client not initialized"}
        
        response = supabase_admin.table("date_plan_details").insert(detail_data).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]
        
        return {"error": "Failed to add date plan detail"}
    except Exception as e:
        return {"error": str(e)}


# Favorite Date Functions
async def save_favorite_date(user_id: str, date_plan: Dict[str, Any]) -> Dict[str, Any]:
    """
    Save a favorite date plan
    
    Args:
        user_id: User's ID
        date_plan: Date plan data
        
    Returns:
        Dict containing success status
    """
    try:
        if not supabase_admin:
            return {"error": "Admin client not initialized"}
        
        # Add user_id to the date plan
        date_plan["user_id"] = user_id
        
        # Insert the date plan
        response = supabase_admin.table("favorite_dates").insert(date_plan).execute()
        
        # Check for errors
        if response.error:
            return {"error": response.error.message}
        
        return {"success": True, "date_id": response.data[0]["id"]}
    except Exception as e:
        return {"error": str(e)}


async def remove_favorite_date(user_id: str, date_id: int) -> Dict[str, Any]:
    """
    Remove a favorite date plan
    
    Args:
        user_id: User's ID
        date_id: Date plan ID
        
    Returns:
        Dict containing success status
    """
    try:
        if not supabase_admin:
            return {"error": "Admin client not initialized"}
        
        # Delete the date plan
        response = supabase_admin.table("favorite_dates").delete().eq("id", date_id).eq("user_id", user_id).execute()
        
        # Check for errors
        if response.error:
            return {"error": response.error.message}
        
        return {"success": True}
    except Exception as e:
        return {"error": str(e)}


async def get_favorite_dates(user_id: str) -> Dict[str, Any]:
    """
    Get all favorite date plans for a user
    
    Args:
        user_id: User's ID
        
    Returns:
        Dict containing favorite date plans
    """
    try:
        if not supabase_admin:
            return {"error": "Admin client not initialized"}
        
        # Get the favorite date plans
        response = supabase_admin.table("favorite_dates").select("*").eq("user_id", user_id).execute()
        
        # Check for errors
        if response.error:
            return {"error": response.error.message}
        
        # Get the date plans
        data = response.data
        
        return {"dates": data}
    except Exception as e:
        return {"error": str(e)}
