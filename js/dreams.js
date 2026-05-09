/* dreams.js — every night a random resident has a dream. Dreams modify
   their happiness next morning, and may unlock special letters. */
const Dreams = {
  catalog: [
    { text: r => `${r.def.name} dreams of flying with a flock of seagulls. They wake up smiling.`, mood:+8 },
    { text: r => `${r.def.name} dreams of being elected mayor. They wake up feeling powerful but also queasy.`, mood:+2 },
    { text: r => `${r.def.name} dreams of being chased by a giant zucchini. They wake up sweaty.`, mood:-4 },
    { text: r => `${r.def.name} dreams of an old friend who never returned a sweater. Bittersweet.`, mood:-2 },
    { text: r => `${r.def.name} dreams of the ocean opening like a book. They wake up serene.`, mood:+10 },
    { text: r => `${r.def.name} dreams of forgetting their own name. They wake up early to write it on their hand.`, mood:-3 },
    { text: r => `${r.def.name} dreams of dancing with someone they're not supposed to like.`, mood:+5 },
    { text: r => `${r.def.name} dreams of the lighthouse keeper. (You.) Specifically: you bringing them breakfast.`, mood:+12 },
    { text: r => `${r.def.name} dreams of their grandmother braiding their hair. They wake up holding their pillow.`, mood:+6 },
    { text: r => `${r.def.name} dreams of swimming with a whale that knows their full name.`, mood:+9 },
  ],
  todays: [],

  nightly() {
    Dreams.todays = [];
    if (!Residents.runtime.length) return;
    const count = Math.min(3, Math.max(1, Math.floor(Residents.runtime.length / 4)));
    const used = new Set();
    for (let i = 0; i < count; i++) {
      let r;
      let attempts = 0;
      do { r = Residents.runtime[Math.floor(Math.random()*Residents.runtime.length)]; attempts++; }
      while (used.has(r.def.id) && attempts < 20);
      used.add(r.def.id);
      const d = Dreams.catalog[Math.floor(Math.random()*Dreams.catalog.length)];
      r.happiness = (r.happiness ?? 70) + d.mood;
      Dreams.todays.push({ name: r.def.name, text: d.text(r) });
    }
  },

  showMorning() {
    if (!Dreams.todays.length) return;
    let html = '<div style="padding:8px 4px;line-height:1.5;">';
    for (const d of Dreams.todays) {
      html += `<div style="margin-bottom:10px;font-style:italic;color:#7a5a5a;">"${d.text}"</div>`;
    }
    html += '</div>';
    UI.toast(`💤 ${Dreams.todays.length} cove dream${Dreams.todays.length>1?'s':''} last night. Check the Dream Journal.`);
    Dreams.lastSummary = html;
  },

  openJournal() {
    const html = Dreams.lastSummary || '<em>No dreams yet. Sleep through a night to see what the cove dreams.</em>';
    document.getElementById('dream-body').innerHTML = html;
    UI.closeAllPanels();
    document.getElementById('panel-dreams').classList.remove('hidden');
  },
};
