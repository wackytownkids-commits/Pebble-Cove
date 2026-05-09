/* camera.js — Tomodachi-style: camera centers on island, free pan + zoom. */
const Camera = {
  zoom: 1.0, zoomTarget: 1.0,
  minZoom: 0.4, maxZoom: 2.5,
  panX: 640, panY: 360,
  panTargetX: 640, panTargetY: 360,

  init() {
    canvas.addEventListener('wheel', e => {
      e.preventDefault();
      const dir = e.deltaY < 0 ? 1.1 : 0.9;
      Camera.zoomTarget = Math.max(Camera.minZoom, Math.min(Camera.maxZoom, Camera.zoomTarget * dir));
    }, { passive: false });
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
    Camera.jumpTo(World.W/2, World.H/2);
  },

  update(dt) {
    Camera.zoom += (Camera.zoomTarget - Camera.zoom) * Math.min(1, dt * 6);
    Camera.panX += (Camera.panTargetX - Camera.panX) * Math.min(1, dt * 8);
    Camera.panY += (Camera.panTargetY - Camera.panY) * Math.min(1, dt * 8);
  },

  apply(ctx) {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    ctx.translate(cx, cy);
    ctx.scale(Camera.zoom, Camera.zoom);
    ctx.translate(-Camera.panX, -Camera.panY);
  },

  screenToWorld(sx, sy) {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    return {
      x: (sx - cx) / Camera.zoom + Camera.panX,
      y: (sy - cy) / Camera.zoom + Camera.panY,
    };
  },

  moveTo(x, y) { Camera.panTargetX = x; Camera.panTargetY = y; },
  jumpTo(x, y) { Camera.panX = Camera.panTargetX = x; Camera.panY = Camera.panTargetY = y; },
  panBy(dxScreen, dyScreen) {
    Camera.panTargetX -= dxScreen / Camera.zoom;
    Camera.panTargetY -= dyScreen / Camera.zoom;
    Camera.panTargetX = Math.max(-200, Math.min(World.W + 200, Camera.panTargetX));
    Camera.panTargetY = Math.max(-200, Math.min(World.H + 200, Camera.panTargetY));
  }
};
