/* ============================================================
   festivals.js — seasonal events that bring residents together.
   ============================================================ */

const Festivals = {
  active: null,
  log: [],

  defs: [
    { id:'spring_bloom',    season:0, dayOfSeason:3, title:'The Bloom Festival',
      announce: 'Spring is here. The cove gathers in the plaza for the Bloom Festival.',
      apply: () => {
        for (const r of Residents.runtime) { r.tx = 640 + Math.cos(Math.random()*Math.PI*2)*100; r.ty = 640 + Math.sin(Math.random()*Math.PI*2)*60; }
        for (let i = 0; i < 30; i++) {
          const a = Math.random() * Math.PI * 2;
          World.flowers.push({ x: 640 + Math.cos(a)*120, y: 640 + Math.sin(a)*70, color: ['#ffd0d8','#d8c0ff','#ffe0a8'][i%3] });
        }
        gameState.coins += 30;
      } },
    { id:'summer_fishing', season:1, dayOfSeason:3, title:'The Cove Fishing Tournament',
      announce: 'Tide casts the first line. The fishing tournament begins.',
      apply: () => {
        for (const r of Residents.runtime) { r.tx = 80 + Math.random() * 200; r.ty = 640 + Math.random() * 50; }
        gameState.inventory['polished_pebble'] = (gameState.inventory['polished_pebble'] || 0) + 4;
        gameState.inventory['shell'] = (gameState.inventory['shell'] || 0) + 3;
        UI.toast('🎣 You won 3rd place. Have some shells.', 'heart');
      } },
    { id:'autumn_rake',    season:2, dayOfSeason:3, title:'The Leaf-Rake Contest',
      announce: "Bramble's at it. The Leaf-Rake Contest is on.",
      apply: () => {
        // rebuild trees with autumn tint
        for (const t of World.trees) t.scale *= 0.97;
        gameState.coins += 25;
      } },
    { id:'winter_gift',    season:3, dayOfSeason:3, title:"Pebble Cove's Gift Exchange",
      announce: 'The cove draws names. The Gift Exchange begins.',
      apply: () => {
        gameState.inventory['cinnamon_bun'] = (gameState.inventory['cinnamon_bun'] || 0) + 1;
        gameState.inventory['pressed_flower'] = (gameState.inventory['pressed_flower'] || 0) + 1;
        gameState.inventory['wind_chime'] = (gameState.inventory['wind_chime'] || 0) + 1;
        UI.toast('🎁 You received gifts from three friends.', 'heart');
      } },
  ],

  // called each day-start
  tick() {
    const dayInSeason = ((gameState.dayNumber - 1) % 7) + 1;
    for (const f of Festivals.defs) {
      if (f.season !== gameState.seasonIndex) continue;
      if (f.dayOfSeason !== dayInSeason) continue;
      if (Festivals.log.includes(f.id + '_' + gameState.yearNumber)) continue;
      Festivals.log.push(f.id + '_' + gameState.yearNumber);
      Festivals.active = f;
      UI.toast(`🎉 ${f.title} — ${f.announce}`, 'heart');
      f.apply();
      if (typeof Audio !== 'undefined') Audio.heart();
    }
  },
};
