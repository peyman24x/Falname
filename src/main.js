// src/main.js
import { state }          from './state.js';
import { StateMachine }   from './engine/StateMachine.js';
import { fnv1a }          from './engine/Hash.js';

// ── Star field background ─────────────────────────────────────────────────
const canvas = document.getElementById('star-canvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Generate deterministic star field (changes per day)
const daySeed  = fnv1a(new Date().toDateString());
const starRng  = mulberry32(daySeed);

function mulberry32(seed) {
  return function() {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng    = mulberry32(daySeed);
const STARS  = Array.from({ length: 200 }, () => ({
  x:       rng(),
  y:       rng(),
  r:       rng() * 1.2 + 0.2,
  twinkle: rng() * Math.PI * 2,
  speed:   rng() * 0.008 + 0.002,
}));

let t = 0;
function drawStars() {
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  t += 0.01;

  STARS.forEach(s => {
    const alpha = 0.2 + 0.5 * Math.sin(t * s.speed * 60 + s.twinkle);
    ctx.beginPath();
    ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(232, 228, 217, ${alpha})`;
    ctx.fill();
  });

  requestAnimationFrame(drawStars);
}
drawStars();

// ── Boot Phase 0 ──────────────────────────────────────────────────────────
const phase0El = document.getElementById('phase-0');
phase0El.style.opacity     = '1';
phase0El.style.pointerEvents = 'auto';

import('./phases/Phase0_Gate.js').then(mod => mod.init(phase0El));