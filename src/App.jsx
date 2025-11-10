import React, { useState, useEffect, useRef } from "react"; // Imports React and hooks for managing component state and lifecycle
import { AnimatePresence } from "framer-motion"; // Imports AnimatePresence for animating components as they enter/exit the DOM
import { GraduationCap, Shield } from "lucide-react"; // Imports icons for use in the UI

import Welcome from "./components/Welcome"; // Imports the Welcome screen component
import QuestionnaireFlow from "./components/QuestionnaireFlow"; // Imports the questionnaire component
import Results from "./components/Results"; // Imports the results display component
import { HomePriceAgent } from "./agents/HomePriceAgent"; // Imports the HomePriceAgent for fetching property data

// Generate a unique session ID for telemetry tracking
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Telemetry logger utility - only logs in development mode
const logTelemetry = (sessionId, eventType, data = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    sessionId,
    timestamp,
    eventType,
    ...data
  };
  
  // Only log to console in development mode
  // In production, this could be sent to a backend analytics service
  if (import.meta.env.DEV) {
    console.log(`[TELEMETRY] [${eventType}]`, logEntry);
  }
  
  // TODO: In production, send to backend logging endpoint
  // Example: await fetch('/api/telemetry', { method: 'POST', body: JSON.stringify(logEntry) })
  
  return logEntry;
};

