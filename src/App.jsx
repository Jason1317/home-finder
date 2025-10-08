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
      // Build query from preferences
      const locationRaw = (preferences.location || 'Austin, TX').trim()
      const location = encodeURIComponent(locationRaw)

      // Map budget to price range
      let priceMin
      let priceMax
      switch (preferences.budget) {
        case 'under-200k':
          priceMax = 200000; break;
        case '200k-400k':
          priceMin = 200000; priceMax = 400000; break;
        case '400k-600k':
          priceMin = 400000; priceMax = 600000; break;
        case '600k-1m':
          priceMin = 600000; priceMax = 1000000; break;
        case 'over-1m':
          priceMin = 1000000; break;
        default:
          // leave undefined to let API decide
          break;
      }

      const params = new URLSearchParams({ location })
      if (priceMin !== undefined) params.append('price_min', String(priceMin))
      if (priceMax !== undefined) params.append('price_max', String(priceMax))

      const url = `https://zillow-com1.p.rapidapi.com/propertyExtendedSearch?${params.toString()}`
      const response = await fetch(url, options);
      const data = await response.json();
      console.log('API Response:', data);

      // --- Data Transformation ---
      // The API response needs to be mapped to the structure `Results.jsx` expects.
      // This is a placeholder and will need to be adjusted based on the actual API response.
      const propsArray = Array.isArray(data?.props) ? data.props : []
      const formattedRecommendations = propsArray.map(prop => ({
        id: prop?.zpid ?? `${prop?.lat || 'x'}-${prop?.lotAreaValue || Math.random()}`,
        city: prop?.city || 'Unknown',
        state: prop?.state || '',
        matchScore: Math.floor(Math.random() * (95 - 85 + 1)) + 85,
        medianPrice: Number(prop?.price) || 0,
        image: prop?.imgSrc || 'https://via.placeholder.com/800x500?text=No+Image',
        neighborhood: prop?.address || [prop?.city, prop?.state].filter(Boolean).join(', '),
        pros: ["Live Data!", "Great Location", "Good Value"],
        cons: ["Needs more data", "High demand"],
        highlights: [
          { icon: <GraduationCap />, label: "Schools", value: "N/A", good: true },
          { icon: <Shield />, label: "Safety", value: "N/A", good: true },
        ],
        // Optional fields used by UI with guards
        priceChange: prop?.priceChangeText || undefined,
        stats: { schoolRating: 'N/A', crimeRate: 'N/A', walkScore: 'N/A', commuteTime: 'N/A' }
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