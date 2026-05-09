/* babyaging.js — children age over in-game days into kid → teen → adult.
   Affects their drawn size + role unlocking. */
const BabyAging = {
  daily() {
    for (const r of Residents.runtime) {
      if (r.def.archetype !== 'child' || !r.parents) continue;
      r.ageDays = (r.ageDays || 0) + 1;
      if (!r.lifeStage) r.lifeStage = 'baby';
      const stage = BabyAging.stageFor(r.ageDays);
      if (stage !== r.lifeStage) {
        r.lifeStage = stage;
        BabyAging.applyStage(r, stage);
        UI.toast(`${r.def.name} grew into a ${stage}.`, 'heart');
      }
    }
  },
  stageFor(days) {
    if (days < 5) return 'baby';
    if (days < 12) return 'kid';
    if (days < 22) return 'teen';
    return 'adult';
  },
  applyStage(r, stage) {
    // bigger heads & bigger overall when adult; smaller when baby
    if (!r.def.look._origScale) r.def.look._origScale = 1;
    let scale = 1;
    if (stage === 'baby') scale = 0.55;
    else if (stage === 'kid') scale = 0.7;
    else if (stage === 'teen') scale = 0.88;
    else scale = 1;
    r.drawScale = scale;
    if (stage === 'adult') r.def.archetype = 'villager';
  },
};

// patch Residents.draw to scale per resident
if (typeof Residents !== 'undefined') {
  const _origDraw = Residents.draw;
  Residents.draw = function(ctx, t) {
    const sorted = [...Residents.runtime].sort((a,b) => a.y - b.y);
    for (const r of sorted) {
      const s = r.drawScale || 1;
      ctx.save();
      ctx.translate(r.x, r.y);
      ctx.scale(s, s);
      Sprites.drawChibi(ctx, 0, 0, r.def.look, t, r.walking);
      ctx.restore();
      if (r.partner && t - (r.lastKissAt || 0) < 1500) {
        const p = Residents.byId(r.partner);
        if (p) {
          const cx = (r.x + p.x) / 2;
          const cy = ((r.y + p.y) / 2) - 60;
          const age = (t - r.lastKissAt) / 1500;
          Sprites.drawHeart(ctx, cx, cy - age * 30, 18 + age * 10, '#ff5894');
        }
      }
      if (r.pregnant) {
        ctx.fillStyle = r.def.look.outfit;
        ctx.beginPath();
        ctx.arc(r.x + r.facing * 4, r.y - 22, 9, 0, Math.PI*2);
        ctx.fill();
      }
    }
  };
}
