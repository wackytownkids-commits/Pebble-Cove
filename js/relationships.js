const Relationships = {
  data: {},
  playerLove: 'none',

  init() {
    Relationships.data = {};
    for (const r of Residents.defs) {
      Relationships.data[r.id] = {};
      for (const o of Residents.defs) {
        if (r.id === o.id) continue;
        Relationships.data[r.id][o.id] = { affinity: 12, status: 'stranger' };
      }
      Relationships.data[r.id].player = { affinity: 8, status: 'stranger' };
    }
    Relationships.setStatus('mum','tide','friend',  60);
    Relationships.setStatus('quill','astra','dating',74);
    Relationships.setStatus('bramble','pip','friend',  35);
    Relationships.bind('quill','astra');
  },

  setStatus(a, b, status, affinity) {
    if (!Relationships.data[a]) return;
    if (!Relationships.data[a][b]) Relationships.data[a][b] = {};
    Relationships.data[a][b].status   = status;
    Relationships.data[a][b].affinity = Math.max(0, Math.min(100, affinity));
    if (Relationships.data[b]) {
      if (!Relationships.data[b][a]) Relationships.data[b][a] = {};
      Relationships.data[b][a].status   = status;
      Relationships.data[b][a].affinity = Relationships.data[a][b].affinity;
    }
  },

  bind(a, b) {
    const ra = Residents.byId(a);
    const rb = Residents.byId(b);
    if (ra) ra.partner = b;
    if (rb) rb.partner = a;
  },

  unbind(a) {
    const ra = Residents.byId(a);
    if (ra && ra.partner) {
      const rb = Residents.byId(ra.partner);
      if (rb) rb.partner = null;
      ra.partner = null;
    }
  },

  affinity(a, b) {
    return (Relationships.data[a] && Relationships.data[a][b]) ? Relationships.data[a][b].affinity : 0;
  },
  status(a, b) {
    return (Relationships.data[a] && Relationships.data[a][b]) ? Relationships.data[a][b].status : 'stranger';
  },

  nudge(a, b, delta) {
    if (!Relationships.data[a] || !Relationships.data[a][b]) return;
    const cur = Relationships.data[a][b].affinity;
    const next = Math.max(0, Math.min(100, cur + delta));
    Relationships.data[a][b].affinity = next;
    if (Relationships.data[b]) {
      if (!Relationships.data[b][a]) Relationships.data[b][a] = {};
      Relationships.data[b][a].affinity = next;
    }
    Relationships.checkPromotion(a, b);
  },

  checkPromotion(a, b) {
    const rec = Relationships.data[a][b];
    const aff = rec.affinity;
    let s = rec.status;
    if (s === 'stranger' && aff >= 25)        s = 'friend';
    else if (s === 'friend' && aff >= 60)     s = 'best_friend';
    if (s !== rec.status) {
      Relationships.setStatus(a, b, s, aff);
      if (a === 'player' || b === 'player') {
        UI.toast(`Now ${s.replace('_',' ')} with ${UI.displayName(a==='player'?b:a)}!`, 'heart');
      }
    }
  },

  tickNpcAffinities(t, dt) {
    if (Math.random() > dt * 0.1) return;
    const all = Residents.runtime;
    if (!all || all.length < 2) return;
    const a = all[(Math.random()*all.length)|0];
    const b = all[(Math.random()*all.length)|0];
    if (a === b) return;
    if (a.def.id === b.def.id) return;
    if (Math.hypot(a.x - b.x, a.y - b.y) > 80) return;
    const compatible = (a.def.compatible || []).includes(b.def.id) || (b.def.compatible || []).includes(a.def.id);
    Relationships.nudge(a.def.id, b.def.id, compatible ? 0.4 : 0.15);
    if (typeof Phases !== 'undefined') {
      if (!Phases.hasMet(a.def.id, b.def.id)) Phases.meet(a.def.id, b.def.id);
      Phases.bumpAffinity(a.def.id, b.def.id, compatible ? 0.6 : 0.2);
    }
  },

  kiss(a, b, t) {
    a.lastKissAt = t;
    b.lastKissAt = t;
    const status = Relationships.status(a.def.id, b.def.id);
    if (status === 'married' && !a.pregnant && !b.pregnant && Math.random() < 0.04) {
      UI.askBaby(a, b);
    }
  },

  startPregnancy(a, b, gameDay) {
    a.pregnant = true;
    a.pregnancyStartedAt = gameDay;
    a.partnerForBaby = b.def.id;
  },

  tickPregnancies(gameDay) {
    for (const r of Residents.runtime) {
      if (r.pregnant && gameDay - r.pregnancyStartedAt >= 3) {
        Relationships.deliverBaby(r);
      }
    }
  },

  deliverBaby(parent) {
    parent.pregnant = false;
    const partner = Residents.byId(parent.partnerForBaby);
    parent.babies = parent.babies || [];
    parent.babies.push({ bornDay: gameState.dayNumber });
    if (typeof Spawn !== 'undefined' && partner) {
      const baby = Spawn.bornBaby(parent, partner);
      UI.toast(`${parent.def.name} and ${partner.def.name} welcomed ${baby.def.name}!`, 'heart');
    }
  },

  makeBabyName(a, b) {
    const syl = ['Ro','Mi','Lu','Po','Ki','Sa','Ne','Vi','Bo','Ar','Eu','To','Fi','Lo','Mu'];
    const end = ['lo','na','ko','ra','wen','sa','vi','to','ri','dy','el','si'];
    return syl[(Math.random()*syl.length)|0] + end[(Math.random()*end.length)|0];
  }
};
