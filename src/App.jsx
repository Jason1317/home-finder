import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, MapPin, Heart, DollarSign, Star, ChevronRight, Search, Filter, Map, Users, Building, Car, Coffee, GraduationCap, Shield, Moon } from 'lucide-react'
import { RAPIDAPI_KEY } from './config'


// Components
import Welcome from './components/Welcome'
import QuestionnaireFlow from './components/QuestionnaireFlow'
import Results from './components/Results'

function App() {
  const [currentStep, setCurrentStep] = useState('welcome')
  const [userPreferences, setUserPreferences] = useState({})
  const [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleStartJourney = () => {
    setCurrentStep('questionnaire')
  }

  const handleQuestionnaireComplete = async (preferences) => {
    setUserPreferences(preferences)
    setIsLoading(true)

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
      }
    };

    try {
      // For now, let's use a hardcoded search for demonstration
      const response = await fetch('https://zillow-com1.p.rapidapi.com/propertyExtendedSearch?location=austin%2C%20tx', options);
      const data = await response.json();
      console.log('API Response:', data);

      // --- Data Transformation ---
      // The API response needs to be mapped to the structure `Results.jsx` expects.
      // This is a placeholder and will need to be adjusted based on the actual API response.
      const formattedRecommendations = data.props.map(prop => ({
        id: prop.zpid,
        city: prop.city,
        state: prop.state,
        matchScore: Math.floor(Math.random() * (95 - 85 + 1)) + 85, // Fake score
        medianPrice: prop.price,
        image: prop.imgSrc,
        neighborhood: prop.address,
        pros: ["Live Data!", "Great Location", "Good Value"],
        cons: ["Needs more data", "High demand"],
        highlights: [
            { icon: <GraduationCap />, label: "Schools", value: "N/A", good: true },
            { icon: <Shield />, label: "Safety", value: "N/A", good: true },
        ]
      }));
      
      setRecommendations(formattedRecommendations);
    } catch (error) {
      console.error(error);
      // In case of an error, we can fall back to mock data or show an error message.
      setRecommendations([]); // Clear recommendations on error
    } finally {
      setIsLoading(false)
      setCurrentStep('results')
    }
  }

  const handleRestart = () => {
    setCurrentStep('welcome')
    setUserPreferences({})
  }

  return (
      <AnimatePresence mode="wait">
        {currentStep === 'welcome' && (
          <Welcome key="welcome" onStart={handleStartJourney} />
        )}
        
        {currentStep === 'questionnaire' && (
          <QuestionnaireFlow 
            key="questionnaire" 
            onComplete={handleQuestionnaireComplete}
            isLoading={isLoading}
          />
        )}
        
        {currentStep === 'results' && (
          <Results 
            key="results" 
            preferences={userPreferences}
            recommendations={recommendations}
            onRestart={handleRestart}
          />
        )}
    </AnimatePresence>
  )
}

export default App;