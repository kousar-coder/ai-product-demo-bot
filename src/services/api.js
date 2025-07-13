import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/backend'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add loading state if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Don't show toast for AI service errors as they're handled specifically
    if (!error.config?.url?.includes('/ask-ai/')) {
      const message = error.response?.data?.error || error.response?.data?.response || error.message || 'Something went wrong'
      toast.error(message)
    }
    return Promise.reject(error)
  }
)

export const sessionService = {
  // Start a new demo session
  startSession: async () => {
    try {
      const response = await api.post('/start-session/')
      toast.success('Demo session started successfully!')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // End a demo session
  endSession: async (sessionId) => {
    try {
      const response = await api.post(`/end-session/${sessionId}/`)
      toast.success('Session ended successfully!')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get session transcript
  getTranscript: async (sessionId) => {
    try {
      const response = await api.get(`/transcript/${sessionId}/`)
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export const commandService = {
  // Send voice command
  sendCommand: async (sessionId, command) => {
    try {
      const response = await api.post('/send-command/', {
        session_id: sessionId,
        command: command,
      })
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export const aiService = {
  // Send message to AI with screen context
  askAI: async (userInput, screenText, sessionId = '') => {
    try {
      // Validate inputs
      if (!userInput || !userInput.trim()) {
        throw new Error('User input is required')
      }

      // Limit screen text to prevent token overflow
      const limitedScreenText = screenText ? screenText.slice(0, 1500) : ''
      
      const response = await api.post('/ask-ai/', {
        user_input: userInput.trim(),
        screen_text: limitedScreenText,
        session_id: sessionId,
      })
      
      // Check if response has the expected structure
      if (!response.data || !response.data.response) {
        throw new Error('Invalid response format from AI service')
      }
      
      return response.data
    } catch (error) {
      // Handle specific error cases
      if (error.response) {
        // Server responded with error status
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
  },
}

export default api 