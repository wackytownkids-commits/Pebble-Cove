/* gifts.js — give a gift from your inventory to a resident.
   Big affinity boost if they love it, neutral otherwise, mild penalty if hated. */
const Gifts = {
  active: null,  // resident the player is gifting to

  open(r) {
    Gifts.active = r;
    UI.closeAllPanels();
    const p = document.getElementById('panel-gifts');
    p.classList.remove('hidden');
    Gifts.render();
  },
  close() { document.getElementById('panel-gifts').classList.add('hidden'); },

  render() {
    const r = Gifts.active;
    if (!r) return;
    const list = document.getElementById('gift-list');
    list.innerHTML = '';
    document.getElementById('gift-target').textContent = `Give a gift to ${r.def.name}`;
    const inv = gameState.inventory;
    const keys = Object.keys(inv).filter(k => inv[k] > 0);
    if (!keys.length) {
      list.innerHTML = '<p style="padding:14px;color:#7a5a5a;">Pouch is empty. Forage at the beach first.</p>';
      return;
    }
    for (const k of keys) {
      const row = document.createElement('button');
      row.className = 'big-btn';
      row.style.justifyContent = 'flex-start';
      row.style.textAlign = 'left';
      row.textContent = `${inv[k]}× ${k.replace(/_/g,' ')}`;
      row.addEventListener('click', () => Gifts.give(k));
      list.appendChild(row);
    }
  },

  give(itemId) {
    const r = Gifts.active;
    if (!r) return;
    if ((gameState.inventory[itemId] || 0) <= 0) return;
    gameState.inventory[itemId] -= 1;
    if (gameState.inventory[itemId] <= 0) delete gameState.inventory[itemId];

    const def = r.def;
    let delta = 5;
    if (def.gifts && def.gifts.love && def.gifts.love.includes(itemId)) delta = 22;
    else if (def.gifts && def.gifts.hate && def.gifts.hate.includes(itemId)) delta = -8;

    if (typeof Phases !== 'undefined') {
      if (!Phases.hasMet(def.id, 'player')) Phases.meet(def.id, 'player');
      Phases.bumpAffinity(def.id, 'player', delta);
    }
    Relationships.nudge(def.id, 'player', delta);
    if (typeof Happiness !== 'undefined') Happiness.bump(r, Math.abs(delta), delta < 0 ? 'disrespect' : 'gift');

    if (delta > 15) UI.toast(`💗 ${def.name} loved it! (+${delta})`, 'heart');
    else if (delta < 0) UI.toast(`${def.name} winces. (${delta})`);
    else UI.toast(`${def.name} smiles politely. (+${delta})`);

    Gifts.render();
  },
};
