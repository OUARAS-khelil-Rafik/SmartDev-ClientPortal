const aiClient = require('../config/gemini');

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

const formatHistory = (rawHistory) => {
  return (rawHistory || []).map((msg) => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.parts?.[0]?.text || msg.text || '' }],
  }));
};

const sendConsultationMessage = async (message, history = []) => {
  try {
    if (!message) {
      throw new Error('Message is required');
    }

    const formattedHistory = formatHistory(history);

    const chat = aiClient.chats.create({
      model: 'gemini-2.0-flash',
      history: [
        { role: 'user', parts: [{ text: 'System: ' + CONSULTANT_SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Understood. I am ready to help as a SmartDev Project Consultant.' }] },
        ...formattedHistory
      ]
    });

    const response = await chat.sendMessage({ message });
    return response.text || 'I apologize, I could not generate a response.';
  } catch (error) {
    console.error('Consultation service error:', error);
    throw error;
  }
};

module.exports = { sendConsultationMessage };
