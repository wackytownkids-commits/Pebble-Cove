const World = {
  // FIXED world bounds (world coords). Terrain doesn't depend on canvas size.
  W: 1280,
  H: 720,

  trees: [],
  flowers: [],
  buildings: [],
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
      UI.toast(`The cove expands! (${Residents.runtime.length} residents)`, 'heart');
    }
  },

  init() {
    World.buildings = [];
    World.trees = [];
    World.flowers = [];
    // sprinkle some default decor only if not in empty mode
    if (!gameState._emptyMode) {
      World.buildings = [
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
      ];
      const placements = [
        [120, 320], [80, 440], [180, 480], [300, 220], [380, 280],
        [600, 260], [620, 420], [880, 510], [1010, 320], [1050, 460],
        [1230, 240], [1240, 540], [1230, 660],
        [320, 580], [180, 700], [440, 720], [560, 700], [700, 720],
        [820, 700], [960, 700], [1100, 700]
      ];
      for (const [x, y] of placements) World.trees.push({ x, y, scale: 0.85 + Math.random()*0.5 });
      for (let i = 0; i < 60; i++) {
        const x = 60 + Math.random() * 1180;
        const y = 200 + Math.random() * 540;
        const onBuilding = World.buildings.some(b => Math.abs(b.x - x) < 65 && Math.abs(b.y - y) < 50);
        if (onBuilding) continue;
        const color = ['#ffd0d8','#ffe0a8','#c0d8ff','#d8c0ff','#ffb0d8'][i%5];
        World.flowers.push({ x, y, color });
      }
    }
  },

  // SKY drawn in screen space (before camera)
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

  // TERRAIN drawn in WORLD coords (after camera applied)
  drawTerrain(ctx) {
    const W = World.W, H = World.H;
    // ocean (extends beyond island in all directions, big)
    ctx.fillStyle = '#5894c0';
    ctx.fillRect(-1000, -1000, W + 2000, H + 2500);
    // wave shimmer
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    for (let i = 0; i < 80; i++) {
      const x = -1000 + (i * 173 + performance.now()*0.015) % (W + 2000);
      const y = -800 + (i * 91) % (H + 2200);
      ctx.fillRect(x, y, 12, 2);
    }
    // island base — soft round shape
    ctx.fillStyle = '#fbe8c0';
    ctx.beginPath();
    ctx.ellipse(W/2, H/2 + 30, W*0.55, H*0.55, 0, 0, Math.PI*2);
    ctx.fill();
    // sand → grass transition
    const g = ctx.createRadialGradient(W/2, H/2, H*0.15, W/2, H/2, H*0.55);
    g.addColorStop(0, '#b8dca0');
    g.addColorStop(0.85, '#b8dca0');
    g.addColorStop(1, '#fbe8c0');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(W/2, H/2 + 10, W*0.5, H*0.48, 0, 0, Math.PI*2);
    ctx.fill();
    // grass tufts
    ctx.fillStyle = '#a0c890';
    for (let i = 0; i < 200; i++) {
      const x = (i * 137) % W;
      const y = (i * 91) % H;
      const dx = x - W/2, dy = y - H/2;
      if (dx*dx/(W*W*0.20) + dy*dy/(H*H*0.20) > 1) continue;
      ctx.fillRect(x, y, 3, 2);
    }
    // dirt path
    ctx.fillStyle = '#d8b888';
    ctx.beginPath();
    ctx.moveTo(0, H*0.62);
    ctx.bezierCurveTo(W*0.3, H*0.55, W*0.7, H*0.7, W, H*0.6);
    ctx.lineTo(W, H*0.66);
    ctx.bezierCurveTo(W*0.7, H*0.76, W*0.3, H*0.63, 0, H*0.7);
    ctx.closePath();
    ctx.fill();
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
    if (World.lighthouse) Sprites.drawLighthouse(ctx, World.lighthouse.x, World.lighthouse.y, t);
    if (World.mailbox)    Sprites.drawMailbox(ctx, World.mailbox.x, World.mailbox.y, gameState.unreadMail > 0);
    const fx = World.cafePos.x, fy = World.cafePos.y;
    ctx.fillStyle = 'rgba(60,30,30,0.18)';
    ctx.beginPath(); ctx.ellipse(fx, fy + 4, 36, 8, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#c8c0b8';
    ctx.beginPath(); ctx.arc(fx, fy, 28, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#88c8e8';
    ctx.beginPath(); ctx.arc(fx, fy, 22, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#5894c0';
    ctx.beginPath(); ctx.arc(fx, fy, 6, 0, Math.PI*2); ctx.fill();
  },

  drawDecor(ctx, t) {
    for (const f of World.flowers) Sprites.drawFlower(ctx, f.x, f.y, f.color);
  },

  drawTrees(ctx, t) {
    const sorted = [...World.trees].sort((a,b) => a.y - b.y);
    for (const tr of sorted) Sprites.drawTree(ctx, tr.x, tr.y, t, tr.scale);
  },

  // tap-to-interact: returns interaction object at world (px,py)
  nearbyInteraction(px, py) {
    if (World.mailbox && Math.hypot(px - World.mailbox.x, py - World.mailbox.y) < 50)
      return { kind:'mailbox', label: 'Open mailbox' };
    if (World.lighthouse && Math.hypot(px - World.lighthouse.x, py - World.lighthouse.y - 30) < 60)
      return { kind:'home', label: 'Sleep' };
    if (Math.hypot(px - World.cafePos.x, py - World.cafePos.y) < 50)
      return { kind:'fountain', label: 'Drink' };
    for (const r of Residents.runtime) {
      if (Math.hypot(px - r.x, py - r.y + 30) < 38) {
        return { kind:'talk', resident: r, label: r.def.name };
      }
    }
    return null;
  }
};
