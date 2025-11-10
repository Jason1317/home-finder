import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Home, MapPin, Heart, Star, ChevronRight, Search, Building, Sparkles, TrendingUp, Shield, Clock } from 'lucide-react'

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

  // Enhanced feature cards with more appealing visuals
  const features = [
    {
      icon: <Sparkles className="w-7 h-7" />,
      title: "AI-Powered Matching",
      description: "Smart algorithms find homes that truly fit your lifestyle",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <MapPin className="w-7 h-7" />,
      title: "Neighborhood Insights",
      description: "Deep data on schools, safety, and local amenities",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Heart className="w-7 h-7" />,
      title: "Personalized Journey",
      description: "Tailored experience based on your unique preferences",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      title: "Real-Time Market Data",
      description: "Live pricing and availability from top real estate sources",
      gradient: "from-indigo-500 to-blue-500"
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.03, 0.05, 0.03]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.03, 0.06, 0.03]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-purple-400 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative min-h-screen flex items-center justify-center p-4 py-12"
      >
        <div className="max-w-7xl mx-auto w-full">
          {/* Hero section */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-20"
          >
            {/* Floating badge */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-5 py-2 rounded-full mb-8 border border-blue-200/50"
            >
              <Star className="w-4 h-4 fill-blue-500 text-blue-500" />
              <span className="text-sm font-medium">Trusted by thousands of home seekers</span>
            </motion.div>

            {/* Animated icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 0.3,
                duration: 0.8,
                type: "spring",
                bounce: 0.5
              }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-3xl mb-8 shadow-2xl shadow-blue-500/30"
            >
              <Home className="w-12 h-12 text-white" />
            </motion.div>
            
            {/* Main headline with gradient */}
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight"
            >
              Discover Your Dream Home
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                With AI-Powered Precision
              </span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed font-light"
            >
              Answer a few questions and let our intelligent platform guide you to neighborhoods that perfectly match your lifestyle, budget, and dreams.
            </motion.p>
            
            {/* CTA Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(79, 70, 229, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                onClick={onStart}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white text-lg font-bold px-10 py-5 rounded-full shadow-2xl shadow-blue-500/40 hover:shadow-purple-500/40 transition-all duration-500 overflow-hidden"
              >
                <span className="relative z-10">Start Your Journey</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="relative z-10"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.button>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-2 text-gray-600"
              >
                <Clock className="w-4 h-4" />
                <span className="text-sm">Takes only 2 minutes</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Enhanced feature cards */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Icon with gradient background */}
                <div className="relative mb-4">
                  <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 text-white`}>
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="relative text-lg font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                  {feature.title}
                </h3>
                <p className="relative text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats section with enhanced design */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-3xl p-10 shadow-2xl shadow-blue-500/30 overflow-hidden"
          >
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
            </div>
            
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-5xl font-extrabold text-white mb-2 drop-shadow-lg">50+</div>
                <div className="text-blue-100 font-medium">States Covered</div>
                <div className="text-blue-200/70 text-sm mt-1">Coast to coast coverage</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-5xl font-extrabold text-white mb-2 drop-shadow-lg">1M+</div>
                <div className="text-blue-100 font-medium">Properties Analyzed</div>
                <div className="text-blue-200/70 text-sm mt-1">Updated in real-time</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-6 h-6 fill-yellow-300 text-yellow-300" />
                  <div className="text-5xl font-extrabold text-white drop-shadow-lg">4.9</div>
                </div>
                <div className="text-blue-100 font-medium">Average Rating</div>
                <div className="text-blue-200/70 text-sm mt-1">From verified users</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Welcome
