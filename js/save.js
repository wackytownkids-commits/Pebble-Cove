/* ============================================================
   save.js — localStorage save/load
   ============================================================ */

const Save = {
  KEY: 'pebble-cove-save-v1',

  save() {
    const blob = {
      v: 1,
      gameState: {
        playerName: gameState.playerName,
        coins: gameState.coins,
        dayNumber: gameState.dayNumber,
        seasonIndex: gameState.seasonIndex,
        timeOfDay: gameState.timeOfDay,
        inventory: gameState.inventory,
      },
      needs: { ...Needs },
      relationships: Relationships.data,
      playerLove: Relationships.playerLove,
      residents: Residents.runtime.map(r => ({
        id: r.def.id,
        x: r.x, y: r.y,
        partner: r.partner,
        pregnant: r.pregnant,
        pregnancyStartedAt: r.pregnancyStartedAt,
        partnerForBaby: r.partnerForBaby,
        babies: r.babies || [],
      })),
      letters: Letters.todays,
    };
    try {
      localStorage.setItem(Save.KEY, JSON.stringify(blob));
    } catch (e) {
      console.error('save fail', e);
    }
  },

  load() {
    const raw = localStorage.getItem(Save.KEY);
    if (!raw) return false;
    try {
      const blob = JSON.parse(raw);
      Object.assign(gameState, blob.gameState);
      Object.assign(Needs, blob.needs);
      Relationships.data = blob.relationships;
      Relationships.playerLove = blob.playerLove;
      for (const rs of blob.residents) {
        const r = Residents.byId(rs.id);
        if (!r) continue;
        r.x = rs.x; r.y = rs.y;
        r.partner = rs.partner;
        r.pregnant = rs.pregnant;
        r.pregnancyStartedAt = rs.pregnancyStartedAt;
        r.partnerForBaby = rs.partnerForBaby;
        r.babies = rs.babies || [];
      }
      Letters.todays = blob.letters;
      return true;
    } catch (e) {
      console.error('load fail', e);
      return false;
    }
  },

  exists() { return !!localStorage.getItem(Save.KEY); },
  wipe()   { localStorage.removeItem(Save.KEY); },
};
