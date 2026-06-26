// src/engine/Hash.js

export function fnv1a(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function mulberry32(seed) {
  return function() {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle(array, seed) {
  const rng = mulberry32(seed);
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateSessionId(epochMs) {
  const hash = fnv1a(epochMs.toString());
  return 'FN-' + hash.toString(16).toUpperCase().padStart(8, '0');
}

export function encodeShareState(state) {
  const payload = JSON.stringify({
    id:  state.session.id,
    z:   state.birth.zodiac,
    e:   state.birth.element,
    d:   state.birth.destinyNum,
    ak:  state.inscription.archetypeKey,
  });
  return btoa(encodeURIComponent(payload));
}