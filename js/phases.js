/* ============================================================
   phases.js — Tomodachi-style relationship phases.
   Each phase requires BOTH a min affinity AND days-since-met.
   ============================================================ */

const Phases = {
  // ordered: each row { id, label, minAff, minDays, romance }
  ladder: [
    { id:'stranger',     label:'Stranger',      minAff:0,   minDays:0,  romance:false },
    { id:'met',          label:'Just met',      minAff:5,   minDays:0,  romance:false },
    { id:'acquaintance', label:'Acquaintance',  minAff:18,  minDays:1,  romance:false },
    { id:'friend',       label:'Friend',        minAff:38,  minDays:3,  romance:false },
    { id:'good_friend',  label:'Good friend',   minAff:55,  minDays:6,  romance:false },
    { id:'best_friend',  label:'Best friend',   minAff:72,  minDays:10, romance:false },
    { id:'crush',        label:'Crushing',      minAff:75,  minDays:8,  romance:true  },
    { id:'sweetheart',   label:'Sweetheart',    minAff:82,  minDays:14, romance:true  },
    { id:'dating',       label:'Dating',        minAff:88,  minDays:18, romance:true  },
    { id:'engaged',      label:'Engaged',       minAff:94,  minDays:25, romance:true  },
    { id:'married',      label:'Married',       minAff:97,  minDays:32, romance:true  },
  ],

  // pair stats: who has met whom, when, current phase, partial-toward-next
  // key: aId + ":" + bId  (sorted alphabetically)
  pairs: {},

  key(a, b) {
    return [a, b].sort().join(':');
  },

  hasMet(a, b) {
    return !!Phases.pairs[Phases.key(a, b)];
  },

  meet(a, b) {
    const k = Phases.key(a, b);
    if (Phases.pairs[k]) return false; // already met
    Phases.pairs[k] = {
      a, b,
      metOnDay: gameState.dayNumber,
      phase: 'met',
      romanceCompatible: Phases.romanceCompat(a, b),
      affinity: 8,
      // Tomodachi-style: friendship doesn't form for a while.
      // Ramp-up delay (in days) before affinity will start growing.
      thawAt: gameState.dayNumber + (Math.random() < 0.5 ? 1 : 2),
      lastInteractionDay: gameState.dayNumber,
    };
    return true;
  },

  romanceCompat(a, b) {
    // anyone can be a romantic match unless they're family-ish
    if (a === 'player' || b === 'player') return true;
    const ra = Residents.defs.find(r => r.id === a);
    const rb = Residents.defs.find(r => r.id === b);
    if (!ra || !rb) return false;
    // twins are inherently incompatible romantically with each other
    if ((a === 'echo' && b === 'wren') || (a === 'wren' && b === 'echo')) return false;
    // archetypes that don't pair (like grub the kid)
    if (ra.archetype === 'gremlin-child' || rb.archetype === 'gremlin-child') return false;
    return true;
  },

  rec(a, b) {
    return Phases.pairs[Phases.key(a, b)];
  },

  affinity(a, b) {
    const r = Phases.rec(a, b);
    return r ? r.affinity : 0;
  },

  phase(a, b) {
    const r = Phases.rec(a, b);
    return r ? r.phase : 'stranger';
  },

  daysSinceMet(rec) {
    return gameState.dayNumber - rec.metOnDay;
  },

  bumpAffinity(a, b, delta) {
    const r = Phases.rec(a, b);
    if (!r) return;
    // before thaw, affinity barely moves
    if (gameState.dayNumber < r.thawAt) delta = delta * 0.15;
    r.affinity = Math.max(0, Math.min(100, r.affinity + delta));
    r.lastInteractionDay = gameState.dayNumber;
    Phases.recheckPhase(r);
  },

  recheckPhase(rec) {
    // walk the ladder, find the highest phase whose constraints are met
    const days = Phases.daysSinceMet(rec);
    let target = 'met';
    for (const step of Phases.ladder) {
      if (step.id === 'stranger' || step.id === 'met') continue;
      if (rec.affinity < step.minAff) continue;
      if (days < step.minDays) continue;
      if (step.romance && !rec.romanceCompatible) continue;
      target = step.id;
    }
    if (target !== rec.phase) {
      const before = rec.phase;
      rec.phase = target;
      Phases.onPhaseChange(rec, before, target);
    }
  },

  onPhaseChange(rec, from, to) {
    const aLabel = UI.displayName(rec.a);
    const bLabel = UI.displayName(rec.b);
    const stepLabel = (Phases.ladder.find(s => s.id === to) || {}).label || to;
    if (rec.a === 'player' || rec.b === 'player') {
      UI.toast(`💗 ${rec.a === 'player' ? bLabel : aLabel}: ${stepLabel}`, 'heart');
    } else if (to === 'sweetheart' || to === 'dating' || to === 'engaged' || to === 'married' || to === 'best_friend') {
      UI.toast(`${aLabel} & ${bLabel}: ${stepLabel}`, 'heart');
    }
    // mirror to old Relationships system for compatibility with existing UI
    if (Relationships && Relationships.setStatus) {
      Relationships.setStatus(rec.a, rec.b, to, rec.affinity);
      if (to === 'dating' || to === 'engaged' || to === 'married') {
        Relationships.bind(rec.a, rec.b);
      }
    }
  },

  // daily tick: nudges affinity for pairs in proximity, decays for those who haven't seen each other
  dailyTick() {
    for (const k in Phases.pairs) {
      const r = Phases.pairs[k];
      const idle = gameState.dayNumber - r.lastInteractionDay;
      if (idle > 7) Phases.bumpAffinity(r.a, r.b, -1);
      Phases.recheckPhase(r);
    }
  },

  // all pairs involving this id (for the relationships panel)
  allFor(id) {
    const out = [];
    for (const k in Phases.pairs) {
      const r = Phases.pairs[k];
      if (r.a === id || r.b === id) out.push(r);
    }
    return out;
  },
};
