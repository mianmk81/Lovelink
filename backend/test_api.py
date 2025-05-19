#!/usr/bin/env python3
"""
Test script for the LoveLink '89 backend API
This script tests various endpoints to verify they're working correctly
"""

import requests
import json
import sys
import os
import time
import subprocess
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
load_dotenv()

# Configuration
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000/api")
DEBUG = True

def log(message):
    """Print debug messages if DEBUG is enabled"""
    if DEBUG:
        print(f"[DEBUG] {message}")

def check_server_running():
    """Check if the backend server is running"""
    try:
        response = requests.get(f"{API_BASE_URL.split('/api')[0]}/docs")
        return response.status_code == 200
    except:
        return False

def start_server():
    """Start the backend server if it's not running"""
    if check_server_running():
        print("✅ Backend server is already running")
        return True
    
    print("🚀 Starting backend server...")
    try:
        # Get the backend directory
        backend_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Start the server as a subprocess
        process = subprocess.Popen(
            ["python3", "main.py"],
            cwd=backend_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Wait for the server to start
        for _ in range(10):  # Try for 10 seconds
            time.sleep(1)
            if check_server_running():
                print("✅ Backend server started successfully")
                return True
        
        # If we get here, the server didn't start
        stdout, stderr = process.communicate(timeout=1)
        print(f"❌ Failed to start backend server")
        print(f"STDOUT: {stdout}")
        print(f"STDERR: {stderr}")
        return False
    except Exception as e:
        print(f"❌ Error starting backend server: {str(e)}")
        return False

def test_debug_endpoint():
    """Test the debug endpoint to verify basic connectivity"""
    print("\n🔍 Testing debug endpoint...")
    
    try:
        response = requests.get(f"{API_BASE_URL}/debug")
        response.raise_for_status()
        result = response.json()
        
        print(f"✅ Debug endpoint working: {result}")
        return True
    except Exception as e:
        print(f"❌ Debug endpoint failed: {str(e)}")
        return False

def test_generate_date_plan():
    """Test the date plan generation endpoint"""
    print("\n🔍 Testing date plan generation...")
    
    # Test data matching the DatePlanGenerationRequest schema
    test_data = {
        "location": "New York City",
        "budget": "medium",
        "interests": ["movies", "food", "art"],
        "dietary_restrictions": ["vegetarian"],
        "preferences": ["walkable", "public"],
        "vibe": "romantic",
        "style_preference": "casual"
    }
    
    try:
        log(f"Sending request to {API_BASE_URL}/generate-date")
        log(f"Request data: {json.dumps(test_data, indent=2)}")
        
        response = requests.post(
            f"{API_BASE_URL}/generate-date",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        log(f"Response status code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ Date plan generation failed with status {response.status_code}")
            try:
                error_data = response.json()
                print(f"Error details: {json.dumps(error_data, indent=2)}")
            except:
                print(f"Error response: {response.text}")
            return False
        
        result = response.json()
        log(f"Response data: {json.dumps(result, indent=2)}")
        
        # Validate response structure
        if not result.get("activities") or not result.get("restaurants"):
            print("❌ Response is missing required fields (activities or restaurants)")
            return False
        
        print("✅ Date plan generation successful!")
        print(f"  - Activities: {len(result.get('activities', []))} items")
        print(f"  - Restaurants: {len(result.get('restaurants', []))} items")
        
        # Print first activity and restaurant as examples
        if result.get("activities"):
            activity = result["activities"][0]
            print(f"\nSample activity: {activity.get('name')}")
            print(f"Description: {activity.get('description')}")
        
        if result.get("restaurants"):
            restaurant = result["restaurants"][0]
            print(f"\nSample restaurant: {restaurant.get('name')}")
            print(f"Cuisine: {restaurant.get('cuisine')}")
            print(f"Distance: {restaurant.get('distance')}")
        
        return True
    except Exception as e:
        print(f"❌ Date plan generation test failed with exception: {str(e)}")
        return False

def test_auth_endpoints():
    """Test authentication endpoints"""
    print("\n🔍 Testing authentication endpoints...")
    
    # Test registration
    test_user = {
        "email": f"test_user_{int(Path(__file__).stat().st_mtime)}@example.com",
        "password": "Test123!",
        "name": "Test User"
    }
    
    try:
        print(f"Testing registration with email: {test_user['email']}")
        response = requests.post(
            f"{API_BASE_URL}/auth/register",
            json=test_user,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("✅ Registration successful")
            result = response.json()
            log(f"Registration response: {json.dumps(result, indent=2)}")
            
            # Test login with the registered user
            login_data = {
                "username": test_user["email"],
                "password": test_user["password"]
            }
            
            login_response = requests.post(
                f"{API_BASE_URL}/auth/login",
                data=login_data,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            
            if login_response.status_code == 200:
                print("✅ Login successful")
                login_result = login_response.json()
                log(f"Login response: {json.dumps(login_result, indent=2)}")
                return True
            else:
                print(f"❌ Login failed with status {login_response.status_code}")
                try:
                    error_data = login_response.json()
                    print(f"Error details: {json.dumps(error_data, indent=2)}")
                except:
                    print(f"Error response: {login_response.text}")
                return False
        else:
            print(f"❌ Registration failed with status {response.status_code}")
            try:
                error_data = response.json()
                print(f"Error details: {json.dumps(error_data, indent=2)}")
            except:
                print(f"Error response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Authentication test failed with exception: {str(e)}")
        return False

def run_all_tests():
    """Run all API tests"""
    print("=" * 50)
    print("🧪 RUNNING LOVELINK '89 BACKEND API TESTS")
    print("=" * 50)
    
    # First check if the server is running
    if not start_server():
        print("❌ Cannot run tests because the backend server is not running")
        return 1
    
    # Track test results
    results = {
        "debug": test_debug_endpoint(),
        "date_plan": test_generate_date_plan(),
        "auth": test_auth_endpoints()
    }
    
    # Print summary
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 50)
    
    all_passed = True
    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name.upper()}: {status}")
        if not passed:
            all_passed = False
    
    print("\n" + "=" * 50)
    if all_passed:
        print("🎉 ALL TESTS PASSED! The backend API is working correctly.")
    else:
        print("⚠️ SOME TESTS FAILED. Please check the logs above for details.")
    print("=" * 50)
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(run_all_tests())
