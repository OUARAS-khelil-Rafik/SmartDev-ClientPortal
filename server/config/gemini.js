const { GoogleGenAI } = require('@google/genai');

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const aiClient = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  auth: false 
});

module.exports = aiClient;
