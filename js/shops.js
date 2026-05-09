/* shops.js — every 5 residents you unlock a new shop. Player places it. */
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
    UI.toast(`New shop unlocked: ${s.name}! Tap where to place it.`, 'heart');
    if (typeof Audio !== 'undefined') Audio.heart();
    if (typeof PlaceMode !== 'undefined') {
      PlaceMode.start('shop', `Tap to place: ${s.name}`, (x, y) => {
        World.buildings.push({ x, y, w: 100, h: 70, body: s.color, roof: s.roof, sign: s.sign });
        UI.toast(`${s.name} placed!`, 'heart');
      });
    } else {
      World.buildings.push({ x: World.W/2 + 100, y: World.H/2, w: 100, h: 70, body: s.color, roof: s.roof, sign: s.sign });
    }
  },
};
