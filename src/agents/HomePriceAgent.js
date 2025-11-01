// HomePriceAgent.js
// This agent is responsible for fetching home price data from the Zillow API.
// It takes user preferences (like location and budget) and translates them into API queries.

import { RAPIDAPI_KEY } from '../config' // Imports the API key from a configuration file

export class HomePriceAgent {
  // The main method to fetch home price data based on user preferences.
  // 'preferences' is an object containing user selections from the questionnaire.
  async fetch(preferences) {
    const { location, budget } = preferences // Destructures location and budget from preferences

    // Maps the user's budget selection (e.g., '200k-400k') to a numerical price range.
    const priceRange = this._mapBudgetToPriceRange(budget)
    // Creates URL search parameters, defaulting to 'Austin, TX' if no location is provided.
    const params = new URLSearchParams({ location: location || 'Austin, TX' })

    // Appends minimum and maximum price parameters if they exist in the mapped price range.
    if (priceRange.min) params.append('price_min', String(priceRange.min))
    if (priceRange.max) params.append('price_max', String(priceRange.max))

    // Constructs the full API URL with search parameters.
    const url = `https://zillow-com1.p.rapidapi.com/propertyExtendedSearch?${params.toString()}`
    // Defines the options for the fetch request, including the API key and host headers.
    const options = {
      method: 'GET', // Specifies the HTTP method
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY, // Your RapidAPI key for authentication
        'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com' // The API host
      }
    }

    try {
      // Sends the API request and waits for the response.
      const response = await fetch(url, options)
      // Parses the JSON response body.
      const data = await response.json()
      // Returns the transformed data, ready for use in the application.
      return { type: 'homePrice', data: this._transformResponse(data) }
    } catch (error) {
      // Catches any errors during the API call and logs them.
      console.error('HomePriceAgent error:', error)
      // Returns an empty array for data and the error message.
      return { type: 'homePrice', data: [], error: error.message }
    }
  }

  // Helper method to convert a budget string into a min/max price object.
  _mapBudgetToPriceRange(budget) {
    const ranges = {
      'under-200k': { max: 200000 },
      '200k-400k': { min: 200000, max: 400000 },
      '400k-600k': { min: 400000, max: 600000 },
      '600k-1m': { min: 600000, max: 1000000 },
      'over-1m': { min: 1000000 }
    }
    // Returns the corresponding price range or an empty object if not found.
    return ranges[budget] || {}
  }

  // Helper method to transform the raw API response into a more usable format for the app.
  _transformResponse(data) {
    // Ensures 'data.props' is an array, defaulting to an empty array if not.
    const propsArray = Array.isArray(data?.props) ? data.props : []
    // Maps each property object to a new, simplified structure.
    return propsArray.map(prop => ({
      id: prop?.zpid ?? `fallback-${Math.random()}`, // Unique ID for the property
      city: prop?.city || 'Unknown', // City name
      state: prop?.state || '', // State name
      medianPrice: Number(prop?.price) || 0, // Median price, converted to a number
      image: prop?.imgSrc || 'https://via.placeholder.com/800x500?text=No+Image', // Image URL
      neighborhood: prop?.address || [prop?.city, prop?.state].filter(Boolean).join(', '), // Neighborhood/address
      priceChange: prop?.priceChangeText, // Text indicating price change
      rawData: prop // Keeps the original raw data for debugging or future use
    }))
  }
}
