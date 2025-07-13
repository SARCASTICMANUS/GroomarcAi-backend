// Number of previous messages to include for context
const CONTEXT_MESSAGE_COUNT = 6;

// Build context prompt with generic speaker labels
function buildContextPrompt(messages, currentUserMessage) {
  // Get the last CONTEXT_MESSAGE_COUNT messages (user and ai)
  const contextMessages = messages.slice(-CONTEXT_MESSAGE_COUNT);
  let context = '';
  contextMessages.forEach(msg => {
    context += `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.content}\n`;
  });
  context += `User: ${currentUserMessage}`;
  return context;
}

module.exports = { CONTEXT_MESSAGE_COUNT, buildContextPrompt }; 