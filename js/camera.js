/* camera.js — pan + zoom. World coords stay the same; we apply a single
   transform before drawing. */
const Camera = {
  zoom: 1.0,
  zoomTarget: 1.0,
  minZoom: 0.5,
  maxZoom: 2.5,

  init() {
    canvas.addEventListener('wheel', e => {
      e.preventDefault();
      const dir = e.deltaY < 0 ? 1.1 : 0.9;
      Camera.zoomTarget = Math.max(Camera.minZoom, Math.min(Camera.maxZoom, Camera.zoomTarget * dir));
    }, { passive: false });
    // pinch zoom
    let pinchStartDist = 0, pinchStartZoom = 1;
    canvas.addEventListener('touchstart', e => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchStartDist = Math.hypot(dx, dy);
        pinchStartZoom = Camera.zoomTarget;
      }
    }, { passive: true });
    canvas.addEventListener('touchmove', e => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const d = Math.hypot(dx, dy);
        if (pinchStartDist > 0) {
          const k = d / pinchStartDist;
          Camera.zoomTarget = Math.max(Camera.minZoom, Math.min(Camera.maxZoom, pinchStartZoom * k));
        }
      }
    }, { passive: true });
  },

  // smoothly approach zoomTarget
  update(dt) {
    Camera.zoom += (Camera.zoomTarget - Camera.zoom) * Math.min(1, dt * 6);
  },

  // apply transform (call before drawing world)
  apply(ctx) {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    // center on player
    const px = gameState && gameState.player ? gameState.player.x : cx;
    const py = gameState && gameState.player ? gameState.player.y : cy;
    ctx.translate(cx, cy);
    ctx.scale(Camera.zoom, Camera.zoom);
    ctx.translate(-px, -py);
  },

  // screen → world
  screenToWorld(sx, sy) {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const px = gameState && gameState.player ? gameState.player.x : cx;
    const py = gameState && gameState.player ? gameState.player.y : cy;
    return {
      x: (sx - cx) / Camera.zoom + px,
      y: (sy - cy) / Camera.zoom + py,
    };
  }
};
