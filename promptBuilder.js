// Category keywords for relatedness check
const CATEGORY_KEYWORDS = {
  "Closet Setting": [
    "closet", "wardrobe", "organize", "organization", "maximum efficiency", "capsule wardrobe", "seasonal clothing", "store", "declutter", "essentials", "arrange", "storage", "space", "hanger", "fold", "shelf", "drawer", "sort", "system", "setup"
  ],
  "Personal Styling": [
    "personal style", "identify", "colors", "skin tone", "dress", "body shape", "mix and match", "outfits", "style", "styling", "fashion", "look", "accessory", "trend", "color", "fit", "match", "coordinate", "appearance"
  ],
  "Lifestyle and Fitness": [
    "dressing well", "confidence", "daily life", "morning habits", "healthier lifestyle", "fitness routine", "busy schedule", "track fitness progress", "lifestyle", "fitness", "routine", "health", "progress", "habits", "diet", "nutrition", "workout", "wellness", "activity", "energy"
  ],
  "Event Styling": [
    "event", "black-tie", "black-tie event", "wedding guest", "wedding", "guest", "standout look", "themed party", "party", "event settings", "makeup", "outfit", "dos and don'ts", "formal", "dress code", "occasion", "festive", "attire"
  ],
  "Grooming": [
    "grooming", "essential tools", "proper grooming routine", "haircut", "maintain style", "shape eyebrows", "eyebrow", "eyebrows", "eyebrow shaping", "well-groomed", "hands", "nails", "shave", "beard", "trim", "hair", "skincare", "face", "clean", "wash", "moisturize", "routine", "facial", "hygiene", "body care"
  ],
  "Personal Care": [
    "personal care", "difference between grooming and personal care", "self-care routine", "lifestyle", "hygiene products", "everyday use", "morning regimen", "night regimen", "recommend", "choose", "best"
  ],
  "Skincare": [
    "skincare", "layer skincare products", "skin type", "determine needs", "skincare ingredients", "avoid", "sensitive skin", "skincare routine", "anti-aging", "cleanser", "moisturizer", "sunscreen", "acne", "pimple", "blemish", "routine", "care", "glow", "hydrate", "cream", "serum", "toner", "mask"
  ],
  "Fragrance Selection": [
    "fragrance", "signature fragrance", "choose fragrance", "eau de parfum", "eau de toilette", "scents", "seasons", "apply perfume", "long-lasting effect", "perfume", "cologne", "scent", "deodorant", "body spray", "aroma", "smell", "affordable", "budget", "cheap", "under", "price", "fresh", "woody", "floral", "citrus", "musky"
  ],
  "Personal Branding": [
    "personal brand", "personal branding", "unique personal brand", "develop personal brand", "strong personal image", "professional look", "aligns with my brand", "career success", "fashion and grooming", "brand", "image", "success", "professional", "unique", "develop", "elements", "key elements", "impact", "create", "fashion", "grooming"
  ],
  "Private Sessions": [
    "private sessions", "one-on-one styling consultation", "general styling advice", "personal brand strategy", "full-image makeover session", "expect", "tailor", "included"
  ],
  "Travel Styling and Essentials": [
    "travel styling", "essentials", "must-have fashion pieces", "frequent travelers", "pack efficiently", "sacrificing style", "transition outfits", "day to night", "traveling", "fabrics", "travel", "wrinkles"
  ],
  "Fashion Designer": [
    "fashion designer", "find a designer", "aligns with my style", "latest trends", "sustainable fashion", "custom tailoring", "ready-to-wear", "design a unique outfit", "special occasion", "designer", "trends"
  ],
  "Accessories Styling": [
    "accessories styling", "layer necklaces", "bracelets", "choose the right handbag", "different outfits", "accessories", "minimalist wardrobe", "statement pieces", "subtle styling", "balance"
  ],
  "Modeling": [
    "modeling", "key poses", "successful photoshoot", "build confidence", "camera", "beginner’s modeling portfolio", "prepare skin", "hair before a shoot", "photoshoot", "portfolio", "pose", "catwalk", "ramp", "audition", "agency", "shoot", "runway", "walk", "expression", "look", "outfit"
  ],
  "Makeup Artist": [
    "makeup artist", "natural makeup look", "daily wear", "foundation type", "skin", "contour", "face shape", "long-lasting makeup", "events", "makeup", "foundation", "concealer", "lipstick", "blush", "eyeliner", "mascara", "shadow", "brow", "highlight", "base", "cosmetic", "apply", "remove"
  ],
  "Haircare": [
    "haircare", "prevent hair fall", "wash my hair", "scalp type", "treatments for damaged hair", "shampoo", "conditioner", "hair type", "hair", "treatments", "damaged hair"
  ]
};

