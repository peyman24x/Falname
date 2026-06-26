// src/engine/InscriptionEngine.js
import { state }                    from '../state.js';
import { ZODIAC_FA, ELEMENT_FA, PLANET_FA } from './AstrologyEngine.js';
import { computeShadowIntensity }   from './PsychologyEngine.js';

export const ARCHETYPES_36 = {
  // ─── FIRE ────────────────────────────────────────────────────────────
  'fire-1': {
    fa: 'آغازگر ابدی',      en: 'The Eternal Initiator',
    jungRef:   'Extraversion + Intuition dominant (Jung, 1921)',
    darkRef:   'Low Dark Triad — genuine enthusiasm',
    tarotCard: 'The Fool',
    bisBasType:'BAS dominant — novelty-seeking',
  },
  'fire-2': {
    fa: 'آینه شکسته',       en: 'The Fractured Mirror',
    jungRef:   'Narcissistic defense + Sensing (Jung, 1951)',
    darkRef:   'Covert Narcissism (Wink, 1991)',
    tarotCard: 'The High Priestess',
    bisBasType:'BIS dominant — hypervigilant',
  },
  'fire-3': {
    fa: 'آتش‌افروز پنهان',  en: 'The Hidden Igniter',
    jungRef:   'Shadow fire — repressed agency (Jung, 1951)',
    darkRef:   'Subclinical Psychopathy (Hare, 1985)',
    tarotCard: 'The Emperor',
    bisBasType:'BAS extreme — impulsive activation',
  },
  'fire-4': {
    fa: 'معمار سایه',        en: 'The Shadow Architect',
    jungRef:   'Thinking function + Power archetype',
    darkRef:   'Machiavellianism (Paulhus & Williams, 2002)',
    tarotCard: 'The Hierophant',
    bisBasType:'BIS-BAS balanced — strategic',
  },
  'fire-5': {
    fa: 'شاهد خاموش',       en: 'The Silent Witness',
    jungRef:   'Introversion + Intuition — Ni type (Jung, 1921)',
    darkRef:   'Low Dark Triad — contemplative shadow',
    tarotCard: 'The Hermit',
    bisBasType:'BIS dominant — withdrawal pattern',
  },
  'fire-6': {
    fa: 'ترازوی طوفان',     en: 'The Tempest Scale',
    jungRef:   'Feeling function conflict + Justice archetype',
    darkRef:   'Moral disengagement (Bandura, 1999)',
    tarotCard: 'Justice',
    bisBasType:'BAS reactive — conflict-seeking',
  },
  'fire-7': {
    fa: 'چرخنده در تاریکی', en: 'The Dark Revolver',
    jungRef:   'Trickster archetype (Jung, 1954)',
    darkRef:   'Primary Psychopathy (Lilienfeld, 1994)',
    tarotCard: 'The Chariot',
    bisBasType:'BAS extreme — thrill-seeking',
  },
  'fire-8': {
    fa: 'بافنده پرده',       en: 'The Veil Weaver',
    jungRef:   'Anima/Animus split (Jung, 1951)',
    darkRef:   'Fantasy-prone narcissism (Wink, 1991)',
    tarotCard: 'The Moon',
    bisBasType:'BIS dominant — reality-avoidance',
  },
  'fire-9': {
    fa: 'پایان‌دهنده دوره', en: 'The Cycle Ender',
    jungRef:   'Individuation completion (Jung, 1959)',
    darkRef:   'Post-Dark Triad integration',
    tarotCard: 'The World',
    bisBasType:'BIS-BAS integrated — transcendent',
  },
  // ─── WATER ───────────────────────────────────────────────────────────
  'water-1': {
    fa: 'غواص عمق',          en: 'The Deep Diver',
    jungRef:   'Feeling + Introversion dominant',
    darkRef:   'Empathic dark side — codependency',
    tarotCard: 'The High Priestess',
    bisBasType:'BIS dominant — depth-seeking',
  },
  'water-2': {
    fa: 'آینه آب',            en: 'The Water Mirror',
    jungRef:   'Projection mechanism (Jung, 1951)',
    darkRef:   'Vulnerable Narcissism (Miller et al., 2011)',
    tarotCard: 'The Moon',
    bisBasType:'BIS dominant — reflection pattern',
  },
  'water-3': {
    fa: 'ماه پنهان',          en: 'The Hidden Moon',
    jungRef:   'Unconscious feminine (Jung, 1951)',
    darkRef:   'Covert Machiavellianism',
    tarotCard: 'Death',
    bisBasType:'BIS dominant — concealed motivation',
  },
  'water-4': {
    fa: 'ساحل‌پرست',          en: 'The Shore Keeper',
    jungRef:   'Persona rigidity (Jung, 1921)',
    darkRef:   'Low Dark Triad — boundary fear',
    tarotCard: 'The Hermit',
    bisBasType:'BIS dominant — safety-seeking',
  },
  'water-5': {
    fa: 'امواج درونی',        en: 'The Inner Tides',
    jungRef:   'Emotional complex (Jung, 1934)',
    darkRef:   'Mood-based manipulation',
    tarotCard: 'The Hanged Man',
    bisBasType:'BIS reactive — emotional flooding',
  },
  'water-6': {
    fa: 'اشک سنگ',            en: 'The Stone Tear',
    jungRef:   'Stoic persona over feeling function',
    darkRef:   'Alexithymia + Psychopathy overlap (Larsen et al., 2006)',
    tarotCard: 'The Tower',
    bisBasType:'BIS-BAS conflict — suppression',
  },
  'water-7': {
    fa: 'ماهی سیاه',          en: 'The Black Fish',
    jungRef:   'Shadow integration needed (Jung, 1951)',
    darkRef:   'Antisocial traits — fluid boundaries',
    tarotCard: 'The Devil',
    bisBasType:'BAS dominant — boundary transgression',
  },
  'water-8': {
    fa: 'طوفان بی‌نام',       en: 'The Nameless Storm',
    jungRef:   'Autonomous complex (Jung, 1934)',
    darkRef:   'Emotional Psychopathy (Hare, 1985)',
    tarotCard: 'Judgement',
    bisBasType:'BAS extreme — emotional dysregulation',
  },
  'water-9': {
    fa: 'دریای آرام',         en: 'The Calm Sea',
    jungRef:   'Individuation — feeling integration',
    darkRef:   'Post-integration — transcended shadows',
    tarotCard: 'The Star',
    bisBasType:'BIS-BAS integrated',
  },
  // ─── EARTH ───────────────────────────────────────────────────────────
  'earth-1': {
    fa: 'بذرافشان',           en: 'The Seed Sower',
    jungRef:   'Sensing function dominant — concrete',
    darkRef:   'Low Dark Triad — grounded personality',
    tarotCard: 'The Empress',
    bisBasType:'BIS moderate — resource-focused',
  },
  'earth-2': {
    fa: 'خاک ساکت',           en: 'The Silent Soil',
    jungRef:   'Introverted Sensing (Si) dominant',
    darkRef:   'Passive Narcissism — quiet entitlement',
    tarotCard: 'The Hierophant',
    bisBasType:'BIS dominant — tradition-bound',
  },
  'earth-3': {
    fa: 'معدن‌چی سایه',       en: 'The Shadow Miner',
    jungRef:   'Senex archetype (von Franz, 1970)',
    darkRef:   'Exploitative Machiavellianism',
    tarotCard: 'The Devil',
    bisBasType:'BAS moderate — resource exploitation',
  },
  'earth-4': {
    fa: 'قلعه‌ساز',           en: 'The Fortress Builder',
    jungRef:   'Father archetype + Thinking',
    darkRef:   'Control Narcissism (Campbell, 2001)',
    tarotCard: 'The Emperor',
    bisBasType:'BIS dominant — control-seeking',
  },
  'earth-5': {
    fa: 'ریشه‌های تاریک',     en: 'The Dark Roots',
    jungRef:   'Chthonic shadow (Jung, 1951)',
    darkRef:   'Everyday Sadism (Buckels et al., 2013)',
    tarotCard: 'The Hermit',
    bisBasType:'BIS extreme — withdrawn aggression',
  },
  'earth-6': {
    fa: 'نگهبان خزانه',       en: 'The Treasury Keeper',
    jungRef:   'Miser archetype — hoarding complex',
    darkRef:   'Machiavellianism + materialism',
    tarotCard: 'The Wheel of Fortune',
    bisBasType:'BIS-BAS balanced — strategic hoard',
  },
  'earth-7': {
    fa: 'سنگ جادو',           en: 'The Philosopher\'s Stone',
    jungRef:   'Self archetype emerging (Jung, 1959)',
    darkRef:   'Integrated shadow — alchemical',
    tarotCard: 'Strength',
    bisBasType:'BAS moderate — transformative',
  },
  'earth-8': {
    fa: 'لرزش زمین',          en: 'The Earth Tremor',
    jungRef:   'Destructive mother (Neumann, 1963)',
    darkRef:   'Covert Psychopathy — slow destruction',
    tarotCard: 'The Tower',
    bisBasType:'BAS reactive — delayed explosion',
  },
  'earth-9': {
    fa: 'باغبان ابدی',        en: 'The Eternal Gardener',
    jungRef:   'Individuation — earth integration',
    darkRef:   'Post-shadow transcendence',
    tarotCard: 'The World',
    bisBasType:'BIS-BAS integrated',
  },
  // ─── AIR ─────────────────────────────────────────────────────────────
  'air-1': {
    fa: 'بادبان اول',         en: 'The First Sail',
    jungRef:   'Thinking + Intuition — NT dominant',
    darkRef:   'Low Dark Triad — analytical idealism',
    tarotCard: 'The Magician',
    bisBasType:'BAS dominant — idea activation',
  },
  'air-2': {
    fa: 'کلمات بریده',        en: 'The Severed Words',
    jungRef:   'Thinking cut from feeling (Jung, 1921)',
    darkRef:   'Cognitive Empathy Deficit (Baron-Cohen, 2011)',
    tarotCard: 'Justice',
    bisBasType:'BIS moderate — analytical distance',
  },
  'air-3': {
    fa: 'مهندس سرد',          en: 'The Cold Engineer',
    jungRef:   'Extraverted Thinking (Te) — systemic',
    darkRef:   'Machiavellianism + low affective empathy',
    tarotCard: 'The Emperor',
    bisBasType:'BAS dominant — efficiency-seeking',
  },
  'air-4': {
    fa: 'فیلسوف طوفان',       en: 'The Storm Philosopher',
    jungRef:   'Introverted Thinking (Ti) — deep analysis',
    darkRef:   'Narcissistic intellectualism',
    tarotCard: 'The Hermit',
    bisBasType:'BIS dominant — intellectual isolation',
  },
  'air-5': {
    fa: 'پرنده شب',           en: 'The Night Bird',
    jungRef:   'Intuition in shadow — flying above reality',
    darkRef:   'Fantasy-prone personality (Wilson & Barber, 1983)',
    tarotCard: 'The Moon',
    bisBasType:'BAS reactive — escape pattern',
  },
  'air-6': {
    fa: 'آینه بی‌رنگ',        en: 'The Colorless Mirror',
    jungRef:   'Persona without self (Jung, 1921)',
    darkRef:   'Chameleon narcissism — identity diffusion',
    tarotCard: 'The Lovers',
    bisBasType:'BIS dominant — identity avoidance',
  },
  'air-7': {
    fa: 'طرح‌ریز پنهان',      en: 'The Hidden Planner',
    jungRef:   'Shadow thinking — covert strategy',
    darkRef:   'Dark Tetrad — sadistic planning (Paulhus, 2014)',
    tarotCard: 'The Chariot',
    bisBasType:'BAS extreme — strategic dominance',
  },
  'air-8': {
    fa: 'زبان برنده',         en: 'The Cutting Tongue',
    jungRef:   'Wounded sensation type (Jung, 1921)',
    darkRef:   'Verbal Aggression + Narcissism',
    tarotCard: 'The Tower',
    bisBasType:'BAS reactive — verbal discharge',
  },
  'air-9': {
    fa: 'بادِ رها',           en: 'The Free Wind',
    jungRef:   'Individuation — thinking liberation',
    darkRef:   'Transcended intellectual shadow',
    tarotCard: 'The Star',
    bisBasType:'BIS-BAS integrated — liberated mind',
  },
};

