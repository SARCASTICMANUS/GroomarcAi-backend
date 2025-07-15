require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

/**
 * 🔧 === CORS CONFIGURATION ===
 * 🌐 Set to PRODUCTION only by default
 */
const allowedOrigins = [
  "https://groomarc-ai-icc3.vercel.app"  // ✅ Production frontend
];

// 🧪 Uncomment for local development
// allowedOrigins.push("http://localhost:3000");

const corsOptions = {
  origin: function (origin, callback) {
    console.log("🌐 CORS Origin:", origin || "undefined");

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

/**
 * ✅ BODY PARSER
 */
app.use(bodyParser.json());

/**
 * ✅ STATIC FILES (for production build of frontend)
 */
app.use(express.static(path.join(__dirname, 'client', 'build')));

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
 * ✅ LOAD CHAT ROUTES
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
 * ✅ REACT SPA FALLBACK (Prevent 404 on browser refresh)
 */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

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
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});
