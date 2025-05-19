#!/usr/bin/env python3
"""
API Tester for LoveLink '89 Backend
This script tests the backend API endpoints without trying to start the server
"""

import requests
import json
import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000/api")
DEBUG = True

def print_header(title):
    """Print a formatted header"""
    print("\n" + "=" * 60)
    print(f" {title}")
    print("=" * 60)

def print_result(test_name, success, message=None):
    """Print a test result with consistent formatting"""
    status = "✅ PASSED" if success else "❌ FAILED"
    print(f"{test_name}: {status}")
    if message and not success:
        print(f"  → {message}")

def test_connection():
    """Test basic connection to the server"""
    print_header("TESTING SERVER CONNECTION")
    
    try:
        # Try to connect to the docs page first (doesn't require API functionality)
        base_url = API_BASE_URL.split('/api')[0]
        print(f"Checking server at {base_url}...")
        
        response = requests.get(f"{base_url}/docs", timeout=5)
        if response.status_code == 200:
            print_result("Server connection", True)
            return True
        else:
            print_result("Server connection", False, 
                        f"Server responded with status code {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print_result("Server connection", False, 
                    "Connection refused. Is the server running?")
        return False
    except Exception as e:
        print_result("Server connection", False, str(e))
        return False

def test_debug_endpoint():
    """Test the debug endpoint"""
    print_header("TESTING DEBUG ENDPOINT")
    
    try:
        print(f"Calling {API_BASE_URL}/debug...")
        response = requests.get(f"{API_BASE_URL}/debug", timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            print_result("Debug endpoint", True)
            return True
        else:
            print_result("Debug endpoint", False, 
                        f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        print_result("Debug endpoint", False, str(e))
        return False

def test_date_plan_generation():
    """Test the date plan generation endpoint"""
    print_header("TESTING DATE PLAN GENERATION")
    
    # Test data that matches the backend schema
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
        print(f"Sending request to {API_BASE_URL}/generate-date...")
        print(f"Request data: {json.dumps(test_data, indent=2)}")
        
        response = requests.post(
            f"{API_BASE_URL}/generate-date",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=10  # Longer timeout as this might take time
        )
        
        print(f"Response status code: {response.status_code}")
        
        if response.status_code == 200:
            try:
                result = response.json()
                
                # Check if the response has the expected structure
                has_activities = "activities" in result and len(result["activities"]) > 0
                has_restaurants = "restaurants" in result and len(result["restaurants"]) > 0
                
                if has_activities and has_restaurants:
                    print("Response contains activities and restaurants:")
                    print(f"- Activities: {len(result['activities'])}")
                    print(f"- Restaurants: {len(result['restaurants'])}")
                    
                    # Display full details for all activities
                    print("\n" + "=" * 60)
                    print(" ACTIVITIES RETURNED")
                    print("=" * 60)
                    for i, activity in enumerate(result["activities"]):
                        print(f"\nActivity #{i+1}:")
                        print(json.dumps(activity, indent=2))
                        print("-" * 40)
                    
                    # Display full details for all restaurants
                    print("\n" + "=" * 60)
                    print(" RESTAURANTS RETURNED")
                    print("=" * 60)
                    for i, restaurant in enumerate(result["restaurants"]):
                        print(f"\nRestaurant #{i+1}:")
                        print(json.dumps(restaurant, indent=2))
                        print("-" * 40)
                    
                    # Save the response to a file for reference
                    with open("api_response_data.json", "w") as f:
                        json.dump(result, f, indent=2)
                    print("\nFull response saved to api_response_data.json")
                    
                    print_result("Date plan generation", True)
                    return True
                else:
                    missing = []
                    if not has_activities:
                        missing.append("activities")
                    if not has_restaurants:
                        missing.append("restaurants")
                    
                    print_result("Date plan generation", False, 
                                f"Response is missing: {', '.join(missing)}")
                    return False
            except json.JSONDecodeError:
                print_result("Date plan generation", False, 
                            "Response is not valid JSON")
                return False
        else:
            print("Error response:")
            try:
                error_data = response.json()
                print(json.dumps(error_data, indent=2))
            except:
                print(response.text)
            
            print_result("Date plan generation", False, 
                        f"Status code: {response.status_code}")
            return False
    except Exception as e:
        print_result("Date plan generation", False, str(e))
        return False

def test_mock_data_structure():
    """Test if the mock data structure matches what we need for the frontend"""
    print_header("TESTING MOCK DATA STRUCTURE")
    
    # Get the date plan data
    try:
        print("Retrieving date plan data...")
        
        response = requests.post(
            f"{API_BASE_URL}/generate-date",
            json={
                "location": "New York City",
                "budget": "medium",
                "interests": ["movies", "food", "art"],
                "dietary_restrictions": ["vegetarian"],
                "preferences": ["walkable", "public"],
                "vibe": "romantic",
                "style_preference": "casual"
            },
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code != 200:
            print_result("Mock data structure", False, 
                        f"Failed to get date plan data. Status code: {response.status_code}")
            return False
        
        result = response.json()
        
        # Check restaurant structure
        print("\n" + "=" * 60)
        print(" CHECKING RESTAURANT DATA STRUCTURE")
        print("=" * 60)
        
        if not result.get("restaurants") or len(result["restaurants"]) == 0:
            print_result("Restaurant data", False, "No restaurant data found")
            return False
        
        restaurant = result["restaurants"][0]
        required_restaurant_fields = ["id", "name", "image", "cuisine", "rating", "distance", "vibe"]
        missing_fields = [field for field in required_restaurant_fields if field not in restaurant]
        
        if missing_fields:
            print_result("Restaurant data structure", False, 
                        f"Missing required fields: {', '.join(missing_fields)}")
            return False
        else:
            print("✅ Restaurant data has all required fields:")
            for field in required_restaurant_fields:
                print(f"  - {field}: {restaurant[field]}")
        
        # Check activity structure
        print("\n" + "=" * 60)
        print(" CHECKING ACTIVITY DATA STRUCTURE")
        print("=" * 60)
        
        if not result.get("activities") or len(result["activities"]) == 0:
            print_result("Activity data", False, "No activity data found")
            return False
        
        activity = result["activities"][0]
        required_activity_fields = ["id", "name", "image", "type", "tags", "description"]
        missing_fields = [field for field in required_activity_fields if field not in activity]
        
        if missing_fields:
            print_result("Activity data structure", False, 
                        f"Missing required fields: {', '.join(missing_fields)}")
            return False
        else:
            print("✅ Activity data has all required fields:")
            for field in required_activity_fields:
                print(f"  - {field}: {activity[field]}")
        
        print_result("Mock data structure", True)
        return True
        
    except Exception as e:
        print_result("Mock data structure", False, str(e))
        return False

def test_google_maps_integration():
    """Test if the Google Maps API integration is working"""
    print_header("TESTING GOOGLE MAPS API INTEGRATION")
    
    # Test data for a location search
    test_data = {
        "location": "Boston, MA",
        "query": "restaurants",
        "radius": 5000,
        "type": "restaurant",
        "interests": ["Italian", "vegetarian"]
    }
    
    try:
        print(f"Sending request to {API_BASE_URL}/places/search...")
        print(f"Request data: {json.dumps(test_data, indent=2)}")
        
        response = requests.post(
            f"{API_BASE_URL}/places/search",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Response status code: {response.status_code}")
        
        if response.status_code == 200:
            try:
                result = response.json()
                
                # Display the results
                print(f"\nFound {len(result)} places")
                print("\n" + "=" * 60)
                print(" GOOGLE MAPS PLACES RESULTS")
                print("=" * 60)
                
                for i, place in enumerate(result[:3]):  # Show first 3 results
                    print(f"\nPlace #{i+1}:")
                    print(json.dumps(place, indent=2))
                    print("-" * 40)
                
                # Save the response to a file
                with open("google_maps_response.json", "w") as f:
                    json.dump(result, f, indent=2)
                print("\nFull response saved to google_maps_response.json")
                
                print_result("Google Maps API integration", True)
                return True
            except json.JSONDecodeError:
                print_result("Google Maps API integration", False, 
                            "Response is not valid JSON")
                return False
        else:
            print("Error response:")
            try:
                error_data = response.json()
                print(json.dumps(error_data, indent=2))
            except:
                print(response.text)
            
            print_result("Google Maps API integration", False, 
                        f"Status code: {response.status_code}")
            return False
    except Exception as e:
        print_result("Google Maps API integration", False, str(e))
        return False

def test_ticketmaster_integration():
    """Test if the Ticketmaster API integration is working"""
    print_header("TESTING TICKETMASTER API INTEGRATION")
    
    # Test data for an events search
    test_data = {
        "location": "New York, NY",
        "interests": ["concert", "theater", "family"]
    }
    
    try:
        print(f"Sending request to {API_BASE_URL}/events/search...")
        print(f"Request data: {json.dumps(test_data, indent=2)}")
        
        response = requests.post(
            f"{API_BASE_URL}/events/search",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Response status code: {response.status_code}")
        
        if response.status_code == 200:
            try:
                result = response.json()
                
                # Display the results
                print(f"\nFound {len(result)} events")
                print("\n" + "=" * 60)
                print(" TICKETMASTER EVENTS RESULTS")
                print("=" * 60)
                
                for i, event in enumerate(result[:3]):  # Show first 3 results
                    print(f"\nEvent #{i+1}:")
                    print(json.dumps(event, indent=2))
                    print("-" * 40)
                
                # Save the response to a file
                with open("ticketmaster_response.json", "w") as f:
                    json.dump(result, f, indent=2)
                print("\nFull response saved to ticketmaster_response.json")
                
                print_result("Ticketmaster API integration", True)
                return True
            except json.JSONDecodeError:
                print_result("Ticketmaster API integration", False, 
                            "Response is not valid JSON")
                return False
        else:
            print("Error response:")
            try:
                error_data = response.json()
                print(json.dumps(error_data, indent=2))
            except:
                print(response.text)
            
            print_result("Ticketmaster API integration", False, 
                        f"Status code: {response.status_code}")
            return False
    except Exception as e:
        print_result("Ticketmaster API integration", False, str(e))
        return False

def run_tests():
    """Run all API tests"""
    print_header("LOVELINK '89 BACKEND API TESTER")
    print("This script tests if the backend API is working correctly.")
    print("Make sure the backend server is running before using this tool.")
    
    # First check if we can connect to the server
    if not test_connection():
        print("\n❌ Cannot connect to the server. Please make sure it's running.")
        print(f"Expected server URL: {API_BASE_URL.split('/api')[0]}")
        print("\nTo start the server, run:")
        print("cd /Users/harimanivannan/Documents/GitHub/PeachHacks2025/backend")
        print("python3 main.py")
        return 1
    
    # Run all tests
    results = {
        "debug": test_debug_endpoint(),
        "date_plan": test_date_plan_generation(),
        "google_maps": test_google_maps_integration(),
        "ticketmaster": test_ticketmaster_integration()
    }
    
    # Print summary
    print_header("TEST RESULTS SUMMARY")
    
    all_passed = True
    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name.upper()}: {status}")
        if not passed:
            all_passed = False
    
    print("\n" + "=" * 60)
    if all_passed:
        print("🎉 ALL TESTS PASSED! The backend API is working correctly.")
    else:
        print("⚠️ SOME TESTS FAILED. Please check the logs above for details.")
    print("=" * 60)
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(run_tests())
