const { GoogleGenAI } = require('@google/genai');

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

function getAiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
  }
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

function ensureJsonBody(req) {
  if (req.body && typeof req.body !== 'string') return req.body;
  if (!req.body) return {};
  try {
    return JSON.parse(req.body);
  } catch (e) {
    return {};
  }
}

function formatHistory(rawHistory) {
  return (rawHistory || []).map((msg) => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.parts?.[0]?.text || msg.text || '' }],
  }));
}

async function runChat({ prompt, message, history }) {
  const ai = getAiClient();
  const chat = ai.chats.create({
    model: 'gemini-2.0-flash',
    history: [
      { role: 'user', parts: [{ text: 'System: ' + prompt }] },
      { role: 'model', parts: [{ text: 'Understood. Ready to assist.' }] },
      ...formatHistory(history),
    ],
  });

  const response = await chat.sendMessage({ message });
  return response.text || 'I apologize, I could not generate a response.';
}

module.exports = {
  CONSULTANT_SYSTEM_PROMPT,
  COPILOT_SYSTEM_PROMPT,
  ensureJsonBody,
  runChat,
};
