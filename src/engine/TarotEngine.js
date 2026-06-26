// src/engine/TarotEngine.js
import { seededShuffle } from './Hash.js';

/**
 * REFERENCE: Nichols, S. "Jung and Tarot: An Archetypal Journey" (1980)
 * Each Major Arcana maps to a Jungian archetype.
 * Zodiac weights: each sign has affinity with certain cards.
 */

export const MAJOR_ARCANA = [
  {
    id: 0,  name: 'The Fool',         fa: 'دیوانه',         fa_role: 'آغازگر',
    jungArchetype: 'innocent',         element: 'air',
    shadowAspect:  'بی‌مسئولیتی پنهان',
    personaAspect: 'آزادی بی‌قید',
    giftAspect:    'شجاعت آغاز',
  },
  {
    id: 1,  name: 'The Magician',     fa: 'جادوگر',         fa_role: 'سازنده',
    jungArchetype: 'magician',         element: 'fire',
    shadowAspect:  'دستکاری نیروها برای کنترل',
    personaAspect: 'قدرت اراده',
    giftAspect:    'تبدیل اراده به واقعیت',
  },
  {
    id: 2,  name: 'The High Priestess', fa: 'کاهنه',        fa_role: 'نگهبان رازها',
    jungArchetype: 'anima',            element: 'water',
    shadowAspect:  'رازپنهانی تخریب‌گر',
    personaAspect: 'دانش درونی',
    giftAspect:    'شهود ناب',
  },
  {
    id: 3,  name: 'The Empress',      fa: 'ملکه',            fa_role: 'مادر',
    jungArchetype: 'great_mother',     element: 'earth',
    shadowAspect:  'وابستگی‌آفرینی',
    personaAspect: 'فراوانی و محبت',
    giftAspect:    'آفرینش زندگی',
  },
  {
    id: 4,  name: 'The Emperor',      fa: 'امپراتور',        fa_role: 'حاکم',
    jungArchetype: 'father',           element: 'fire',
    shadowAspect:  'کنترل‌گری سرد',
    personaAspect: 'نظم و قدرت',
    giftAspect:    'رهبری با اقتدار',
  },
  {
    id: 5,  name: 'The Hierophant',   fa: 'رهبر روحانی',    fa_role: 'معلم',
    jungArchetype: 'wise_old_man',     element: 'earth',
    shadowAspect:  'دگماتیسم پنهان',
    personaAspect: 'سنت و خرد',
    giftAspect:    'انتقال معرفت',
  },
  {
    id: 6,  name: 'The Lovers',       fa: 'عاشقان',          fa_role: 'انتخابگر',
    jungArchetype: 'anima_animus',     element: 'air',
    shadowAspect:  'وابستگی به تأیید دیگری',
    personaAspect: 'پیوند و انتخاب',
    giftAspect:    'یکپارچگی درون',
  },
  {
    id: 7,  name: 'The Chariot',      fa: 'ارابه',           fa_role: 'فاتح',
    jungArchetype: 'hero',             element: 'water',
    shadowAspect:  'کنترل بیش از حد احساسات',
    personaAspect: 'اراده آهنین',
    giftAspect:    'پیروزی از درون',
  },
  {
    id: 8,  name: 'Strength',         fa: 'قدرت',            fa_role: 'رام‌کننده',
    jungArchetype: 'self',             element: 'fire',
    shadowAspect:  'سرکوب غریزه',
    personaAspect: 'آرامش در طوفان',
    giftAspect:    'قدرت ملایم',
  },
  {
    id: 9,  name: 'The Hermit',       fa: 'زاهد',            fa_role: 'جستجوگر',
    jungArchetype: 'wise_old_man',     element: 'earth',
    shadowAspect:  'انزوای ترس‌محور',
    personaAspect: 'خردمندی درونی',
    giftAspect:    'نور در تاریکی',
  },
  {
    id: 10, name: 'Wheel of Fortune', fa: 'چرخ سرنوشت',    fa_role: 'گرداننده',
    jungArchetype: 'trickster',        element: 'fire',
    shadowAspect:  'قمار با سرنوشت دیگران',
    personaAspect: 'سیکل تغییر',
    giftAspect:    'اعتماد به جریان زندگی',
  },
  {
    id: 11, name: 'Justice',          fa: 'عدالت',           fa_role: 'سنجنده',
    jungArchetype: 'self',             element: 'air',
    shadowAspect:  'قضاوت بی‌رحمانه خود',
    personaAspect: 'حقیقت و توازن',
    giftAspect:    'دیدن بدون قضاوت',
  },
  {
    id: 12, name: 'The Hanged Man',   fa: 'معلق',            fa_role: 'منتظر',
    jungArchetype: 'shadow',           element: 'water',
    shadowAspect:  'قربانی‌بودن داوطلبانه',
    personaAspect: 'تسلیم آگاهانه',
    giftAspect:    'دیدن از زاویه‌ای دیگر',
  },
  {
    id: 13, name: 'Death',            fa: 'مرگ',             fa_role: 'تحول‌گر',
    jungArchetype: 'shadow',           element: 'water',
    shadowAspect:  'مقاومت در برابر تغییر',
    personaAspect: 'پایان ضروری',
    giftAspect:    'تولد دوباره',
  },
  {
    id: 14, name: 'Temperance',       fa: 'اعتدال',          fa_role: 'آمیزنده',
    jungArchetype: 'self',             element: 'fire',
    shadowAspect:  'سرکوب افراط‌ها به جای یکپارچگی',
    personaAspect: 'هارمونی و صبر',
    giftAspect:    'کیمیاگری درونی',
  },
  {
    id: 15, name: 'The Devil',        fa: 'شیطان',           fa_role: 'زنجیرکننده',
    jungArchetype: 'shadow',           element: 'earth',
    shadowAspect:  'اعتیاد به قدرت یا لذت',
    personaAspect: 'شناخت زنجیرهای خود',
    giftAspect:    'آزادی از وسوسه',
  },
  {
    id: 16, name: 'The Tower',        fa: 'برج',             fa_role: 'ویرانگر',
    jungArchetype: 'shadow',           element: 'fire',
    shadowAspect:  'تخریب آنچه به آن وابسته‌ای',
    personaAspect: 'فروپاشی ضروری',
    giftAspect:    'ساختن بر پایه درست',
  },
  {
    id: 17, name: 'The Star',         fa: 'ستاره',           fa_role: 'امیددهنده',
    jungArchetype: 'anima',            element: 'air',
    shadowAspect:  'امید دروغین',
    personaAspect: 'الهام و شفا',
    giftAspect:    'هدایت درونی',
  },
  {
    id: 18, name: 'The Moon',         fa: 'ماه',             fa_role: 'فریبنده',
    jungArchetype: 'shadow',           element: 'water',
    shadowAspect:  'توهم و ترس از ناشناخته',
    personaAspect: 'ناخودآگاه عمیق',
    giftAspect:    'پذیرش ابهام',
  },
  {
    id: 19, name: 'The Sun',          fa: 'خورشید',          fa_role: 'روشنگر',
    jungArchetype: 'self',             element: 'fire',
    shadowAspect:  'غرور پنهان',
    personaAspect: 'شادی و وضوح',
    giftAspect:    'اصالت درخشان',
  },
  {
    id: 20, name: 'Judgement',        fa: 'داوری',           fa_role: 'بیدارکننده',
    jungArchetype: 'self',             element: 'fire',
    shadowAspect:  'محاکمه بی‌پایان خود',
    personaAspect: 'بیداری و رستاخیز',
    giftAspect:    'پذیرش گذشته',
  },
  {
    id: 21, name: 'The World',        fa: 'جهان',            fa_role: 'کامل‌شده',
    jungArchetype: 'self',             element: 'earth',
    shadowAspect:  'ترس از کمال',
    personaAspect: 'یکپارچگی کامل',
    giftAspect:    'تکمیل چرخه',
  },
];

