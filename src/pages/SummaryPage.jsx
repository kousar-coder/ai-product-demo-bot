import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { 
  Clock, 
  MessageSquare, 
  Download, 
  Mail, 
  Share2, 
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Calendar,
  Video,
  Bot
} from 'lucide-react'
import Button from '../components/Button'
import toast from 'react-hot-toast'

const SummaryPage = () => {
  const location = useLocation()
  const [sessionData, setSessionData] = useState(location.state || {})
  const [isEmailSent, setIsEmailSent] = useState(false)

  const {
    sessionId,
    messages = [],
    duration = 0
  } = sessionData

  const sessionDuration = Math.floor(duration / 1000 / 60) // Convert to minutes
  const totalCommands = messages.filter(m => m.type === 'user').length
  const aiResponses = messages.filter(m => m.type === 'ai').length

  const metrics = [
    {
      icon: Clock,
      label: 'Session Duration',
      value: `${sessionDuration} min`,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: MessageSquare,
      label: 'Voice Commands',
      value: totalCommands,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: Users,
      label: 'AI Interactions',
      value: aiResponses,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: TrendingUp,
      label: 'Engagement Score',
      value: `${Math.min(100, Math.max(60, totalCommands * 15))}%`,
      color: 'text-orange-600 dark:text-orange-400'
    }
  ]

  const nextSteps = [
    {
      title: 'Schedule a Follow-up',
      description: 'Book a personalized demo with our sales team',
      icon: Calendar,
      action: 'Schedule Call',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Download Resources',
      description: 'Get whitepapers, case studies, and technical docs',
      icon: Download,
      action: 'Download',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Join Webinar',
      description: 'Learn more about advanced features and use cases',
      icon: Video,
      action: 'Register',
      color: 'from-purple-500 to-pink-500'
    }
  ]

  const sendTranscriptEmail = () => {
    // In a real app, this would call your backend API
    setIsEmailSent(true)
    toast.success('Transcript sent to sales team!')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-8 h-8 text-white" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Demo Session Complete!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Thank you for experiencing our AI Voice Agent. Here's a summary of your session and next steps.
          </p>
        </motion.div>

        {/* Session Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="card text-center"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${metric.color.replace('text-', 'bg-').replace('dark:text-', 'dark:bg-')} bg-opacity-10 flex items-center justify-center mx-auto mb-4`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {metric.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Session Transcript */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Session Transcript
            </h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id || index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className={`p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500'
                      : 'bg-gray-50 dark:bg-gray-700 border-l-4 border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    {message.type === 'user' ? (
                      <Users className="w-4 h-4 text-primary-600" />
                    ) : (
                      <Bot className="w-4 h-4 text-gray-600" />
                    )}
                    <span className="font-medium text-sm">
                      {message.type === 'user' ? 'You' : 'AI Assistant'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-900 dark:text-gray-100 text-sm">
                    {message.content}
                  </p>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 flex space-x-3">
              <Button
                variant="outline"
                onClick={sendTranscriptEmail}
                disabled={isEmailSent}
              >
                <Mail className="w-4 h-4 mr-2" />
                {isEmailSent ? 'Sent!' : 'Send to Sales'}
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </motion.div>

          {/* Session Analytics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Session Analytics
            </h2>
            
            <div className="space-y-6">
              {/* Engagement Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Engagement Overview
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Voice Commands</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(100, totalCommands * 20)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {totalCommands}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">AI Responses</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-secondary-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(100, aiResponses * 20)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {aiResponses}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Session Duration</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(100, sessionDuration * 10)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {sessionDuration}m
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Insights */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Key Insights
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Successfully completed {totalCommands} voice commands</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>AI responded to {aiResponses} interactions</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Session lasted {sessionDuration} minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            What's Next?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nextSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="card text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${step.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {step.description}
                </p>
                <Button variant="outline" className="w-full">
                  {step.action}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-100 mb-6 max-w-2xl mx-auto">
              Join thousands of teams already using AI Voice Agent to create engaging, interactive experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/demo">
                <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100">
                  <Play className="w-5 h-5 mr-2" />
                  Start Another Demo
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary-600">
                <Mail className="w-5 h-5 mr-2" />
                Contact Sales
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SummaryPage 