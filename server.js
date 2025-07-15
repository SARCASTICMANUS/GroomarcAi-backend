require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

/**
 * 🔧 === CORS CONFIGURATION ===
 */

// ✅ Allowed production origin
const allowedOrigins = [
  "https://groomarc-ai-icc3.vercel.app" // <-- ✅ ONLINE FRONTEND
];

// ✅ Local origin (for development)
const localOrigin = "http://localhost:3000"; // <-- 🛠️ USE ONLY LOCALLY

// ✅ Switch mode: 'online' for deployment, 'local' for dev
const MODE = process.env.MODE || 'online'; // 'local' or 'online'

// 🌐 Final origin list
const finalAllowedOrigins = MODE === 'local'
  ? [...allowedOrigins, localOrigin]
  : allowedOrigins;

const corsOptions = {
  origin: function (origin, callback) {
    console.log("🌐 CORS Origin:", origin || "undefined");

    // ✅ Allow if origin is in the list or if no origin (Postman/cURL)
    if (!origin || finalAllowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
};

// ✅ CORS middleware
app.use(cors(corsOptions));

/**
 * ✅ BODY PARSER SETUP
 */
app.use(bodyParser.json());

/**
 * ✅ HEALTH CHECK ENDPOINT
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend is running!',
    timestamp: new Date().toISOString()
  });
});

/**
 * ✅ LOAD CHAT ROUTES SAFELY
 */
try {
  console.log('🔄 Attempting to load ./chat');
  const chatRoute = require('./chat');
  
  if (!chatRoute) throw new Error("chat.js did not export anything");

  app.use('/api', chatRoute);
  console.log('✅ Chat routes loaded successfully');

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

/**
 * ✅ ERROR HANDLING
 */
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  console.error(error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

/**
 * ✅ START SERVER
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Frontend should be running on: ${MODE === 'local' ? localOrigin : allowedOrigins[0]}`);
});
