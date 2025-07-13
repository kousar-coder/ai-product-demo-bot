#!/usr/bin/env python3
"""
Test script for the AI Screen Analysis feature
"""

import requests
import json
import os

def test_ai_endpoint():
    """Test the AI analysis endpoint"""
    
    # Test data
    test_data = {
        "user_input": "What's on this page?",
        "screen_text": """
        Dashboard Analytics Users Settings
        Welcome to your dashboard
        Recent Activity
        Revenue Chart
        User Management
        System Settings
        Notifications
        Profile
        Logout
        """,
        "session_id": "test-session-123"
    }
    
    try:
        # Make request to AI endpoint
        response = requests.post(
            "http://localhost:8000/api/backend/ask-ai/",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        print("🔍 Testing AI Screen Analysis Feature")
        print("=" * 50)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ AI Endpoint Working!")
            print(f"📝 User Input: {data.get('user_input')}")
            print(f"🤖 AI Response: {data.get('response')}")
            print(f"📊 Screen Context Length: {data.get('screen_context_length')}")
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Make sure Django is running on port 8000")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

def test_openai_config():
    """Test OpenAI configuration"""
    print("\n🔧 Checking OpenAI Configuration")
    print("=" * 30)
    
    api_key = os.environ.get('OPENAI_API_KEY')
    if api_key:
        print(f"✅ OpenAI API Key found: {api_key[:10]}...")
    else:
        print("❌ OpenAI API Key not found in environment")
        print("💡 Add OPENAI_API_KEY to your django.env file")

if __name__ == "__main__":
    test_openai_config()
    test_ai_endpoint()
    
    print("\n🎯 Next Steps:")
    print("1. Make sure Django server is running: python manage.py runserver")
    print("2. Set your OpenAI API key in django.env")
    print("3. Test the frontend at http://localhost:3000/demo")
    print("4. Try voice commands like 'What's on this page?'") 