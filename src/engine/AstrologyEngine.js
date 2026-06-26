// src/engine/AstrologyEngine.js
import jalaali from 'jalaali-js';

// ── Zodiac by Shamsi month ────────────────────────────────────────────────
const SHAMSI_ZODIAC = [
  { sign: 'aries'       },  // ماه ۱
  { sign: 'taurus'      },  // ماه ۲
  { sign: 'gemini'      },  // ماه ۳
  { sign: 'cancer'      },  // ماه ۴
  { sign: 'leo'         },  // ماه ۵
  { sign: 'virgo'       },  // ماه ۶
  { sign: 'libra'       },  // ماه ۷
  { sign: 'scorpio'     },  // ماه ۸
  { sign: 'sagittarius' },  // ماه ۹
  { sign: 'capricorn'   },  // ماه ۱۰
  { sign: 'aquarius'    },  // ماه ۱۱
  { sign: 'pisces'      },  // ماه ۱۲
];

// Element mapping
const ZODIAC_ELEMENT = {
  aries: 'fire', leo: 'fire', sagittarius: 'fire',
  taurus: 'earth', virgo: 'earth', capricorn: 'earth',
  gemini: 'air', libra: 'air', aquarius: 'air',
  cancer: 'water', scorpio: 'water', pisces: 'water',
};

// Ruling planet
const ZODIAC_PLANET = {
  aries: 'mars', taurus: 'venus', gemini: 'mercury',
  cancer: 'moon', leo: 'sun', virgo: 'mercury',
  libra: 'venus', scorpio: 'pluto', sagittarius: 'jupiter',
  capricorn: 'saturn', aquarius: 'uranus', pisces: 'neptune',
};

// Planet Persian names
export const PLANET_FA = {
  mars: 'مریخ', venus: 'زهره', mercury: 'عطارد',
  moon: 'ماه', sun: 'خورشید', pluto: 'پلوتون',
  jupiter: 'مشتری', saturn: 'زحل', uranus: 'اورانوس', neptune: 'نپتون',
};

// Zodiac Persian names
export const ZODIAC_FA = {
  aries: 'حمل', taurus: 'ثور', gemini: 'جوزا',
  cancer: 'سرطان', leo: 'اسد', virgo: 'سنبله',
  libra: 'میزان', scorpio: 'عقرب', sagittarius: 'قوس',
  capricorn: 'جدی', aquarius: 'دلو', pisces: 'حوت',
};

// Element Persian names
export const ELEMENT_FA = {
  fire: 'آتش', water: 'آب', earth: 'خاک', air: 'هوا',
};

// ── Pythagorean Numerology ────────────────────────────────────────────────
export function computeDestinyNumber(jy, jm, jd) {
  const digits = `${jy}${String(jm).padStart(2, '0')}${String(jd).padStart(2, '0')}`;
  let sum = digits.split('').reduce((a, b) => a + parseInt(b, 10), 0);
  while (sum > 9) {
    sum = sum.toString().split('').reduce((a, b) => a + parseInt(b, 10), 0);
  }
  return sum === 0 ? 9 : sum;
}

// ── Main computation ──────────────────────────────────────────────────────
export function computeAstrology(jy, jm, jd) {
  // Force integers — inputs from HTML are often strings
  const year  = parseInt(jy, 10);
  const month = parseInt(jm, 10);
  const day   = parseInt(jd, 10);

  const idx = month - 1; // 0-based index into SHAMSI_ZODIAC
  if (idx < 0 || idx > 11 || !SHAMSI_ZODIAC[idx]) {
    throw new Error(`ماه نامعتبر: ${month}`);
  }

  const zodiac     = SHAMSI_ZODIAC[idx].sign;
  const element    = ZODIAC_ELEMENT[zodiac];
  const planet     = ZODIAC_PLANET[zodiac];
  const destinyNum = computeDestinyNumber(year, month, day);

  return { zodiac, element, planet, destinyNum };
}

// ── Validate Shamsi date ──────────────────────────────────────────────────
export function validateShamsiDate(jy, jm, jd) {
  const year  = parseInt(jy, 10);
  const month = parseInt(jm, 10);
  const day   = parseInt(jd, 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1) return false;

  // ماه‌های ۱ تا ۶ = ۳۱ روز، ۷ تا ۱۱ = ۳۰ روز، ۱۲ = ۲۹ روز (۳۰ در سال کبیسه)
  let maxDay;
  if (month <= 6)       maxDay = 31;
  else if (month <= 11) maxDay = 30;
  else                  maxDay = jalaali.isLeapJalaaliYear(year) ? 30 : 29;

  if (day > maxDay) return false;
  if (year < 1300 || year > 1420) return false;
  return true;
}

// ── Convert Shamsi to Gregorian (for display only) ───────────────────────
export function shamsiToGregorian(jy, jm, jd) {
  return jalaali.toGregorian(
    parseInt(jy, 10),
    parseInt(jm, 10),
    parseInt(jd, 10)
  );
}
