// Welcome Component - The landing page users see when they first visit the app
// This component displays an attractive welcome screen with features and a call-to-action button

import React from 'react'
// framer-motion provides smooth animations for React components
import { motion } from 'framer-motion'
// lucide-react provides icon components (like Home, MapPin, etc.)
import { Home, MapPin, Heart, Star, ChevronRight, Search, Users, Building } from 'lucide-react'
import houseGif from '../assets/house.gif';

// This is a React functional component that receives props
// Props are data passed from parent components (in this case, an 'onStart' callback function)
const Welcome = ({ onStart }) => {
  // This is an array that stores feature information
  // Each feature object contains an icon (JSX element), title, and description
  // We'll map through this array later to display all features
  const features = [
    {
      icon: <Search className="w-8 h-8 text-blue-600" />, // JSX element that renders as an icon
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

  // The return statement contains the JSX (JavaScript XML) that defines what the component renders
  // motion.div is an animated div from framer-motion that can fade in/out
  return (
    <motion.div
      initial={{ opacity: 0 }} // Starting state: invisible (opacity 0)
      animate={{ opacity: 1 }}  // Ending state: fully visible (opacity 1)
      exit={{ opacity: 0 }}     // State when component is removed: fade out
      className="min-h-screen flex items-center justify-center p-4" // Tailwind CSS classes for styling
    >
      <div className="max-w-6xl mx-auto">
        {/* Hero Section - The main heading and call-to-action area */}
        <motion.div
          initial={{ y: 50, opacity: 0 }} // Starts 50px down and invisible
          animate={{ y: 0, opacity: 1 }}   // Animates to normal position and visible
          transition={{ duration: 0.6 }}   // Animation takes 0.6 seconds
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
          
          {/* The main "Start Your Journey" button */}
          <motion.button
            whileHover={{ scale: 1.05 }} // Scales up 5% when mouse hovers
            whileTap={{ scale: 0.95 }}   // Scales down 5% when clicked
            onClick={onStart}             // Calls the onStart function when clicked (passed from parent)
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Start Your Journey
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Features Grid - Displays the 4 feature cards */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }} // Waits 0.4s before starting animation
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16" // Responsive grid: 1 col on mobile, 2 on tablet, 4 on desktop
        >
          {/* map() iterates through the features array and creates a card for each one */}
          {/* Each feature card is animated individually */}
          {features.map((feature, index) => (
            <motion.div
              key={feature.title} // React needs a unique key for each item in a list
              initial={{ y: 20, opacity: 0 }}          // Starts slightly below and invisible
              animate={{ y: 0, opacity: 1 }}           // Moves to normal position and becomes visible
              transition={{ duration: 0.5, delay: 0.1 * index }} // Each card animates with a slight delay based on its position
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

        {/* Stats Section - Displays impressive statistics about the service */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }} // Last section to animate
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl" // Semi-transparent white background with blur effect
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
