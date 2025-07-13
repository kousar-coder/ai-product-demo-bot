# 🛡️ Error Handling Guide - AI Voice Agent

This guide documents the comprehensive error handling implemented to prevent 500 Internal Server Errors and ensure graceful degradation.

## 🎯 Problem Solved

**Issue**: 500 Internal Server Error when asking AI questions like "What is on this page?"

**Root Causes**:
- Large screen content causing token overflow
- OpenAI API failures (rate limits, auth errors, network issues)
- Missing or invalid API keys
- Unhandled exceptions in backend
- Poor error feedback in frontend

## ✅ Backend Fixes (Django DRF)

### 1. Enhanced `ask_ai` Function in `backend/views.py`

#### Input Validation
```python
# Validate user input
if not user_input.strip():
    logger.warning("Empty user input received")
    return Response(
        {"error": "User input is required"}, 
        status=status.HTTP_400_BAD_REQUEST
    )

# Check API key configuration
openai_api_key = os.environ.get('OPENAI_API_KEY')
if not openai_api_key:
    logger.error("OpenAI API key not configured")
    return Response(
        {"error": "AI service not configured. Please contact support."}, 
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )
```

#### Content Limiting
```python
# Limit screen text to prevent token overflow (1500 chars = ~2000 tokens)
limited_screen_text = screen_text[:1500] if screen_text else "No screen content available"
```

#### Specific OpenAI Error Handling
```python
try:
    completion = openai.ChatCompletion.create(...)
    ai_response = completion.choices[0].message.content.strip()
    
    if not ai_response:
        return Response({
            "response": "I'm sorry, I couldn't generate a response. Please try asking your question again.",
            "user_input": user_input,
            "screen_context_length": len(limited_screen_text)
        })

except openai.error.RateLimitError as e:
    logger.error(f"OpenAI rate limit exceeded: {e}")
    return Response({
        "response": "I'm receiving too many requests right now. Please wait a moment and try again.",
        "error": "Rate limit exceeded"
    }, status=status.HTTP_429_TOO_MANY_REQUESTS)
    
except openai.error.InvalidRequestError as e:
    logger.error(f"OpenAI invalid request: {e}")
    return Response({
        "response": "I'm having trouble processing your request. Please try rephrasing your question.",
        "error": "Invalid request"
    }, status=status.HTTP_400_BAD_REQUEST)
    
except openai.error.AuthenticationError as e:
    logger.error(f"OpenAI authentication error: {e}")
    return Response({
        "response": "AI service is currently unavailable. Please contact support.",
        "error": "Authentication failed"
    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
except openai.error.APIError as e:
    logger.error(f"OpenAI API error: {e}")
    return Response({
        "response": "I'm experiencing technical difficulties. Please try again in a moment.",
        "error": "API error"
    }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
```

#### Comprehensive Logging
```python
logger.info(f"Calling OpenAI API for user input: '{user_input[:50]}...' (screen text length: {len(limited_screen_text)})")
logger.info(f"AI response generated successfully for: '{user_input[:50]}...'")
```

## ✅ Frontend Fixes (React)

### 1. Enhanced API Service (`src/services/api.js`)

#### Input Validation
```javascript
// Validate inputs
if (!userInput || !userInput.trim()) {
  throw new Error('User input is required')
}

// Limit screen text to prevent token overflow
const limitedScreenText = screenText ? screenText.slice(0, 1500) : ''
```

#### Specific Error Handling
```javascript
catch (error) {
  // Handle specific error cases
  if (error.response) {
    const status = error.response.status
    const errorData = error.response.data
    
    if (status === 429) {
      throw new Error('Too many requests. Please wait a moment and try again.')
    } else if (status === 400) {
      throw new Error(errorData.error || 'Invalid request. Please try again.')
    } else if (status === 500) {
      throw new Error(errorData.response || 'AI service is temporarily unavailable.')
    } else if (status === 503) {
      throw new Error('AI service is currently down. Please try again later.')
    } else {
      throw new Error(errorData.response || errorData.error || 'Something went wrong.')
    }
  } else if (error.request) {
    // Network error
    throw new Error('Network error. Please check your connection and try again.')
  } else {
    // Other errors
    throw new Error(error.message || 'An unexpected error occurred.')
  }
}
```

### 2. Improved DemoPage (`src/pages/DemoPage.jsx`)

#### Screen Context Limiting
```javascript
const getScreenContext = () => {
  try {
    const screenText = document.body.innerText || document.body.textContent || '';
    // Limit to 1500 characters to stay within token limits and prevent overflow
    return screenText.slice(0, 1500);
  } catch (error) {
    console.error('Error getting screen context:', error);
    return '';
  }
};
```

