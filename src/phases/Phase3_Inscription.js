// src/phases/Phase3_Inscription.js
import { state }            from '../state.js';
import { encodeShareState } from '../engine/Hash.js';
import gsap                 from 'gsap';
import html2canvas          from 'html2canvas';

export function init(el) {
  const { archetypeName, archetypeRef, personaText, shadowText,
          giftText, tarotTriple, matrix } = state.inscription;

  el.innerHTML = `
    <div class="phase__inner" style="align-items:stretch;max-height:100vh;overflow-y:auto;padding-bottom:40px">

      <div id="inscription-content" style="
        direction:rtl;
        text-align:right;
        width:100%;
        background:var(--bg-void);
        padding:40px 16px;
      ">

        <!-- Header -->
        <div style="text-align:center;margin-bottom:32px;opacity:0" id="ins-header">
          <p style="
            font-family:'Vazirmatn',sans-serif;
            font-size:11px;letter-spacing:0.25em;
            color:var(--gold-dim);margin-bottom:12px
          ">✦ فال‌نامه ✦</p>
          <h1 style="
            font-family:'Cinzel',serif;
            color:var(--gold);
            font-size:clamp(14px,3vw,22px);
            letter-spacing:0.3em;font-weight:400
          ">FALNAME</h1>
        </div>

        <hr class="ritual-divider"/>

        <!-- Archetype name -->
        <div id="ins-archetype" style="opacity:0;text-align:center;padding:20px 0">
          <h2 style="
            font-family:'Vazirmatn',sans-serif;
            font-weight:500;
            font-size:clamp(22px,4vw,34px);
            color:var(--ink-primary);
            margin-bottom:8px
          ">${archetypeName.fa}</h2>
          <p style="
            font-family:'Cinzel',serif;
            font-size:clamp(11px,2vw,14px);
            color:var(--ink-secondary);
            letter-spacing:0.2em;font-weight:400
          ">${archetypeName.en}</p>
          <p style="
            margin-top:12px;
            font-family:'Vazirmatn',sans-serif;
            font-size:10px;
            color:var(--ink-ghost);
            direction:ltr;text-align:center;
            font-weight:300
          ">${archetypeRef}</p>
        </div>

        <hr class="ritual-divider"/>

        <!-- Tarot Triple -->
        <div id="ins-tarot" style="opacity:0;padding:16px 0">
          <p style="
            font-family:'Vazirmatn',sans-serif;
            font-size:11px;letter-spacing:0.2em;
            color:var(--gold-dim);margin-bottom:12px;
            font-weight:300
          ">سه کارت سرنوشت</p>
          ${[
            { pos: 'persona', label: 'پرسونا' },
            { pos: 'shadow',  label: 'سایه'   },
            { pos: 'gift',    label: 'هدیه'   },
          ].map(({ pos, label }) => {
            const card = tarotTriple[pos];
            return `
              <div style="
                display:flex;justify-content:space-between;align-items:center;
                padding:10px 0;border-bottom:0.5px solid var(--border-faint);
                gap:8px;
              ">
                <span style="
                  font-family:'Vazirmatn',sans-serif;
                  font-size:12px;color:var(--ink-ghost);font-weight:300
                ">${label}</span>
                <span style="text-align:left">
                  <span style="
                    font-family:'Cinzel',serif;
                    font-size:11px;color:var(--gold);
                    direction:ltr;display:block;text-align:right
                  ">${card?.name || '—'}</span>
                  <span style="
                    font-family:'Vazirmatn',sans-serif;
                    font-size:11px;color:var(--ink-secondary);
                    display:block;direction:rtl;text-align:right;
                    font-weight:300
                  ">${card?.fa || '—'}</span>
                </span>
              </div>
            `;
          }).join('')}
        </div>

        <hr class="ritual-divider"/>

        <!-- Persona -->
        <div id="ins-persona" style="opacity:0;padding:16px 0">
          <p style="
            font-family:'Vazirmatn',sans-serif;
            font-size:11px;letter-spacing:0.15em;
            color:var(--gold-dim);margin-bottom:10px;font-weight:300
          ">پرسونا — نقابی که می‌پوشی</p>
          <p style="
            font-family:'Vazirmatn',sans-serif;
            font-size:14px;font-weight:300;
            color:var(--ink-secondary);line-height:2.2;direction:rtl
          ">${personaText}</p>
        </div>

        <!-- Shadow -->
        <div id="ins-shadow" style="opacity:0;padding:16px 0">
          <p style="
            font-family:'Vazirmatn',sans-serif;
            font-size:11px;letter-spacing:0.15em;
            color:var(--gold-dim);margin-bottom:10px;font-weight:300
          ">سایه — آنچه پنهان است</p>
          <p style="
            font-family:'Vazirmatn',sans-serif;
            font-size:14px;font-weight:300;
            color:var(--ink-secondary);line-height:2.2;direction:rtl
          ">${shadowText}</p>
        </div>

        <!-- Gift -->
        <div id="ins-gift" style="opacity:0;padding:16px 0">
          <p style="
            font-family:'Vazirmatn',sans-serif;
            font-size:11px;letter-spacing:0.15em;
            color:var(--gold-dim);margin-bottom:10px;font-weight:300
          ">هدیه — آنچه می‌توانی بشوی</p>
          <p style="
            font-family:'Vazirmatn',sans-serif;
            font-size:15px;font-weight:400;
            color:var(--ink-primary);line-height:2.2;direction:rtl
          ">${giftText}</p>
        </div>

        <hr class="ritual-divider"/>

        <!-- Sacred Matrix -->
        <div id="ins-matrix" style="opacity:0;padding:16px 0">
          <p style="
            font-family:'Vazirmatn',sans-serif;
            font-size:11px;letter-spacing:0.15em;
            color:var(--gold-dim);margin-bottom:12px;font-weight:300
          ">ماتریس مقدس</p>
          ${Object.entries({
            'عدد سرنوشت':    matrix.destinyNum,
            'برج':           matrix.zodiac,
            'عنصر':          matrix.element,
            'سیاره حاکم':    matrix.planet,
            'سه‌گانه تاروت': matrix.tarotTriple,
            'تاریخ شمسی':    matrix.shamsiDate,
            'امضای جلسه':    matrix.sessionId,
          }).map(([label, val]) => `
            <div style="
              display:flex;justify-content:space-between;align-items:center;
              padding:8px 0;border-bottom:0.5px solid var(--border-faint);gap:8px;
            ">
              <span style="
                font-family:'Vazirmatn',sans-serif;
                font-size:12px;color:var(--ink-ghost);
                flex-shrink:0;font-weight:300
              ">${label}</span>
              <span style="
                font-family:'Vazirmatn',sans-serif;
                font-size:12px;color:var(--ink-primary);
                direction:ltr;text-align:right;word-break:break-all;
                font-weight:400
              ">${val}</span>
            </div>
          `).join('')}
        </div>

      </div><!-- end #inscription-content -->

      <!-- Action buttons -->
      <div id="ins-actions" style="
        opacity:0;display:flex;gap:12px;
        justify-content:center;flex-wrap:wrap;
        padding-top:16px
      ">
        <button id="btn-download" style="
          background:none;border:0.5px solid var(--border-mid);
          font-family:'Vazirmatn',sans-serif;
          font-size:12px;letter-spacing:0.1em;
          color:var(--ink-secondary);cursor:pointer;padding:12px 24px;
          transition:border-color 200ms,color 200ms;
        ">دریافت تصویر</button>

        <button id="btn-share" style="
          background:none;border:0.5px solid var(--border-gold);
          font-family:'Vazirmatn',sans-serif;
          font-size:12px;letter-spacing:0.1em;
          color:var(--gold);cursor:pointer;padding:12px 24px;
          transition:border-color 200ms,color 200ms;
        ">اشتراک‌گذاری</button>
      </div>

    </div>
  `;

  // Sequential reveal
  const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.9 } });
  tl.to('#ins-header',    { opacity: 1 },          '+=0.2')
    .to('#ins-archetype', { opacity: 1 },          '+=0.5')
    .to('#ins-tarot',     { opacity: 1 },          '+=0.4')
    .to('#ins-persona',   { opacity: 1 },          '+=0.4')
    .to('#ins-shadow',    { opacity: 1 },          '+=0.4')
    .to('#ins-gift',      { opacity: 1 },          '+=0.4')
    .to('#ins-matrix',    { opacity: 1 },          '+=0.4')
    .to('#ins-actions',   { opacity: 1, duration: 0.5 }, '+=0.6');

  document.getElementById('btn-download').addEventListener('click', downloadImage);
  document.getElementById('btn-share').addEventListener('click', shareResult);
}

