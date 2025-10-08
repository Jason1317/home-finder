# Copilot Instructions for Home Finder Prototype

## Project Overview
This is a Vite-based React application for discovering homes using AI-powered recommendations and real-time market data. The app guides users through a multi-step questionnaire and displays personalized results. Key files are in `src/`, with major components in `src/components/` and assets in `src/assets/`.

## Architecture & Data Flow
- **Main entry:** App.jsx orchestrates the app's flow using `currentStep` state to switch between `Welcome`, `QuestionnaireFlow`, and `Results` components.
- **User journey:** Starts at Welcome.jsx (background set via inline style using `house.gif` from `src/assets/`), proceeds to `QuestionnaireFlow.jsx` for user input, then triggers an API call (Zillow RapidAPI) in App.jsx to fetch property data, and finally displays results in `Results.jsx`.
- **API Integration:** Uses RapidAPI (Zillow) with key from config.js. Data is mapped to a custom structure for display; see transformation logic in App.jsx.

## Developer Workflows
- **Start/Build:** Use Vite commands (`npm run dev`, `npm run build`).
- **No test suite detected.**
- **Debugging:** Use browser dev tools; API errors are logged to console in App.jsx.

## Project-Specific Patterns
- **Component communication:** Props are used for passing callbacks and data between parent (App.jsx) and children (Welcome.jsx, `QuestionnaireFlow.jsx`, `Results.jsx`).
- **Background images:** Use ES6 import for assets and inline style for backgrounds (see Welcome.jsx).
- **State management:** React `useState` for all local state; no global state or context API.
- **Animations:** Framer Motion is used for transitions and effects in UI components.
- **Icons:** Lucide React icons are imported and used directly in JSX.

## External Dependencies
- **Framer Motion** for UI animation.
- **Lucide React** for icons.
- **RapidAPI (Zillow)** for property data (API key in config.js).

## Conventions
- **File structure:** Components in `src/components/`, assets in `src/assets/`. Main logic in App.jsx.
- **Styling:** Uses Tailwind CSS utility classes in JSX. Inline styles for dynamic backgrounds.
- **Error handling:** API errors are caught and logged; fallback is to clear recommendations.

## Examples
- To set a background image in a component:
  ```jsx
  import houseGif from '../assets/house.gif';
  <div style={{ backgroundImage: `url(${houseGif})`, backgroundSize: 'cover', ... }}>
    ...
  </div>
  ```
- To fetch and transform API data: See `handleQuestionnaireComplete` in App.jsx.

## Key Files
- App.jsx – main app logic and data flow
- Welcome.jsx – landing page with animated background
- `src/components/QuestionnaireFlow.jsx` – user input form
- `src/components/Results.jsx` – displays recommendations
- `src/assets/` – images and media
- `src/config.js` – API key

---

## Connect Other AI Agents
To connect other agents to your local app:

Create a new agent file in src/agents/
Example:
```javascript
// src/agents/NightlifeAgent.js
export class NightlifeAgent {
  async fetch(city) {
    // Fetch nightlife data for city
    return { type: "nightlife", data: null };
  }
}
export async function gatherCityData(city) {
  const agent = new NightlifeAgent();
  return await agent.fetch(city);
}
```

Import and add the agent to the registry in src/agents/index.js
```javascript
import { NightlifeAgent } from "./NightlifeAgent";
// ...existing imports

export const agents = [
  new HomePriceAgent(),
  new CrimeAgent(),
  new NightlifeAgent(), // Add your new agent here
  // ...other agents
];
```

Use gatherCityData(city) in your app code
```javascript
import { gatherCityData } from "./agents";

const results = await gatherCityData("San Francisco");
// results will include data from all agents
```

Just repeat steps 1–2 for each new agent. The app will automatically gather data from all registered agents.

**If any section is unclear or missing, please provide feedback for further refinement.**
