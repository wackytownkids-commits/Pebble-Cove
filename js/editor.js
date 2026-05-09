/* ============================================================
   editor.js — World editor (build mode). Press B to toggle.
   Place trees, flowers, houses. Drag residents. Add new residents.
   ============================================================ */

const Editor = {
  active: false,
  tool: 'select',       // 'select' | 'tree' | 'flower' | 'house' | 'add_resident' | 'erase'
  draggingResident: null,
  hoverPair: null,

  toggle() {
    Editor.active = !Editor.active;
    UI.toast(Editor.active ? '🛠 Edit mode: ON' : '🛠 Edit mode: OFF');
    document.getElementById('editor-toolbar')?.classList.toggle('hidden', !Editor.active);
  },

  setTool(t) {
    Editor.tool = t;
    document.querySelectorAll('#editor-toolbar button').forEach(b =>
      b.classList.toggle('active', b.dataset.tool === t));
  },

  onWorldClick(x, y) {
    if (!Editor.active) return false;
    if (Editor.tool === 'tree') {
      World.trees.push({ x, y, scale: 0.85 + Math.random()*0.5 });
    } else if (Editor.tool === 'flower') {
      const colors = ['#ffd0d8','#ffe0a8','#c0d8ff','#d8c0ff','#ffb0d8'];
      World.flowers.push({ x, y, color: colors[Math.floor(Math.random()*5)] });
    } else if (Editor.tool === 'house') {
      const tints = [
        { body:'#fbd9b8', roof:'#e85088' },
        { body:'#ffe0a0', roof:'#f5a358' },
        { body:'#f8d8e8', roof:'#e8a0c0' },
        { body:'#d8d0e8', roof:'#a888c0' },
        { body:'#c0d8e8', roof:'#5894c0' },
      ];
      const t = tints[Math.floor(Math.random()*tints.length)];
      World.buildings.push({ x, y, w: 80, h: 60, body: t.body, roof: t.roof, sign: '' });
    } else if (Editor.tool === 'add_resident') {
      Spawn.addResidentAt(x, y);
    } else if (Editor.tool === 'erase') {
      Editor.eraseAt(x, y);
    }
    return true;
  },

  eraseAt(x, y) {
    // try trees
    for (let i = World.trees.length - 1; i >= 0; i--) {
      const tr = World.trees[i];
      if (Math.hypot(tr.x - x, tr.y - y) < 18) { World.trees.splice(i, 1); return; }
    }
    for (let i = World.flowers.length - 1; i >= 0; i--) {
      const f = World.flowers[i];
      if (Math.hypot(f.x - x, f.y - y) < 6) { World.flowers.splice(i, 1); return; }
    }
    for (let i = World.buildings.length - 1; i >= 0; i--) {
      const b = World.buildings[i];
      if (Math.abs(b.x - x) < b.w/2 && Math.abs(b.y - y) < b.h/2) { World.buildings.splice(i, 1); return; }
    }
  },

  // start dragging a resident (in any mode if you click on one)
  pickResidentAt(x, y) {
    for (const r of Residents.runtime) {
      if (Math.hypot(r.x - x, r.y - y + 30) < 30) return r;
    }
    return null;
  },

  startDrag(r) {
    Editor.draggingResident = r;
    r.beingDragged = true;
  },

  moveDrag(x, y) {
    if (!Editor.draggingResident) return;
    Editor.draggingResident.x = x;
    Editor.draggingResident.y = y;
    Editor.draggingResident.tx = x;
    Editor.draggingResident.ty = y;
    // see if hovering another resident
    Editor.hoverPair = null;
    for (const r of Residents.runtime) {
      if (r === Editor.draggingResident) continue;
      if (Math.hypot(r.x - x, r.y - y) < 38) { Editor.hoverPair = r; break; }
    }
  },

  endDrag() {
    if (!Editor.draggingResident) return;
    const a = Editor.draggingResident;
    const b = Editor.hoverPair;
    a.beingDragged = false;
    Editor.draggingResident = null;
    if (b && b !== a) {
      Editor.tryMeet(a, b);
    }
    Editor.hoverPair = null;
  },

  tryMeet(a, b) {
    if (Phases.hasMet(a.def.id, b.def.id)) {
      // already met — small affinity bump from quality time
      Phases.bumpAffinity(a.def.id, b.def.id, 4);
      UI.spark(a.x, a.y - 70, '+4');
      return;
    }
    // 50/50: do they hit it off? coin flip per Tomodachi style
    const chance = 0.5;
    const ok = Math.random() < chance;
    Phases.meet(a.def.id, b.def.id);
    const rec = Phases.rec(a.def.id, b.def.id);
    if (!ok) {
      // bad first impression, drag the affinity down a little
      rec.affinity = 2;
      rec.thawAt = gameState.dayNumber + 4;
      UI.toast(`${a.def.name} and ${b.def.name} met. They didn't hit it off.`);
    } else {
      rec.affinity = 14;
      rec.thawAt = gameState.dayNumber + 1;
      UI.toast(`💗 ${a.def.name} and ${b.def.name} hit it off!`, 'heart');
    }
  },

  drawBarrier(ctx) {
    // glowing edge showing playable area
    const b = World.barrier();
    ctx.strokeStyle = 'rgba(232, 80, 136, 0.55)';
    ctx.lineWidth = 4;
    ctx.setLineDash([12, 8]);
    ctx.strokeRect(b.x, b.y, b.w, b.h);
    ctx.setLineDash([]);
  },

  drawHover(ctx) {
    if (!Editor.draggingResident) return;
    if (Editor.hoverPair) {
      Sprites.drawHeart(ctx, Editor.hoverPair.x, Editor.hoverPair.y - 80, 28, '#ff5894');
    }
  }
};