// ── Download — با embed فونت فارسی ──────────────────────────────────────
async function downloadImage() {
  const btn = document.getElementById('btn-download');
  btn.textContent = 'در حال ساخت...';
  btn.style.opacity = '0.5';

  try {
    // فونت Vazirmatn رو به صورت base64 fetch می‌کنیم
    // تا html2canvas بتونه متن فارسی رو درست رندر کنه
    await loadFontForCanvas();

    const contentEl = document.getElementById('inscription-content');

    const canvas = await html2canvas(contentEl, {
      backgroundColor: '#05040a',
      scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: false,
      // width و height صریح برای جلوگیری از clipping
      width:  contentEl.scrollWidth,
      height: contentEl.scrollHeight,
      windowWidth:  contentEl.scrollWidth,
      windowHeight: contentEl.scrollHeight,
      onclone: (doc) => {
        // در clone، direction و font-family رو مجدد تنظیم می‌کنیم
        const clonedContent = doc.getElementById('inscription-content');
        if (clonedContent) {
          clonedContent.style.direction   = 'rtl';
          clonedContent.style.fontFamily  = 'Vazirmatn, sans-serif';
          clonedContent.style.width       = contentEl.scrollWidth + 'px';
          clonedContent.style.padding     = '48px 24px';
          clonedContent.style.background  = '#05040a';
        }
        // همه المان‌های فارسی رو visible می‌کنیم
        doc.querySelectorAll('[style*="opacity:0"]').forEach(el => {
          el.style.opacity = '1';
        });
      },
    });

    const link    = document.createElement('a');
    link.download = `falname-${state.session.id || 'export'}.png`;
    link.href     = canvas.toDataURL('image/png');
    link.click();

  } catch (err) {
    console.error('[Download] خطا:', err);
    btn.textContent = 'خطا در ساخت تصویر';
  } finally {
    btn.textContent = 'دریافت تصویر';
    btn.style.opacity = '1';
  }
}

