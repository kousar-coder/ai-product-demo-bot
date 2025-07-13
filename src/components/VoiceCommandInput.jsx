import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Send, Volume2 } from 'lucide-react'
import Button from './Button'

const VoiceCommandInput = ({ onCommand, disabled = false, className = '' }) => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true)
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'
      
      recognitionRef.current.onstart = () => {
        setIsListening(true)
      }
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }
        
        setTranscript(finalTranscript + interimTranscript)
      }
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }
      
      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && !disabled) {
      setTranscript('')
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const handleSendCommand = () => {
    if (transcript.trim() && onCommand) {
      onCommand(transcript.trim())
      setTranscript('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && transcript.trim()) {
      handleSendCommand()
    }
  }

  if (!isSupported) {
    return (
      <div className={`p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg ${className}`}>
        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
          Speech recognition is not supported in your browser. Please use Chrome or Edge for voice commands.
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Voice Input Area */}
      <div className="relative">
        <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus-within:border-primary-500 dark:focus-within:border-primary-400 transition-colors duration-200">
          {/* Voice Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isListening ? stopListening : startListening}
            disabled={disabled}
            className={`p-3 rounded-full transition-all duration-300 ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/40'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <AnimatePresence mode="wait">
              {isListening ? (
                <motion.div
                  key="listening"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MicOff className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="not-listening"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Mic className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Text Input */}
          <input
            type="text"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isListening ? "Listening..." : "Type or speak your command..."}
            disabled={disabled}
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />

          {/* Send Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSendCommand}
            disabled={!transcript.trim() || disabled}
            className="p-2"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Listening Indicator */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -bottom-8 left-0 right-0 flex items-center justify-center space-x-2"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 bg-red-500 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 bg-red-500 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                className="w-2 h-2 bg-red-500 rounded-full"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                Listening...
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Message */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center space-x-2 text-sm text-primary-600 dark:text-primary-400"
          >
            <Volume2 className="w-4 h-4" />
            <span>Speak now to give voice commands</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VoiceCommandInput 