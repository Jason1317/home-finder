// QuestionnaireFlow Component - A multi-step form that collects user preferences
// This component displays questions one at a time and stores user answers

import React, { useState } from 'react' // useState is a React Hook that lets us manage component state
import { motion, AnimatePresence } from 'framer-motion' // AnimatePresence handles exit animations
import { ChevronRight, ChevronLeft, DollarSign, MapPin, Users, Car, Coffee, GraduationCap, Shield, Moon, Heart, Home, Briefcase, Loader } from 'lucide-react'

// Props: onComplete (callback function), isLoading (boolean showing if data is being fetched)
const QuestionnaireFlow = ({ onComplete, isLoading }) => {
  // useState Hook: currentQuestion stores which question we're on (0 = first question)
  // setCurrentQuestion is the function to update it
  const [currentQuestion, setCurrentQuestion] = useState(0)
  // useState Hook: answers stores all user responses in an object
  // Example: { budget: '200k-400k', lifestyle: ['schools', 'safety'] }
  const [answers, setAnswers] = useState({})

  // This array contains all the questions in the questionnaire
  // Each question object has: id (unique identifier), title, subtitle, type, and options
  const questions = [
    {
      id: 'experience', // Used as a key to store the answer in the answers object
      title: "What's your home buying experience?",
      subtitle: "This helps us tailor our recommendations",
      type: 'single', // 'single' means user can only select one option
      options: [ // Array of available choices for this question
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
      type: 'multiple', // 'multiple' means user can select several options
      maxSelections: 3, // Limits how many options can be selected
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
      title: "Any location preferences?",
      subtitle: "Regions, states, or areas you're interested in or want to avoid",
      type: 'text', // 'text' means user types their answer in a textarea
      placeholder: 'e.g., Prefer West Coast, avoid harsh winters, close to Austin...'
    }
  ]

  // Get the current question object based on the currentQuestion index
  const currentQ = questions[currentQuestion]
  // Check if we're on the last question (used to change button text)
  const isLastQuestion = currentQuestion === questions.length - 1

  // This function is called when user selects an option or types text
  // questionId: which question is being answered (e.g., 'budget', 'lifestyle')
  // value: the answer value (e.g., '200k-400k' or 'schools')
  const handleAnswerChange = (questionId, value) => {
    console.log('Answer changed:', questionId, value);
    // Find the question object to check its type
    const question = questions.find(q => q.id === questionId)
    
    // Handle multiple-choice questions (user can select multiple options)
    if (question.type === 'multiple') {
      // Get current answers for this question, or empty array if none exist
      const currentAnswers = answers[questionId] || []
      const maxSelections = question.maxSelections || Infinity // Default to unlimited if not specified
      
      // If option is already selected, remove it (toggle off)
      if (currentAnswers.includes(value)) {
        // setAnswers updates state using the previous state (prev)
        // The spread operator (...) copies all existing answers, then we update this question
        setAnswers(prev => ({
          ...prev, // Keep all other questions' answers unchanged
          [questionId]: currentAnswers.filter(v => v !== value) // Remove the selected value
        }))
      } 
      // If option is not selected and we haven't reached max, add it (toggle on)
      else if (currentAnswers.length < maxSelections) {
        setAnswers(prev => ({
          ...prev, // Keep all other questions' answers unchanged
          [questionId]: [...currentAnswers, value] // Add the new value to the array
        }))
      }
    } 
    // Handle single-choice and text questions
    else {
      setAnswers(prev => ({
        ...prev, // Keep all other questions' answers unchanged
        [questionId]: value // Replace the answer for this question with the new value
      }))
    }
  }

  // Called when user clicks "Continue" or "Find My Perfect Home" button
  const handleNext = () => {
    if (isLastQuestion) {
      // If on last question, call onComplete with all answers (triggers results page)
      onComplete(answers)
    } else {
      // Otherwise, move to the next question (increment currentQuestion by 1)
      setCurrentQuestion(prev => prev + 1)
    }
  }

  // Called when user clicks "Back" button
  const handleBack = () => {
    // Go to previous question, but don't go below 0 (stay on first question)
    setCurrentQuestion(prev => Math.max(0, prev - 1))
  }

  // Checks if the user has answered the current question (enables/disables Continue button)
  const canProceed = () => {
    const answer = answers[currentQ.id] // Get the answer for current question
    
    if (currentQ.type === 'multiple') {
      // For multiple choice: must have at least one selection
      return answer && answer.length > 0
    } else if (currentQ.type === 'text') {
      // For text: must have non-empty text (trim() removes whitespace)
      return answer && answer.trim().length > 0
    }
    // For single choice: answer just needs to exist (not undefined)
    return answer !== undefined
  }

  // If data is loading, show a loading spinner instead of the questionnaire
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
        {/* Progress Bar - Shows how far through the questionnaire user is */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {/* Display current question number (currentQuestion is 0-based, so add 1) */}
            <span className="text-sm text-gray-600">Question {currentQuestion + 1} of {questions.length}</span>
            {/* Calculate and display percentage complete */}
            <span className="text-sm text-gray-600">{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          {/* Gray background bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            {/* Animated filled portion that grows as user progresses */}
            <motion.div
              initial={{ width: 0 }} // Starts at 0 width
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} // Grows based on progress
              transition={{ duration: 0.5 }} // Smooth animation
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
            />
          </div>
        </div>

        {/* AnimatePresence handles smooth transitions between questions */}
        <AnimatePresence mode="wait">
          {/* The key prop changes when currentQuestion changes, triggering the animation */}
          <motion.div
            key={currentQuestion} // React re-renders this when key changes
            initial={{ x: 50, opacity: 0 }}  // Enter from the right, invisible
            animate={{ x: 0, opacity: 1 }}   // Move to center, visible
            exit={{ x: -50, opacity: 0 }}    // Exit to the left, invisible
            transition={{ duration: 0.3 }}   // Animation speed
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

            {/* Conditional rendering: show textarea for text questions, option buttons for others */}
            {currentQ.type === 'text' ? (
              // Text input area for location preferences
              <div className="max-w-2xl mx-auto">
                <textarea
                  value={answers[currentQ.id] || ''} // Controlled input: value comes from state
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)} // Update state when user types
                  placeholder={currentQ.placeholder} // Hint text inside the textarea
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none h-32 text-lg"
                />
              </div>
            ) : (
              // Grid of selectable option buttons for single/multiple choice questions
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {/* Loop through each option and create a button */}
                {currentQ.options.map((option, index) => {
                  // Check if this option is currently selected
                  // For multiple: check if value is in the answers array
                  // For single: check if value equals the answer
                  const isSelected = currentQ.type === 'multiple' 
                    ? answers[currentQ.id]?.includes(option.value) // ?. is optional chaining (safe if undefined)
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
            )}

            {/* Navigation buttons - Back and Continue */}
            <div className="flex justify-between items-center mt-12">
              {/* Back button - disabled on first question */}
              <button
                onClick={handleBack}
                disabled={currentQuestion === 0} // Can't go back from first question
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentQuestion === 0
                    ? 'text-gray-400 cursor-not-allowed' // Grayed out style when disabled
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100' // Normal style when enabled
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>

              {/* Continue button - changes text on last question, disabled if question not answered */}
              <motion.button
                whileHover={canProceed() ? { scale: 1.05 } : {}} // Only animate if button is enabled
                whileTap={canProceed() ? { scale: 0.95 } : {}}
                onClick={handleNext}
                disabled={!canProceed()} // Disabled if current question hasn't been answered
                className={`flex items-center gap-3 px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  canProceed()
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl' // Enabled style
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed' // Disabled style
                }`}
              >
                {/* Conditional text: different button text on last question */}
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
