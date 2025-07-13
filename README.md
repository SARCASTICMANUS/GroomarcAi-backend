# GroomArc AI Backend

Node.js + Express backend API for the GroomArc AI chat application.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the backend directory:
```bash
cp env.example .env
```

Edit `.env` and add your API keys:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_api_key_here
PUTER_APP_ID=your_puter_app_id_here
```

### 3. Start Development Server
```bash
npm run dev
```

The backend will start on: http://localhost:5000

### 4. Test the Server
```bash
# Test dependencies
npm run test

# Run simple server (without complex modules)
npm run simple
```

## API Endpoints

### Health Check
- `GET /api/health` - Server status

### Chat Endpoints
- `POST /api/puter-chat` - Chat with AI (Puter.com integration)
- `POST /api/puter-result` - Log chat results
- `POST /api/chat` - Legacy chat endpoint

## Features

- **Express.js** with middleware support
- **CORS** enabled for frontend integration
- **Environment variables** for configuration
- **Error handling** with graceful fallbacks
- **Modular architecture** with separate route files
- **AI integration** with OpenAI and Puter.com support

## Project Structure

```
backend/
├── server.js              # Main server file
├── chat.js               # Chat route handlers
├── modelRouter.js        # AI model integration
├── scopeDetection.js     # Content filtering
├── contextManager.js     # Chat context management
├── promptBuilder.js      # AI prompt construction
├── languageDetection.js  # Language detection
├── avatars.json         # Avatar configurations
├── env.example          # Environment template
└── package.json         # Dependencies and scripts
```

## Development

- **Nodemon**: Auto-restart on file changes
- **Error handling**: Graceful crashes and recovery
- **Logging**: Detailed console output
- **Health checks**: Server status monitoring

## Frontend Integration

The backend expects the frontend to be running on `http://localhost:3000`. CORS is configured to allow requests from the frontend.

## Troubleshooting

1. **Port conflicts**: Change PORT in `.env` file
2. **Dependency errors**: Run `npm install` again
3. **Module errors**: Check that all files exist and are properly formatted
4. **API key errors**: Ensure `.env` file is properly configured

## Testing

```bash
# Test all dependencies
npm run test

# Run simple server
npm run simple

# Check health endpoint
curl http://localhost:5000/api/health
``` 