export const SHADOW_TEXTS = {
  1: 'سایه شما هنوز در پرده است. آنچه سرکوب می‌کنید نامی ندارد — اما وزن دارد.',
  2: 'لایه‌ای از شیشه میان شما و آنچه واقعاً هستید. شفاف، اما جداکننده.',
  3: 'پرده‌ای آشنا. کسانی که دوست دارید، گاهی نقش آینه می‌پوشند.',
  4: 'زره عقلانی. احساسات به شکل تحلیل بیرون می‌آیند، نه احساس.',
  5: 'مُهر محکم. رنج‌ها درون دژ مانده‌اند — و دژ شما را ساخته است.',
  6: 'تاریکی دفن‌شده. کنترل نامرئی‌تر از آن است که تصور می‌کنید.',
  7: 'بند محکم. آزادی واقعی شبیه‌ترین چیز به خطر است در ذهن شما.',
  8: 'زنجیر درونی. آنچه دیگران «قدرت» می‌نامند، شما «بقا» می‌شناسید.',
  9: 'سایه با شما یکی شده. نه دشمن — شریک پنهانی است که منتظر شناخته شدن است.',
};

export const PERSONA_TEXTS = {
  fire:  'نقاب شما: شور و حضور. پشت آن، خستگی از همیشه روشن بودن.',
  water: 'نقاب شما: ملایمت و درک. پشت آن، مرزهایی که هرگز نگفتید.',
  air:   'نقاب شما: منطق و فاصله. پشت آن، احساسی که مکانی برای بودن ندارد.',
};