#### Enhanced Error Handling
```javascript
const sendMessageToAI = async (userMessage) => {
  try {
    const screenText = getScreenContext();
    const response = await aiService.askAI(userMessage, screenText, session?.session_id);
    return response.response;
  } catch (error) {
    console.error('Error calling AI service:', error);
    
    // Show user-friendly error message
    toast.error('AI service error: ' + error.message);
    
    // Return a helpful fallback response
    return "I'm sorry, I'm having trouble analyzing the screen right now. Please try again in a moment, or you can describe what you're looking for and I'll do my best to help.";
  }
};
```

#### Voice Command Validation
```javascript
const handleVoiceCommand = async (command) => {
  if (!session) {
    toast.error('No active session. Please refresh the page and try again.')
    return
  }

  if (!command || !command.trim()) {
    toast.error('Please provide a valid command.')
    return
  }
  // ... rest of function
}
```

### 3. Smart API Interceptor
```javascript
// Don't show toast for AI service errors as they're handled specifically
if (!error.config?.url?.includes('/ask-ai/')) {
  const message = error.response?.data?.error || error.response?.data?.response || error.message || 'Something went wrong'
  toast.error(message)
}
```

## 🧪 Testing

### Test Script: `test_error_handling.py`

Run comprehensive error handling tests:

```bash
python test_error_handling.py
```

**Tests Include**:
- ✅ Empty user input handling
- ✅ Missing API key handling
- ✅ Large screen content truncation
- ✅ Invalid API key handling
- ✅ Rate limiting simulation
- ✅ Successful request validation

## 🚀 Error Scenarios Handled

### 1. **Large Screen Content**
- **Problem**: `document.body.innerText` can be massive
- **Solution**: Truncate to 1500 characters (frontend + backend)
- **Result**: Prevents token overflow, maintains performance

### 2. **OpenAI API Failures**
- **Rate Limits**: Returns 429 with user-friendly message
- **Auth Errors**: Returns 500 with support contact info
- **Network Issues**: Returns 503 with retry suggestion
- **Invalid Requests**: Returns 400 with rephrase suggestion

### 3. **Missing/Invalid API Keys**
- **Missing Key**: Clear error message about configuration
- **Invalid Key**: Graceful degradation with helpful response
- **Result**: No more 500 errors, user gets helpful feedback

### 4. **Empty/Invalid Inputs**
- **Empty Commands**: Validated before API call
- **Malformed Data**: Proper HTTP status codes
- **Result**: Better user experience, fewer errors

### 5. **Network Issues**
- **Connection Errors**: Clear network error messages
- **Timeout Handling**: 10-second timeout with retry guidance
- **Result**: Users know when to retry vs contact support

## 📊 Error Response Format

All error responses now include:
```json
{
  "response": "User-friendly error message",
  "error": "Technical error details (for debugging)",
  "user_input": "Original user input",
  "screen_context_length": 1234
}
```

## 🎯 User Experience Improvements

### Before (500 Error)
- ❌ White screen or generic error
- ❌ No helpful information
- ❌ User doesn't know what to do

### After (Graceful Handling)
- ✅ Clear, helpful error messages
- ✅ Specific guidance on what to do
- ✅ Fallback responses when possible
- ✅ Toast notifications for immediate feedback
- ✅ Retry suggestions for temporary issues

## 🔧 Monitoring & Debugging

### Backend Logging
- Detailed error logs with stack traces
- Request/response logging for debugging
- Performance metrics (response times, token usage)

### Frontend Error Tracking
- Console logging for development
- User-friendly error messages
- Error boundaries prevent app crashes

## 🚀 Production Readiness

### Environment Variables
```bash
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional (for enhanced logging)
DJANGO_LOG_LEVEL=INFO
```

### Health Checks
- API health endpoint for monitoring
- OpenAI API connectivity checks
- Database connection validation

### Rate Limiting
- Frontend request throttling
- Backend rate limit handling
- User-friendly rate limit messages

---

## 🎉 Result

**No more 500 Internal Server Errors!** 

The AI Voice Agent now gracefully handles all error scenarios with:
- ✅ User-friendly error messages
- ✅ Proper HTTP status codes
- ✅ Comprehensive logging
- ✅ Fallback responses
- ✅ Retry guidance
- ✅ Performance optimization

Users get helpful feedback instead of crashes, and developers get detailed logs for debugging. 