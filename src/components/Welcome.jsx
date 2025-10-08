import React from 'react'
import { motion } from 'framer-motion'
import { Home, MapPin, Heart, Star, ChevronRight, Search, Users, Building } from 'lucide-react'
import houseGif from '../assets/house.gif';

const Welcome = ({ onStart }) => {
  const features = [
    {
      icon: <Search className="w-8 h-8 text-blue-600" />,
      title: "Smart Discovery",
      description: "AI-powered recommendations based on your unique needs"
    },
    {
      icon: <MapPin className="w-8 h-8 text-green-600" />,
      title: "Neighborhood Insights",
      description: "Comprehensive data on safety, schools, and amenities"
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: "Personalized Experience",
      description: "Interactive journey tailored to your preferences"
    },
    {
      icon: <Building className="w-8 h-8 text-purple-600" />,
      title: "Market Analysis",
      description: "Real-time data from across the US housing market"
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
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

        {/* Features Grid */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="card p-6 text-center hover:bg-gradient-to-br hover:from-white hover:to-blue-50"
            >
              <div className="mb-4 flex justify-center">
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

        {/* Stats Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50+ States</div>
              <div className="text-gray-600">Markets Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">1M+ Homes</div>
              <div className="text-gray-600">Properties Analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-gray-600">User Satisfaction</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Welcome
