// src/engine/PsychologyEngine.js

/**
 * SCIENTIFIC REFERENCES:
 * - Jungian functions: Jung, C.G. "Psychological Types" (1921)
 * - Dark Triad: Paulhus & Williams, Journal of Research in Personality (2002)
 * - BIS/BAS: Gray, J.A. "The Neuropsychology of Anxiety" (1982)
 * - Shadow archetype: Jung, C.G. "Aion" (1951)
 */

// Triangle vertices map to Jungian orientations
// FIRE vertex (top) = Extraversion + Intuition (Ne/Se dominant)
// WATER vertex (bottom-left) = Introversion + Feeling (Fi/Fe dominant)
// AIR vertex (bottom-right) = Thinking + Intuition (Ti/Ni dominant)

export function computeJungFunction(normalizedX, normalizedY) {
  // normalizedX: 0=left(water), 1=right(air)
  // normalizedY: 0=top(fire), 1=bottom
  if (normalizedY < 0.35) return 'intuiting';     // near fire vertex
  if (normalizedX < 0.35) return 'feeling';        // near water vertex
  if (normalizedX > 0.65) return 'thinking';       // near air vertex
  return 'sensing';                                 // center
}

/**
 * BIS/BAS from movement pattern
 * BAS (Behavioral Activation System) → fast, edge-seeking, impulsive
 * BIS (Behavioral Inhibition System) → slow, center-staying, cautious
 */
export function computeBISBAS(orbPath) {
  if (orbPath.length < 3) return 0;

  // Average speed
  let totalDist = 0;
  for (let i = 1; i < orbPath.length; i++) {
    const dx = orbPath[i].x - orbPath[i-1].x;
    const dy = orbPath[i].y - orbPath[i-1].y;
    totalDist += Math.sqrt(dx*dx + dy*dy);
  }
  const avgSpeed = totalDist / orbPath.length;

  // Edge-seeking: how close to vertices on average
  const avgEdgeDist = orbPath.reduce((sum, p) => {
    const distFromCenter = Math.sqrt((p.x-0.5)**2 + (p.y-0.5)**2);
    return sum + distFromCenter;
  }, 0) / orbPath.length;

  // High speed + high edge = BAS (positive score)
  // Low speed + center-staying = BIS (negative score)
  const speedScore = Math.min(1, avgSpeed / 0.02);
  const edgeScore  = Math.min(1, avgEdgeDist / 0.4);
  return ((speedScore + edgeScore) / 2) * 2 - 1; // -1 to 1
}

/**
 * Dark Triad hint from path erraticism and edge-seeking
 * Reference: Paulhus & Williams (2002)
 * High = Machiavellian-leaning (strategic, boundary-testing)
 * Low  = Empathic-leaning (center-seeking, harmonious)
 */
export function computeDarkTriadHint(orbPath, finalPos) {
  if (orbPath.length < 5) return 0.3;

  // Count direction reversals (erratic = higher score)
  let reversals = 0;
  for (let i = 2; i < orbPath.length; i++) {
    const prev = { dx: orbPath[i-1].x - orbPath[i-2].x, dy: orbPath[i-1].y - orbPath[i-2].y };
    const curr = { dx: orbPath[i].x   - orbPath[i-1].x, dy: orbPath[i].y   - orbPath[i-1].y };
    const dot  = prev.dx*curr.dx + prev.dy*curr.dy;
    if (dot < 0) reversals++;
  }

  const reversalRate = reversals / orbPath.length;
  const edgeDist     = Math.sqrt((finalPos.x - 0.5)**2 + (finalPos.y - 0.5)**2);

  return Math.min(1, (reversalRate * 0.6 + edgeDist * 0.4));
}

// ── Jungian Shadow Intensity (1–9) ────────────────────────────────────────
export function computeShadowIntensity(destinyNum, bisBasScore, darkTriadHint) {
  // Destiny number sets the base
  const base = destinyNum; // 1–9
  // BIS (negative score) amplifies shadow (repression = more shadow)
  const bisAmplifier  = bisBasScore < 0 ? Math.abs(bisBasScore) * 2 : 0;
  // Dark Triad hint shifts shadow outward (externalizing)
  const darkShift     = darkTriadHint * 2;
  const raw = base + bisAmplifier + darkShift;
  return Math.max(1, Math.min(9, Math.round(raw)));
}