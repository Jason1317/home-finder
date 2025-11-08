import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, DollarSign, Star, Users, GraduationCap, Shield, Car, Coffee, Home, ChevronRight, ExternalLink, RefreshCw, Heart, TrendingUp, TrendingDown } from 'lucide-react'

const Results = ({ preferences, recommendations, onRestart }) => {
  const [selectedCity, setSelectedCity] = useState(null)

  const CityCard = ({ city, isSelected, onClick }) => (
    <motion.div
      layoutId={`city-${city.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={`cursor-pointer card overflow-hidden ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div className="relative">
        <img 
          src={city.image} 
          alt={`${city.city} neighborhood`}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 shadow-lg">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="font-semibold text-sm">{city.matchScore}% Match</span>
          </div>
        </div>
        <div className="absolute top-4 left-4 bg-black/50 rounded-lg px-3 py-1">
          <span className="text-white text-sm font-medium">{city.neighborhood}</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{city.city}</h3>
            <p className="text-gray-600">{city.state}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-800">
              ${city.medianPrice.toLocaleString()}
            </div>
            <div className={`text-sm flex items-center gap-1 ${
              city.priceChange && city.priceChange.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {city.priceChange && city.priceChange.startsWith('+') ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {city.priceChange}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {city.highlights.map((highlight, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`p-1 rounded ${highlight.good ? 'text-green-600' : 'text-orange-600'}`}>
                {highlight.icon}
              </div>
              <div>
                <div className="text-xs text-gray-600">{highlight.label}</div>
                <div className="font-medium text-sm">{highlight.value}</div>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 rounded-lg transition-colors duration-200">
          View Details
        </button>
      </div>
    </motion.div>
  )

  const DetailedView = ({ city }) => (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="bg-white rounded-xl shadow-xl overflow-hidden"
    >
      <div className="relative h-64">
        <img 
          src={city.image} 
          alt={city.city}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-bold">{city.city}</h2>
          <p className="text-lg opacity-90">{city.neighborhood} • {city.state}</p>
        </div>
        <button
          onClick={() => setSelectedCity(null)}
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
        >
          ×
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="font-semibold">{city.matchScore}% Match</span>
            </div>
            <div className="text-gray-400">•</div>
            <div className="font-semibold text-lg">${city.medianPrice.toLocaleString()}</div>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <ExternalLink className="w-4 h-4" />
            View Listings
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="font-semibold text-lg mb-3 text-green-700">Why You'll Love It</h3>
            <ul className="space-y-2">
              {city.pros.map((pro, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-3 text-orange-700">Consider These Points</h3>
            <ul className="space-y-2">
              {city.cons.map((con, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-3">Quick Stats</h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{city.stats.schoolRating}</div>
              <div className="text-sm text-gray-600">School Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{city.stats.crimeRate}</div>
              <div className="text-sm text-gray-600">Crime Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{city.stats.walkScore}</div>
              <div className="text-sm text-gray-600">Walk Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{city.stats.commuteTime}m</div>
              <div className="text-sm text-gray-600">Avg Commute</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen p-4"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Your Perfect Home Matches
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Based on your preferences, we found {recommendations ? recommendations.length : 0} neighborhoods that match your lifestyle
          </p>
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            Start Over
          </button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {recommendations && recommendations.length > 0 ? (
                recommendations.map((city, index) => (
                  <motion.div
                    key={city.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CityCard 
                      city={city} 
                      isSelected={selectedCity?.id === city.id}
                      onClick={() => setSelectedCity(city)}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Results Found</h3>
                  <p className="text-gray-600">
                    We couldn't find any properties matching your criteria. Try adjusting your preferences and searching again.
                  </p>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center"
            >
              <h3 className="text-2xl font-bold mb-4">Ready to Explore Further?</h3>
              <p className="mb-6 opacity-90">
                Connect with local real estate agents, schedule virtual tours, or get personalized market reports
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                  Connect with Agents
                </button>
                <button className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors">
                  Get Market Reports
                </button>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {selectedCity ? (
                <DetailedView city={selectedCity} />
              ) : (
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-xl shadow-lg p-8 text-center"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Select a City
                  </h3>
                  <p className="text-gray-600">
                    Click on any city card to see detailed information, pros and cons, and local insights.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t-2 border-gray-200 p-6 z-50"
        >
          <div className="max-w-7xl mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Based on Your Preferences
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">Budget Range</h4>
                <p className="text-gray-600 text-xs mt-1">
                  {preferences.budget?.replace('-', ' - $').replace('k', 'K').replace('m', 'M') || 'Not specified'}
                </p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Heart className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">Top Priorities</h4>
                <p className="text-gray-600 text-xs mt-1">
                  {preferences.lifestyle?.length || 0} selected
                </p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">Deal Breakers</h4>
                <p className="text-gray-600 text-xs mt-1">
                  {preferences.dealbreakers?.length || 0} selected
                </p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">Experience</h4>
                <p className="text-gray-600 text-xs mt-1">
                  {preferences.experience?.replace('-', ' ') || 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="h-48"></div>
      </div>
    </motion.div>
  )
}

export default Results
