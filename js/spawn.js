/* ============================================================
   spawn.js — adds new residents at runtime (babies, player additions).
   No cap on character count.
   ============================================================ */

const Spawn = {
  addResidentAt(x, y, options = {}) {
    const id = 'r_' + Date.now() + '_' + Math.floor(Math.random()*1000);
    const name = options.name || Roles.randomName();
    const look = options.look || Roles.randomLook();
    const archetype = options.archetype || ['villager','dreamer','grump','sweetie','rascal','quiet','loud'][Math.floor(Math.random()*7)];

    const def = {
      id,
      name,
      archetype,
      voice: 'soft',
      look,
      home: { x, y, name: name + "'s Place" },
      schedule: [
        { time:6,  spot:[x, y] },
        { time:13, spot:[Math.max(80, x - 80 + Math.random()*160), Math.max(220, y - 80 + Math.random()*160)] },
        { time:20, spot:[x, y] },
      ],
      lines: [
        `Hi ${gameState.playerName}, I'm ${name}!`,
        `Did you know I just moved here? It's lovely.`,
        `Mhm. Cove's nice this time of year.`,
      ],
      gifts: { love:[], hate:[] },
      compatible: [],
    };
    Residents.defs.push(def);

    const runtimeEntry = {
      def,
      x, y,
      tx: x, ty: y,
      walking: false,
      facing: 1,
      portraitCanvas: Sprites.portraitCanvas(look),
      lastLineAt: 0,
      currentLine: '',
      partner: null,
      lastKissAt: 0,
      pregnant: false,
      pregnancyStartedAt: 0,
      role: options.role || 'Citizen',
      babies: [],
    };
    Residents.runtime.push(runtimeEntry);

    // expand barrier if we crossed a threshold
    World.maybeExpandBarrier();
    if (typeof Shops !== 'undefined') Shops.check();
    if (typeof Camera !== 'undefined') Camera.moveTo(x, y);

    UI.toast(`${name} moved into the cove!`, 'heart');
    return runtimeEntry;
  },

  bornBaby(parentA, parentB) {
    const px = (parentA.x + parentB.x) / 2 + (Math.random() * 40 - 20);
    const py = (parentA.y + parentB.y) / 2 + 30;
    const childLook = Roles.randomLook();
    // baby inherits a bit from parents
    if (Math.random() < 0.5 && parentA.def.look) childLook.skin = parentA.def.look.skin;
    if (Math.random() < 0.5 && parentB.def.look) childLook.hair = parentB.def.look.hair;
    const baby = Spawn.addResidentAt(px, py, {
      name: Relationships.makeBabyName(parentA, parentB),
      look: childLook,
      archetype: 'child',
      role: 'Citizen',
    });
    baby.parents = [parentA.def.id, parentB.def.id];
    return baby;
  },
};
