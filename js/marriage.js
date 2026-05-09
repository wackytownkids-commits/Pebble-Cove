/* marriage.js — when two residents marry, one moves into the other's home.
   Both share the larger one. The vacated home becomes claimable. */
const Marriage = {
  // called when a phase transition reaches 'married'
  onMarried(rec) {
    const a = Residents.byId(rec.a);
    const b = Residents.byId(rec.b);
    if (!a || !b) return;
    if (a.def.id === b.def.id) return;
    // pick the home with the bigger building
    const homeA = World.buildings.find(B => Math.hypot(B.x - a.def.home.x, B.y - a.def.home.y) < 80);
    const homeB = World.buildings.find(B => Math.hypot(B.x - b.def.home.x, B.y - b.def.home.y) < 80);
    let keeper, mover;
    if (homeA && homeB) {
      const sizeA = homeA.w * homeA.h, sizeB = homeB.w * homeB.h;
      if (sizeA >= sizeB) { keeper = a; mover = b; }
      else                { keeper = b; mover = a; }
    } else { keeper = a; mover = b; }

    // mover's schedule home becomes keeper's home location
    mover.def.home = { ...keeper.def.home, name: keeper.def.home.name + ' (with ' + mover.def.name + ')' };
    // adjust their schedule entries that pointed to old home — leave alone for simplicity, just ensure they head to keeper's
    for (const s of mover.def.schedule) {
      // if spot equals nothing similar, snap home spots
      if (Math.abs(s.spot[0] - mover.x) < 5 && Math.abs(s.spot[1] - mover.y) < 5) {
        s.spot = [keeper.def.home.x, keeper.def.home.y];
      }
    }
    UI.toast(`💒 ${mover.def.name} moved in with ${keeper.def.name}.`, 'heart');
  },
};

// hook into Phases.onPhaseChange
if (typeof Phases !== 'undefined') {
  const _orig = Phases.onPhaseChange;
  Phases.onPhaseChange = function(rec, from, to) {
    _orig.call(Phases, rec, from, to);
    if (to === 'married') Marriage.onMarried(rec);
  };
}
