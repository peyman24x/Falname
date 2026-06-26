// src/engine/StateMachine.js
import { state }            from '../state.js';
import { buildInscription } from './InscriptionEngine.js';
import { Audio }            from '../audio/ambient.js';
import gsap                 from 'gsap';

export const StateMachine = {
  _transitioning: false,

  async transition(toPhase) {
    if (this._transitioning) return;
    this._transitioning = true;

    const fromPhase = state.phase.current;
    const fromEl    = document.getElementById(`phase-${fromPhase}`);
    const toEl      = document.getElementById(`phase-${toPhase}`);

    // 1. Fade out current phase
    await gsap.to(fromEl, {
      opacity: 0, duration: 1.0, ease: 'power2.inOut',
    });
    fromEl.classList.remove('phase--active');
    fromEl.style.pointerEvents = 'none';

    // 2. Ritual pause
    await new Promise(r => setTimeout(r, 1200));

    // 3. Build inscription before Phase 3 — wrapped in try/catch
    if (toPhase === 3) {
      try {
        buildInscription();
      } catch (err) {
        console.error('[FALNAME] buildInscription خطا داد:', err);
        // fallback: مقادیر null رو با پیش‌فرض پر می‌کنیم تا crash نشه
        if (!state.inscription) {
          state.inscription = {
            archetypeKey:  'air-1',
            archetypeName: { fa: 'ناشناخته', en: 'Unknown' },
            archetypeRef:  '',
            personaText:   '',
            shadowText:    '',
            giftText:      '',
            tarotTriple:   { persona: null, shadow: null, gift: null },
            matrix: {
              destinyNum:  state.birth.destinyNum  || '—',
              element:     state.birth.element     || '—',
              planet:      state.birth.planet      || '—',
              zodiac:      state.birth.zodiac      || '—',
              tarotTriple: '— · — · —',
              sessionId:   state.session.id        || '—',
              shamsiDate:  `${state.birth.shamsiYear}/${state.birth.shamsiMonth}/${state.birth.shamsiDay}`,
            },
          };
        }
      }
    }

    // 4. Update state
    state.phase.completed.push(fromPhase);
    state.phase.current = toPhase;

    // 5. پاک کردن محتوای قدیمی phase مقصد قبل از init
    toEl.innerHTML = '';

    // 6. Load and init next phase
    try {
      const modules = {
        0: () => import('../phases/Phase0_Gate.js'),
        1: () => import('../phases/Phase1_Mirror.js'),
        2: () => import('../phases/Phase2_Cards.js'),
        3: () => import('../phases/Phase3_Inscription.js'),
      };
      const mod = await modules[toPhase]();
      mod.init(toEl);
    } catch (err) {
      console.error(`[FALNAME] Phase ${toPhase} load خطا داد:`, err);
      this._transitioning = false;
      return;
    }

    // 7. Audio
    try {
      Audio.onPhaseEnter(toPhase);
    } catch (err) {
      // audio خطا نباید تجربه رو خراب کنه
      console.warn('[FALNAME] Audio error:', err);
    }

    // 8. Fade in next phase
    toEl.style.opacity = '0';
    toEl.classList.add('phase--active');
    toEl.style.pointerEvents = 'auto';
    await gsap.to(toEl, {
      opacity: 1, duration: 1.0, ease: 'power2.out',
    });

    this._transitioning = false;
  }
};
