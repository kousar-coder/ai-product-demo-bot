import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Mic, 
  Monitor, 
  Mail, 
  Zap, 
  Shield, 
  Users, 
  ArrowRight,
  Play,
  Star
} from 'lucide-react'
import Button from '../components/Button'

const LandingPage = () => {
  const features = [
    {
      icon: Mic,
      title: 'Voice Commands',
      description: 'Navigate your interface naturally with voice commands. No more clicking around.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Monitor,
      title: 'Screen Sharing',
      description: 'Seamless screen sharing sessions with AI agent guidance and interaction.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Mail,
      title: 'Auto Transcripts',
      description: 'Get detailed session transcripts automatically emailed to your sales team.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Real-time AI',
      description: 'Intelligent AI agent that responds and adapts to user interactions instantly.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Shield,
      title: 'Secure Sessions',
      description: 'Enterprise-grade security with encrypted communications and data protection.',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Perfect for sales demos, training sessions, and remote team collaboration.',
      color: 'from-pink-500 to-rose-500'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Sales Director',
      company: 'TechCorp',
      content: 'This AI voice agent has revolutionized our demo process. Our conversion rates increased by 40%.',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Product Manager',
      company: 'InnovateLab',
      content: 'The voice commands are incredibly intuitive. Our clients love the hands-free experience.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Customer Success',
      company: 'GrowthCo',
      content: 'The automatic transcripts save us hours of work. It\'s like having an assistant in every demo.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200 mb-6">
                <Zap className="w-4 h-4 mr-2" />
                AI-Powered Voice Interactions
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Experience the Future of
              <span className="block gradient-text">AI Voice Agent</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Transform your product demos with intelligent voice commands, screen sharing, and automated transcripts. 
              The next generation of interactive AI is here.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/demo">
                <Button size="xl" className="group">
                  Start Demo
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="xl" className="text-white border-white hover:bg-white hover:text-gray-900">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 left-10 w-20 h-20 bg-primary-500/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-40 right-20 w-32 h-32 bg-secondary-500/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-20 left-1/4 w-16 h-16 bg-neon-pink/20 rounded-full blur-xl"
        />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Modern Teams
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to create engaging, interactive demos that convert prospects into customers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card group hover:scale-105"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Loved by Teams Worldwide
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See what our customers are saying about their experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Ready to Transform Your Demos?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-primary-100 mb-8"
          >
            Join thousands of teams already using AI Voice Agent to create engaging, interactive experiences.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link to="/demo">
              <Button size="xl" variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100">
                Start Your Free Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage 