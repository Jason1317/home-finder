import React, { useState } from 'react' // Imports React and the useState hook for managing component state
import { AnimatePresence } from 'framer-motion' // Imports AnimatePresence for animating components as they enter/exit the DOM
import { GraduationCap, Shield } from 'lucide-react' // Imports icons for use in the UI

import Welcome from './components/Welcome' // Imports the Welcome screen component
import QuestionnaireFlow from './components/QuestionnaireFlow' // Imports the questionnaire component
import Results from './components/Results' // Imports the results display component
import { HomePriceAgent } from './agents/HomePriceAgent' // Imports the HomePriceAgent for fetching property data

// The main application component
function App() {
  // State to manage the current step of the user journey ('welcome', 'questionnaire', 'results')
  const [currentStep, setCurrentStep] = useState('welcome')
  // State to store user preferences collected from the questionnaire
  const [userPreferences, setUserPreferences] = useState({})
  // State to store the property recommendations fetched from the API
  const [recommendations, setRecommendations] = useState([])
  // State to manage the loading status during data fetching
  const [isLoading, setIsLoading] = useState(false)

  // Handler function to start the home-finding journey, transitioning to the questionnaire
  const handleStartJourney = () => {
    setCurrentStep('questionnaire')
  }

  // Handler function called when the questionnaire is completed.
  // It fetches property data based on user preferences.
  const handleQuestionnaireComplete = async (preferences) => {
    setUserPreferences(preferences) // Saves the completed preferences to state
    setIsLoading(true) // Sets loading to true to show a loading indicator

    try {
      const agent = new HomePriceAgent() // Creates a new instance of the HomePriceAgent
      // Calls the agent's fetch method with user preferences to get property data
      const result = await agent.fetch(preferences)
      
      // Checks if there was an error during data fetching
      if (result.error) {
        console.error('Agent error:', result.error) // Logs the error
        setRecommendations([]) // Clears recommendations on error
      } else {
        // Formats the fetched data with additional properties for display in the UI
        const formatted = result.data.map(prop => ({
          ...prop,
          matchScore: Math.floor(Math.random() * 11) + 85, // Assigns a random match score
          pros: ['Live Data!', 'Great Location', 'Good Value'], // Example pros
          cons: ['Needs more data', 'High demand'], // Example cons
          highlights: [
            { icon: <GraduationCap />, label: 'Schools', value: 'N/A', good: true },
            { icon: <Shield />, label: 'Safety', value: 'N/A', good: true }
          ],
          stats: { schoolRating: 'N/A', crimeRate: 'N/A', walkScore: 'N/A', commuteTime: 'N/A' }
        }))
        setRecommendations(formatted) // Updates state with the formatted recommendations
      }
    } catch (error) {
      console.error('handleQuestionnaireComplete error:', error) // Catches and logs any unexpected errors
      setRecommendations([]) // Clears recommendations on error
    } finally {
      setIsLoading(false) // Sets loading to false after data fetching is complete (or errors)
      setCurrentStep('results') // Transitions to the results page
    }
  }

  // Handler function to restart the entire process, resetting all state
  const handleRestart = () => {
    setCurrentStep('welcome') // Goes back to the welcome screen
    setUserPreferences({}) // Clears user preferences
    setRecommendations([]) // Clears recommendations
  }

  return (
    // AnimatePresence manages the animation of components as they are added or removed from the React tree
    <AnimatePresence mode='wait'>
      {/* Conditionally renders the Welcome component if currentStep is 'welcome' */}
      {currentStep === 'welcome' && (
        <Welcome key='welcome' onStart={handleStartJourney} />
      )}
      
      {/* Conditionally renders the QuestionnaireFlow component */}
      {currentStep === 'questionnaire' && (
        <QuestionnaireFlow 
          key='questionnaire' 
          onComplete={handleQuestionnaireComplete} // Passes the completion handler
          isLoading={isLoading} // Passes the loading state
        />
      )}
      
      {/* Conditionally renders the Results component */}
      {currentStep === 'results' && (
        <Results 
          key='results' 
          preferences={userPreferences} // Passes user preferences
          recommendations={recommendations} // Passes fetched recommendations
          onRestart={handleRestart} // Passes the restart handler
        />
      )}
    </AnimatePresence>
  )
}

export default App // Exports the App component for use in main.jsx