// The main application component
function App() {
  // Generate session ID once when component mounts
  const sessionId = useRef(generateSessionId());
  
  // State to manage the current step of the user journey ('welcome', 'questionnaire', 'results')
  const [currentStep, setCurrentStep] = useState("welcome");
  // State to store user preferences collected from the questionnaire
  const [userPreferences, setUserPreferences] = useState({});
  // State to store the property recommendations fetched from the API
  const [recommendations, setRecommendations] = useState([]);
  // State to manage the loading status during data fetching
  const [isLoading, setIsLoading] = useState(false);

  // Log app initialization
  useEffect(() => {
    logTelemetry(sessionId.current, 'APP_INITIALIZED', {
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language
    });
  }, []);

  // Handler function to start the home-finding journey, transitioning to the questionnaire
  const handleStartJourney = () => {
    logTelemetry(sessionId.current, 'JOURNEY_STARTED', {
      previousStep: currentStep
    });
    setCurrentStep("questionnaire");
  };

  // Handler function called when the questionnaire is completed.
  // It fetches property data based on user preferences.
  const handleQuestionnaireComplete = async (preferences) => {
    // Log questionnaire completion with full user preferences
    logTelemetry(sessionId.current, 'QUESTIONNAIRE_COMPLETED', {
      preferences: preferences,
      questionnaireCompletionTime: new Date().toISOString()
    });

    setUserPreferences(preferences); // Saves the completed preferences to state
    setIsLoading(true); // Sets loading to true to show a loading indicator

    try {
      const homePriceAgent = new HomePriceAgent(); // Creates a new instance of the HomePriceAgent
      
      // Log API request start
      const requestStartTime = Date.now();
      logTelemetry(sessionId.current, 'API_REQUEST_STARTED', {
        location: preferences.location,
        budget: preferences.budget
      });
      
      // Calls the agent's fetch method with user preferences to get property data
      const result = await homePriceAgent.fetch(preferences);
      
      // Log API request completion with full response
      const requestDuration = Date.now() - requestStartTime;
      logTelemetry(sessionId.current, 'API_RESPONSE_RECEIVED', {
        duration: requestDuration,
        resultType: result.type,
        hasError: !!result.error,
        propertiesCount: result.data?.length || 0,
        fullResponse: result
      });

      // Checks if there was an error during data fetching
      if (result.error) {
        console.error("Error in respones from HomePriceAgent:", result.error); // Logs the error
        logTelemetry(sessionId.current, 'API_ERROR', {
          error: result.error,
          preferences: preferences
        });
        setRecommendations([]); // Clears recommendations on error
      } else {
        // Formats the fetched data with additional properties for display in the UI
        const formatted = result.data.map((prop) => {
          // Calculate match score based on budget alignment
          const budgetRanges = {
            "under-200k": { min: 0, max: 200000 },
            "200k-400k": { min: 200000, max: 400000 },
            "400k-600k": { min: 400000, max: 600000 },
            "600k-1m": { min: 600000, max: 1000000 },
            "over-1m": { min: 1000000, max: 10000000 },
          };

          const range = budgetRanges[preferences.budget] || {
            min: 0,
            max: 10000000,
          };
          const price = prop.medianPrice;
          let matchScore = 85;

          // Score based on how well price fits budget
          if (price >= range.min && price <= range.max) {
            const midpoint = (range.min + range.max) / 2;
            const deviation =
              Math.abs(price - midpoint) / (range.max - range.min);
            matchScore = Math.round(95 - deviation * 10);
          } else if (price < range.min) {
            matchScore = 88;
          } else {
            matchScore = 86;
          }

          return {
            ...prop,
            matchScore: matchScore,
            pros: ["Live Data!", "Great Location", "Good Value"],
            cons: ["Needs more data", "High demand"],
            highlights: [
              {
                icon: <GraduationCap />,
                label: "Schools",
                value: "N/A",
                good: true,
              },
              { icon: <Shield />, label: "Safety", value: "N/A", good: true },
            ],
            stats: {
              schoolRating: "N/A",
              crimeRate: "N/A",
              walkScore: "N/A",
              commuteTime: "N/A",
            },
          };
        });
        
        // Log formatted results
        logTelemetry(sessionId.current, 'RESULTS_FORMATTED', {
          formattedCount: formatted.length,
          matchScores: formatted.map(p => ({ id: p.id, score: p.matchScore, price: p.medianPrice }))
        });
        
        setRecommendations(formatted); // Updates state with the formatted recommendations
      }
    } catch (error) {
      console.error("handleQuestionnaireComplete error:", error); // Catches and logs any unexpected errors
      logTelemetry(sessionId.current, 'UNEXPECTED_ERROR', {
        error: error.message,
        stack: error.stack
      });
      setRecommendations([]); // Clears recommendations on error
    } finally {
      setIsLoading(false); // Sets loading to false after data fetching is complete (or errors)
      setCurrentStep("results"); // Transitions to the results page
      
      logTelemetry(sessionId.current, 'RESULTS_PAGE_SHOWN', {
        recommendationsCount: recommendations.length
      });
    }
  };

  // Handler function to restart the entire process, resetting all state
  const handleRestart = () => {
    logTelemetry(sessionId.current, 'USER_RESTARTED', {
      fromStep: currentStep
    });
    setCurrentStep("welcome"); // Goes back to the welcome screen
    setUserPreferences({}); // Clears user preferences
    setRecommendations([]); // Clears recommendations
  };

  return (
    // AnimatePresence manages the animation of components as they are added or removed from the React tree
    <AnimatePresence mode="wait">
      {/* Conditionally renders the Welcome component if currentStep is 'welcome' */}
      {currentStep === "welcome" && (
        <Welcome key="welcome" onStart={handleStartJourney} sessionId={sessionId.current} />
      )}

      {/* Conditionally renders the QuestionnaireFlow component */}
      {currentStep === "questionnaire" && (
        <QuestionnaireFlow
          key="questionnaire"
          onComplete={handleQuestionnaireComplete} // Passes the completion handler
          isLoading={isLoading} // Passes the loading state
        />
      )}

      {/* Conditionally renders the Results component */}
      {currentStep === "results" && (
        <Results
          key="results"
          preferences={userPreferences} // Passes user preferences
          recommendations={recommendations} // Passes fetched recommendations
          onRestart={handleRestart} // Passes the restart handler
        />
      )}
    </AnimatePresence>
  );
}

export default App; // Exports the App component for use in main.jsx
