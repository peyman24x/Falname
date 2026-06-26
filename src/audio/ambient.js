// src/audio/ambient.js
import * as Tone from 'tone';

/**
 * FIX: Tone.js Transport را هنگام import مقداردهی اولیه می‌کند
 * که قبل از user gesture باعث AudioContext warning می‌شود.
 * راه‌حل: همه اشیاء Tone فقط داخل init() ساخته می‌شوند،
 * و init() فقط بعد از Tone.start() (که نیاز به user gesture دارد) صدا زده می‌شود.
 */
export const Audio = {
  _initialized:  false,
  _droneStarted: false,
  drone:  null,
  pad:    null,
  bell:   null,

  async init() {
    if (this._initialized) return;

    // Tone.start() باید قبل از ساخت هر node صدا زده شده باشه
    // (در Phase0_Gate.js قبل از Audio.init() صدا زده می‌شه)
    this._initialized = true;

    try {
      this.drone = new Tone.Oscillator({ type: 'sine', frequency: 55 })
        .connect(new Tone.Volume(-28).toDestination());

      this.pad = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 4, decay: 2, sustain: 0.8, release: 6 },
      }).connect(new Tone.Volume(-22).toDestination());

      this.bell = new Tone.MetalSynth({
        frequency:   200,
        harmonicity: 5.1,
        envelope: { attack: 0.001, decay: 8, release: 4 },
      }).connect(new Tone.Volume(-24).toDestination());
    } catch (err) {
      console.warn('[Audio] init failed:', err);
      this._initialized = false;
    }
  },

  onPhaseEnter(phase) {
    if (!this._initialized || !this.drone || !this.pad || !this.bell) return;

    const configs = {
      0: { freq: 55,   chord: ['C2', 'G2'],       bellFreq: 110 },
      1: { freq: 73.4, chord: ['D2', 'A2', 'F3'], bellFreq: 146 },
      2: { freq: 65.4, chord: ['E2', 'B2', 'G3'], bellFreq: 196 },
      3: { freq: 82.4, chord: ['F2', 'C3', 'A3'], bellFreq: 220 },
    };
    const cfg = configs[phase] || configs[0];

    try {
      if (!this._droneStarted) {
        this.drone.start();
        this._droneStarted = true;
      }
      this.drone.frequency.rampTo(cfg.freq, 4);
      this.pad.triggerAttackRelease(cfg.chord, 12);
      this.bell.frequency.value = cfg.bellFreq;
      this.bell.triggerAttack();
    } catch (err) {
      console.warn('[Audio] onPhaseEnter error:', err);
    }
  },

  onCardReveal() {
    if (!this._initialized || !this.bell) return;

    // فرکانس‌های عددی — MetalSynth با note string کار نمی‌کند
    const freqs = [220, 261.6, 329.6, 392, 493.9];
    const freq  = freqs[Math.floor(Math.random() * freqs.length)];

    try {
      this.bell.frequency.value = freq;
      this.bell.triggerAttack();
    } catch (err) {
      console.warn('[Audio] onCardReveal error:', err);
    }
  },
};
