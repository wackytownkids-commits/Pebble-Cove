/* ============================================================
   needs.js — hunger, thirst, energy, social meters.
   These tick down over time and are restored by actions.
   ============================================================ */

const Needs = {
  hunger: 80, thirst: 80, energy: 90, social: 70,
  drainPerSecond: { hunger: 0.18, thirst: 0.22, energy: 0.10, social: 0.06 },

  tick(dt) {
    Needs.hunger = Math.max(0, Needs.hunger - Needs.drainPerSecond.hunger * dt);
    Needs.thirst = Math.max(0, Needs.thirst - Needs.drainPerSecond.thirst * dt);
    Needs.energy = Math.max(0, Needs.energy - Needs.drainPerSecond.energy * dt);
    Needs.social = Math.max(0, Needs.social - Needs.drainPerSecond.social * dt);

    // emergency penalties
    if (Needs.hunger < 10 || Needs.thirst < 10) Needs.energy = Math.max(0, Needs.energy - 0.05 * dt);
  },

  eat(amount = 30)    { Needs.hunger = Math.min(100, Needs.hunger + amount); UI.toast(`🍞 +${amount} hunger`); },
  drink(amount = 30)  { Needs.thirst = Math.min(100, Needs.thirst + amount); UI.toast(`💧 +${amount} thirst`); },
  sleep(amount = 60)  { Needs.energy = Math.min(100, Needs.energy + amount); UI.toast(`💤 +${amount} energy`); },
  socialize(amount = 18) { Needs.social = Math.min(100, Needs.social + amount); }
};
