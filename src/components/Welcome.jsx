import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Home, ChevronRight, Sparkles, TrendingUp } from 'lucide-react'

const Welcome = ({ onStart, sessionId }) => {
  // Log when user views the welcome page (only in development mode)
  useEffect(() => {
    if (import.meta.env.DEV) {
      const timestamp = new Date().toISOString();
      console.log('[TELEMETRY] [USER_VIEWED_SITE]', {
        sessionId,
        timestamp,
        eventType: 'USER_VIEWED_SITE',
        page: 'welcome',
        referrer: document.referrer || 'direct',
        viewportSize: `${window.innerWidth}x${window.innerHeight}`
      });
    }
  }, [sessionId]);

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered Matching",
      description: "Intelligent recommendations based on your needs"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Real-Time Market Data",
      description: "Live pricing from top real estate sources"
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col p-4"
    >
      {/* Header with brand name */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-6 left-6"
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          TheNextDoor
        </h2>
      </motion.div>

      <div className="max-w-6xl mx-auto flex-1 flex items-center justify-center w-full">
        <div className="w-full">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-8"
          >
            <Home className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            Find Your
            <span className="block gradient-text">Perfect Home</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            An intelligent home finder that understands your unique needs, budget, and lifestyle to discover neighborhoods you'll love across the United States.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Start Your Journey
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-2 gap-6 mb-16 max-w-3xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="card p-6 text-center hover:bg-gradient-to-br hover:from-white hover:to-blue-50"
            >
              <div className="mb-4 flex justify-center text-blue-600">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">50+ States</div>
              <div className="text-gray-600">Markets Covered</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-3xl font-bold text-green-600 mb-2">1M+ Homes</div>
              <div className="text-gray-600">Properties Analyzed</div>
            </motion.div>
          </div>
        </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-auto py-6 text-center"
      >
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm text-gray-500 mb-2">
            TheNextDoor is an AI-powered real estate discovery platform connecting home seekers with their ideal neighborhoods across the United States.
          </p>
          <p className="text-xs text-gray-400">
            © 2025 TheNextDoor. Property data sourced from leading real estate providers. All rights reserved.
          </p>
        </div>
      </motion.footer>
    </motion.div>
  )
}

export default Welcome
