// Stubbed Gemini service for client builds
// The real `@google/genai` SDK is server-side only and should not be bundled into the browser.
// To avoid build-time Rollup resolution errors we provide a lightweight client-side fallback.

export const generateProjectConsultation = async (
  userQuery: string,
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  // Inform the client that AI is only available via a server-side endpoint.
  return (
    "AI functionality is disabled in the browser. " +
    "Please configure a server-side proxy or use environment with server-side rendering to enable Gemini." 
  );
};

export const generateCopilotResponse = async (
  userQuery: string,
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  return (
    "Copilot is unavailable in the browser build. " +
    "For interactive AI responses, run the app in SSR or call a secure server API that uses @google/genai." 
  );
};
