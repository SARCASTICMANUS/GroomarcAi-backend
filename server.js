require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const allowedOrigins = ["https://groomarc-ai-icc3.vercel.app"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

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
  console.log('DEBUG: Attempting to require ./chat');
  const chatRoute = require('./chat');
  console.log('DEBUG: ./chat required successfully:', chatRoute);
  app.use('/api', chatRoute);
  console.log('✅ Chat routes loaded successfully');
  // Debug: print all registered route paths
  if (chatRoute.stack) {
    console.log('Registered chatRoute paths:', chatRoute.stack.map(r => r.route && r.route.path));
  }
} catch (error) {
  console.error('❌ Error loading chat routes:', error);
  console.log('⚠️  Running in basic mode without chat functionality');

  // Ensure /api/puter-chat and /api/puter-result are always available as fallback ONLY if chat.js fails
  app.post('/api/puter-chat', (req, res) => {
    res.json({ 
      allowed: false, 
      prompt: 'Chat routes are not loaded properly. This is a fallback response.' 
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
