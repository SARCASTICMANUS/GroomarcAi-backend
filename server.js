require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// ✅ Allow both production and local dev frontends
const allowedOrigins = [
  "https://groomarc-ai-icc3.vercel.app", // Vercel
  "http://localhost:3000"                // Local React
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("🌐 CORS Origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// ✅ Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// ✅ Try to load chat routes safely
try {
  console.log('🔄 Attempting to load ./chat');
  const chatRoute = require('./chat');
  
  if (!chatRoute) throw new Error("chat.js did not export anything");

  app.use('/api', chatRoute);
  console.log('✅ Chat routes loaded successfully');

  // Optional: Log all registered paths
  if (chatRoute.stack) {
    console.log('📋 Registered routes:', chatRoute.stack.map(r => r.route?.path));
  }

} catch (error) {
  console.error('❌ Error loading chat routes:', error.message);
  console.error(error.stack);

  console.log('⚠️ Fallback mode enabled (no chat.js)');

  // Fallback endpoints
  app.post('/api/puter-chat', (req, res) => {
    res.json({ 
      allowed: false, 
      prompt: 'Chat routes not loaded. This is fallback mode.' 
    });
  });

  app.post('/api/puter-result', (req, res) => {
    res.json({ status: 'ok' });
  });
}

// ✅ Setup error handling for stability
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  console.error(error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Frontend should be running on: http://localhost:3000`);
});
