// src/phases/Phase2_Cards.js
import { state }                 from '../state.js';
import { StateMachine }          from '../engine/StateMachine.js';
import { Audio }                 from '../audio/ambient.js';
import { buildWeightedDeckSync } from '../engine/TarotEngine.js';
import gsap                      from 'gsap';

const POSITIONS = ['persona', 'shadow', 'gift'];
const POSITION_LABELS = {
  persona: 'آنچه هستی',
  shadow:  'آنچه پنهان می‌کنی',
  gift:    'آنچه می‌توانی بشوی',
};

export function init(el) {
  // seededShuffle is now imported inside TarotEngine — no third argument needed
  const deck = buildWeightedDeckSync(
    state.birth.zodiac,
    state.session.seed
  );
  state.tarot.deck = deck;

  el.innerHTML = `
    <div class="phase__inner" style="align-items:stretch">
      <p class="micro" style="text-align:center;letter-spacing:0.2em;color:var(--ink-ghost)">
        سه کارت را برگزینید
      </p>
      <p id="cards-position-label" class="body-text"
         style="text-align:center;font-size:12px;color:var(--gold);opacity:0.7;min-height:20px">
        ${POSITION_LABELS[POSITIONS[0]]}
      </p>
      <div id="cards-grid" style="
        display:flex;
        justify-content:center;
        gap:10px;
        flex-wrap:wrap;
        width:100%;
      "></div>
      <p id="cards-counter" class="micro"
         style="text-align:center;color:var(--ink-ghost)">
        ۰ / ۳
      </p>
    </div>
  `;

  const grid = document.getElementById('cards-grid');
  let selectedCount = 0;

  deck.forEach((card, idx) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.dataset.id = card.id;
    cardEl.dataset.selected = 'false';

    cardEl.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back" style="flex-direction:column;gap:4px">
          <span style="
            font-family:'Cinzel',serif;
            font-size:8px;
            color:var(--gold);
            letter-spacing:0.1em;
            text-align:center;
          ">${card.name}</span>
          <span class="micro" style="
            font-family:'Vazirmatn',sans-serif;
            color:var(--ink-secondary);
            font-size:9px;
            text-align:center;
            direction:rtl;
          ">${card.fa}</span>
        </div>
      </div>
    `;

    function handleSelect() {
      // Guards
      if (cardEl.dataset.selected === 'true') return;
      if (selectedCount >= 3) return;

      // Reveal
      cardEl.dataset.selected = 'true';
      cardEl.classList.add('revealed');

      const positionKey = POSITIONS[selectedCount];
      state.tarot.selected.push({ card, position: positionKey });

      Audio.onCardReveal();
      selectedCount++;

      // Update counter (Persian digits)
      const persianDigits = ['۰', '۱', '۲', '۳'];
      document.getElementById('cards-counter').textContent =
        `${persianDigits[selectedCount]} / ۳`;

      // Update position label
      const labelEl = document.getElementById('cards-position-label');
      if (selectedCount < 3) {
        labelEl.textContent = POSITION_LABELS[POSITIONS[selectedCount]];
      } else {
        labelEl.textContent = 'کارت‌های شما آشکار شدند';
      }

      // Advance after third card
      if (selectedCount === 3) {
        // Fade out unselected cards
        document.querySelectorAll('.card:not([data-selected="true"])').forEach(c => {
          gsap.to(c, { opacity: 0.15, duration: 0.6 });
        });
        setTimeout(() => StateMachine.transition(3), 1800);
      }
    }

    cardEl.addEventListener('click', handleSelect);
    cardEl.addEventListener('touchend', e => {
      e.preventDefault();
      handleSelect();
    }, { passive: false });

    // Staggered entry animation
    cardEl.style.opacity = '0';
    grid.appendChild(cardEl);
    gsap.to(cardEl, {
      opacity: 1,
      duration: 0.5,
      delay: idx * 0.08,
      ease: 'power2.out',
    });
  });
}
