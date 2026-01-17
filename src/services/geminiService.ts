// Gemini AI service - calls the backend proxy server
// The backend handles the actual Gemini API calls to keep the API key secure

// Default to relative /api so Vercel Functions work without extra config; allow override for local dev
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

export const generateProjectConsultation = async (
  userQuery: string,
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/consultation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userQuery,
        history: history,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get AI response');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Consultation API Error:', error);
    return "I apologize, but I'm having trouble connecting to the AI service. Please try again later.";
  }
};

export const generateCopilotResponse = async (
  userQuery: string,
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/copilot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userQuery,
        history: history,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get AI response');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Copilot API Error:', error);
    return "I apologize, but I'm having trouble connecting. Please try again.";
  }
};