// Zodiac affinities — each zodiac has higher probability for certain cards
const ZODIAC_AFFINITIES = {
  aries:       [4, 7, 16, 8, 10],
  taurus:      [3, 5, 15, 21, 9],
  gemini:      [6, 1, 17, 0, 11],
  cancer:      [2, 18, 13, 12, 3],
  leo:         [19, 8, 4, 20, 10],
  virgo:       [9, 5, 11, 14, 3],
  libra:       [11, 6, 14, 17, 21],
  scorpio:     [13, 15, 18, 12, 16],
  sagittarius: [10, 0, 1, 14, 19],
  capricorn:   [15, 5, 9, 21, 3],
  aquarius:    [17, 0, 11, 1, 6],
  pisces:      [18, 12, 2, 13, 20],
};

/**
 * Build weighted deck for this zodiac — SYNC version
 * Affinity cards get 3x weight, others 1x
 * seededShuffle is imported statically from Hash.js
 */
export function buildWeightedDeckSync(zodiac, seed) {
  const affinities = new Set(ZODIAC_AFFINITIES[zodiac] || []);
  const weighted   = [];

  MAJOR_ARCANA.forEach(card => {
    const count = affinities.has(card.id) ? 3 : 1;
    for (let i = 0; i < count; i++) weighted.push(card.id);
  });

  const shuffled = seededShuffle(weighted, seed);
  const seen = new Set();
  const deck  = [];
  for (const id of shuffled) {
    if (!seen.has(id)) { seen.add(id); deck.push(MAJOR_ARCANA[id]); }
    if (deck.length === 7) break;
  }
  return deck;
}
