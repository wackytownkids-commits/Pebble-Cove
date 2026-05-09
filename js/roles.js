/* ============================================================
   roles.js — President / VP / worker / citizen role system,
   plus a name pool for new residents (born babies, added by player).
   ============================================================ */

const Roles = {
  available: ['Citizen', 'Worker', 'Shopkeeper', 'Vice President', 'President'],

  // assign defaults: Pip is shopkeeper, no president yet
  init() {
    for (const r of Residents.runtime) {
      if (r.def.id === 'pip')      r.role = 'Shopkeeper';
      else if (r.def.id === 'mum') r.role = 'Worker';      // bakery
      else if (r.def.id === 'mayor') r.role = 'President';
      else                          r.role = 'Citizen';
    }
  },

  count(role) {
    return Residents.runtime.filter(r => r.role === role).length;
  },

  president() { return Residents.runtime.find(r => r.role === 'President'); },
  vp()        { return Residents.runtime.find(r => r.role === 'Vice President'); },

  assign(residentId, role) {
    const r = Residents.byId(residentId);
    if (!r) return false;
    if (role === 'President' && Roles.count('President') > 0 && Roles.president().def.id !== residentId) {
      // demote existing president to Citizen
      Roles.president().role = 'Citizen';
    }
    if (role === 'Vice President' && Roles.count('Vice President') > 0 && Roles.vp().def.id !== residentId) {
      Roles.vp().role = 'Citizen';
    }
    r.role = role;
    UI.toast(`${r.def.name} is now ${role}`);
    return true;
  },

  // name pool for procedural residents (babies / added-by-player)
  firstNames: ['Pebble','Reed','Lark','Fern','Lila','Toby','Rye','Wren','Eli','Asa','Maeve','Juno','Pip','Mossy','Quill','Olive','Saffy','Bea','Cleo','Hugo','Jin','Kira','Nori','Otis','Rumi','Sora','Velvet','Yumi','Zephyr','Aki'],

  surnames: ['Driftwood','Salt','Marigold','Beacon','Tide','Cove','Ripple','Sandcrest','Foam','Dunes'],

  randomName() {
    const a = Roles.firstNames[(Math.random() * Roles.firstNames.length) | 0];
    const b = Roles.surnames[(Math.random() * Roles.surnames.length) | 0];
    return a + ' ' + b;
  },

  randomLook() {
    const skin = ['#fbe0c8','#f8d2b0','#e8c0a0','#d8a888','#c89878','#fbd9b8'][Math.floor(Math.random()*6)];
    const hair = ['#3a2a4a','#88c068','#ffb0c8','#a888c8','#c08060','#5a3a2a','#88c8e8','#ffd870','#3a1a1a'][Math.floor(Math.random()*9)];
    const styles = ['short','long','puff','bun','spiky'];
    const outfits = ['#f5a3a3','#5894c0','#f5b0d0','#b0c0e0','#a0e090','#ffd870','#dcc8f0','#7848a8','#4a7048','#5a3a4a','#5a4a8a'];
    return {
      skin,
      hair,
      hairStyle: styles[Math.floor(Math.random()*styles.length)],
      hairBack: Math.random() < 0.4,
      outfit: outfits[Math.floor(Math.random()*outfits.length)],
      legs: '#3a3a3a',
      mood: ['happy','neutral','happy','happy'][Math.floor(Math.random()*4)],
      accessory: Math.random() < 0.15 ? 'glasses' : (Math.random() < 0.1 ? 'hat' : 'none'),
      hatColor: '#5a3a4a',
      bgTint: '#dcc8f0'
    };
  },
};
