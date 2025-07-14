const fetch = require('node-fetch');

// Call the selected model (OpenAI or Puter.com)
async function callModel(prompt, modelConfig) {
  if (modelConfig.provider === 'openai') {
    // --- OpenAI API ---
    // You can add your OpenAI API key and endpoint here
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${modelConfig.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelConfig.model || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
  } else if (modelConfig.provider === 'puter') {
    // --- Puter.com SDK Integration ---
    // For Puter.com, we'll use a mock response since the SDK is frontend-only
    // In a real implementation, you would use Puter.com's REST API if available
    console.log('Using Puter.com mode - sending prompt:', prompt.substring(0, 100) + '...');
    
    // Mock response for Puter.com (replace with actual API call when available)
    return `[Puter.com Response] ${prompt.substring(0, 50)}... This is a mock response. In production, integrate with Puter.com REST API.`;
    
    // TODO: When Puter.com REST API is available, use this:
    // const response = await fetch('https://api.puter.com/v1/chat', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${modelConfig.apiKey}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     prompt: prompt,
    //     app_id: modelConfig.appId
    //   })
    // });
    // const data = await response.json();
    // return data.message?.content || "Sorry, I couldn't generate a response.";
  } else if (modelConfig.provider === 'your_custom_model') {
    // --- Add your custom model API call here ---
    // Example:
    // const response = await fetch('https://api.yourmodel.com/v1/chat', { ... });
    // const data = await response.json();
    // return data.message || "Sorry, I couldn't generate a response.";
    throw new Error('Custom model provider not implemented.');
  } else {
    throw new Error('Unknown model provider');
  }
}

module.exports = { callModel }; 
