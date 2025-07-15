console.log('DEBUG: chat.js file loaded');
require('dotenv').config();
const express = require('express');
const router = express.Router();
const { buildContextPrompt, buildSystemInstruction, buildFullPrompt } = require('./promptBuilder');
const { isInScopeWithContext, OUT_OF_SCOPE_FALLBACK, detectBoundaryType, BOUNDARY_RESPONSES } = require('./scopeDetection');

// Health check route
router.get('/chat', (req, res) => {
  res.json({ status: 'ok', message: 'Chat route is working!' });
});

// Main chat route (with error logging)
router.post('/puter-chat', (req, res) => {
  try {
    console.log('PUTER-CHAT HIT', req.body);
    const { message, avatar, categoryName, answerLength, messages } = req.body;
    // Boundary type detection (closing, personal, etc.)
    const boundaryType = detectBoundaryType(message);
    if (boundaryType) {
      return res.json({ allowed: false, response: BOUNDARY_RESPONSES[boundaryType] });
    }
    const contextPrompt = buildContextPrompt([...messages, { sender: 'user', content: message }], message);
    let lengthInstruction = '';
    if (answerLength === 'one') lengthInstruction = 'Answer in one line.';
    else if (answerLength === 'two') lengthInstruction = 'Answer in two lines.';
    else lengthInstruction = 'Answer in a detailed paragraph.';
    const systemInstruction = buildSystemInstruction(avatar, categoryName, message) || 'You are a helpful stylist. Please answer the user question.';
    const prompt = buildFullPrompt(systemInstruction, contextPrompt, lengthInstruction) || 'Please answer the user question.';
    console.log('FINAL PROMPT:', prompt);
    res.json({ allowed: true, prompt });
  } catch (err) {
    console.error('Error in /puter-chat:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Result logging route
router.post('/puter-result', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router; 
