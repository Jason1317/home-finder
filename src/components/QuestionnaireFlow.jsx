import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, DollarSign, MapPin, Users, Car, Coffee, GraduationCap, Shield, Moon, Heart, Home, Briefcase, Loader } from 'lucide-react'

const QuestionnaireFlow = ({ onComplete, isLoading }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selectedState, setSelectedState] = useState('')

  // State and city data for location dropdown
  // Contains major US states with popular cities for each
  const locationData = {
    'California': ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento', 'Oakland', 'Fresno', 'Long Beach'],
    'Texas': ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi'],
    'Florida': ['Jacksonville', 'Miami', 'Tampa', 'Orlando', 'St. Petersburg', 'Tallahassee', 'Fort Lauderdale', 'Gainesville'],
    'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse', 'Yonkers', 'White Plains', 'Ithaca'],
    'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading', 'Scranton', 'Bethlehem', 'Lancaster'],
    'Illinois': ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford', 'Springfield', 'Peoria', 'Elgin'],
    'Ohio': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton', 'Parma', 'Canton'],
    'Georgia': ['Atlanta', 'Augusta', 'Columbus', 'Macon', 'Savannah', 'Athens', 'Sandy Springs', 'Roswell'],
    'North Carolina': ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem', 'Fayetteville', 'Cary', 'Wilmington'],
    'Michigan': ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor', 'Lansing', 'Flint', 'Dearborn'],
    'Arizona': ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale', 'Glendale', 'Gilbert', 'Tempe'],
    'Washington': ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue', 'Everett', 'Kent', 'Renton'],
    'Massachusetts': ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell', 'Brockton', 'Quincy', 'Lynn'],
    'Colorado': ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Lakewood', 'Thornton', 'Arvada', 'Boulder'],
    'Oregon': ['Portland', 'Salem', 'Eugene', 'Gresham', 'Hillsboro', 'Beaverton', 'Bend', 'Medford'],
    'Nevada': ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Sparks', 'Carson City', 'Fernley', 'Elko'],
    'Tennessee': ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Clarksville', 'Murfreesboro', 'Franklin', 'Jackson'],
    'Virginia': ['Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond', 'Newport News', 'Alexandria', 'Hampton', 'Roanoke'],
    'Maryland': ['Baltimore', 'Frederick', 'Rockville', 'Gaithersburg', 'Bowie', 'Hagerstown', 'Annapolis', 'College Park'],
    'Wisconsin': ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine', 'Appleton', 'Waukesha', 'Eau Claire']
  }

  // Core questionnaire data - defines all questions, options, and validation rules
  // Each question has: id (key for answers object), type (single/multiple/text), and options
  const questions = [
    {
      id: 'experience',
      title: "What's your home buying experience?",
      subtitle: "This helps us tailor our recommendations",
      type: 'single',
      options: [
        { value: 'first-time', label: 'First-time buyer', icon: <Home className="w-6 h-6" />, description: 'New to the home buying process' },
        { value: 'experienced', label: 'Experienced buyer', icon: <Briefcase className="w-6 h-6" />, description: 'Bought homes before' },
        { value: 'investor', label: 'Investor', icon: <DollarSign className="w-6 h-6" />, description: 'Looking for investment properties' }
      ]
    },
    {
      id: 'budget',
      title: "What's your budget range?",
      subtitle: "We'll find options that fit your financial comfort zone",
      type: 'single',
      options: [
        { value: 'under-200k', label: 'Under $200K', icon: <DollarSign className="w-6 h-6" />, description: 'Starter homes and condos' },
        { value: '200k-400k', label: '$200K - $400K', icon: <DollarSign className="w-6 h-6" />, description: 'Mid-range family homes' },
        { value: '400k-600k', label: '$400K - $600K', icon: <DollarSign className="w-6 h-6" />, description: 'Premium properties' },
        { value: '600k-1m', label: '$600K - $1M', icon: <DollarSign className="w-6 h-6" />, description: 'Luxury homes' },
        { value: 'over-1m', label: 'Over $1M', icon: <DollarSign className="w-6 h-6" />, description: 'High-end luxury' }
      ]
    },
    {
      id: 'lifestyle',
      title: "What's most important to you?",
      subtitle: "Select your top 3 priorities",
      type: 'multiple',
      maxSelections: 3,
      options: [
        { value: 'schools', label: 'Great Schools', icon: <GraduationCap className="w-6 h-6" />, description: 'Top-rated education' },
        { value: 'safety', label: 'Safety & Security', icon: <Shield className="w-6 h-6" />, description: 'Low crime rates' },
        { value: 'nightlife', label: 'Nightlife & Entertainment', icon: <Moon className="w-6 h-6" />, description: 'Bars, clubs, events' },
        { value: 'restaurants', label: 'Dining Scene', icon: <Coffee className="w-6 h-6" />, description: 'Great food options' },
        { value: 'commute', label: 'Easy Commute', icon: <Car className="w-6 h-6" />, description: 'Short travel times' },
        { value: 'family', label: 'Near Family', icon: <Users className="w-6 h-6" />, description: 'Close to loved ones' }
      ]
    },
    {
      id: 'dealbreakers',
      title: "What are your deal breakers?",
      subtitle: "Things you absolutely want to avoid",
      type: 'multiple',
      maxSelections: 5,
      options: [
        { value: 'high-crime', label: 'High Crime Rate', icon: <Shield className="w-6 h-6" />, description: 'Safety concerns' },
        { value: 'poor-schools', label: 'Poor School Districts', icon: <GraduationCap className="w-6 h-6" />, description: 'Low-rated education' },
        { value: 'long-commute', label: 'Long Commute', icon: <Car className="w-6 h-6" />, description: 'Over 45 minutes' },
        { value: 'no-nightlife', label: 'Limited Nightlife', icon: <Moon className="w-6 h-6" />, description: 'Quiet evenings only' },
        { value: 'expensive', label: 'High Cost of Living', icon: <DollarSign className="w-6 h-6" />, description: 'Above budget lifestyle' },
        { value: 'isolated', label: 'Too Rural/Isolated', icon: <MapPin className="w-6 h-6" />, description: 'Far from amenities' }
      ]
    },
    {
      id: 'location',
      title: "Where are you looking to buy?",
      subtitle: "Select a state and city to find your perfect home",
      type: 'cascading'
    }
  ]

  const currentQ = questions[currentQuestion]
  const isLastQuestion = currentQuestion === questions.length - 1

  // Handles answer changes for both single-select and multiple-select questions
  // For multiple-select: toggles selection and enforces maxSelections limit
  const handleAnswerChange = (questionId, value) => {
    console.log('Answer changed:', questionId, value);
    const question = questions.find(q => q.id === questionId)
    
    if (question.type === 'multiple') {
      const currentAnswers = answers[questionId] || []
      const maxSelections = question.maxSelections || Infinity
      
      if (currentAnswers.includes(value)) {
        setAnswers(prev => ({
          ...prev,
          [questionId]: currentAnswers.filter(v => v !== value)
        }))
      } else if (currentAnswers.length < maxSelections) {
        setAnswers(prev => ({
          ...prev,
          [questionId]: [...currentAnswers, value]
        }))
      }
    } else {
      setAnswers(prev => ({
        ...prev,
        [questionId]: value
      }))
    }
  }

  // Handles state selection for cascading location dropdown
  // Resets city selection when state changes
  const handleStateChange = (state) => {
    setSelectedState(state)
    // Reset city when state changes
    setAnswers(prev => ({
      ...prev,
      location: ''
    }))
  }

  // Handles city selection for cascading location dropdown
  const handleCityChange = (city) => {
    const state = selectedState || answers.location?.split(', ')[1]
    setAnswers(prev => ({
      ...prev,
      location: `${city}, ${state}`
    }))
  }

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete(answers)
    } else {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handleBack = () => {
    setCurrentQuestion(prev => Math.max(0, prev - 1))
  }

  // Validates if user has answered current question before allowing proceed
  // Different validation rules for multiple-select, text, cascading, and single-select
  const canProceed = () => {
    const answer = answers[currentQ.id]
    
    if (currentQ.type === 'multiple') {
      return answer && answer.length > 0
    } else if (currentQ.type === 'text') {
      return answer && answer.trim().length > 0
    } else if (currentQ.type === 'cascading') {
      return answer && answer.trim().length > 0 && selectedState
    }
    return answer !== undefined
  }

  // Loading state - shown while fetching recommendations from API
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Finding Your Perfect Matches</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Our AI is analyzing thousands of neighborhoods across the country to find options that match your preferences...
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="max-w-4xl w-full">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="text-sm text-gray-600">{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
            />
          </div>
        </div>

        {/* Question card with slide animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="card p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">{currentQ.title}</h2>
              <p className="text-gray-600 text-lg">{currentQ.subtitle}</p>
              {currentQ.type === 'multiple' && currentQ.maxSelections && (
                <p className="text-blue-600 text-sm mt-2">
                  Select up to {currentQ.maxSelections} options
                  {answers[currentQ.id] && ` (${answers[currentQ.id].length}/${currentQ.maxSelections} selected)`}
                </p>
              )}
            </div>

            {/* Cascading dropdowns for location selection */}
            {currentQ.type === 'cascading' ? (
              <div className="max-w-2xl mx-auto space-y-6">
                {/* State dropdown */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-left">
                    Select State
                  </label>
                  <select
                    value={selectedState || (answers[currentQ.id] ? answers[currentQ.id].split(', ')[1] : '')}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg bg-white cursor-pointer"
                  >
                    <option value="">Choose a state...</option>
                    {Object.keys(locationData).sort().map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                {/* City dropdown - only shown when state is selected */}
                {(selectedState || (answers[currentQ.id] && answers[currentQ.id].split(', ')[1])) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-gray-700 font-medium mb-2 text-left">
                      Select City
                    </label>
                    <select
                      value={answers[currentQ.id]?.split(', ')[0] || ''}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg bg-white cursor-pointer"
                    >
                      <option value="">Choose a city...</option>
                      {locationData[selectedState || answers[currentQ.id]?.split(', ')[1]]?.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </motion.div>
                )}

                {/* Display selected location */}
                {answers[currentQ.id] && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2 text-blue-700">
                      <MapPin className="w-5 h-5" />
                      <span className="font-semibold">Selected Location:</span>
                      <span>{answers[currentQ.id]}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : currentQ.type === 'text' ? (
              <div className="max-w-2xl mx-auto">
                <textarea
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  placeholder={currentQ.placeholder}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none h-32 text-lg"
                />
              </div>
            ) : currentQ.options ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {/* Option cards for single/multiple select questions */}
                {currentQ.options.map((option, index) => {
                  const isSelected = currentQ.type === 'multiple' 
                    ? answers[currentQ.id]?.includes(option.value)
                    : answers[currentQ.id] === option.value

                  return (
                    <motion.button
                      key={option.value}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerChange(currentQ.id, option.value)}
                      className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                          {option.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold text-lg mb-1 ${
                            isSelected ? 'text-blue-700' : 'text-gray-800'
                          }`}>
                            {option.label}
                          </h3>
                          <p className="text-gray-600 text-sm">{option.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            ) : null}

            {/* Navigation buttons */}
            <div className="flex justify-between items-center mt-12">
              <button
                onClick={handleBack}
                disabled={currentQuestion === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentQuestion === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>

              <motion.button
                whileHover={canProceed() ? { scale: 1.05 } : {}}
                whileTap={canProceed() ? { scale: 0.95 } : {}}
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex items-center gap-3 px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  canProceed()
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isLastQuestion ? 'Find My Perfect Home' : 'Continue'}
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default QuestionnaireFlow