export const GIFT_TEXTS = {
  intuiting: 'هدیه پنهان شما: دیدن آنچه هنوز نیامده. نه پیش‌گویی — آفرینش.',
  feeling:   'هدیه پنهان شما: پیوند عمیق. نه وابستگی — ظرفیت حقیقی برای دیدن دیگری.',
  thinking:  'هدیه پنهان شما: وضوح در آشوب. نه سردی — شفافیت که ابزار رهایی است.',
  sensing:   'هدیه پنهان شما: حضور کامل. نه محدودیت — عمق در همین لحظه.',
};

// ── Main build function — SYNC, fully defensive ───────────────────────────
export function buildInscription() {
  const { birth, mirror, tarot, session } = state;

  // --- Defensive defaults برای هر مقداری که ممکنه null باشه ---
  const element    = birth.element    || 'air';
  const destinyNum = birth.destinyNum || 1;
  const vertex     = mirror.vertex    || element;   // fallback به element کاربر
  const jungFn     = mirror.jungFunction || 'sensing';
  const bisBasScore   = mirror.bisBasScore   ?? 0;
  const darkTriadHint = mirror.darkTriadHint ?? 0.3;

  // 1. Select archetype — با دو سطح fallback
  const key       = `${element}-${destinyNum}`;
  const archetype = ARCHETYPES_36[key]
                 || ARCHETYPES_36[`${element}-9`]
                 || ARCHETYPES_36['air-1'];  // آخرین fallback

  // 2. Shadow intensity
  const shadowIntensity = computeShadowIntensity(destinyNum, bisBasScore, darkTriadHint);
  const clampedShadow   = Math.max(1, Math.min(9, shadowIntensity));

  // 3. Tarot triple
  const card1 = tarot.selected[0]?.card || null;
  const card2 = tarot.selected[1]?.card || null;
  const card3 = tarot.selected[2]?.card || null;

  // 4. Sacred matrix
  const matrix = {
    destinyNum:   destinyNum,
    element:      ELEMENT_FA[element]         || element,
    planet:       PLANET_FA[birth.planet]     || '—',
    zodiac:       ZODIAC_FA[birth.zodiac]     || '—',
    tarotTriple:  `${card1?.fa || '—'} · ${card2?.fa || '—'} · ${card3?.fa || '—'}`,
    sessionId:    session.id                  || '—',
    shamsiDate:   `${birth.shamsiYear || '—'}/${birth.shamsiMonth || '—'}/${birth.shamsiDay || '—'}`,
  };

  // 5. Set state
  state.inscription = {
    archetypeKey:  key,
    archetypeName: { fa: archetype.fa, en: archetype.en },
    archetypeRef:  archetype.jungRef || '',
    personaText:   PERSONA_TEXTS[vertex]  || PERSONA_TEXTS.air,
    shadowText:    SHADOW_TEXTS[clampedShadow] || SHADOW_TEXTS[5],
    giftText:      GIFT_TEXTS[jungFn]     || GIFT_TEXTS.sensing,
    tarotTriple: {
      persona: card1,
      shadow:  card2,
      gift:    card3,
    },
    matrix,
  };
}