// فونت Vazirmatn رو در document.fonts لود می‌کنیم
// تا html2canvas بتونه ازش استفاده کنه
async function loadFontForCanvas() {
  if (document.fonts && document.fonts.check('16px Vazirmatn')) return;

  try {
    // اگر font API در دسترسه، منتظر لود کامل می‌مونیم
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  } catch (e) {
    // اگر font API نبود، 500ms صبر می‌کنیم
    await new Promise(r => setTimeout(r, 500));
  }
}

// ── Share ────────────────────────────────────────────────────────────────
async function shareResult() {
  const encoded = encodeShareState(state);
  const url     = `${window.location.origin}${window.location.pathname}?s=${encoded}`;

  const btn = document.getElementById('btn-share');

  if (navigator.share) {
    try {
      await navigator.share({
        title: `فال‌نامه — ${state.inscription.archetypeName.fa}`,
        text:  `فال‌نامه من: ${state.inscription.archetypeName.fa} | ${state.inscription.archetypeName.en}`,
        url,
      });
    } catch (e) {
      // کاربر share رو کنسل کرد
    }
  } else {
    try {
      await navigator.clipboard.writeText(url);
      btn.textContent = 'لینک کپی شد ✓';
      setTimeout(() => { btn.textContent = 'اشتراک‌گذاری'; }, 2000);
    } catch (e) {
      btn.textContent = 'کپی نشد';
      setTimeout(() => { btn.textContent = 'اشتراک‌گذاری'; }, 2000);
    }
  }
}
