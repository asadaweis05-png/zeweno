// Gemini API configuration — key is loaded from environment variables
// and is never exposed in the UI or user-facing code.
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export function getGeminiApiKey() {
  return GEMINI_API_KEY;
}

export function getGeminiUrl(model = 'gemini-2.0-flash') {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
}
