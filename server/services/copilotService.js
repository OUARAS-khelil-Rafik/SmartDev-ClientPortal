const aiClient = require('../config/gemini');

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

const formatHistory = (rawHistory) => {
  return (rawHistory || []).map((msg) => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.parts?.[0]?.text || msg.text || '' }],
  }));
};

const sendCopilotMessage = async (message, history = []) => {
  try {
    if (!message) {
      throw new Error('Message is required');
    }

    const formattedHistory = formatHistory(history);

    const chat = aiClient.chats.create({
      model: 'gemini-2.0-flash',
      history: [
        { role: 'user', parts: [{ text: 'System: ' + COPILOT_SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Hello! I\'m here to help you navigate SmartDev. What can I assist you with?' }] },
        ...formattedHistory
      ]
    });

    const response = await chat.sendMessage({ message });
    return response.text || 'I apologize, I could not generate a response.';
  } catch (error) {
    console.error('Copilot service error:', error);
    throw error;
  }
};

module.exports = { sendCopilotMessage };
