const Input = {
  keys: {},
  mouse: { x: 0, y: 0, down: false },

  init() {
    document.addEventListener('keydown', e => {
      Input.keys[e.key.toLowerCase()] = true;
      Input.handleHotkey(e);
    });
    document.addEventListener('keyup', e => {
      Input.keys[e.key.toLowerCase()] = false;
    });
    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      Input.mouse.x = (e.clientX - r.left) * (canvas.width / r.width);
      Input.mouse.y = (e.clientY - r.top)  * (canvas.height / r.height);
      if (Editor.draggingResident) Editor.moveDrag(Input.mouse.x, Input.mouse.y);
    });
    canvas.addEventListener('mousedown', e => {
      Input.mouse.down = true;
      if (e.button === 2 || Editor.active) {
        const r = Editor.pickResidentAt(Input.mouse.x, Input.mouse.y);
        if (r) { Editor.startDrag(r); return; }
      }
      if (Editor.active && Editor.tool !== 'select') {
        Editor.onWorldClick(Input.mouse.x, Input.mouse.y);
        return;
      }
      const r = Editor.pickResidentAt(Input.mouse.x, Input.mouse.y);
      if (r) Editor.startDrag(r);
    });
    canvas.addEventListener('mouseup', () => {
      Input.mouse.down = false;
      Editor.endDrag();
    });
    canvas.addEventListener('contextmenu', e => e.preventDefault());

    document.querySelectorAll('#editor-toolbar button').forEach(btn => {
      btn.addEventListener('click', () => Editor.setTool(btn.dataset.tool));
    });
  },

  handleHotkey(e) {
    const k = e.key.toLowerCase();
    if (k === 'm')      UI.openPanel('mailbox');
    else if (k === 'r') UI.openPanel('relationships');
    else if (k === 'tab') { e.preventDefault(); UI.openPanel('inventory'); }
    else if (k === 'escape') UI.openPanel('pause');
    else if (k === 'e')      Game.tryInteract();
    else if (k === 'b')      Editor.toggle();
    else if (k === 'c')      UI.openPanel('cookbook');
  },

  movement() {
    let vx = 0, vy = 0;
    if (Input.keys['w'] || Input.keys['arrowup'])    vy -= 1;
    if (Input.keys['s'] || Input.keys['arrowdown'])  vy += 1;
    if (Input.keys['a'] || Input.keys['arrowleft'])  vx -= 1;
    if (Input.keys['d'] || Input.keys['arrowright']) vx += 1;
    const len = Math.hypot(vx, vy);
    if (len > 0) { vx /= len; vy /= len; }
    return { vx, vy };
  }
};
