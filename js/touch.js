/* ============================================================
   touch.js — touch input + on-screen joystick for phone testing.
   ============================================================ */

const Touch = {
  joystick: { active: false, baseX: 0, baseY: 0, x: 0, y: 0, id: null },
  dragId: null,            // touch id currently dragging a resident
  dragLast: { x: 0, y: 0 },

  init() {
    if (!('ontouchstart' in window) && !navigator.maxTouchPoints) return;
    document.body.classList.add('touch');
    canvas.addEventListener('touchstart', Touch.onStart, { passive: false });
    canvas.addEventListener('touchmove',  Touch.onMove,  { passive: false });
    canvas.addEventListener('touchend',   Touch.onEnd,   { passive: false });
    canvas.addEventListener('touchcancel',Touch.onEnd,   { passive: false });
  },

  onStart(e) {
    e.preventDefault();
    for (const t of e.changedTouches) {
      const x = t.clientX * (canvas.width / canvas.clientWidth);
      const y = t.clientY * (canvas.height / canvas.clientHeight);

      // Check if touching a resident (drag-to-meet)
      const r = Editor.pickResidentAt(x, y);
      if (r) {
        Touch.dragId = t.identifier;
        Touch.dragLast = { x, y };
        Editor.startDrag(r);
        continue;
      }
      // Otherwise: left half = joystick
      if (!Touch.joystick.active && x < canvas.width / 2) {
        Touch.joystick.active = true;
        Touch.joystick.baseX = x;
        Touch.joystick.baseY = y;
        Touch.joystick.x = x;
        Touch.joystick.y = y;
        Touch.joystick.id = t.identifier;
      } else if (x >= canvas.width / 2) {
        // right side tap = interact
        Game.tryInteract();
      }
    }
  },

  onMove(e) {
    e.preventDefault();
    for (const t of e.changedTouches) {
      const x = t.clientX * (canvas.width / canvas.clientWidth);
      const y = t.clientY * (canvas.height / canvas.clientHeight);
      if (Touch.joystick.active && t.identifier === Touch.joystick.id) {
        Touch.joystick.x = x;
        Touch.joystick.y = y;
      }
      if (Touch.dragId === t.identifier) {
        Editor.moveDrag(x, y);
        Touch.dragLast = { x, y };
      }
    }
  },

  onEnd(e) {
    e.preventDefault();
    for (const t of e.changedTouches) {
      if (t.identifier === Touch.joystick.id) {
        Touch.joystick.active = false;
        Touch.joystick.id = null;
      }
      if (t.identifier === Touch.dragId) {
        Touch.dragId = null;
        Editor.endDrag();
      }
    }
  },

  // returns {vx, vy} like keyboard movement
  joystickVec() {
    if (!Touch.joystick.active) return null;
    const dx = Touch.joystick.x - Touch.joystick.baseX;
    const dy = Touch.joystick.y - Touch.joystick.baseY;
    const d = Math.hypot(dx, dy);
    if (d < 8) return { vx: 0, vy: 0 };
    const max = 60;
    const scale = Math.min(d, max) / max;
    return { vx: (dx / d) * scale, vy: (dy / d) * scale };
  },

  drawJoystick(ctx) {
    if (!Touch.joystick.active) return;
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath(); ctx.arc(Touch.joystick.baseX, Touch.joystick.baseY, 60, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(232, 80, 136, 0.85)';
    const dx = Touch.joystick.x - Touch.joystick.baseX;
    const dy = Touch.joystick.y - Touch.joystick.baseY;
    const d = Math.hypot(dx, dy);
    const maxR = 50;
    const tx = d > maxR ? Touch.joystick.baseX + dx/d*maxR : Touch.joystick.x;
    const ty = d > maxR ? Touch.joystick.baseY + dy/d*maxR : Touch.joystick.y;
    ctx.beginPath(); ctx.arc(tx, ty, 28, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  },
};
