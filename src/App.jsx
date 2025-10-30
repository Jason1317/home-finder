import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { GraduationCap, Shield } from 'lucide-react'

import Welcome from './components/Welcome'
import QuestionnaireFlow from './components/QuestionnaireFlow'
import Results from './components/Results'
import { HomePriceAgent } from './agents/HomePriceAgent'

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

 try {
 const agent = new HomePriceAgent()
 const result = await agent.fetch(preferences)
 
 if (result.error) {
 console.error('Agent error:', result.error)
 setRecommendations([])
 } else {
 const formatted = result.data.map(prop => ({
 ...prop,
 matchScore: Math.floor(Math.random() * 11) + 85,
 pros: ['Live Data!', 'Great Location', 'Good Value'],
 cons: ['Needs more data', 'High demand'],
 highlights: [
 { icon: <GraduationCap />, label: 'Schools', value: 'N/A', good: true },
 { icon: <Shield />, label: 'Safety', value: 'N/A', good: true }
 ],
 stats: { schoolRating: 'N/A', crimeRate: 'N/A', walkScore: 'N/A', commuteTime: 'N/A' }
 }))
 setRecommendations(formatted)
 }
 } catch (error) {
 console.error('handleQuestionnaireComplete error:', error)
 setRecommendations([])
 } finally {
 setIsLoading(false)
 setCurrentStep('results')
 }
 }

 const handleRestart = () => {
 setCurrentStep('welcome')
 setUserPreferences({})
 setRecommendations([])
 }

 return (
 <AnimatePresence mode='wait'>
 {currentStep === 'welcome' && (
 <Welcome key='welcome' onStart={handleStartJourney} />
 )}
 
 {currentStep === 'questionnaire' && (
 <QuestionnaireFlow 
 key='questionnaire' 
 onComplete={handleQuestionnaireComplete}
 isLoading={isLoading}
 />
 )}
 
 {currentStep === 'results' && (
 <Results 
 key='results' 
 preferences={userPreferences}
 recommendations={recommendations}
 onRestart={handleRestart}
 />
 )}
 </AnimatePresence>
 )
}

export default App
