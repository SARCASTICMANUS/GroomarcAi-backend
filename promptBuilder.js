const { isRomanHindi } = require('./languageDetection');

// Helper to check if info is present in userMessage
function hasInfo(userMessage, keyword) {
  const text = userMessage.toLowerCase();
  if (keyword === 'gender') return /\b(male|female|man|woman|ladki|ladka|boy|girl)\b/.test(text);
  if (keyword === 'age') return /\b(\d{2})\s*(years|yrs|saal)\b/.test(text);
  if (keyword === 'height') return /\b(\d{1,2}(\'|ft|feet|inch|inches|cm|centimeter|meter|m))\b/.test(text);
  if (keyword === 'weight') return /\b(\d{2,3}\s*(kg|kilogram|pound|lbs))\b/.test(text);
  if (keyword === 'skin color') return /\b(fair|dark|wheatish|gora|saawla|dusky|light|medium|brown|white|black)\b/.test(text);
  if (keyword === 'event') return /\b(wedding|party|meeting|interview|function|event|shaadi|birthday|anniversary|gathering|ceremony|festival)\b/.test(text);
  if (keyword === 'theme') return /\b(theme|motif|concept|color code|dress code)\b/.test(text);
  if (keyword === 'preferences') return /prefer|like|pasand|favorite|favourite/.test(text);
  if (keyword === 'budget') return /\b(\d{3,6}|budget|price|range|afford|expensive|cheap|affordable)\b/.test(text);
  if (keyword === 'bust') return /\b(bust|chest|bra size|cup size|\d{2,3}\s*(cm|inch|inches))\b/.test(text);
  if (keyword === 'waist') return /\b(waist|\d{2,3}\s*(cm|inch|inches))\b/.test(text);
  if (keyword === 'hips') return /\b(hips|hip|\d{2,3}\s*(cm|inch|inches))\b/.test(text);
  if (keyword === 'storage space') return /space|wardrobe|closet|almirah|rack|shelf/.test(text);
  if (keyword === 'seasonal needs') return /season|summer|winter|monsoon|rotate|seasonal/.test(text);
  if (keyword === 'style frequency') return /formal|casual|frequency|often|regular|occasion/.test(text);
  if (keyword === 'style icons') return /icon|inspiration|influencer|role model|idol/.test(text);
  if (keyword === 'preferred colors') return /color|colours|shade|hue|rang/.test(text);
  if (keyword === 'disliked styles') return /dislike|avoid|hate|not like|pasand nahi/.test(text);
  if (keyword === 'activity level') return /active|sedentary|lifestyle|workout|exercise/.test(text);
  if (keyword === 'fitness goal') return /goal|target|lose|gain|muscle|weight loss|fitness/.test(text);
  if (keyword === 'routine') return /routine|schedule|habit|daily|dincharya/.test(text);
  if (keyword === 'event date') return /date|when|kab|din|day/.test(text);
  if (keyword === 'venue') return /venue|location|place|indoor|outdoor|hall|banquet|garden/.test(text);
  if (keyword === 'weather') return /weather|climate|temperature|hot|cold|humid|rain/.test(text);
  if (keyword === 'beard status') return /beard|clean shave|moustache|dadhi|mooch/.test(text);
  if (keyword === 'grooming frequency') return /groom|salon|barber|kitni baar|how often/.test(text);
  if (keyword === 'skin concerns') return /dry|acne|pimple|concern|problem|issue|oily|sensitive/.test(text);
  if (keyword === 'daily routine') return /routine|daily|habit|subah|shaam/.test(text);
  if (keyword === 'skin type') return /oily|dry|combination|normal|skin type/.test(text);
  if (keyword === 'sensitive skin') return /sensitive|allergy|reaction/.test(text);
  if (keyword === 'fragrance type') return /fresh|floral|woody|spicy|fragrance|scent|perfume/.test(text);
  if (keyword === 'fragrance duration') return /long lasting|duration|kitni der|last/.test(text);
  if (keyword === 'industry') return /industry|profession|kaam|job|field/.test(text);
  if (keyword === 'public appearance') return /public|event|speak|stage|appearance/.test(text);
  if (keyword === 'expectation') return /expect|ummeed|chahte|want|need/.test(text);
  if (keyword === 'past consultation') return /before|pehle|past|consult|session/.test(text);
  if (keyword === 'destination') return /destination|travel|trip|yatra|place|city|country/.test(text);
  if (keyword === 'duration') return /duration|kitne din|how long|days|weeks/.test(text);
  if (keyword === 'custom preferences') return /custom|tailor|stitched|ready to wear/.test(text);
  if (keyword === 'fabric choice') return /fabric|kapda|material|cotton|silk|linen|wool/.test(text);
  if (keyword === 'jewelry preference') return /jewelry|jewellery|gold|silver|accessory/.test(text);
  if (keyword === 'watch type') return /watch|smartwatch|analog|digital/.test(text);
  if (keyword === 'portfolio status') return /portfolio|photoshoot|shoot|modeling/.test(text);
  if (keyword === 'posing confidence') return /pose|posing|camera|confidence/.test(text);
  if (keyword === 'makeup frequency') return /makeup|kitni baar|how often|daily|occasion/.test(text);
  if (keyword === 'event makeup need') return /event|special|occasion|shaadi|party/.test(text);
  if (keyword === 'hair type') return /hair type|straight|wavy|curly|bald/.test(text);
  if (keyword === 'scalp type') return /scalp|oily|dry|normal/.test(text);
  return false;
}

function isFemaleUser(userMessage, avatar) {
  if (avatar && avatar.gender && avatar.gender.toLowerCase() === 'female') return true;
  const text = userMessage.toLowerCase();
  return /\b(female|woman|ladki|girl|mahila|aurat)\b/.test(text);
}

const CATEGORY_QUESTIONS = {
  'closet setting': [
    'storage space', 'seasonal needs', 'style frequency'
  ],
  'personal styling': [
    'style icons', 'preferred colors', 'disliked styles', 'budget', 'height', 'weight', 'age'
  ],
  'lifestyle and fitness': [
    'activity level', 'fitness goal', 'routine'
  ],
  'event styling': [
    'event', 'theme', 'gender', 'age', 'height', 'weight', 'skin color', 'event date', 'venue', 'weather', 'budget'
  ],
  'grooming': [
    'beard status', 'grooming frequency'
  ],
  'personal care': [
    'skin concerns', 'daily routine'
  ],
  'skincare': [
    'skin type', 'sensitive skin'
  ],
  'fragrance selection': [
    'fragrance type', 'fragrance duration'
  ],
  'personal branding': [
    'industry', 'public appearance'
  ],
  'private sessions': [
    'expectation', 'past consultation'
  ],
  'travel styling and essentials': [
    'destination', 'duration'
  ],
  'fashion designer': [
    'custom preferences', 'fabric choice', 'budget'
  ],
  'accessories styling': [
    'jewelry preference', 'watch type'
  ],
  'modeling': [
    'portfolio status', 'posing confidence'
  ],
  'makeup artist': [
    'makeup frequency', 'event makeup need'
  ],
  'haircare': [
    'hair type', 'scalp type'
  ]
};

// Build the system instruction for persona, scope, and language
function buildSystemInstruction(avatar, categoryName, userMessage) {
  try {
    let languageInstruction = '';
    if (isRomanHindi(userMessage)) {
      languageInstruction = 'Reply in Roman Hindi (Hindi using English/Latin letters).';
    }
    let personalizationInstruction = '';
    const safeCategory = typeof categoryName === 'string' ? categoryName.toLowerCase() : '';
    if (safeCategory && CATEGORY_QUESTIONS[safeCategory]) {
      const missing = [];
      const questions = CATEGORY_QUESTIONS[safeCategory];
      const isFemale = isFemaleUser(userMessage, avatar);
      for (const key of questions) {
        // For personal styling, handle female-specific
        if (safeCategory === 'personal styling' && isFemale) {
          if (['height', 'weight'].includes(key)) continue; // skip general height/weight for female
          if (key === 'bust' && !hasInfo(userMessage, 'bust')) missing.push('What is your bust size?');
          if (key === 'waist' && !hasInfo(userMessage, 'waist')) missing.push('What is your waist size?');
          if (key === 'hips' && !hasInfo(userMessage, 'hips')) missing.push('What is your hip size?');
        }
        if (!hasInfo(userMessage, key)) {
          // Female-specific: add bust/waist/hips for personal styling
          if (safeCategory === 'personal styling' && isFemale) {
            if (key === 'age') missing.push('What is your age?');
          }
          else missing.push(getQuestionText(key));
        }
      }
      // For female users in personal styling, always ask bust/waist/hips if not present
      if (safeCategory === 'personal styling' && isFemale) {
        if (!hasInfo(userMessage, 'bust')) missing.push('What is your bust size?');
        if (!hasInfo(userMessage, 'waist')) missing.push('What is your waist size?');
        if (!hasInfo(userMessage, 'hips')) missing.push('What is your hip size?');
      }
      if (missing.length > 0) {
        personalizationInstruction = `Before proceeding with your style request, I would like to know a few things about you.\nPlease answer the following questions as a numbered or bulleted list:\n${missing.map((q, i) => `${i + 1}. ${q}`).join('\n')}`;
      } else {
        personalizationInstruction = 'You have all the necessary details. Give highly personalized advice based on the provided information.';
      }
    }
    return `You are ${avatar && avatar.name ? avatar.name : 'the stylist'}, a helpful expert in ${categoryName || 'style'}. Focus on ${safeCategory}-related questions. If the user asks for a list, format your answer as a numbered or bulleted list. ${personalizationInstruction} ${languageInstruction}`;
  } catch (err) {
    console.error('Error in buildSystemInstruction:', err);
    return 'You are a helpful stylist. Please answer the user question.';
  }
}

function getQuestionText(key) {
  // Map key to user-friendly question
  const map = {
    'storage space': 'How much space do you have for your wardrobe?',
    'seasonal needs': 'Do you rotate clothes seasonally?',
    'style frequency': 'How often do you wear formal vs casual outfits?',
    'style icons': 'Do you have any style inspirations or icons?',
    'preferred colors': 'What are your preferred colors?',
    'disliked styles': 'Are there any styles you dislike or avoid?',
    'budget': 'What is your styling budget?',
    'height': 'What is your height?',
    'weight': 'What is your weight?',
    'age': 'What is your age?',
    'activity level': 'How active is your daily lifestyle?',
    'fitness goal': 'Do you have any fitness goals?',
    'routine': 'What’s your typical daily schedule like?',
    'event': 'What is the event?',
    'theme': 'What is the theme?',
    'gender': 'What is your gender?',
    'skin color': 'What is your skin color?',
    'event date': 'When is the event?',
    'venue': 'What’s the venue like? Indoor or outdoor?',
    'weather': 'What’s the expected weather?',
    'beard status': 'Do you maintain a beard or clean shave?',
    'grooming frequency': 'How often do you groom or visit a salon?',
    'skin concerns': 'Do you have any skin concerns like dryness or acne?',
    'daily routine': 'What does your current personal care routine look like?',
    'skin type': 'What is your skin type (oily, dry, combination)?',
    'sensitive skin': 'Is your skin sensitive to any products?',
    'fragrance type': 'Do you prefer fresh, floral, woody, or spicy scents?',
    'fragrance duration': 'How long do you want your scent to last?',
    'industry': 'Which industry or profession are you in?',
    'public appearance': 'Do you attend public events or speak often?',
    'expectation': 'What do you expect from a one-on-one styling session?',
    'past consultation': 'Have you had a styling session before?',
    'destination': 'Where are you traveling to?',
    'duration': 'How long will you be traveling?',
    'custom preferences': 'Do you prefer custom-tailored or ready-to-wear?',
    'fabric choice': 'Do you prefer certain fabrics or materials?',
    'jewelry preference': 'Do you prefer gold, silver, or other jewelry types?',
    'watch type': 'What type of watch do you usually wear?',
    'portfolio status': 'Do you already have a portfolio?',
    'posing confidence': 'How confident are you in front of the camera?',
    'makeup frequency': 'How often do you wear makeup?',
    'event makeup need': 'Is this makeup for a specific event?',
    'hair type': 'What is your hair type (straight, wavy, curly)?',
    'scalp type': 'Do you have an oily, dry, or normal scalp?'
  };
  return map[key] || key;
}

// Build the context prompt from messages
function buildContextPrompt(messages, userMessage) {
  // Join all messages as context
  return messages.map(m => `${m.sender}: ${m.content}`).join('\n') + `\nuser: ${userMessage}`;
}

// Build the full prompt for the model
function buildFullPrompt(systemInstruction, answerLength, contextPrompt) {
  return `${systemInstruction}\n${answerLength}\n${contextPrompt}`;
}

module.exports = { buildSystemInstruction, buildFullPrompt, buildContextPrompt }; 
