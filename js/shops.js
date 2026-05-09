/* shops.js — every 5 residents you unlock a new shop. */
const Shops = {
  unlocked: [],
  catalog: [
    { id:'cafe',    name:'Cafe',         color:'#fbd9b8', roof:'#e85088', sign:'CAFE',    threshold:5 },
    { id:'bakery',  name:'Bakery',       color:'#ffe0a0', roof:'#f5a358', sign:'BAKERY',  threshold:10 },
    { id:'gallery', name:'Art Gallery',  color:'#dcc8f0', roof:'#7848a8', sign:'GALLERY', threshold:15 },
    { id:'arcade',  name:'Arcade',       color:'#a8d8ff', roof:'#5894c0', sign:'ARCADE',  threshold:20 },
    { id:'salon',   name:'Hair Salon',   color:'#f8d8e8', roof:'#e8a0c0', sign:'SALON',   threshold:25 },
    { id:'theater', name:'Theater',      color:'#5a3a4a', roof:'#3a1a3a', sign:'THEATER', threshold:30 },
  ],

  // call after every population change
  check() {
    const n = Residents.runtime.length;
    for (const s of Shops.catalog) {
      if (n >= s.threshold && !Shops.unlocked.includes(s.id)) {
        Shops.unlocked.push(s.id);
        Shops.spawnShop(s);
      }
    }
  },

  spawnShop(s) {
    // place near the cove center but offset so it doesn't overlap others
    const idx = Shops.unlocked.length - 1;
    const angle = idx * 1.2;
    const r = 220;
    const x = World.W/2 + Math.cos(angle) * r;
    const y = World.H/2 + Math.sin(angle) * r * 0.6;
    World.buildings.push({ x, y, w: 100, h: 70, body: s.color, roof: s.roof, sign: s.sign });
    UI.toast(`🏪 New shop unlocked: ${s.name}!`, 'heart');
    if (typeof Audio !== 'undefined') Audio.heart();
  },
};
