const World = {
  trees: [],
  flowers: [],
  buildings: [
    { x: 1100, y: 540, w: 100, h: 70, body:'#fbd9b8', roof:'#e85088', sign:'BAKERY' },
    { x: 800,  y: 280, w: 120, h: 70, body:'#ffe0a0', roof:'#f5a358', sign:'STORE' },
    { x: 880,  y: 360, w: 90,  h: 60, body:'#f8d8e8', roof:'#e8a0c0', sign:'' },
    { x: 460,  y: 420, w: 80,  h: 65, body:'#d8d0e8', roof:'#a888c0', sign:'' },
    { x: 250,  y: 580, w: 80,  h: 60, body:'#c0d8e8', roof:'#5894c0', sign:'' },
    { x: 1180, y: 380, w: 75,  h: 60, body:'#5a3a4a', roof:'#3a1a3a', sign:'' },
    { x: 380,  y: 660, w: 90,  h: 50, body:'#a0c898', roof:'#5a8050', sign:'GARDEN' },
    { x: 220,  y: 320, w: 75,  h: 60, body:'#dcc8f0', roof:'#7848a8', sign:'' },
    { x: 540,  y: 340, w: 90,  h: 60, body:'#e8d8f8', roof:'#a888c8', sign:'TWINS' },
    { x: 740,  y: 300, w: 100, h: 70, body:'#a8a8d0', roof:'#5a4a8a', sign:'TOWN HALL' },
  ],
  lighthouse: { x: 950, y: 320 },
  mailbox: { x: 990, y: 350 },
  cafePos: { x: 640, y: 640 },

  barrierLevel: 0,
  barrier() {
    const grow = World.barrierLevel * 60;
    return { x: 30 - grow, y: 180 - grow, w: 1220 + grow * 2, h: 540 + grow * 2 };
  },
  maybeExpandBarrier() {
    const target = Math.floor(Residents.runtime.length / 10);
    if (target > World.barrierLevel) {
      World.barrierLevel = target;
      UI.toast(`The cove expands! Barrier grew. (${Residents.runtime.length} residents)`, 'heart');
    }
  },

  init() {
    World.trees = [];
    const placements = [
      [120, 320], [80, 440], [180, 480], [300, 220], [380, 280],
      [600, 260], [620, 420], [880, 510], [1010, 320], [1050, 460],
      [1230, 240], [1240, 540], [1230, 660],
      [320, 580], [180, 700], [440, 720], [560, 700], [700, 720],
      [820, 700], [960, 700], [1100, 700]
    ];
    for (const [x, y] of placements) World.trees.push({ x, y, scale: 0.85 + Math.random()*0.5 });
    World.flowers = [];
    for (let i = 0; i < 60; i++) {
      const x = 60 + Math.random() * 1180;
      const y = 200 + Math.random() * 540;
      const onBuilding = World.buildings.some(b => Math.abs(b.x - x) < 65 && Math.abs(b.y - y) < 50);
      if (onBuilding) continue;
      const color = ['#ffd0d8','#ffe0a8','#c0d8ff','#d8c0ff','#ffb0d8'][i%5];
      World.flowers.push({ x, y, color });
    }
  },

  drawSky(ctx, hour) {
    const w = canvas.width, h = canvas.height;
    let top, bot;
    if (hour >= 5 && hour < 7) { top = '#ffc0d8'; bot = '#ffe6b8'; }
    else if (hour >= 7 && hour < 17) { top = '#a8d8ff'; bot = '#e8f4ff'; }
    else if (hour >= 17 && hour < 20) { top = '#e88090'; bot = '#ffd0a0'; }
    else { top = '#1a1a3a'; bot = '#3a3a6a'; }
    const g = ctx.createLinearGradient(0, 0, 0, h * 0.6);
    g.addColorStop(0, top); g.addColorStop(1, bot);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    if (hour < 5 || hour >= 20) {
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      for (let i = 0; i < 60; i++) {
        const sx = (i * 173) % w;
        const sy = (i * 97) % (h * 0.4);
        const tw = 1 + ((i * 13) % 2);
        ctx.fillRect(sx, sy, tw, tw);
      }
    }
  },

  drawTerrain(ctx) {
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = '#b8dca0';
    ctx.fillRect(0, h*0.3, w, h*0.7);
    ctx.fillStyle = '#a0c890';
    for (let i = 0; i < 200; i++) {
      const x = (i * 137) % w;
      const y = h*0.3 + ((i * 91) % (h*0.6));
      ctx.fillRect(x, y, 3, 2);
    }
    ctx.fillStyle = '#d8b888';
    ctx.beginPath();
    ctx.moveTo(0, h*0.62);
    ctx.bezierCurveTo(w*0.3, h*0.55, w*0.7, h*0.7, w, h*0.6);
    ctx.lineTo(w, h*0.66);
    ctx.bezierCurveTo(w*0.7, h*0.76, w*0.3, h*0.63, 0, h*0.7);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fbe8c0';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.85);
    ctx.bezierCurveTo(w*0.2, h*0.82, w*0.5, h*0.88, w, h*0.84);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();
    const wg = ctx.createLinearGradient(0, h*0.93, 0, h);
    wg.addColorStop(0, '#88c8e8'); wg.addColorStop(1, '#5894c0');
    ctx.fillStyle = wg;
    ctx.fillRect(0, h*0.93, w, h*0.07);
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 4; i++) {
      const yLine = h*0.93 + i*4 + Math.sin(performance.now()*0.001 + i)*1.5;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 8) {
        const dy = Math.sin((x + performance.now()*0.05 + i*30) * 0.04) * 1.2;
        if (x === 0) ctx.moveTo(x, yLine + dy);
        else ctx.lineTo(x, yLine + dy);
      }
      ctx.stroke();
    }
  },

  drawNightOverlay(ctx, hour) {
    if (hour >= 7 && hour < 18) return;
    let alpha = 0;
    if (hour < 5) alpha = 0.45;
    else if (hour < 7) alpha = 0.45 - (hour - 5) * 0.225;
    else if (hour < 18) alpha = 0;
    else if (hour < 20) alpha = (hour - 18) * 0.225;
    else alpha = 0.45;
    ctx.fillStyle = `rgba(20, 20, 50, ${alpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  },

  drawBuildings(ctx, t) {
    for (const b of World.buildings) {
      Sprites.drawHouse(ctx, b.x, b.y, b.w, b.h, b);
    }
    Sprites.drawLighthouse(ctx, World.lighthouse.x, World.lighthouse.y, t);
    Sprites.drawMailbox(ctx, World.mailbox.x, World.mailbox.y, gameState.unreadMail > 0);
    const fx = World.cafePos.x, fy = World.cafePos.y;
    ctx.fillStyle = 'rgba(60,30,30,0.18)';
    ctx.beginPath(); ctx.ellipse(fx, fy + 4, 36, 8, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#c8c0b8';
    ctx.beginPath(); ctx.arc(fx, fy, 28, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#88c8e8';
    ctx.beginPath(); ctx.arc(fx, fy, 22, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#5894c0';
    ctx.beginPath(); ctx.arc(fx, fy, 6, 0, Math.PI*2); ctx.fill();
    for (let i = 0; i < 5; i++) {
      const a = (t * 0.003 + i) % 1;
      const sy = fy - a * 18;
      ctx.fillStyle = `rgba(180, 220, 240, ${1 - a})`;
      ctx.fillRect(fx + Math.sin(i*1.7)*3, sy, 2, 2);
    }
  },

  drawDecor(ctx, t) {
    for (const f of World.flowers) Sprites.drawFlower(ctx, f.x, f.y, f.color);
  },

  drawTrees(ctx, t) {
    const sorted = [...World.trees].sort((a,b) => a.y - b.y);
    for (const tr of sorted) Sprites.drawTree(ctx, tr.x, tr.y, t, tr.scale);
  },

  nearbyInteraction(px, py) {
    if (Math.hypot(px - World.mailbox.x, py - World.mailbox.y) < 50)
      return { kind:'mailbox', label: 'Open mailbox' };
    if (Math.hypot(px - World.lighthouse.x, py - World.lighthouse.y - 30) < 60)
      return { kind:'home', label: 'Sleep / cook / craft' };
    if (Math.hypot(px - World.cafePos.x, py - World.cafePos.y) < 50)
      return { kind:'fountain', label: 'Drink (free)' };
    for (const r of Residents.runtime) {
      if (Math.hypot(px - r.x, py - r.y) < 32) {
        return { kind:'talk', resident: r, label: `Talk to ${r.def.name}` };
      }
    }
    const store = World.buildings.find(b => b.sign === 'STORE');
    if (store && Math.hypot(px - store.x, py - store.y) < 60)
      return { kind:'store', label: 'General Store' };
    const bakery = World.buildings.find(b => b.sign === 'BAKERY');
    if (bakery && Math.hypot(px - bakery.x, py - bakery.y) < 60)
      return { kind:'bakery', label: 'Buy a bun (5 coin)' };
    if (py > canvas.height * 0.85)
      return { kind:'beach', label: 'Forage at shore' };
    return null;
  }
};
