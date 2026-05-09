/* pairing.js — Tomodachi-style matchmaking shop.
   Pay 50 coins to introduce two residents and bias them toward romance.
*/
const Pairing = {
  selectedA: null,
  selectedB: null,

  open() {
    UI.closeAllPanels();
    Pairing.render();
    document.getElementById('panel-pairing').classList.remove('hidden');
  },
  close() { document.getElementById('panel-pairing').classList.add('hidden'); },

  pick(id) {
    if (!Pairing.selectedA) Pairing.selectedA = id;
    else if (Pairing.selectedA === id) Pairing.selectedA = null;
    else if (!Pairing.selectedB) Pairing.selectedB = id;
    else if (Pairing.selectedB === id) Pairing.selectedB = null;
    else { Pairing.selectedA = id; Pairing.selectedB = null; }
    Pairing.render();
  },

  render() {
    const grid = document.getElementById('pair-grid');
    grid.innerHTML = '';
    for (const r of Residents.runtime) {
      const c = document.createElement('div');
      c.className = 'pair-card';
      if (Pairing.selectedA === r.def.id || Pairing.selectedB === r.def.id) c.classList.add('selected');
      c.innerHTML = `<div class="pair-portrait"></div><div class="pair-name">${r.def.name}</div>`;
      c.querySelector('.pair-portrait').appendChild(r.portraitCanvas.cloneNode(true));
      c.addEventListener('click', () => Pairing.pick(r.def.id));
      grid.appendChild(c);
    }
    const a = Pairing.selectedA;
    const b = Pairing.selectedB;
    document.getElementById('pair-confirm').disabled = !(a && b && a !== b);
    document.getElementById('pair-status').textContent =
      a && b ? `Pair ${UI.displayName(a)} with ${UI.displayName(b)}? (50 coins)` :
      'Pick two residents from above.';
  },

  confirm() {
    const a = Pairing.selectedA, b = Pairing.selectedB;
    if (!a || !b || a === b) return;
    if (gameState.coins < 50) { UI.toast('Not enough coins (need 50).'); return; }
    gameState.coins -= 50;
    if (!Phases.hasMet(a, b)) Phases.meet(a, b);
    Phases.bumpAffinity(a, b, 35);
    const ra = Residents.byId(a), rb = Residents.byId(b);
    if (ra && rb && Math.random() < 0.7) {
      // they walk toward each other for a date
      const mx = (ra.x + rb.x)/2, my = (ra.y + rb.y)/2;
      ra.tx = mx - 20; ra.ty = my;
      rb.tx = mx + 20; rb.ty = my;
    }
    UI.toast(`💗 You set ${UI.displayName(a)} up with ${UI.displayName(b)}.`, 'heart');
    Pairing.selectedA = null; Pairing.selectedB = null;
    Pairing.render();
  },
};
