/* touch.js — Tomodachi-style: tap a resident or building to interact, long-press a chibi to drag, otherwise drag pans camera. */
const Touch = {
  active: null,
  startX: 0, startY: 0,
  lastX: 0, lastY: 0,
  startWorldX: 0, startWorldY: 0,
  moved: false,
  draggingResident: null,
  pressTimer: null,

  init() {
    canvas.addEventListener('touchstart', Touch.onStart, { passive: false });
    canvas.addEventListener('touchmove',  Touch.onMove,  { passive: false });
    canvas.addEventListener('touchend',   Touch.onEnd,   { passive: false });
    canvas.addEventListener('touchcancel',Touch.onEnd,   { passive: false });
  },

  onStart(e) {
    if (e.touches.length !== 1) {
      Touch.active = null;
      Touch.endResidentDrag(false);
      return;
    }
    const r = canvas.getBoundingClientRect();
    const t = e.touches[0];
    Touch.active = t.identifier;
    Touch.startX = Touch.lastX = (t.clientX - r.left) * (canvas.width / r.width);
    Touch.startY = Touch.lastY = (t.clientY - r.top)  * (canvas.height / r.height);
    Touch.moved = false;
    const w = Camera.screenToWorld(Touch.startX, Touch.startY);
    Touch.startWorldX = w.x; Touch.startWorldY = w.y;

    // long-press on a resident → drag-to-meet
    const res = Editor.pickResidentAt(w.x, w.y);
    if (res) {
      Touch.pressTimer = setTimeout(() => {
        Touch.pressTimer = null;
        if (Touch.active != null) {
          Touch.draggingResident = res;
          Editor.startDrag(res);
        }
      }, 250);
    }
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
      if (Math.hypot(sx - Touch.startX, sy - Touch.startY) > 6) {
        Touch.moved = true;
        // movement before long-press cancels long-press start (treat as pan)
        if (Touch.pressTimer && !Touch.draggingResident) {
          clearTimeout(Touch.pressTimer);
          Touch.pressTimer = null;
        }
      }
      if (Touch.draggingResident) {
        const w = Camera.screenToWorld(sx, sy);
        Editor.moveDrag(w.x, w.y);
      } else {
        Camera.panBy(dx, dy);
      }
      Touch.lastX = sx; Touch.lastY = sy;
    }
  },

  onEnd(e) {
    if (Touch.active == null) return;
    if (Touch.pressTimer) { clearTimeout(Touch.pressTimer); Touch.pressTimer = null; }
    if (Touch.draggingResident) {
      Touch.endResidentDrag(true);
    } else if (!Touch.moved) {
      // tap — interact
      const w = Camera.screenToWorld(Touch.startX, Touch.startY);
      Game.tapAt(w.x, w.y);
    }
    Touch.active = null;
  },

  endResidentDrag(commit) {
    if (Touch.draggingResident) {
      if (commit) Editor.endDrag();
      else { Editor.draggingResident = null; if (Editor.hoverPair) Editor.hoverPair = null; }
      Touch.draggingResident = null;
    }
  },

  joystickVec() { return null; },
  drawJoystick() {},
};
