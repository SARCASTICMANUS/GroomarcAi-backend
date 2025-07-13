require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

// Simple chat endpoint without complex dependencies
app.post('/api/simple-chat', (req, res) => {
  const { message } = req.body;
  res.json({ 
    response: `You said: "${message}". This is a test response from the backend.`,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Simple backend server running on port ${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
}); 