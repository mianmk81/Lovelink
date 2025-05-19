import os
import asyncio
from dotenv import load_dotenv
from utils.supabase import supabase, supabase_admin

async def test_supabase_connection():
    """Test the connection to Supabase"""
    print("Testing Supabase connection...")
    
    # Test basic client connection
    try:
        # Get Supabase URL and keys from environment
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_KEY")
        supabase_service_key = os.getenv("SUPABASE_SERVICE_KEY")
        
        print(f"Supabase URL: {supabase_url}")
        print(f"Supabase Key: {supabase_key[:10]}...{supabase_key[-5:]}")
        print(f"Supabase Service Key: {supabase_service_key[:10]}...{supabase_service_key[-5:]}")
        
        # Test if clients are initialized
        print(f"Regular client initialized: {supabase is not None}")
        print(f"Admin client initialized: {supabase_admin is not None}")
        
        # Try to query the database
        if supabase_admin:
            # Try to get users table info
            response = supabase_admin.table("users").select("*").limit(5).execute()
            print(f"\nUsers table query successful: {response is not None}")
            print(f"Number of users: {len(response.data)}")
            
            # Try to get profiles table info
            response = supabase_admin.table("profiles").select("*").limit(5).execute()
            print(f"Profiles table query successful: {response is not None}")
            print(f"Number of profiles: {len(response.data)}")
            
            # Try to get other tables
            tables = ["hobbies", "relationships", "date_plans", "activities", "restaurants"]
            for table in tables:
                try:
                    response = supabase_admin.table(table).select("*").limit(1).execute()
                    print(f"{table.capitalize()} table query successful: {response is not None}")
                except Exception as e:
                    print(f"Error querying {table} table: {str(e)}")
            
            print("\nConnection test completed successfully!")
            return True
        else:
            print("Admin client not initialized. Cannot test database queries.")
            return False
    
    except Exception as e:
        print(f"Error testing Supabase connection: {str(e)}")
        return False

if __name__ == "__main__":
    asyncio.run(test_supabase_connection())
