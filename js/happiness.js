/* happiness.js — per-resident happiness 0..100. Drives leave-island. */
const Happiness = {
  init() {
    for (const r of Residents.runtime) {
      if (r.happiness === undefined) r.happiness = 70;
      if (r.disrespects === undefined) r.disrespects = 0;
    }
  },

  bump(r, delta, reason) {
    r.happiness = Math.max(0, Math.min(100, (r.happiness ?? 70) + delta));
    if (delta < -5 && reason === 'disrespect') r.disrespects = (r.disrespects || 0) + 1;
  },

  // called on day start
  daily() {
    for (const r of Residents.runtime) {
      let h = r.happiness ?? 70;
      // partner = +
      if (r.partner) h += 1.2;
      // friends nearby = +
      const friends = Object.values(Phases.pairs || {}).filter(p =>
        (p.a === r.def.id || p.b === r.def.id) && (p.phase === 'friend' || p.phase === 'good_friend' || p.phase === 'best_friend' || p.phase === 'married' || p.phase === 'dating'));
      h += Math.min(3, friends.length * 0.4);
      // role tax — president carries weight
      if (r.role === 'President') h -= 0.4;
      // disrespects accumulate
      h -= Math.min(8, (r.disrespects || 0) * 0.5);
      // mood drift toward 70
      h += (70 - h) * 0.05;
      r.happiness = Math.max(0, Math.min(100, h));
      // 5% chance to consider leaving
      const playerAff = Phases.affinity ? Phases.affinity(r.def.id, 'player') : 50;
      const disrespected = (r.disrespects || 0) >= 3 || playerAff < 15;
      if (h < 30 && disrespected && Math.random() < 0.05) {
        LeaveIsland.askLeave(r);
      }
    }
  },
};

const LeaveIsland = {
  pendingLeave: null,
  askLeave(r) {
    if (LeaveIsland.pendingLeave) return;
    LeaveIsland.pendingLeave = r;
    document.getElementById('leave-text').textContent =
      `${r.def.name} has packed a small bag and is at the dock. They want to leave Pebble Cove.`;
    document.getElementById('leave-modal').classList.remove('hidden');
  },
  beg() {
    document.getElementById('leave-modal').classList.add('hidden');
    if (!LeaveIsland.pendingLeave) return;
    const r = LeaveIsland.pendingLeave;
    r.happiness = 60;
    r.disrespects = 0;
    Phases.bumpAffinity && Phases.bumpAffinity(r.def.id, 'player', 18);
    UI.toast(`${r.def.name} agreed to stay. Be kinder.`, 'heart');
    LeaveIsland.pendingLeave = null;
  },
  letGo() {
    document.getElementById('leave-modal').classList.add('hidden');
    const r = LeaveIsland.pendingLeave;
    if (!r) return;
    UI.toast(`${r.def.name} sailed away from Pebble Cove.`);
    const idx = Residents.runtime.indexOf(r);
    if (idx >= 0) Residents.runtime.splice(idx, 1);
    LeaveIsland.pendingLeave = null;
  },
};
