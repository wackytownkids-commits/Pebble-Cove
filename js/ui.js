const UI = {
  bubbleEl: null, promptEl: null, toastsEl: null,
  sparks: [],
  pendingBaby: null,
  pendingPropose: null,

  init() {
    UI.bubbleEl = document.getElementById('speech-bubble');
    UI.promptEl = document.getElementById('interact-prompt');
    UI.toastsEl = document.getElementById('toasts');
    document.querySelectorAll('#hud-side button').forEach(btn => {
      btn.addEventListener('click', () => UI.openPanel(btn.dataset.panel));
    });
    document.querySelectorAll('.panel-close').forEach(btn => {
      btn.addEventListener('click', () => UI.closeAllPanels());
    });
    document.getElementById('btn-save').addEventListener('click', () => { Save.save(); UI.toast('Saved.'); });
    document.getElementById('btn-load').addEventListener('click', () => { Save.load(); UI.toast('Loaded.'); });
    document.getElementById('btn-title').addEventListener('click', () => location.reload());
    document.getElementById('baby-yes').addEventListener('click', () => UI.confirmBaby(true));
    document.getElementById('baby-no').addEventListener('click', () => UI.confirmBaby(false));
    document.getElementById('propose-yes').addEventListener('click', () => UI.confirmPropose(true));
    document.getElementById('propose-no').addEventListener('click', () => UI.confirmPropose(false));
    const py = document.getElementById('pres-yes');
    const pn = document.getElementById('pres-no');
    if (py) py.addEventListener('click', () => President.approve());
    if (pn) pn.addEventListener('click', () => President.decline());
    const lb = document.getElementById('leave-beg');
    const lg = document.getElementById('leave-go');
    if (lb) lb.addEventListener('click', () => LeaveIsland.beg());
    if (lg) lg.addEventListener('click', () => LeaveIsland.letGo());
    const pc = document.getElementById('pair-confirm');
    if (pc) pc.addEventListener('click', () => Pairing.confirm());
    // volume sliders
    const m = document.getElementById('vol-master');
    const mu = document.getElementById('vol-music');
    const v = document.getElementById('vol-voice');
    const s = document.getElementById('vol-sfx');
    if (m) {
      m.value  = parseFloat(localStorage.getItem('vol_master') ?? '0.8');
      mu.value = parseFloat(localStorage.getItem('vol_music')  ?? '0.35');
      v.value  = parseFloat(localStorage.getItem('vol_voice')  ?? '0.7');
      s.value  = parseFloat(localStorage.getItem('vol_sfx')    ?? '0.6');
      m.addEventListener('input',  e => Audio.setMaster(parseFloat(e.target.value)));
      mu.addEventListener('input', e => Audio.setMusic(parseFloat(e.target.value)));
      v.addEventListener('input',  e => Audio.setVoice(parseFloat(e.target.value)));
      s.addEventListener('input',  e => Audio.setSfx(parseFloat(e.target.value)));
    }
  },

  showInteract(label) {
    UI.promptEl.classList.add('visible');
    document.getElementById('interact-label').textContent = label;
  },
  hideInteract() { UI.promptEl.classList.remove('visible'); },

  speak(speaker, line, x, y) {
    UI.bubbleEl.classList.remove('hidden');
    UI.bubbleEl.querySelector('.speaker').textContent = speaker;
    UI.bubbleEl.querySelector('.line').textContent = line;
    UI.bubbleEl.style.left = x + 'px';
    UI.bubbleEl.style.top  = (y - 30) + 'px';
    clearTimeout(UI._bubbleTimeout);
    UI._bubbleTimeout = setTimeout(() => UI.bubbleEl.classList.add('hidden'), 2800);
    // chibi voice per resident pitch
    if (typeof Audio !== 'undefined') {
      const def = Residents.defs.find(d => d.name === speaker);
      const pitch = def ? (def.look && def.look.hairStyle === 'long' ? 1.2 : (def.archetype === 'gremlin-child' ? 1.5 : (def.archetype === 'fisherman' ? 0.7 : 1.0))) : 1.0;
      const syllables = Math.min(8, Math.max(2, Math.round(line.length / 6)));
      for (let i = 0; i < syllables; i++) {
        setTimeout(() => Audio.voiceBlip(pitch), i * 90);
      }
    }
  },

  toast(text, kind) {
    const div = document.createElement('div');
    div.className = 'toast' + (kind ? (' ' + kind) : '');
    div.textContent = text;
    UI.toastsEl.appendChild(div);
    setTimeout(() => div.classList.add('fade'), 2200);
    setTimeout(() => div.remove(), 2900);
    if (typeof Audio !== 'undefined') {
      if (kind === 'heart') Audio.heart();
      else if (kind === 'coin') Audio.coin();
      else Audio.pop();
    }
  },

  spark(x, y, text, color) {
    UI.sparks.push({ x, y, text, color: color || '#e85088', t: 0 });
  },
  drawSparks(ctx, dt) {
    for (let i = UI.sparks.length - 1; i >= 0; i--) {
      const s = UI.sparks[i];
      s.t += dt;
      if (s.t > 1.4) { UI.sparks.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - s.t);
      ctx.fillStyle = s.color;
      ctx.font = 'bold 18px Fredoka';
      ctx.fillText(s.text, s.x, s.y - s.t * 30);
      ctx.restore();
    }
  },

  displayName(id) {
    if (id === 'player') return gameState.playerName;
    const r = Residents.defs.find(d => d.id === id);
    return r ? r.name : id;
  },

  openPanel(name) {
    UI.closeAllPanels();
    const p = document.getElementById('panel-' + name);
    if (!p) return;
    p.classList.remove('hidden');
    if (name === 'mailbox')       UI.renderMailbox();
    if (name === 'inventory')     UI.renderInventory();
    if (name === 'relationships') UI.renderRelationships();
    if (name === 'cookbook')      UI.renderCookbook();
    if (name === 'map')           UI.renderMap();
    if (name === 'pairing' && typeof Pairing !== 'undefined')  Pairing.render();
    if (name === 'facepaint' && typeof FacePaint !== 'undefined') FacePaint.open();
    if (name === 'dreams' && typeof Dreams !== 'undefined')    Dreams.openJournal();
  },
  closeAllPanels() {
    document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
  },

  renderMailbox() {
    const list = document.getElementById('letter-list');
    const view = document.getElementById('letter-view');
    list.innerHTML = '';
    view.innerHTML = '<em>Pick a letter to read.</em>';
    if (!Letters.todays.length) {
      list.innerHTML = '<p style="padding:8px;color:#7a5a5a;">Mailbox is empty today.</p>';
      return;
    }
    for (const L of Letters.todays) {
      const row = document.createElement('div');
      row.className = 'letter-row' + (L.read ? ' read' : '');
      const fromName = UI.displayName(L.from);
      const preview = L.body.split('\n')[0].slice(0, 60);
      row.innerHTML = `<div class="from">${fromName}</div><div class="preview">${preview}…</div>`;
      row.addEventListener('click', () => UI.openLetter(L));
      list.appendChild(row);
    }
  },

  openLetter(L) {
    L.read = true;
    gameState.unreadMail = Letters.todays.filter(x => !x.read).length;
    UI.renderMailbox();
    const view = document.getElementById('letter-view');
    view.innerHTML = `<div style="white-space:pre-wrap;">${L.body}</div>
      <div class="letter-actions">
        <button data-tone="warm">Reply warmly</button>
        <button class="sassy" data-tone="sassy">Sassy reply</button>
        <button class="formal" data-tone="formal">Formal reply</button>
        <button class="ignore" data-tone="ignore">Ignore</button>
      </div>`;
    view.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => {
        const tone = b.dataset.tone;
        UI.replyTo(L, tone);
      });
    });
  },

  replyTo(L, tone) {
    if (L.replied) return;
    L.replied = true;
    const map = { warm:+8, formal:+5, sassy:+3, ignore:-3 };
    Relationships.nudge(L.from, 'player', map[tone]);
    if (typeof Phases !== 'undefined') {
      if (!Phases.hasMet(L.from, 'player')) Phases.meet(L.from, 'player');
      Phases.bumpAffinity(L.from, 'player', map[tone]);
    }
    if (typeof Arcs !== 'undefined' && L.arcId) Arcs.onReply(L, tone);
    GameState.coins += 1;
    UI.toast(`${tone} reply sent (${map[tone] >= 0 ? '+' : ''}${map[tone]} affinity)`, 'heart');
    UI.openLetter(L);
  },

  renderInventory() {
    const grid = document.getElementById('inv-grid');
    grid.innerHTML = '';
    const items = gameState.inventory;
    const keys = Object.keys(items);
    const icons = {
      polished_pebble:'rock', sea_glass:'glass', driftwood:'wood',
      shell:'shell', bug_jar:'bug', wildflower:'flower',
      herbs:'herb', berries:'berry', dried_seaweed:'kelp',
      cinnamon_bun:'bun', bread:'bread', water:'water',
      pressed_flower:'flower', pebble_paperweight:'paint', wind_chime:'chime'
    };
    if (!keys.length) {
      for (let i=0;i<24;i++) {
        const slot = document.createElement('div');
        slot.className = 'inv-slot';
        grid.appendChild(slot);
      }
      const note = document.createElement('p');
      note.style.cssText = 'padding:12px;color:#7a5a5a;';
      note.textContent = 'Pouch is empty. Forage at the beach!';
      grid.appendChild(note);
      return;
    }
    for (const k of keys) {
      const slot = document.createElement('div');
      slot.className = 'inv-slot';
      slot.innerHTML = `<span style="font-size:14px">${icons[k] || k}</span><span class="qty">${items[k]}</span>`;
      grid.appendChild(slot);
    }
    while (grid.children.length < 24) {
      const slot = document.createElement('div');
      slot.className = 'inv-slot';
      grid.appendChild(slot);
    }
  },

  renderRelationships() {
    const list = document.getElementById('rel-list');
    list.innerHTML = '';
    for (const r of Residents.runtime) {
      const row = document.createElement('div');
      row.className = 'rel-row';
      const portrait = document.createElement('div');
      portrait.className = 'rel-portrait';
      portrait.appendChild(r.portraitCanvas);
      const info = document.createElement('div');
      info.className = 'rel-info';
      const pPhase = (typeof Phases !== 'undefined') ? Phases.phase(r.def.id, 'player') : Relationships.status(r.def.id, 'player');
      const aff = (typeof Phases !== 'undefined' && Phases.hasMet(r.def.id, 'player'))
        ? Phases.affinity(r.def.id, 'player')
        : Relationships.affinity(r.def.id, 'player');
      const phaseLabel = (typeof Phases !== 'undefined' && Phases.ladder.find(s => s.id === pPhase) || {}).label || pPhase;
      const hearts = Math.round(aff / 20);
      let heartHtml = '';
      for (let i=0; i<5; i++) heartHtml += `<span class="${i < hearts ? 'full':'empty'}">♥</span>`;
      let partnerTag = '';
      if (r.partner) {
        const p = Residents.byId(r.partner);
        const phaseAB = (typeof Phases !== 'undefined') ? Phases.phase(r.def.id, r.partner) : Relationships.status(r.def.id, r.partner);
        partnerTag = `<span class="rel-tag ${phaseAB}">${phaseAB} ${p?.def.name || ''}</span>`;
      }
      let babyTag = '';
      if (r.babies && r.babies.length) babyTag = `<span class="rel-tag">${r.babies.length} kid${r.babies.length>1?'s':''}</span>`;
      if (r.pregnant) babyTag += `<span class="rel-tag">expecting</span>`;
      const roleTag = r.role && r.role !== 'Citizen'
        ? `<span class="rel-tag" style="background:#5a4a8a">${r.role}</span>` : '';
      info.innerHTML = `
        <div class="name">${r.def.name}${roleTag}${partnerTag}${babyTag}</div>
        <div class="status">${r.def.archetype} · ${phaseLabel}</div>`;
      const heartsEl = document.createElement('div');
      heartsEl.className = 'rel-hearts';
      heartsEl.innerHTML = heartHtml;
      row.appendChild(portrait);
      row.appendChild(info);
      row.appendChild(heartsEl);
      list.appendChild(row);
    }
  },

  renderCookbook() {
    const list = document.getElementById('recipe-list');
    list.innerHTML = '';
    const recipes = [
      { name:'Berry Jam', icon:'jam', ingr:{ berries:2 }, result:'jam' },
      { name:'Herb Tea', icon:'tea', ingr:{ herbs:1, water:1 }, result:'tea' },
      { name:'Pressed Flower', icon:'flower', ingr:{ wildflower:1, driftwood:1 }, result:'pressed_flower' },
      { name:'Wind Chime', icon:'chime', ingr:{ shell:3, driftwood:1 }, result:'wind_chime' },
      { name:'Pebble Paperweight', icon:'paint', ingr:{ polished_pebble:1 }, result:'pebble_paperweight' },
    ];
    for (const r of recipes) {
      const row = document.createElement('div');
      row.className = 'recipe-row';
      const ingrText = Object.entries(r.ingr).map(([k,v]) => `${v}× ${k.replace(/_/g,' ')}`).join(' + ');
      row.innerHTML = `<div class="icon">${r.icon}</div>
        <div><div class="name">${r.name}</div><div class="ingr">${ingrText}</div></div>
        <button>Craft</button>`;
      row.querySelector('button').addEventListener('click', () => UI.craft(r));
      list.appendChild(row);
    }
  },

  craft(r) {
    for (const [k,v] of Object.entries(r.ingr)) {
      if ((gameState.inventory[k] || 0) < v) { UI.toast(`Need ${v} ${k.replace(/_/g,' ')}`); return; }
    }
    for (const [k,v] of Object.entries(r.ingr)) {
      gameState.inventory[k] -= v;
      if (gameState.inventory[k] <= 0) delete gameState.inventory[k];
    }
    gameState.inventory[r.result] = (gameState.inventory[r.result] || 0) + 1;
    UI.toast(`Crafted ${r.name}!`);
    UI.renderInventory();
    UI.renderCookbook();
  },

  renderMap() {
    const wrap = document.getElementById('mini-map');
    wrap.innerHTML = '';
    const c = document.createElement('canvas');
    c.width = 640; c.height = 360;
    wrap.appendChild(c);
    const cx = c.getContext('2d');
    cx.scale(c.width / canvas.width, c.height / canvas.height);
    World.drawSky(cx, 12);
    World.drawTerrain(cx);
    World.drawBuildings(cx, performance.now());
    World.drawDecor(cx, performance.now());
    World.drawTrees(cx, performance.now());
    Residents.draw(cx, performance.now());
    cx.fillStyle = 'red';
    cx.beginPath(); cx.arc(gameState.player.x, gameState.player.y, 10, 0, Math.PI*2); cx.fill();
  },

  askBaby(a, b) {
    UI.pendingBaby = { a, b };
    document.getElementById('baby-text').textContent =
      `${a.def.name} and ${b.def.name} share a long, soft look. Should they start a family?`;
    document.getElementById('baby-modal').classList.remove('hidden');
  },
  confirmBaby(yes) {
    document.getElementById('baby-modal').classList.add('hidden');
    if (yes && UI.pendingBaby) {
      Relationships.startPregnancy(UI.pendingBaby.a, UI.pendingBaby.b, gameState.dayNumber);
      UI.toast(`${UI.pendingBaby.a.def.name} is expecting!`, 'heart');
    }
    UI.pendingBaby = null;
  },

  askPropose(r) {
    UI.pendingPropose = r;
    document.getElementById('propose-text').textContent = `Ask ${r.def.name} to be your partner?`;
    document.getElementById('propose-modal').classList.remove('hidden');
  },
  confirmPropose(yes) {
    document.getElementById('propose-modal').classList.add('hidden');
    if (yes && UI.pendingPropose) {
      const r = UI.pendingPropose;
      Relationships.setStatus('player', r.def.id, 'dating', Relationships.affinity('player', r.def.id));
      Relationships.playerLove = r.def.id;
      UI.toast(`You and ${r.def.name} are dating!`, 'heart');
    }
    UI.pendingPropose = null;
  }
};
