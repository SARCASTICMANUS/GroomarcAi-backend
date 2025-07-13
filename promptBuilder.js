const { isRomanHindi } = require('./languageDetection');

// Build the system instruction for persona, scope, and language
function buildSystemInstruction(avatar, categoryName, userMessage) {
  let languageInstruction = '';
  if (isRomanHindi(userMessage)) {
    languageInstruction = 'Reply in Roman Hindi (Hindi using English/Latin letters).';
  }
  return `You are ${avatar.name}, a helpful expert in ${categoryName}. Focus on ${categoryName?.toLowerCase()}-related questions. If the user asks for a list, format your answer as a numbered or bulleted list. ${languageInstruction}`;
}

// Build the full prompt for the model
function buildFullPrompt(systemInstruction, answerLength, contextPrompt) {
  return `${systemInstruction}\n${answerLength}\n${contextPrompt}`;
}

module.exports = { buildSystemInstruction, buildFullPrompt }; 