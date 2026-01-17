const { CONSULTANT_SYSTEM_PROMPT, ensureJsonBody, runChat } = require('./_aiClient');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = ensureJsonBody(req);
    const { message, history } = body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const responseText = await runChat({
      prompt: CONSULTANT_SYSTEM_PROMPT,
      message,
      history,
    });

    return res.status(200).json({ response: responseText });
  } catch (error) {
    console.error('Consultation API Error:', error);
    return res.status(500).json({ error: 'Error with AI service' });
  }
};
