// HomePriceAgent.js
import { RAPIDAPI_KEY } from '../config'

export class HomePriceAgent {
 async fetch(preferences) {
 const { location, budget } = preferences

 const priceRange = this._mapBudgetToPriceRange(budget)
 const params = new URLSearchParams({ location: location || 'Austin, TX' })

 if (priceRange.min) params.append('price_min', String(priceRange.min))
 if (priceRange.max) params.append('price_max', String(priceRange.max))

 const url = `https://zillow-com1.p.rapidapi.com/propertyExtendedSearch?${params.toString()}`
 const options = {
 method: 'GET',
 headers: {
 'X-RapidAPI-Key': RAPIDAPI_KEY,
 'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
 }
 }

 try {
 const response = await fetch(url, options)
 const data = await response.json()
 return { type: 'homePrice', data: this._transformResponse(data) }
 } catch (error) {
 console.error('HomePriceAgent error:', error)
 return { type: 'homePrice', data: [], error: error.message }
 }
 }

 _mapBudgetToPriceRange(budget) {
 const ranges = {
 'under-200k': { max: 200000 },
 '200k-400k': { min: 200000, max: 400000 },
 '400k-600k': { min: 400000, max: 600000 },
 '600k-1m': { min: 600000, max: 1000000 },
 'over-1m': { min: 1000000 }
 }
 return ranges[budget] || {}
 }

 _transformResponse(data) {
 const propsArray = Array.isArray(data?.props) ? data.props : []
 return propsArray.map(prop => ({
 id: prop?.zpid ?? `fallback-${Math.random()}`,
 city: prop?.city || 'Unknown',
 state: prop?.state || '',
 medianPrice: Number(prop?.price) || 0,
 image: prop?.imgSrc || 'https://via.placeholder.com/800x500?text=No+Image',
 neighborhood: prop?.address || [prop?.city, prop?.state].filter(Boolean).join(', '),
 priceChange: prop?.priceChangeText,
 rawData: prop
 }))
 }
}
