/* facepaint.js — face paint shop. Apply patterns to a chibi.
   patterns are drawn by Sprites in addition to the base look.
*/
const FacePaint = {
  patterns: [
    { id:'none',     label:'None' },
    { id:'whiskers', label:'Whiskers',   color:'#3a2030' },
    { id:'star',     label:'Star',       color:'#ffd060' },
    { id:'heart',    label:'Heart',      color:'#e85088' },
    { id:'tribal',   label:'Tribal',     color:'#5a4a8a' },
    { id:'glitter',  label:'Glitter',    color:'#ffe0a8' },
    { id:'mask',     label:'Cat Mask',   color:'#1a1a2a' },
    { id:'butterfly',label:'Butterfly',  color:'#88c8e8' },
    { id:'sun',      label:'Sun',        color:'#ffa040' },
  ],

  selectedResident: null,

  open() {
    UI.closeAllPanels();
    if (!FacePaint.selectedResident && Residents.runtime.length) {
      FacePaint.selectedResident = 'player';
    }
    FacePaint.render();
    document.getElementById('panel-facepaint').classList.remove('hidden');
  },

  pickResident(id) {
    FacePaint.selectedResident = id;
    FacePaint.render();
  },

  apply(patternId) {
    const target = FacePaint.targetLook();
    if (!target) return;
    target.facePaint = patternId;
    UI.toast(`Painted ${patternId}.`);
    // refresh portrait
    const r = FacePaint.selectedResident === 'player' ? null : Residents.byId(FacePaint.selectedResident);
    if (r) r.portraitCanvas = Sprites.portraitCanvas(r.def.look);
    FacePaint.render();
  },

  targetLook() {
    if (FacePaint.selectedResident === 'player') return gameState.player.look;
    const r = Residents.byId(FacePaint.selectedResident);
    return r ? r.def.look : null;
  },

  render() {
    const list = document.getElementById('fp-residents');
    list.innerHTML = '';
    // player first
    const opts = [{ id:'player', name: gameState.playerName, look: gameState.player.look }]
      .concat(Residents.runtime.map(r => ({ id: r.def.id, name: r.def.name, look: r.def.look })));
    for (const o of opts) {
      const c = document.createElement('div');
      c.className = 'pair-card';
      if (FacePaint.selectedResident === o.id) c.classList.add('selected');
      const portrait = document.createElement('div');
      portrait.className = 'pair-portrait';
      portrait.appendChild(Sprites.portraitCanvas(o.look));
      c.appendChild(portrait);
      const n = document.createElement('div');
      n.className = 'pair-name';
      n.textContent = o.name;
      c.appendChild(n);
      c.addEventListener('click', () => FacePaint.pickResident(o.id));
      list.appendChild(c);
    }
    const grid = document.getElementById('fp-patterns');
    grid.innerHTML = '';
    for (const p of FacePaint.patterns) {
      const b = document.createElement('button');
      b.className = 'fp-btn';
      const target = FacePaint.targetLook();
      if (target && target.facePaint === p.id) b.classList.add('selected');
      b.textContent = p.label;
      b.addEventListener('click', () => FacePaint.apply(p.id));
      grid.appendChild(b);
    }
  },
};

// monkey-patch into Sprites: after drawing a chibi face, also draw the face paint
Sprites._origDrawChibi = Sprites.drawChibi;
Sprites.drawChibi = function(ctx, cx, cy, look, t, walking) {
  Sprites._origDrawChibi(ctx, cx, cy, look, t, walking);
  if (!look.facePaint || look.facePaint === 'none') return;
  const bob = walking ? Math.round(Math.sin(t * 0.012) * 1.5) : 0;
  ctx.save();
  ctx.translate(cx, cy + bob);
  const headY = -55;
  ctx.fillStyle = ({ whiskers:'#3a2030', star:'#ffd060', heart:'#e85088',
    tribal:'#5a4a8a', glitter:'#ffe0a8', mask:'#1a1a2a',
    butterfly:'#88c8e8', sun:'#ffa040' })[look.facePaint] || '#000';
  ctx.strokeStyle = ctx.fillStyle;
  ctx.lineWidth = 1.2;
  switch (look.facePaint) {
    case 'whiskers':
      ctx.beginPath();
      ctx.moveTo(-12, headY+3); ctx.lineTo(-3, headY+5);
      ctx.moveTo(-12, headY+6); ctx.lineTo(-3, headY+6);
      ctx.moveTo(12, headY+3);  ctx.lineTo(3, headY+5);
      ctx.moveTo(12, headY+6);  ctx.lineTo(3, headY+6);
      ctx.stroke();
      break;
    case 'star':
      Sprites._drawStar(ctx, -10, headY+1, 4);
      Sprites._drawStar(ctx, 10, headY+1, 4);
      break;
    case 'heart':
      Sprites.drawHeart(ctx, -9, headY+2, 7, ctx.fillStyle);
      break;
    case 'tribal':
      ctx.beginPath();
      ctx.moveTo(-13, headY-4); ctx.lineTo(-9, headY+4);
      ctx.moveTo(13, headY-4);  ctx.lineTo(9, headY+4);
      ctx.lineWidth = 2;
      ctx.stroke();
      break;
    case 'glitter':
      for (let i = 0; i < 6; i++) {
        const ax = -12 + i*4 + (i%2)*1;
        const ay = headY-6 + (i%2)*10;
        ctx.beginPath();
        ctx.arc(ax, ay, 1, 0, Math.PI*2);
        ctx.fill();
      }
      break;
    case 'mask':
      ctx.beginPath();
      ctx.ellipse(0, headY-1, 14, 6, 0, 0, Math.PI*2);
      ctx.globalAlpha = 0.55;
      ctx.fill();
      ctx.globalAlpha = 1;
      break;
    case 'butterfly':
      ctx.beginPath();
      ctx.arc(-9, headY+3, 3, 0, Math.PI*2);
      ctx.arc(-13, headY+5, 2.5, 0, Math.PI*2);
      ctx.arc(9, headY+3, 3, 0, Math.PI*2);
      ctx.arc(13, headY+5, 2.5, 0, Math.PI*2);
      ctx.fill();
      break;
    case 'sun':
      ctx.beginPath();
      ctx.arc(0, headY-12, 4, 0, Math.PI*2);
      ctx.fill();
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a)*5, headY-12 + Math.sin(a)*5);
        ctx.lineTo(Math.cos(a)*8, headY-12 + Math.sin(a)*8);
        ctx.stroke();
      }
      break;
  }
  ctx.restore();
};
Sprites._drawStar = function(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = i*Math.PI/5;
    const rr = i%2 ? r*0.45 : r;
    if (i === 0) ctx.moveTo(x + Math.cos(a)*rr, y + Math.sin(a)*rr);
    else ctx.lineTo(x + Math.cos(a)*rr, y + Math.sin(a)*rr);
  }
  ctx.closePath();
  ctx.fill();
};
