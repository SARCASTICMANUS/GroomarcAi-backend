require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Try to load chat routes, but don't crash if they fail
try {
  const chatRoute = require('./chat');
  app.use('/', chatRoute);
  console.log('✅ Chat routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading chat routes:', error.message);
  console.log('⚠️  Running in basic mode without chat functionality');
  
  // Fallback chat endpoint
  app.post('/api/puter-chat', (req, res) => {
    res.json({ 
      allowed: true, 
      prompt: 'This is a fallback response. Chat routes are not loaded properly.' 
    });
  });
  
  app.post('/api/puter-result', (req, res) => {
    res.json({ status: 'ok' });
  });
}

const PORT = process.env.PORT || 5000;

// Error handling for the server
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  console.error('Stack trace:', error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Frontend should be running on: http://localhost:3000`);
}); 