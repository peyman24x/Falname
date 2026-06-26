// src/state.js

export const state = {
  session: {
    id:      null,   // 'FN-' + 8-char hex
    epochMs: null,
    seed:    null,
  },

  phase: {
    current:   0,
    completed: [],
  },

  // Phase 0 — Gate
  birth: {
    shamsiDay:   null,
    shamsiMonth: null,
    shamsiYear:  null,
    // Computed by AstrologyEngine
    zodiac:      null,   // 'aries'|'taurus'|...|'pisces'
    element:     null,   // 'fire'|'water'|'earth'|'air'
    planet:      null,   // 'mars'|'venus'|...
    destinyNum:  null,   // 1–9
  },

  // Phase 1 — Mirror
  mirror: {
    orbPath:       [],   // [{x,y,t}] sampled during drag
    finalPosition: null, // {x,y} normalized 0-1
    jungFunction:  null, // 'thinking'|'feeling'|'sensing'|'intuiting'
    bisBasScore:   0,    // -1 to 1 (negative=BIS, positive=BAS)
    darkTriadHint: 0,    // 0-1 (edge-seeking behavior)
    vertex:        null, // 'fire'|'water'|'air' (dominant triangle vertex)
  },

  // Phase 2 — Cards
  tarot: {
    deck:     [],   // weighted and shuffled 7 cards shown
    selected: [],   // [{card, position:'persona'|'shadow'|'gift'}]
  },

  // Final inscription
  inscription: {
    archetypeKey:   null,
    archetypeName:  null,   // {fa, en}
    archetypeRef:   null,   // scientific reference
    personaText:    null,
    shadowText:     null,
    giftText:       null,
    tarotTriple:    null,   // {persona, shadow, gift} card names
    matrix:         null,   // sacred number matrix
  },
};