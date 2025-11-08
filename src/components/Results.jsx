import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, DollarSign, Star, Home, RefreshCw, Heart, TrendingUp, TrendingDown, Bed, Bath, Maximize, ChevronDown, ChevronUp, ExternalLink, AlertCircle, Sparkles } from 'lucide-react'

const Results = ({ preferences, recommendations, onRestart }) => {
  // Helper to get consistent unique ID for properties
  const getUniqueId = (prop) => prop.zpid || prop.id || `${prop.city}-${prop.neighborhood}`

  // Deduplicate and limit results to 3 unique properties
  const preparedResults = useMemo(() => {
    if (!recommendations || recommendations.length === 0) return []
    
    // Use Map to deduplicate by unique ID
    const uniqueMap = new Map()
    recommendations.forEach(prop => {
      const uniqueId = getUniqueId(prop)
      if (!uniqueMap.has(uniqueId)) {
        // Add uniqueId to property for consistent access
        uniqueMap.set(uniqueId, { ...prop, uniqueId })
      }
    })
    
    // Convert to array and limit to 3
    const unique = Array.from(uniqueMap.values())
    const limited = unique.slice(0, 3)
    
    // Log truncation for telemetry
    if (unique.length > 3) {
      console.log(`Truncated ${unique.length} results to 3`)
    }
    
    return limited
  }, [recommendations])

  const [expandedProperty, setExpandedProperty] = useState(null)

  // Format budget string for display
  const formatBudget = (budget) => {
    if (!budget) return 'Any Budget'
    
    const budgetMap = {
      'under-200k': 'Under $200K',
      '200k-400k': '$200K - $400K',
      '400k-600k': '$400K - $600K',
      '600k-1m': '$600K - $1M',
      'over-1m': 'Over $1M'
    }
    
    return budgetMap[budget] || budget
  }

  // PropertyHero - Hero image section with match score badge
  // Modular component that displays property image and key badges
  const PropertyHero = ({ property }) => (
    <div className="relative h-80 overflow-hidden rounded-t-2xl">
      <img 
        src={property.image} 
        alt={property.neighborhood}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      
      {/* Match Score Badge */}
      <div className="absolute top-4 right-4 bg-white rounded-full px-4 py-2 shadow-xl">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500 fill-current" />
          <span className="font-bold text-lg">{property.matchScore}%</span>
        </div>
      </div>

      {/* Price Change Tag */}
      {property.priceChange && (
        <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg px-3 py-1.5 shadow-lg">
          <div className="flex items-center gap-1">
            {property.priceChange.startsWith('+') ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="font-semibold text-sm">{property.priceChange}</span>
          </div>
        </div>
      )}

      {/* Address Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex items-start gap-2">
          <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-2xl font-bold mb-1">{property.neighborhood}</h3>
            <p className="text-lg opacity-90">{property.city}, {property.state}</p>
          </div>
        </div>
      </div>
    </div>
  )

  // PropertyEssentials - Core property facts section
  // Displays price, beds, baths, sqft - extracted from rawData when available
  const PropertyEssentials = ({ property }) => {
    const beds = property.rawData?.bedrooms || property.rawData?.beds || 'N/A'
    const baths = property.rawData?.bathrooms || property.rawData?.baths || 'N/A'
    const sqft = property.rawData?.livingArea || property.rawData?.sqft || null
    
    // Safe formatting for price
    const formatPrice = (price) => {
      if (typeof price === 'number' && !isNaN(price)) {
        return `$${price.toLocaleString()}`
      }
      return 'Contact for price'
    }

    // Safe formatting for sqft
    const formatSqft = (value) => {
      if (typeof value === 'number' && !isNaN(value)) {
        return value.toLocaleString()
      }
      return 'N/A'
    }
    
    return (
      <div className="p-6 border-b border-gray-100">
        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900">
              {formatPrice(property.medianPrice)}
            </span>
          </div>
        </div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bed className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{beds}</div>
              <div className="text-xs text-gray-600">Beds</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Bath className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{baths}</div>
              <div className="text-xs text-gray-600">Baths</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Maximize className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{formatSqft(sqft)}</div>
              <div className="text-xs text-gray-600">Sq Ft</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // PropertyInsights - Expandable insights section
  // Modular container for future agent data (schools, crime, walkability, etc.)
  const PropertyInsights = ({ property, isExpanded, onToggle }) => (
    <div className="p-6">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between mb-4 hover:bg-gray-50 rounded-lg p-2 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-lg text-gray-900">AI-Powered Insights</h3>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* Placeholder for future agent modules */}
            <div className="space-y-4">
              {/* Pros Section - using existing data */}
              {property.pros && property.pros.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">Why You'll Love It</h4>
                  <ul className="space-y-1">
                    {property.pros.map((pro, idx) => (
                      <li key={idx} className="text-sm text-green-800 flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cons Section - using existing data */}
              {property.cons && property.cons.length > 0 && (
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2">Things to Consider</h4>
                  <ul className="space-y-1">
                    {property.cons.map((con, idx) => (
                      <li key={idx} className="text-sm text-orange-800 flex items-start gap-2">
                        <span className="text-orange-600">!</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Future agent data will be added here as modular sections */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  More Data Coming Soon
                </h4>
                <p className="text-sm text-blue-800">
                  Additional insights about schools, crime rates, walkability, and neighborhood trends will appear here as more agents are integrated.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Listing CTA */}
      <a 
        href={`https://www.zillow.com/homedetails/${property.rawData?.zpid}_zpid/`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
      >
        <ExternalLink className="w-5 h-5" />
        View Listing on Zillow
      </a>
    </div>
  )

  // PropertyCard - Main card component that assembles all modular sections
  const PropertyCard = ({ property, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.2, 
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
    >
      <PropertyHero property={property} />
      <PropertyEssentials property={property} />
      <PropertyInsights 
        property={property}
        isExpanded={expandedProperty === property.uniqueId}
        onToggle={() => setExpandedProperty(expandedProperty === property.uniqueId ? null : property.uniqueId)}
      />
    </motion.div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 pb-32"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Your Top 3 Home Matches
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Curated specifically for your lifestyle in {preferences.location || 'your selected area'}
          </p>
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg shadow-md transition-all duration-200 font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            Start New Search
          </button>
        </motion.div>

        {/* Results Grid - 3 column responsive layout */}
        {preparedResults.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
            {preparedResults.map((property, index) => (
              <PropertyCard key={property.uniqueId} property={property} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-12 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Home className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Properties Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We couldn't find any properties matching your criteria in {preferences.location}. 
              Try adjusting your budget or searching in a different area.
            </p>
            <button
              onClick={onRestart}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200"
            >
              Search Again
            </button>
          </motion.div>
        )}

        {/* Info card for <3 results */}
        {preparedResults.length > 0 && preparedResults.length < 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-12"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-blue-900 mb-2">Limited Results Available</h4>
                <p className="text-blue-800">
                  We found {preparedResults.length} {preparedResults.length === 1 ? 'property' : 'properties'} matching your criteria. 
                  Try adjusting your budget range or expanding your search location for more options.
                </p>
              </div>
            </div>
          </motion.div>
        )}

      </div>

      {/* Sticky search summary bar at bottom */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-2xl border-t-2 border-gray-200 py-4 px-6 z-50"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">{preferences.location || 'Location'}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">
                {formatBudget(preferences.budget)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-purple-600" />
              <span className="text-gray-700">{preparedResults.length} {preparedResults.length === 1 ? 'Match' : 'Matches'}</span>
            </div>
          </div>
          <button
            onClick={onRestart}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            New Search
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Results
