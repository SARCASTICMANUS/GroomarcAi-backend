// Simple test to check if all dependencies are working
console.log('Testing backend dependencies...');

try {
  console.log('Testing dotenv...');
  require('dotenv').config();
  console.log('✅ dotenv loaded');

  console.log('Testing express...');
  const express = require('express');
  console.log('✅ express loaded');

  console.log('Testing body-parser...');
  const bodyParser = require('body-parser');
  console.log('✅ body-parser loaded');

  console.log('Testing cors...');
  const cors = require('cors');
  console.log('✅ cors loaded');

  console.log('Testing node-fetch...');
  const fetch = require('node-fetch');
  console.log('✅ node-fetch loaded');

  console.log('Testing local modules...');
  const { isInScopeWithContext } = require('./scopeDetection');
  const { buildContextPrompt } = require('./contextManager');
  const { buildSystemInstruction } = require('./promptBuilder');
  const { callModel } = require('./modelRouter');
  console.log('✅ all local modules loaded');

  console.log('All dependencies are working! 🎉');
} catch (error) {
  console.error('❌ Error loading dependencies:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
} 