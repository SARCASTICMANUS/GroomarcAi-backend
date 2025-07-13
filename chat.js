require('dotenv').config();
const express = require('express');
const router = express.Router();
const { isInScopeWithContext } = require('./scopeDetection');
const { buildContextPrompt, CONTEXT_MESSAGE_COUNT } = require('./contextManager');
const { buildSystemInstruction, buildFullPrompt } = require('./promptBuilder');
const { callModel } = require('./modelRouter');

// Fallback message for out-of-scope
const OUT_OF_SCOPE_FALLBACK =
  "Oops! I only chat about fashion, grooming & styling. Try talking to Tania for skincare 💁‍♀️";

// --- Existing API for backend AI ---
router.post('/api/chat', async (req, res) => {
  try {
    const { message, avatar, categoryName, answerLength, messages } = req.body;
    const modelConfig = {
      provider: 'puter',
      appId: process.env.PUTER_APP_ID || 'your_puter_app_id_here'
    };
    if (!isInScopeWithContext(message, messages, categoryName, [])) {
      return res.json({ 
        response: OUT_OF_SCOPE_FALLBACK,
        recommendedAvatar: null
      });
    }
    const contextPrompt = buildContextPrompt([...messages, { sender: 'user', content: message }], message);
    let lengthInstruction = '';
    if (answerLength === 'one') lengthInstruction = 'Answer in one line.';
    else if (answerLength === 'two') lengthInstruction = 'Answer in two lines.';
    else lengthInstruction = 'Answer in a detailed paragraph.';
    const systemInstruction = buildSystemInstruction(avatar, categoryName, message);
    const fullPrompt = buildFullPrompt(systemInstruction, lengthInstruction, contextPrompt);
    const aiResponse = await callModel(fullPrompt, modelConfig);
    const recommendedAvatar = getRecommendedAvatar(message, avatar);
    return res.json({ 
      response: aiResponse,
      recommendedAvatar: recommendedAvatar
    });
  } catch (err) {
    console.error('Error in /api/chat:', err);
    return res.status(500).json({ 
      response: "Sorry, I'm having trouble right now. Please try again!",
      recommendedAvatar: null
    });
  }
});

// --- New API for Puter SDK hybrid flow ---
router.post('/api/puter-chat', (req, res) => {
  const { message, avatar, categoryName, answerLength, messages } = req.body;
  if (!isInScopeWithContext(message, messages, categoryName, [])) {
    return res.json({ allowed: false, response: OUT_OF_SCOPE_FALLBACK });
  }
  const contextPrompt = buildContextPrompt([...messages, { sender: 'user', content: message }], message);
  let lengthInstruction = '';
  if (answerLength === 'one') lengthInstruction = 'Answer in one line.';
  else if (answerLength === 'two') lengthInstruction = 'Answer in two lines.';
  else lengthInstruction = 'Answer in a detailed paragraph.';
  const systemInstruction = buildSystemInstruction(avatar, categoryName, message);
  const prompt = buildFullPrompt(systemInstruction, lengthInstruction, contextPrompt);
  res.json({ allowed: true, prompt });
});

// (Optional) For logging AI result
router.post('/api/puter-result', (req, res) => {
  // You can log req.body here for analytics
  // Example: { userMessage, aiResponse, avatar, categoryName, ... }
  res.json({ status: 'ok' });
});

function getRecommendedAvatar(message, currentAvatar) {
  const lower = message.toLowerCase();
  const recommendations = {
    'skincare': 'Tania Arora',
    'skin care': 'Tania Arora',
    'makeup': 'Tania Arora',
    'beauty': 'Tania Arora',
    'wellness': 'Kabir Singh',
    'fitness': 'Kabir Singh',
    'nutrition': 'Kabir Singh',
    'workout': 'Kabir Singh',
    'gym': 'Kabir Singh',
    'exercise': 'Kabir Singh',
    'grooming': 'Aarav Verma',
    'fashion': 'Rhea Kapoor',
    'styling': 'Rhea Kapoor'
  };
  for (const [keyword, avatarName] of Object.entries(recommendations)) {
    if (lower.includes(keyword) && avatarName !== currentAvatar) {
      return avatarName;
    }
  }
  return null;
}

module.exports = router; 