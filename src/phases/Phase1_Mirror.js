// src/phases/Phase1_Mirror.js
import { state }               from '../state.js';
import { StateMachine }        from '../engine/StateMachine.js';
import { computeJungFunction,
         computeBISBAS,
         computeDarkTriadHint } from '../engine/PsychologyEngine.js';
import Matter                   from 'matter-js';
import gsap                     from 'gsap';

const VERTICES = {
  fire:  { x: 260, y:  50 },
  water: { x:  60, y: 410 },
  air:   { x: 460, y: 410 },
};
const CENTROID = { x: 260, y: 290 };

export function init(el) {
  el.innerHTML = `
    <div class="phase__inner" style="align-items:stretch">
      <p class="micro" style="text-align:center;letter-spacing:0.2em;color:var(--ink-ghost)">
        روح خود را در مثلث رها کنید
      </p>
      <canvas id="mirror-canvas"
              width="520" height="460"
              style="width:100%;max-width:520px;margin:0 auto;display:block;
                     touch-action:none;cursor:crosshair">
      </canvas>
      <p class="micro" style="text-align:center;color:var(--ink-ghost);opacity:0.5">
        هنگامی که آماده‌اید، انگشت را رها کنید
      </p>
    </div>
  `;

  const canvas = document.getElementById('mirror-canvas');
  const ctx    = canvas.getContext('2d');

  // ── Matter.js physics ──────────────────────────────────────────────────
  const Engine   = Matter.Engine;
  const Render   = Matter.Render; // not used — custom canvas
  const Bodies   = Matter.Bodies;
  const Body     = Matter.Body;
  const MatterEvents = Matter.Events;
  const Composite = Matter.Composite;

  const engine   = Engine.create({ gravity: { x: 0, y: 0 } });

  // Triangle boundary walls (approximate)
  const walls = [
    // Left wall: fire→water
    Bodies.rectangle(110, 230, 12, 380, { isStatic: true, angle: -0.96 }),
    // Right wall: fire→air
    Bodies.rectangle(400, 230, 12, 380, { isStatic: true, angle: 0.96 }),
    // Bottom wall: water→air
    Bodies.rectangle(260, 415, 400, 12,  { isStatic: true }),
  ];
  Composite.add(engine.world, walls);

  // Orb body
  const orb = Bodies.circle(CENTROID.x, CENTROID.y, 16, {
    restitution: 0.7,
    friction: 0.01,
    frictionAir: 0.04,
  });
  Composite.add(engine.world, orb);

  // ── Path recording ─────────────────────────────────────────────────────
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  const pathSamples = [];
  let lastSampleTime = 0;

  // ── Canvas scale ───────────────────────────────────────────────────────
  function getScale() {
    const rect = canvas.getBoundingClientRect();
    return { sx: 520 / rect.width, sy: 460 / rect.height };
  }

  function toCanvasCoords(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const { sx, sy } = getScale();
    return {
      x: (clientX - rect.left) * sx,
      y: (clientY - rect.top)  * sy,
    };
  }

  // ── Pointer events ─────────────────────────────────────────────────────
  canvas.addEventListener('pointerdown', e => {
    const { x, y } = toCanvasCoords(e.clientX, e.clientY);
    const orbPos = orb.position;
    const dist = Math.sqrt((x - orbPos.x)**2 + (y - orbPos.y)**2);
    if (dist < 30) {
      isDragging = true;
      canvas.setPointerCapture(e.pointerId);
      Body.setVelocity(orb, { x: 0, y: 0 });
      e.preventDefault();
    }
  });

  canvas.addEventListener('pointermove', e => {
    if (!isDragging) return;
    const { x, y } = toCanvasCoords(e.clientX, e.clientY);
    Body.setPosition(orb, { x, y });
    Body.setVelocity(orb, { x: 0, y: 0 });

    // Sample path every 100ms
    const now = Date.now();
    if (now - lastSampleTime > 100) {
      pathSamples.push({
        x: x / 520,
        y: y / 460,
        t: now,
      });
      lastSampleTime = now;
    }
    e.preventDefault();
  });

  canvas.addEventListener('pointerup', async e => {
    if (!isDragging) return;
    isDragging = false;

    const finalPos = {
      x: orb.position.x / 520,
      y: orb.position.y / 460,
    };

    // Compute psychology scores
    state.mirror.orbPath       = pathSamples;
    state.mirror.finalPosition = finalPos;
    state.mirror.jungFunction  = computeJungFunction(finalPos.x, finalPos.y);
    state.mirror.bisBasScore   = computeBISBAS(pathSamples);
    state.mirror.darkTriadHint = computeDarkTriadHint(pathSamples, finalPos);

    // Dominant vertex
    const dists = Object.entries(VERTICES).map(([k, v]) => ({
      k,
      d: Math.sqrt((orb.position.x - v.x)**2 + (orb.position.y - v.y)**2)
    }));
    dists.sort((a, b) => a.d - b.d);
    state.mirror.vertex = dists[0].k;

    // Wait 800ms then advance
    await new Promise(r => setTimeout(r, 800));
    StateMachine.transition(2);
  });

  // ── Render loop ────────────────────────────────────────────────────────
  let animId;
  function draw() {
    Engine.update(engine, 1000 / 60);
    ctx.clearRect(0, 0, 520, 460);

    const elementColor = getComputedStyle(document.body)
      .getPropertyValue('--element-color').trim() || '#c9a84c';

    // Draw triangle
    ctx.beginPath();
    ctx.moveTo(VERTICES.fire.x,  VERTICES.fire.y);
    ctx.lineTo(VERTICES.water.x, VERTICES.water.y);
    ctx.lineTo(VERTICES.air.x,   VERTICES.air.y);
    ctx.closePath();
    ctx.strokeStyle = 'rgba(232,228,217,0.08)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Vertex labels
    const labels = { fire: 'اراده', water: 'احساس', air: 'ذهن' };
    ctx.font = '11px Vazirmatn';
    ctx.fillStyle = 'rgba(120,115,104,0.7)';
    ctx.textAlign = 'center';
    ctx.fillText(labels.fire,  VERTICES.fire.x,  VERTICES.fire.y  - 14);
    ctx.fillText(labels.water, VERTICES.water.x, VERTICES.water.y + 22);
    ctx.fillText(labels.air,   VERTICES.air.x,   VERTICES.air.y   + 22);

    // Draw orb glow
    const { x, y } = orb.position;
    const grd = ctx.createRadialGradient(x, y, 0, x, y, 28);
    grd.addColorStop(0, elementColor + '40');
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    // Draw orb
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(201,168,76,0.6)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = 'rgba(12,11,20,0.9)';
    ctx.fill();

    // Draw strings to vertices
    Object.values(VERTICES).forEach(v => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(v.x, v.y);
      ctx.strokeStyle = 'rgba(232,228,217,0.06)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    animId = requestAnimationFrame(draw);
  }

  draw();

  // Cleanup when phase changes
  return () => cancelAnimationFrame(animId);
}