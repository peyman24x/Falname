// src/phases/Phase0_Gate.js
import { state }             from '../state.js';
import { StateMachine }      from '../engine/StateMachine.js';
import { Audio }             from '../audio/ambient.js';
import { computeAstrology, validateShamsiDate } from '../engine/AstrologyEngine.js';
import { fnv1a, generateSessionId }             from '../engine/Hash.js';
import * as Tone                                from 'tone';
import gsap                                     from 'gsap';

const SHAMSI_MONTHS_FA = [
  'فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور',
  'مهر','آبان','آذر','دی','بهمن','اسفند'
];

export function init(el) {
  el.innerHTML = `
    <div class="phase__inner" style="text-align:center">

      <div id="gate-brand" style="opacity:0">
        <h1 class="display" style="
          color:var(--gold);
          letter-spacing:0.35em;
          font-size:clamp(24px,5vw,42px)
        ">FALNAME</h1>
        <p class="micro" style="
          margin-top:8px;
          letter-spacing:0.2em;
          color:var(--ink-ghost)
        ">فال‌نامه — کتاب سرنوشت</p>
      </div>

      <hr class="ritual-divider" id="gate-divider" style="opacity:0;width:60%;margin:0 auto"/>

      <div id="gate-form" style="opacity:0;width:100%">
        <p class="body-text" style="margin-bottom:20px;color:var(--ink-secondary)">
          تاریخ تولد خود را به تقویم شمسی وارد کنید
        </p>
        <div class="date-input-group" style="justify-content:center">
          <input class="date-input" id="inp-day"
                 type="number" min="1" max="31"
                 placeholder="روز" style="width:80px"/>
          <select class="date-input" id="inp-month" style="width:130px">
            <option value="">ماه</option>
            ${SHAMSI_MONTHS_FA.map((m,i) =>
              `<option value="${i+1}">${m}</option>`
            ).join('')}
          </select>
          <input class="date-input" id="inp-year"
                 type="number" min="1300" max="1420"
                 placeholder="سال" style="width:100px"/>
        </div>
        <p id="gate-error" class="micro" style="
          margin-top:12px;
          color:var(--fire);
          opacity:0;
          transition:opacity 300ms
        ">تاریخ معتبر نیست</p>
      </div>

      <button id="gate-btn" style="
        opacity:0;
        background:none;border:none;
        font-family:'Vazirmatn',sans-serif;
        font-size:12px;letter-spacing:0.2em;
        color:var(--ink-secondary);cursor:pointer;
        padding:10px 24px;
        border:0.5px solid var(--border-faint);
        transition:border-color 300ms, color 300ms;
      ">
        گشودن فال‌نامه
      </button>

    </div>
  `;

  // Sequential reveal
  const tl = gsap.timeline();
  tl.to('#gate-brand',   { opacity: 1, duration: 1.2, ease: 'power2.out' })
    .to('#gate-divider', { opacity: 1, duration: 0.6 }, '+=0.3')
    .to('#gate-form',    { opacity: 1, duration: 0.8 }, '+=0.2')
    .to('#gate-btn',     { opacity: 1, duration: 0.6 }, '+=0.4');

  // Hover effect
  const btn = document.getElementById('gate-btn');
  btn.addEventListener('mouseenter', () => {
    btn.style.borderColor = 'var(--border-gold)';
    btn.style.color = 'var(--gold)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.borderColor = 'var(--border-faint)';
    btn.style.color = 'var(--ink-secondary)';
  });

  btn.addEventListener('click', handleSubmit);
  document.getElementById('inp-year')
    .addEventListener('keydown', e => { if (e.key === 'Enter') handleSubmit(); });

  async function handleSubmit() {
    const day   = parseInt(document.getElementById('inp-day').value);
    const month = parseInt(document.getElementById('inp-month').value);
    const year  = parseInt(document.getElementById('inp-year').value);

    const errorEl = document.getElementById('gate-error');

    if (!validateShamsiDate(year, month, day)) {
      errorEl.style.opacity = '1';
      setTimeout(() => { errorEl.style.opacity = '0'; }, 2000);
      return;
    }

    // Unlock audio
    await Tone.start();
    await Audio.init();

    // Store birth data
    state.birth.shamsiDay   = day;
    state.birth.shamsiMonth = month;
    state.birth.shamsiYear  = year;

    // Compute astrology
    const { zodiac, element, planet, destinyNum } = computeAstrology(year, month, day);
    state.birth.zodiac      = zodiac;
    state.birth.element     = element;
    state.birth.planet      = planet;
    state.birth.destinyNum  = destinyNum;

    // Session
    state.session.epochMs = Date.now();
    state.session.id      = generateSessionId(state.session.epochMs);
    state.session.seed    = fnv1a(`${year}${month}${day}${state.session.epochMs}`);

    // Apply element theme to body
    document.body.className = `element-${element}`;

    StateMachine.transition(1);
  }
}