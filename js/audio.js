/* ============================================================
   audio.js — procedural Web Audio: ambient ocean loop, TTS
   gibberish voices, season music, foley.
   No external audio files needed.
   ============================================================ */

const Audio = {
  ctx: null,
  master: null, musicGain: null, sfxGain: null, voiceGain: null,
  musicVolume: 0.35,
  sfxVolume: 0.6,
  voiceVolume: 0.7,
  enabled: false,
  ambientNode: null,
  musicLoop: null,

  init() {
    if (Audio.ctx) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      Audio.ctx = new Ctx();
      Audio.master    = Audio.ctx.createGain();
      Audio.musicGain = Audio.ctx.createGain();
      Audio.sfxGain   = Audio.ctx.createGain();
      Audio.voiceGain = Audio.ctx.createGain();
      Audio.musicGain.gain.value = Audio.musicVolume;
      Audio.sfxGain.gain.value   = Audio.sfxVolume;
      Audio.voiceGain.gain.value = Audio.voiceVolume;
      Audio.musicGain.connect(Audio.master);
      Audio.sfxGain.connect(Audio.master);
      Audio.voiceGain.connect(Audio.master);
      Audio.master.connect(Audio.ctx.destination);
      Audio.master.gain.value = parseFloat(localStorage.getItem('vol_master') ?? '0.8');
      Audio.enabled = true;
    } catch (e) {
      console.warn('Audio init failed:', e);
    }
  },

  // browsers require user-gesture before audio plays. Hook this on first click.
  resume() {
    if (Audio.ctx && Audio.ctx.state === 'suspended') Audio.ctx.resume();
    if (!Audio.ambientNode) Audio.startAmbient();
    if (!Audio.musicLoop)  Audio.startMusic();
  },

  // procedural ocean-ambient: low-pass filtered pink noise + slow gentle waves
  startAmbient() {
    if (!Audio.ctx) return;
    const ctx = Audio.ctx;
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
      b6 = white * 0.115926;
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer; src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 600;
    const swell = ctx.createGain();
    swell.gain.value = 0.5;
    src.connect(lp); lp.connect(swell); swell.connect(Audio.sfxGain);
    src.start();

    // slow LFO on the swell to suggest waves
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.13; // ~7s wave
    lfoGain.gain.value = 0.25;
    lfo.connect(lfoGain); lfoGain.connect(swell.gain);
    lfo.start();

    Audio.ambientNode = src;
  },

  // gentle generative music — slow arpeggio in the season's key
  startMusic() {
    if (!Audio.ctx) return;
    const seasonRoots = [220, 196, 175, 165]; // Spring A3, Summer G3, Autumn F3, Winter E3
    const intervals = [0, 4, 7, 11, 14]; // major-7 + extension
    let step = 0;
    const ctx = Audio.ctx;

    function noteAt(time, freq, dur, vol) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, time);
      g.gain.linearRampToValueAtTime(vol, time + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, time + dur);
      o.connect(g); g.connect(Audio.musicGain);
      o.start(time);
      o.stop(time + dur + 0.05);
    }

    function tick() {
      if (!Audio.enabled) return;
      const root = seasonRoots[gameState ? gameState.seasonIndex : 0];
      const intvl = intervals[step % intervals.length];
      const freq = root * Math.pow(2, intvl/12);
      const t = ctx.currentTime;
      noteAt(t, freq,         1.4, 0.18);
      noteAt(t, freq * 1.5,   1.2, 0.10); // a fifth above, lighter
      // bass drone
      if (step % 4 === 0) noteAt(t, root * 0.5, 3.0, 0.14);
      step++;
    }

    tick();
    Audio.musicLoop = setInterval(tick, 1700);
  },

  // chibi voice — short blip per syllable, pitched per character
  voiceBlip(pitch = 1.0) {
    if (!Audio.ctx || !Audio.enabled) return;
    const ctx = Audio.ctx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = ['sine','square','triangle'][Math.floor(Math.random()*3)];
    const base = 240 + Math.random() * 120;
    o.frequency.value = base * pitch;
    o.frequency.exponentialRampToValueAtTime(base * pitch * 0.85, ctx.currentTime + 0.10);
    g.gain.value = 0;
    g.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.10);
    o.connect(g); g.connect(Audio.voiceGain);
    o.start();
    o.stop(ctx.currentTime + 0.12);
  },

  // generic ui blip — for clicks / toasts / pickups
  ping(freq = 880, vol = 0.16, dur = 0.08) {
    if (!Audio.ctx || !Audio.enabled) return;
    const ctx = Audio.ctx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.value = 0;
    g.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.005);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    o.connect(g); g.connect(Audio.sfxGain);
    o.start();
    o.stop(ctx.currentTime + dur + 0.02);
  },

  heart()  { Audio.ping(1320, 0.18, 0.18); setTimeout(() => Audio.ping(1760, 0.14, 0.18), 100); },
  coin()   { Audio.ping(1480, 0.22, 0.10); setTimeout(() => Audio.ping(1976, 0.18, 0.10), 90); },
  pop()    { Audio.ping(660, 0.14, 0.06); },
  whoosh() {
    if (!Audio.ctx) return;
    const ctx = Audio.ctx;
    const noise = ctx.createBufferSource();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random()*2-1) * (1 - i / d.length);
    noise.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 1200;
    bp.Q.value = 2;
    const g = ctx.createGain();
    g.gain.value = 0.18;
    noise.connect(bp); bp.connect(g); g.connect(Audio.sfxGain);
    noise.start();
  },

  setMaster(v) {
    if (!Audio.master) return;
    Audio.master.gain.value = v;
    localStorage.setItem('vol_master', String(v));
  },
  setMusic(v)  { if (Audio.musicGain) Audio.musicGain.gain.value = v; localStorage.setItem('vol_music', String(v)); },
  setSfx(v)    { if (Audio.sfxGain)   Audio.sfxGain.gain.value   = v; localStorage.setItem('vol_sfx', String(v)); },
  setVoice(v)  { if (Audio.voiceGain) Audio.voiceGain.gain.value = v; localStorage.setItem('vol_voice', String(v)); },
};

// auto-resume on first user interaction (browsers require this)
function _audioFirstGesture() {
  Audio.init();
  Audio.resume();
  document.removeEventListener('pointerdown', _audioFirstGesture);
  document.removeEventListener('keydown', _audioFirstGesture);
}
document.addEventListener('pointerdown', _audioFirstGesture);
document.addEventListener('keydown', _audioFirstGesture);
