/* touch.js — Tomodachi-style: tap a resident or building to interact, drag to pan camera. */
const Touch = {
  active: null,        // current single-touch
  startX: 0, startY: 0,
  lastX: 0, lastY: 0,
  moved: false,

  init() {
    canvas.addEventListener('touchstart', Touch.onStart, { passive: false });
    canvas.addEventListener('touchmove',  Touch.onMove,  { passive: false });
    canvas.addEventListener('touchend',   Touch.onEnd,   { passive: false });
    canvas.addEventListener('touchcancel',Touch.onEnd,   { passive: false });
  },

  onStart(e) {
    if (e.touches.length !== 1) { Touch.active = null; return; }
    const r = canvas.getBoundingClientRect();
    const t = e.touches[0];
    Touch.active = t.identifier;
    Touch.startX = Touch.lastX = (t.clientX - r.left) * (canvas.width / r.width);
    Touch.startY = Touch.lastY = (t.clientY - r.top)  * (canvas.height / r.height);
    Touch.moved = false;
  },

  onMove(e) {
    if (Touch.active == null) return;
    e.preventDefault();
    const r = canvas.getBoundingClientRect();
    for (const t of e.changedTouches) {
      if (t.identifier !== Touch.active) continue;
      const sx = (t.clientX - r.left) * (canvas.width / r.width);
      const sy = (t.clientY - r.top)  * (canvas.height / r.height);
      const dx = sx - Touch.lastX, dy = sy - Touch.lastY;
      if (Math.hypot(sx - Touch.startX, sy - Touch.startY) > 6) Touch.moved = true;
      // pan camera
      Camera.panBy(dx, dy);
      Touch.lastX = sx; Touch.lastY = sy;
    }
  },

  onEnd(e) {
    if (Touch.active == null) return;
    if (!Touch.moved) {
      // it was a tap — interact
      const w = Camera.screenToWorld(Touch.startX, Touch.startY);
      Game.tapAt(w.x, w.y);
    }
    Touch.active = null;
  },

  // legacy compatibility
  joystickVec() { return null; },
  drawJoystick() {},
};
