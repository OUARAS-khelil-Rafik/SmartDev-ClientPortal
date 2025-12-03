const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// System prompts for different AI assistants
const CONSULTANT_SYSTEM_PROMPT = 
    "You are an expert AI Project Consultant for SmartDev, a cutting-edge software development agency. " +
    "Your role is to help potential clients define their software project requirements.\n\n" +
    "Guidelines:\n" +
    "- Be professional, friendly, and helpful\n" +
    "- Ask clarifying questions to understand the project scope\n" +
    "- Provide realistic timelines and technology recommendations\n" +
    "- Help break down complex projects into manageable phases\n" +
    "- Suggest best practices and modern technologies\n" +
    "- Be concise but thorough in your responses\n" +
    "- If asked about pricing, explain that final quotes require a detailed consultation with the team\n\n" +
    "Respond in the same language the user writes in (English or French).";

const COPILOT_SYSTEM_PROMPT = 
    "You are a helpful AI assistant for SmartDev's client portal website. " +
    "You help users navigate the site and answer questions about our services.\n\n" +
    "Guidelines:\n" +
    "- Be concise and helpful\n" +
    "- Guide users to the right sections of the website\n" +
    "- Answer questions about web development, mobile apps, AI solutions, and cloud services\n" +
    "- Be friendly and professional\n" +
    "- Keep responses short (2-3 sentences max unless more detail is needed)\n\n" +
    "Respond in the same language the user writes in (English or French).";

// Project Consultation endpoint
app.post('/api/consultation', async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Format conversation history for Gemini
        const formattedHistory = (history || []).map(msg => ({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.parts?.[0]?.text || msg.text || '' }]
        }));

        // Start chat with history
        const chat = ai.chats.create({
            model: 'gemini-2.0-flash',
            history: [
                { role: 'user', parts: [{ text: 'System: ' + CONSULTANT_SYSTEM_PROMPT }] },
                { role: 'model', parts: [{ text: 'Understood. I am ready to help as a SmartDev Project Consultant.' }] },
                ...formattedHistory
            ]
        });

        const response = await chat.sendMessage({ message });
        const responseText = response.text || 'I apologize, I could not generate a response.';

        res.json({ response: responseText });
    } catch (error) {
        console.error('Consultation API Error:', error);
        res.status(500).json({ 
            error: 'Error with AI service',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Copilot endpoint
app.post('/api/copilot', async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Format conversation history for Gemini
        const formattedHistory = (history || []).map(msg => ({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.parts?.[0]?.text || msg.text || '' }]
        }));

        // Start chat with history
        const chat = ai.chats.create({
            model: 'gemini-2.0-flash',
            history: [
                { role: 'user', parts: [{ text: 'System: ' + COPILOT_SYSTEM_PROMPT }] },
                { role: 'model', parts: [{ text: 'Hello! I\'m here to help you navigate SmartDev. What can I assist you with?' }] },
                ...formattedHistory
            ]
        });

        const response = await chat.sendMessage({ message });
        const responseText = response.text || 'I apologize, I could not generate a response.';

        res.json({ response: responseText });
    } catch (error) {
        console.error('Copilot API Error:', error);
        res.status(500).json({ 
            error: 'Error with AI service',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
    console.log(`🚀 SmartDev AI Server running on http://localhost:${port}`);
    console.log(`📡 Endpoints available:`);
    console.log(`   POST /api/consultation - Project consultation AI`);
    console.log(`   POST /api/copilot - Website copilot AI`);
    console.log(`   GET  /api/health - Health check`);
});
