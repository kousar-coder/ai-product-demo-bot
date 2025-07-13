import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Monitor, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Download, 
  Mail, 
  Clock,
  User,
  Bot,
  Volume2,
  Settings,
  X
} from 'lucide-react'
import Button from '../components/Button'
import VoiceCommandInput from '../components/VoiceCommandInput'
import { sessionService, commandService, aiService } from '../services/api'
import toast from 'react-hot-toast'

const DemoPage = () => {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  const [transcript, setTranscript] = useState(null)
  const mediaRecorderRef = useRef(null)
  const streamRef = useRef(null)

  // Function to get visible screen text for AI analysis
  const getScreenContext = () => {
    try {
      // Get all visible text from the current page
      const screenText = document.body.innerText || document.body.textContent || '';
      // Limit to 1500 characters to stay within token limits and prevent overflow
      return screenText.slice(0, 1500);
    } catch (error) {
      console.error('Error getting screen context:', error);
      return '';
    }
  };

  // Function to send message to AI with screen context
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

  useEffect(() => {
    // Initialize session on component mount
    initializeSession()
  }, [])

  const initializeSession = async () => {
    try {
      setIsLoading(true)
      const response = await sessionService.startSession()
      setSession(response.data)
      
      // Add welcome message
      setMessages([
        {
          id: 1,
          type: 'ai',
          content: "Hello! I'm your AI assistant. I'm here to guide you through this demo. What would you like to explore today?",
          timestamp: new Date()
        }
      ])
      
      toast.success('Demo session started!')
    } catch (error) {
      console.error('Failed to start session:', error)
      toast.error('Failed to start demo session')
    } finally {
      setIsLoading(false)
    }
  }

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' },
        audio: true
      })
      
      streamRef.current = stream
      setIsScreenSharing(true)
      
      // Start recording
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      const chunks = []
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        // In a real app, you'd upload this to your server
        console.log('Recording saved:', url)
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      
      toast.success('Screen sharing started!')
    } catch (error) {
      console.error('Failed to start screen share:', error)
      toast.error('Failed to start screen sharing')
    }
  }

  const stopScreenShare = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
    
    setIsScreenSharing(false)
    toast.success('Screen sharing stopped')
  }

  const handleVoiceCommand = async (command) => {
    if (!session) {
      toast.error('No active session. Please refresh the page and try again.')
      return
    }

    if (!command || !command.trim()) {
      toast.error('Please provide a valid command.')
      return
    }

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: command,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    // Show typing indicator
    const typingMessage = {
      id: Date.now() + 0.5,
      type: 'ai',
      content: '...',
      timestamp: new Date(),
      isTyping: true
    }
    setMessages(prev => [...prev, typingMessage])

    try {
      // Get AI response with screen context
      const aiResponse = await sendMessageToAI(command)
      
      // Remove typing indicator and add AI response
      setMessages(prev => prev.filter(msg => !msg.isTyping))
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      
    } catch (error) {
      console.error('Failed to get AI response:', error)
      
      // Remove typing indicator and add error message
      setMessages(prev => prev.filter(msg => !msg.isTyping))
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      
      // Show toast notification for better user feedback
      toast.error('Failed to get AI response. Please try again.')
    }
  }

  const endSession = async () => {
    try {
      if (session) {
        await sessionService.endSession(session.session_id)
      }
      
      if (isScreenSharing) {
        stopScreenShare()
      }
      
      // Navigate to summary page
      navigate('/summary', { 
        state: { 
          sessionId: session?.session_id,
          messages: messages,
          duration: session ? new Date() - new Date(session.started_at) : 0
        }
      })
    } catch (error) {
      console.error('Failed to end session:', error)
      toast.error('Failed to end session')
    }
  }

  const getTranscript = async () => {
    if (!session) return
    
    try {
      const response = await sessionService.getTranscript(session.session_id)
      setTranscript(response)
      setShowTranscript(true)
    } catch (error) {
      console.error('Failed to get transcript:', error)
      toast.error('Failed to get transcript')
    }
  }

  const sendTranscriptEmail = () => {
    // In a real app, this would call your backend API
    toast.success('Transcript sent to sales team!')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              AI Voice Agent Demo
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Interactive session with voice commands and screen sharing
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {session && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Session: {session.session_id.slice(0, 8)}...</span>
              </div>
            )}
            
            <Button
              variant="outline"
              onClick={getTranscript}
              disabled={!session}
            >
              <Download className="w-4 h-4 mr-2" />
              Transcript
            </Button>
            
            <Button
              variant="danger"
              onClick={endSession}
              disabled={!session}
            >
              End Session
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Demo Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Screen Share Area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Screen Share
                </h2>
                <div className="flex items-center space-x-2">
                  {isRecording && (
                    <div className="flex items-center space-x-1 text-red-500">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm">Recording</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                {isScreenSharing ? (
                  <video
                    ref={(video) => {
                      if (video && streamRef.current) {
                        video.srcObject = streamRef.current
                      }
                    }}
                    autoPlay
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Monitor className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Click "Start Screen Share" to begin
                    </p>
                    <Button
                      onClick={startScreenShare}
                      disabled={isLoading}
                      loading={isLoading}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Screen Share
                    </Button>
                  </div>
                )}
              </div>
              
              {isScreenSharing && (
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="secondary"
                    onClick={stopScreenShare}
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop Screen Share
                  </Button>
                </div>
              )}
            </motion.div>

            {/* Voice Command Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Voice Commands
              </h2>
              <VoiceCommandInput
                onCommand={handleVoiceCommand}
                disabled={!session}
              />
            </motion.div>
          </div>

          {/* Chat & Controls */}
          <div className="space-y-6">
            {/* Session Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Session Info
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    session ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {session ? 'Active' : 'Initializing...'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Screen Share:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isScreenSharing ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {isScreenSharing ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Recording:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isRecording ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {isRecording ? 'Recording' : 'Stopped'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Chat Messages */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card h-96 flex flex-col"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Chat
              </h2>
              
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      }`}>
                        <div className="flex items-center space-x-2 mb-1">
                          {message.type === 'user' ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                          <span className="text-xs opacity-75">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">
                          {message.isTyping ? (
                            <span className="flex items-center">
                              <span className="animate-pulse">AI is thinking</span>
                              <span className="ml-1 animate-bounce">...</span>
                            </span>
                          ) : (
                            message.content
                          )}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleVoiceCommand('Show me the dashboard')}
                  disabled={!session}
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Show Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleVoiceCommand('Open analytics')}
                  disabled={!session}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Open Analytics
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleVoiceCommand('Show user management')}
                  disabled={!session}
                >
                  <User className="w-4 h-4 mr-2" />
                  User Management
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Transcript Modal */}
      <AnimatePresence>
        {showTranscript && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowTranscript(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Session Transcript
                </h2>
                <button
                  onClick={() => setShowTranscript(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500'
                        : 'bg-gray-50 dark:bg-gray-700 border-l-4 border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {message.type === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                      <span className="font-medium">
                        {message.type === 'user' ? 'User' : 'AI Assistant'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {message.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-900 dark:text-gray-100">
                      {message.content}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowTranscript(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={sendTranscriptEmail}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send to Sales Team
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DemoPage 