// List of generic/banned words to ignore as category matches
const GENERIC_BANNED_WORDS = [
  'car', 'bus', 'train', 'plane', 'vehicle', 'road', 'city', 'country', 'animal', 'dog', 'cat', 'tree', 'random', 'test', 'number', 'thing', 'object', 'item', 'stuff', 'etc', 'something', 'anything', 'everything', 'nothing'
];

function normalizeCategoryName(categoryName) {
  if (!categoryName) return '';
  // Replace hyphens/underscores with space, remove extra spaces, capitalize each word
  return categoryName
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase());
}

function isRelatedToCategory(question, categoryName) {
  if (!categoryName) return false;
  const normalized = normalizeCategoryName(categoryName);
  const keywords = CATEGORY_KEYWORDS[normalized] || [];
  const lower = question.toLowerCase();
  // Split message into words (remove punctuation)
  const words = lower.replace(/[^a-z0-9\s]/g, '').split(/\s+/);
  // If any keyword is a full word in the message, and not a banned word, return true
  return keywords.some(kw => {
    if (GENERIC_BANNED_WORDS.includes(kw)) return false;
    return words.includes(kw) || lower.includes(kw); // allow phrase match too
  });
}

function isPopQuestion(text, readyQuestions) {
  return readyQuestions && readyQuestions.some(q => q.trim().toLowerCase() === text.trim().toLowerCase());
}

// Enhanced in-scope check: if any of the last 5 user messages (plus current) are in-scope, treat as in-scope.
// After 6, only treat as in-scope if the current message matches pop/cat keywords.
function isInScopeWithContext(currentMessage, messages, categoryName, readyQuestions) {
  const userMessages = Array.isArray(messages) ? messages.filter(m => m.sender === 'user') : [];
  if (userMessages.length < 5) {
    // Use up to last 5 previous user messages + current
    const recentUserMessages = userMessages.slice(-5).map(m => m.content);
    const allToCheck = [...recentUserMessages, currentMessage];
    return allToCheck.some(msg => isPopQuestion(msg, readyQuestions) || isRelatedToCategory(msg, categoryName));
  } else {
    // If more than 5 previous, only current message is checked
    return isPopQuestion(currentMessage, readyQuestions) || isRelatedToCategory(currentMessage, categoryName);
  }
}

const CLOSING_MESSAGES = [
  'bye', 'ok', 'okay', 'thanks', 'thank you', 'see you', 'goodbye', 'shukriya', 'dhanyavaad'
];

const PERSONAL_PATTERNS = [
  /aap.*kha(n|na) kh(a|aya|ayi|aye)/i,
  /aap.*kaise ho/i,
  /aap.*kaha(n|ha) se/i,
  /tum.*kaise ho/i,
  /tum.*kaha(n|ha) se/i
];

function detectBoundaryType(message) {
  const text = message.trim().toLowerCase();
  if (CLOSING_MESSAGES.includes(text)) return 'closing';
  for (const pattern of PERSONAL_PATTERNS) {
    if (pattern.test(text)) return 'personal';
  }
  return null;
}

const BOUNDARY_RESPONSES = {
  closing: 'Thank you for connecting! Happy to help you 😊',
  personal: 'Main sirf styling/grooming se related sawaalon ke liye hoon 😊'
};

module.exports = {
  CATEGORY_KEYWORDS,
  isRelatedToCategory,
  isPopQuestion,
  isInScopeWithContext,
  detectBoundaryType,
  BOUNDARY_RESPONSES
}; 
