# Home Finder App

## Overview

Home Finder is an AI-powered real estate discovery application that helps first-time and prospective home buyers find their ideal neighborhood. The application guides users through an interactive questionnaire to understand their preferences, then leverages AI and real estate APIs to provide personalized city and property recommendations with detailed insights.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**November 10, 2025 - UI Enhancements & Complete State Coverage**
- **Issue Fixed**: Location dropdown was only showing 20 states instead of all 50
- **Solution**: Expanded `locationData` object in QuestionnaireFlow.jsx to include all 50 US states with 8 major cities each
- **Impact**: Users can now search for homes across the entire United States (Alabama to Wyoming)
- **Security Enhancement**: Migrated API keys from hardcoded config.js to Replit Secrets (VITE_GEMINI_API_KEY, VITE_RAPIDAPI_KEY)
- **Background Design**: Added animated PlayStation-style backgrounds with floating orbs and wave animations
  - Welcome Page: Cyan/Blue/Teal theme with animated waves and orbs
  - Questionnaire Page: Same Cyan/Blue/Teal theme for consistent flow
  - Results Page: Green/Emerald/Teal theme to signify success/completion
  - All backgrounds feature smooth, non-distracting constant movement with 3 floating orbs and 2 wave layers

## System Architecture

### Frontend Architecture

**Framework Choice: React 18 with Vite**
- **Problem**: Need for fast development, hot module replacement, and modern build tooling
- **Solution**: Vite + React provides instant server start, lightning-fast HMR, and optimized production builds
- **Rationale**: Vite offers superior developer experience compared to Create React App, with significantly faster build times and better performance

**State Management: Component-Level useState**
- **Problem**: Managing application flow between welcome screen, questionnaire, and results
- **Solution**: Local state management using React's useState hook in App.jsx
- **Rationale**: The application has relatively simple state requirements without need for global state management. Props drilling is minimal and manageable
- **Alternative Considered**: Context API or Redux would add unnecessary complexity for this use case

**UI Component Library: Custom Components**
- **Problem**: Need for consistent, branded UI with smooth animations
- **Solution**: Custom-built components using Tailwind CSS utilities and Framer Motion
- **Rationale**: Provides full design control and avoids bloat from pre-built UI libraries
- **Pros**: Complete customization, smaller bundle size
- **Cons**: More development time compared to using component libraries like Material-UI

**Animation System: Framer Motion**
- **Problem**: Creating smooth, professional transitions and interactions
- **Solution**: Framer Motion for declarative animations
- **Rationale**: Industry-standard animation library with excellent React integration and performance

**Icon System: Lucide React**
- **Problem**: Need for consistent, lightweight iconography
- **Solution**: Lucide React icon library
- **Rationale**: Modern, well-maintained fork of Feather Icons with tree-shaking support

### Application Flow Architecture

**Multi-Step Wizard Pattern**
- **Component Structure**: App.jsx orchestrates flow using `currentStep` state
- **Flow Stages**:
  1. Welcome.jsx - Landing page with animated background
  2. QuestionnaireFlow.jsx - User input collection with cascading state/city dropdowns
  3. Results.jsx - Display of top 3 property recommendations
- **Rationale**: Separates concerns and allows users to focus on one task at a time, improving completion rates

**Results Page Architecture (Nov 2025 Redesign)**
- **Layout**: 3-column responsive grid (1 col mobile, 2 cols large, 3 cols extra-large)
- **Data Preparation**: `preparedResults` useMemo hook deduplicates by uniqueId (zpid || id || fallback) and limits to exactly 3 results
- **Modular Component Structure**:
  - `PropertyCard`: Main assembly component with staggered reveal animation
  - `PropertyHero`: Hero image with calculated match score, price change badges, and address overlay
  - `PropertyEssentials`: Price display + beds/baths/sqft grid extracted from rawData
  - `PropertyInsights`: Expandable section for pros/cons and future agent modules with working Zillow links
- **Match Score Calculation**: Intelligent scoring based on budget alignment (85-95% range)
  - Properties within budget score 90-95% based on proximity to budget midpoint
  - Properties below budget score 88% (good value)
  - Properties above budget score 86% (stretch option)
- **Extensibility**: PropertyInsights designed as plug-in architecture for future agents (schools, crime, walkability)
- **Type Safety**: formatPrice() and formatSqft() helpers prevent runtime errors with non-numeric data
- **UI Enhancements**: Gradient backgrounds, sticky search summary bar, fallback UI for <3 results, smooth one-by-one card reveal animation
- **External Links**: Each property links to full Zillow listing via zpid in new tab

