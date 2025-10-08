// CrimeAgent.js
// Modular agent for fetching crime/safety data
import { GoogleGenAI } from '@google/genai';
const API_KEY = process.env.API_KEY;

export class CrimeAgent {
  async fetch(city) {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const prompt = `Research the crime and safety statistics for ${city}.`;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are a crime and safety analyst. Your job is to find the latest crime statistics and safety information for a given location. Provide a brief, easy-to-read summary.',
        },
      });
      return { type: "crime", data: response.text };
    } catch (e) {
      return { type: "crime", data: null, error: e.message };
    }
  }
}
