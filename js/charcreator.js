/* charcreator.js — character creator. Opens before game starts.
   Builds a chibi with skin/hair/style/outfit/accessory + name + archetype. */
const CharCreator = {
  current: null,    // built look
  name: 'Keeper',

  options: {
    skin:    ['#fbe0c8','#f8d2b0','#e8c0a0','#d8a888','#c89878','#a87858','#7a5040','#fdd8b8','#f0c8a0'],
    hair:    ['#3a2a4a','#88c068','#ffb0c8','#a888c8','#c08060','#5a3a2a','#88c8e8','#ffd870','#3a1a1a','#e8e0a0','#ffffff'],
    style:   ['short','long','puff','bun','spiky'],
    outfit:  ['#f5a3a3','#5894c0','#f5b0d0','#b0c0e0','#a0e090','#ffd870','#dcc8f0','#7848a8','#4a7048','#5a3a4a','#5a4a8a','#e85088','#3a2a4a'],
    accessory: ['none','glasses','hat'],
    mood:    ['happy','neutral','sad'],
  },

  init() {
    CharCreator.current = {
      skin:'#fbe0c8', hair:'#88c8e8', hairStyle:'short',
      hairBack: false,
      outfit:'#5894c0', legs:'#3a3a4a', mood:'happy',
      accessory:'none', hatColor:'#5a3a4a', bgTint:'#b8d8ff',
      facePaint:'none',
    };
  },

  open() {
    if (!CharCreator.current) CharCreator.init();
    document.getElementById('char-screen').classList.add('visible');
    document.querySelectorAll('.screen').forEach(s => { if (s.id !== 'char-screen') s.classList.remove('visible'); });
    CharCreator.render();
  },

  render() {
    // preview
    const canvasPrev = document.getElementById('cc-preview');
    const ctx = canvasPrev.getContext('2d');
    ctx.clearRect(0,0,canvasPrev.width,canvasPrev.height);
    ctx.save();
    ctx.translate(canvasPrev.width/2, canvasPrev.height - 30);
    ctx.scale(2.0, 2.0);
    Sprites.drawChibi(ctx, 0, 0, CharCreator.current, performance.now(), false);
    ctx.restore();

    // swatches
    CharCreator._renderSwatch('cc-skin', CharCreator.options.skin, v => CharCreator.current.skin = v, CharCreator.current.skin);
    CharCreator._renderSwatch('cc-hair', CharCreator.options.hair, v => CharCreator.current.hair = v, CharCreator.current.hair);
    CharCreator._renderSwatch('cc-outfit', CharCreator.options.outfit, v => CharCreator.current.outfit = v, CharCreator.current.outfit);
    CharCreator._renderChoice('cc-style', CharCreator.options.style, v => CharCreator.current.hairStyle = v, CharCreator.current.hairStyle);
    CharCreator._renderChoice('cc-accessory', CharCreator.options.accessory, v => CharCreator.current.accessory = v, CharCreator.current.accessory);
    CharCreator._renderChoice('cc-mood', CharCreator.options.mood, v => CharCreator.current.mood = v, CharCreator.current.mood);
  },

  _renderSwatch(id, opts, onPick, current) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = '';
    for (const c of opts) {
      const b = document.createElement('button');
      b.className = 'cc-sw';
      b.style.background = c;
      if (c === current) b.classList.add('selected');
      b.addEventListener('click', () => { onPick(c); CharCreator.render(); });
      el.appendChild(b);
    }
  },
  _renderChoice(id, opts, onPick, current) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = '';
    for (const c of opts) {
      const b = document.createElement('button');
      b.className = 'cc-choice';
      if (c === current) b.classList.add('selected');
      b.textContent = c;
      b.addEventListener('click', () => { onPick(c); CharCreator.render(); });
      el.appendChild(b);
    }
  },

  // returns the built look + name to game.js
  finalize() {
    const v = document.getElementById('cc-name').value.trim() || 'Keeper';
    return { name: v, look: CharCreator.current };
  },

  randomize() {
    const opts = CharCreator.options;
    CharCreator.current = {
      skin: opts.skin[Math.floor(Math.random()*opts.skin.length)],
      hair: opts.hair[Math.floor(Math.random()*opts.hair.length)],
      hairStyle: opts.style[Math.floor(Math.random()*opts.style.length)],
      hairBack: Math.random() < 0.4,
      outfit: opts.outfit[Math.floor(Math.random()*opts.outfit.length)],
      legs: '#3a3a3a', mood: opts.mood[Math.floor(Math.random()*opts.mood.length)],
      accessory: opts.accessory[Math.floor(Math.random()*opts.accessory.length)],
      hatColor: '#5a3a4a', bgTint:'#dcc8f0',
      facePaint: 'none',
    };
    CharCreator.render();
  }
};
