// Simple heuristic to detect Roman Hindi (not robust, but works for most cases)
function isRomanHindi(text) {
  // List of common English words (can be expanded)
  const commonEnglish = [
    'the','is','and','to','of','in','that','it','for','on','with','as','was','at','by','an','be','this','have','from','or','one','had','but','not','what','all','were','we','when','your','can','said','there','use','each','which','she','do','how','their','if','will','up','other','about','out','many','then','them','these','so','some','her','would','make','like','him','into','time','has','look','two','more','write','go','see','number','no','way','could','people','my','than','first','water','been','call','who','oil','its','now','find','long','down','day','did','get','come','made','may','part'
  ];
  const words = text.toLowerCase().split(/\s+/);
  let englishCount = 0;
  words.forEach(w => { if (commonEnglish.includes(w)) englishCount++; });
  // If less than 50% of words are common English, treat as Roman Hindi
  return englishCount / words.length < 0.5;
}

module.exports = { isRomanHindi }; 