**Component Communication Pattern**
- **Approach**: Props-based callbacks for parent-child communication
- **Data Flow**: Unidirectional - data flows down via props, events flow up via callbacks
- **Rationale**: Maintains React best practices and keeps data flow predictable

### Styling Architecture

**Tailwind CSS Utility-First Approach**
- **Problem**: Need for rapid UI development with consistent design system
- **Solution**: Tailwind CSS with custom configuration
- **Custom Theme**: Extended color palette with primary color variations (50-900 scale)
- **Rationale**: Utility-first CSS eliminates context switching and ensures design consistency
- **Pros**: Faster development, smaller CSS bundle, built-in responsive design
- **Cons**: Verbose className attributes, learning curve for team members

**Asset Management**
- **Background Images**: ES6 imports with inline styles for dynamic backgrounds
- **Static Assets**: Stored in `src/assets/` directory
- **Rationale**: Vite's asset handling provides automatic optimization and cache busting

### Data Architecture

**Agent-Based Data Fetching Pattern**
- **Problem**: Need to integrate multiple data sources (real estate APIs, AI insights)
- **Solution**: Modular agent architecture with specialized agents for different data types
- **Agents**:
  - `HomePriceAgent`: Fetches property listings from Zillow API
  - `CrimeAgent`: Gathers safety/crime statistics using AI
- **Pattern**: Each agent implements `fetch()` method returning standardized response format
- **Rationale**: Separation of concerns, easy to add new data sources, testable in isolation
- **Future Extensibility**: Additional agents can be added to `agents/index.js` registry

**Data Transformation Layer**
- **Location**: Response transformation in HomePriceAgent (`_transformResponse` method)
- **Purpose**: Normalizes external API data into application-specific structure
- **Rationale**: Decouples external API contracts from internal data models

### Configuration Management

**Environment Configuration**
- **Location**: `src/config.js` exports API keys and configuration
- **Problem**: Managing API credentials and environment-specific settings
- **Current Approach**: Hardcoded credentials in source code
- **Security Note**: API keys are currently exposed in repository (not production-ready)
- **Recommended Enhancement**: Migrate to environment variables using Vite's `import.meta.env`

## External Dependencies

### Third-Party APIs

**RapidAPI (Zillow Integration)**
- **Purpose**: Real estate property data and market information
- **Endpoint**: `zillow-com1.p.rapidapi.com/propertyExtendedSearch`
- **Authentication**: API key via `X-RapidAPI-Key` header
- **Configuration**: API key stored in `src/config.js` as `RAPIDAPI_KEY`
- **Data Returned**: Property listings with pricing, location, and details
- **Error Handling**: Try-catch blocks with fallback to empty array

**Google Gemini AI**
- **Purpose**: AI-powered insights for crime/safety analysis
- **Model**: gemini-2.5-flash
- **Authentication**: API key stored in `src/config.js` as `GEMINI_API_KEY`
- **Usage Pattern**: Structured prompts with system instructions for specialized responses
- **Integration Status**: Partial implementation in CrimeAgent.js

### NPM Dependencies

**Production Dependencies**
- `react` (^18.3.1): Core UI library
- `react-dom` (^18.3.1): React rendering for web
- `framer-motion` (^11.15.0): Animation library for smooth transitions
- `lucide-react` (^0.468.0): Icon component library

**Development Dependencies**
- `vite` (^6.0.1): Build tool and dev server
- `@vitejs/plugin-react` (^4.3.4): React plugin for Vite with Fast Refresh
- `tailwindcss` (^3.4.17): Utility-first CSS framework
- `postcss` (^8.4.49): CSS transformation tool (required for Tailwind)
- `autoprefixer` (^10.4.20): PostCSS plugin for vendor prefixes

### Build and Development Tools

**Vite Configuration**
- Server configured for host `0.0.0.0` and port 5000
- Allows external host access for development environments
- Hot Module Replacement (HMR) enabled for React components

**Tailwind Configuration**
- Content scanning: `index.html` and all `.js`, `.ts`, `.jsx`, `.tsx` files in `src/`
- Custom color theme with primary palette (50-900 shades)
- PostCSS integration for processing

### Asset Dependencies
- Static assets stored in `src/assets/` directory
- `house.gif`: Animated background for welcome screen
- Images imported via ES6 modules for Vite optimization