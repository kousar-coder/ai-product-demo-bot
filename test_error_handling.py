#!/usr/bin/env python3
"""
Test script to verify error handling in the AI Voice Agent
Tests various error scenarios to ensure graceful degradation
"""

import requests
import json
import time
import os
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8000"
API_BASE = f"{BASE_URL}/api/backend"

def test_api_health():
    """Test if the API is running"""
    try:
        response = requests.get(f"{BASE_URL}/api/backend/")
        print(f"✅ API Health Check: {response.status_code}")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ API is not running. Please start the Django server first.")
        return False

def test_empty_user_input():
    """Test handling of empty user input"""
    print("\n🧪 Testing empty user input...")
    
    try:
        response = requests.post(f"{API_BASE}/ask-ai/", json={
            "user_input": "",
            "screen_text": "Some screen content"
        })
        
        if response.status_code == 400:
            print("✅ Empty user input correctly rejected with 400")
            return True
        else:
            print(f"❌ Expected 400, got {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing empty input: {e}")
        return False

def test_missing_api_key():
    """Test handling when OpenAI API key is missing"""
    print("\n🧪 Testing missing OpenAI API key...")
    
    # Temporarily remove API key
    original_key = os.environ.get('OPENAI_API_KEY')
    if original_key:
        os.environ.pop('OPENAI_API_KEY')
    
    try:
        response = requests.post(f"{API_BASE}/ask-ai/", json={
            "user_input": "What is on this page?",
            "screen_text": "Some screen content"
        })
        
        if response.status_code == 500:
            data = response.json()
            if "AI service not configured" in data.get('error', ''):
                print("✅ Missing API key correctly handled")
                result = True
            else:
                print(f"❌ Unexpected error message: {data}")
                result = False
        else:
            print(f"❌ Expected 500, got {response.status_code}")
            result = False
    except Exception as e:
        print(f"❌ Error testing missing API key: {e}")
        result = False
    finally:
        # Restore API key
        if original_key:
            os.environ['OPENAI_API_KEY'] = original_key
    
    return result

def test_large_screen_content():
    """Test handling of very large screen content"""
    print("\n🧪 Testing large screen content...")
    
    # Create very large screen content
    large_content = "Large content " * 1000  # ~15,000 characters
    
    try:
        response = requests.post(f"{API_BASE}/ask-ai/", json={
            "user_input": "What is on this page?",
            "screen_text": large_content
        })
        
        if response.status_code == 200:
            data = response.json()
            # Check if content was truncated
            if data.get('screen_context_length', 0) <= 1500:
                print("✅ Large screen content correctly truncated")
                return True
            else:
                print(f"❌ Content not truncated: {data.get('screen_context_length')}")
                return False
        else:
            print(f"❌ Expected 200, got {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing large content: {e}")
        return False

def test_invalid_openai_key():
    """Test handling of invalid OpenAI API key"""
    print("\n🧪 Testing invalid OpenAI API key...")
    
    # Temporarily set invalid key
    original_key = os.environ.get('OPENAI_API_KEY')
    os.environ['OPENAI_API_KEY'] = 'invalid-key-12345'
    
    try:
        response = requests.post(f"{API_BASE}/ask-ai/", json={
            "user_input": "What is on this page?",
            "screen_text": "Some screen content"
        })
        
        if response.status_code in [500, 503]:
            data = response.json()
            if any(keyword in data.get('response', '').lower() for keyword in ['unavailable', 'trouble', 'error']):
                print("✅ Invalid API key correctly handled")
                result = True
            else:
                print(f"❌ Unexpected error message: {data}")
                result = False
        else:
            print(f"❌ Expected 500/503, got {response.status_code}")
            result = False
    except Exception as e:
        print(f"❌ Error testing invalid API key: {e}")
        result = False
    finally:
        # Restore original key
        if original_key:
            os.environ['OPENAI_API_KEY'] = original_key
        else:
            os.environ.pop('OPENAI_API_KEY', None)
    
    return result

def test_rate_limiting_simulation():
    """Simulate rate limiting by making multiple rapid requests"""
    print("\n🧪 Testing rate limiting simulation...")
    
    try:
        # Make 5 rapid requests
        responses = []
        for i in range(5):
            response = requests.post(f"{API_BASE}/ask-ai/", json={
                "user_input": f"Test request {i+1}",
                "screen_text": "Test content"
            })
            responses.append(response)
            time.sleep(0.1)  # Small delay
        
        # Check if any requests failed due to rate limiting
        rate_limited = any(r.status_code == 429 for r in responses)
        if rate_limited:
            print("✅ Rate limiting detected (this is expected behavior)")
            return True
        else:
            print("ℹ️ No rate limiting detected (this is also fine)")
            return True
    except Exception as e:
        print(f"❌ Error testing rate limiting: {e}")
        return False

def test_successful_request():
    """Test a successful AI request"""
    print("\n🧪 Testing successful AI request...")
    
    try:
        response = requests.post(f"{API_BASE}/ask-ai/", json={
            "user_input": "What is on this page?",
            "screen_text": "This is a test page with some content for the AI to analyze."
        })
        
        if response.status_code == 200:
            data = response.json()
            if data.get('response') and len(data.get('response', '')) > 0:
                print("✅ Successful AI request")
                print(f"   Response: {data['response'][:100]}...")
                return True
            else:
                print("❌ Empty response received")
                return False
        else:
            print(f"❌ Expected 200, got {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing successful request: {e}")
        return False

def run_all_tests():
    """Run all error handling tests"""
    print("🚀 Starting Error Handling Tests")
    print("=" * 50)
    
    if not test_api_health():
        return
    
    tests = [
        test_empty_user_input,
        test_missing_api_key,
        test_large_screen_content,
        test_invalid_openai_key,
        test_rate_limiting_simulation,
        test_successful_request
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"❌ Test {test.__name__} crashed: {e}")
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All error handling tests passed!")
    else:
        print("⚠️ Some tests failed. Check the implementation.")
    
    return passed == total

if __name__ == "__main__":
    run_all_tests() 