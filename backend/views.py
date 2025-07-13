import logging
import openai
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view
from django.core.exceptions import ValidationError
from .services import SessionService, CommandService, TranscriptService
from .serializers import (
    DemoSessionSerializer, 
    CommandRequestSerializer, 
    TranscriptSerializer
)

logger = logging.getLogger(__name__)

class StartSessionView(APIView):
    """API endpoint to start a new demo session"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Create a new demo session"""
        try:
            session = SessionService.create_session()
            serializer = DemoSessionSerializer(session)
            
            logger.info(f"Started new session: {session.session_id}")
            return Response(
                {
                    "message": "Session started successfully",
                    "data": serializer.data
                }, 
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            logger.error(f"Failed to start session: {e}")
            return Response(
                {"error": "Failed to start session"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SendCommandView(APIView):
    """API endpoint to send voice commands"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Process a voice command"""
        try:
            # Validate request data
            serializer = CommandRequestSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(
                    {"error": "Invalid request data", "details": serializer.errors}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            session_id = serializer.validated_data['session_id']
            command = serializer.validated_data['command']
            
            # Process command using service
            result, status_code = CommandService.process_command(str(session_id), command)
            
            return Response(result, status=status_code)
            
        except ValidationError as e:
            logger.warning(f"Validation error in command: {e}")
            return Response(
                {"error": "Invalid command format"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Unexpected error in SendCommandView: {e}")
            return Response(
                {"error": "Internal server error"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class TranscriptView(APIView):
    """API endpoint to get session transcript"""
    permission_classes = [AllowAny]
    
    def get(self, request, session_id):
        """Get full transcript for a session"""
        try:
            result, status_code = TranscriptService.get_session_transcript(str(session_id))
            return Response(result, status=status_code)
            
        except Exception as e:
            logger.error(f"Error getting transcript: {e}")
            return Response(
                {"error": "Internal server error"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class EndSessionView(APIView):
    """API endpoint to end a demo session"""
    permission_classes = [AllowAny]
    
    def post(self, request, session_id):
        """End a demo session"""
        try:
            success = SessionService.end_session(str(session_id))
            
            if success:
                return Response(
                    {"message": "Session ended successfully"}, 
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"error": "Session not found or already ended"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
                
        except Exception as e:
            logger.error(f"Error ending session: {e}")
            return Response(
                {"error": "Internal server error"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(["POST"])
def ask_ai(request):
    """AI endpoint that analyzes screen content and provides contextual responses"""
    try:
        user_input = request.data.get("user_input", "")
        screen_text = request.data.get("screen_text", "")
        session_id = request.data.get("session_id", "")

        # Validate inputs
        if not user_input.strip():
            logger.warning("Empty user input received")
            return Response(
                {"error": "User input is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get OpenAI API key from environment
        openai_api_key = os.environ.get('OPENAI_API_KEY')
        if not openai_api_key:
            logger.error("OpenAI API key not configured")
            return Response(
                {"error": "AI service not configured. Please contact support."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Configure OpenAI
        openai.api_key = openai_api_key

        # Limit screen text to prevent token overflow (1500 chars = ~2000 tokens)
        limited_screen_text = screen_text[:1500] if screen_text else "No screen content available"
        
        # Create intelligent prompt based on screen content
        prompt = f"""
You are an intelligent AI demo agent helping users interact with a SaaS product UI. You can see what's currently displayed on their screen and should provide helpful, contextual guidance.

CURRENT SCREEN CONTENT:
---
{limited_screen_text}
---

USER QUESTION/COMMAND: "{user_input}"

INSTRUCTIONS:
1. Analyze the visible screen content to understand the current context
2. Provide a helpful, specific response that guides the user
3. If the user asks about features not visible, suggest how to navigate to them
4. Be conversational but professional
5. If you can identify specific UI elements, mention them by name
6. Keep responses concise but informative

RESPONSE FORMAT:
Provide a natural, helpful response that addresses the user's question based on what's visible on screen.
"""

        logger.info(f"Calling OpenAI API for user input: '{user_input[:50]}...' (screen text length: {len(limited_screen_text)})")

        # Call OpenAI API with error handling
        try:
            completion = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system", 
                        "content": "You are a helpful, UI-aware AI assistant that guides users through software demos. You can see what's on their screen and provide contextual help."
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                max_tokens=300,
                temperature=0.7
            )

            ai_response = completion.choices[0].message.content.strip()
            
            if not ai_response:
                logger.warning("Empty response from OpenAI API")
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

        # Log the interaction if session_id is provided
        if session_id:
            try:
                CommandService.process_command(str(session_id), f"AI Analysis: {user_input}")
            except Exception as e:
                logger.warning(f"Failed to log AI interaction: {e}")

        logger.info(f"AI response generated successfully for: '{user_input[:50]}...'")
        
        return Response({
            "response": ai_response,
            "user_input": user_input,
            "screen_context_length": len(limited_screen_text)
        })

    except Exception as e:
        logger.error(f"Unexpected error in AI analysis: {e}", exc_info=True)
        return Response({
            "response": "I'm sorry, something went wrong on my end. Please try again or contact support if the problem persists.",
            "error": "Internal server error"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
