/* ============================================================
   president.js — the President asks you for cove improvements.
   ============================================================ */

const President = {
  pending: null,
  lastRequestDay: 0,

  // try to send a request; called when day starts
  maybeRequest() {
    if (!Roles.president()) return;
    if (gameState.dayNumber - President.lastRequestDay < 3) return;
    if (Math.random() > 0.4) return;
    const requests = [
      { text: 'I think a row of new trees along the south path would lift everyone\'s spirits.', apply: () => {
          for (let i = 0; i < 6; i++) World.trees.push({ x: 100 + i * 180, y: 700, scale: 0.9 + Math.random()*0.3 });
        }},
      { text: 'A flower bed near the plaza would make ribbon-cuttings far more dignified.', apply: () => {
          for (let i = 0; i < 14; i++) {
            const a = (i / 14) * Math.PI * 2;
            World.flowers.push({ x: 640 + Math.cos(a) * 70, y: 640 + Math.sin(a) * 50, color: ['#ffd0d8','#d8c0ff','#ffe0a8'][i%3] });
          }
        }},
      { text: 'A small new cottage on the hillside, pre-zoned. Please?', apply: () => {
          World.buildings.push({ x: 560, y: 200, w: 70, h: 55, body: '#fbd9b8', roof: '#c0a098', sign: '' });
        }},
      { text: 'We must hire a new cove official. May I appoint a Vice President?', apply: () => {
          // pick a random non-Mayor resident with high fondness toward player
          const candidates = Residents.runtime.filter(r => r.role === 'Citizen');
          if (candidates.length) {
            const pick = candidates[Math.floor(Math.random() * candidates.length)];
            Roles.assign(pick.def.id, 'Vice President');
          }
        }},
    ];
    const r = requests[Math.floor(Math.random() * requests.length)];
    President.pending = r;
    President.lastRequestDay = gameState.dayNumber;
    document.getElementById('pres-text').textContent = `"${r.text}" — The Mayor`;
    document.getElementById('pres-modal').classList.remove('hidden');
  },

  approve() {
    if (President.pending) {
      President.pending.apply();
      gameState.acceptedPresRequest = true;
      UI.toast('📜 The cove has been improved.', 'heart');
    }
    President.close();
  },
  decline() {
    UI.toast('The President sighs. "Very well."');
    President.close();
  },
  close() {
    President.pending = null;
    document.getElementById('pres-modal').classList.add('hidden');
  },
};
