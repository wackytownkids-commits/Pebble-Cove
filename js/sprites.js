const Sprites = {
  drawChibi(ctx, cx, cy, look, t, walking) {
    const bob = walking ? Math.round(Math.sin(t * 0.012) * 1.5) : 0;
    const sway = walking ? Math.sin(t * 0.012) * 0.04 : 0;
    ctx.save();
    ctx.translate(cx, cy + bob);
    ctx.rotate(sway);

    ctx.fillStyle = 'rgba(40, 20, 30, 0.25)';
    ctx.beginPath();
    ctx.ellipse(3, 4 - bob, 18, 5.5, 0, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = look.outfit;
    Sprites.roundRect(ctx, -14, -38, 28, 30, 12);
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.13)';
    Sprites.roundRect(ctx, 6, -38, 8, 30, 4); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    Sprites.roundRect(ctx, -14, -38, 6, 22, 4); ctx.fill();

    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(-14, -10, 28, 2);

    ctx.fillStyle = look.skin;
    ctx.beginPath();
    ctx.arc(-15, -14, 5, 0, Math.PI*2);
    ctx.arc(15, -14, 5, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = look.legs || '#5a3a2a';
    ctx.fillRect(-9, -10, 7, 8);
    ctx.fillRect(2, -10, 7, 8);

    ctx.fillStyle = '#3a2a2a';
    Sprites.roundRect(ctx, -10, -3, 9, 4, 2); ctx.fill();
    Sprites.roundRect(ctx, 1, -3, 9, 4, 2); ctx.fill();

    const headY = -55;
    ctx.fillStyle = look.skin;
    ctx.beginPath();
    ctx.arc(0, headY, 18, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.beginPath();
    ctx.arc(7, headY+3, 12, -Math.PI*0.2, Math.PI*0.6);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,250,235,0.35)';
    ctx.beginPath();
    ctx.arc(-7, headY-3, 13, Math.PI*0.7, Math.PI*1.3);
    ctx.fill();

    if (look.hairBack) {
      ctx.fillStyle = look.hair;
      Sprites.drawHair(ctx, headY, look.hairStyle, true);
    }
    ctx.fillStyle = look.hair;
    Sprites.drawHair(ctx, headY, look.hairStyle, false);

    ctx.fillStyle = 'rgba(255, 120, 140, 0.35)';
    ctx.beginPath();
    ctx.ellipse(-7, headY+3, 3.5, 2, 0, 0, Math.PI*2);
    ctx.ellipse(7, headY+3, 3.5, 2, 0, 0, Math.PI*2);
    ctx.fill();

    const blink = (Math.floor(t / 90) % 40 === 0) ? 0.15 : 1;
    ctx.fillStyle = '#2a1a2a';
    ctx.beginPath();
    ctx.ellipse(-6, headY-1, 2.5, 3.5 * blink, 0, 0, Math.PI*2);
    ctx.ellipse(6, headY-1, 2.5, 3.5 * blink, 0, 0, Math.PI*2);
    ctx.fill();
    if (blink > 0.5) {
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(-5, headY-2, 0.9, 0, Math.PI*2);
      ctx.arc(7, headY-2, 0.9, 0, Math.PI*2);
      ctx.fill();
    }

    ctx.strokeStyle = '#5a3030';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    if (look.mood === 'happy') {
      ctx.arc(0, headY+5, 3, 0, Math.PI);
    } else if (look.mood === 'sad') {
      ctx.arc(0, headY+8, 3, Math.PI, Math.PI*2);
    } else {
      ctx.moveTo(-2, headY+5); ctx.lineTo(2, headY+5);
    }
    ctx.stroke();

    if (look.accessory === 'glasses') {
      ctx.strokeStyle = '#2a1a2a';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(-6, headY-1, 4, 0, Math.PI*2);
      ctx.arc(6, headY-1, 4, 0, Math.PI*2);
      ctx.moveTo(-2, headY-1); ctx.lineTo(2, headY-1);
      ctx.stroke();
    }
    if (look.accessory === 'hat') {
      ctx.fillStyle = look.hatColor || '#5a3a4a';
      ctx.beginPath();
      ctx.ellipse(0, headY-15, 22, 5, 0, 0, Math.PI*2);
      ctx.fill();
      Sprites.roundRect(ctx, -14, headY-25, 28, 12, 4);
      ctx.fill();
    }

    ctx.restore();
  },

  drawHair(ctx, headY, style, back) {
    if (style === 'short') {
      if (!back) {
        ctx.beginPath();
        ctx.arc(0, headY-3, 18, Math.PI*1.05, Math.PI*1.95);
        ctx.lineTo(14, headY-1);
        ctx.lineTo(-14, headY-1);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-12, headY-6);
        ctx.quadraticCurveTo(-4, headY+4, 4, headY-2);
        ctx.quadraticCurveTo(8, headY-4, 12, headY-6);
        ctx.fill();
      }
    } else if (style === 'long') {
      if (back) {
        Sprites.roundRect(ctx, -22, headY-5, 44, 50, 14);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, headY-3, 19, Math.PI, 0);
        ctx.fill();
      }
    } else if (style === 'puff') {
      if (!back) {
        ctx.beginPath();
        ctx.arc(-12, headY-12, 9, 0, Math.PI*2);
        ctx.arc(0, headY-15, 11, 0, Math.PI*2);
        ctx.arc(12, headY-12, 9, 0, Math.PI*2);
        ctx.fill();
      }
    } else if (style === 'bun') {
      if (back) {
        ctx.beginPath();
        ctx.arc(0, headY-22, 8, 0, Math.PI*2);
        ctx.fill();
      }
      if (!back) {
        ctx.beginPath();
        ctx.arc(0, headY-3, 18, Math.PI, 0);
        ctx.fill();
      }
    } else if (style === 'spiky') {
      if (!back) {
        ctx.beginPath();
        for (let i = 0; i < 7; i++) {
          const a = Math.PI + (i / 6) * Math.PI;
          const x = Math.cos(a) * 18;
          const y = Math.sin(a) * 18 + headY;
          ctx.lineTo(x, y);
          const a2 = a + Math.PI/12;
          ctx.lineTo(Math.cos(a2) * 26, Math.sin(a2) * 26 + headY - 3);
        }
        ctx.fill();
      }
    }
  },

  drawHeart(ctx, x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size/16, size/16);
    ctx.fillStyle = color || '#e85088';
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.bezierCurveTo(-12, -8, -16, 8, 0, 14);
    ctx.bezierCurveTo(16, 8, 12, -8, 0, 4);
    ctx.fill();
    ctx.restore();
  },

  portraitCanvas(look) {
    const c = document.createElement('canvas');
    c.width = 64; c.height = 64;
    const ctx = c.getContext('2d');
    ctx.fillStyle = look.bgTint || '#dcc8f0';
    ctx.fillRect(0,0,64,64);
    ctx.translate(32, 60);
    ctx.scale(1.2, 1.2);
    Sprites.drawChibi(ctx, 0, 0, look, 0, false);
    return c;
  },

  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y,   x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x,   y+h, r);
    ctx.arcTo(x,   y+h, x,   y,   r);
    ctx.arcTo(x,   y,   x+w, y,   r);
    ctx.closePath();
  },

  drawTree(ctx, x, y, t, scale) {
    scale = scale || 1;
    const sway = Math.sin(t * 0.001 + x * 0.01) * 2;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = 'rgba(60,30,30,0.15)';
    ctx.beginPath(); ctx.ellipse(0, 4, 24, 6, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#7a4a2a';
    Sprites.roundRect(ctx, -5, -28, 10, 30, 3); ctx.fill();
    ctx.fillStyle = '#7ec070';
    ctx.beginPath();
    ctx.arc(-12 + sway, -38, 18, 0, Math.PI*2);
    ctx.arc(12 + sway, -38, 18, 0, Math.PI*2);
    ctx.arc(0 + sway, -50, 22, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#a0e090';
    ctx.beginPath();
    ctx.arc(-8 + sway, -45, 7, 0, Math.PI*2);
    ctx.arc(8 + sway, -42, 6, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  },

  drawFlower(ctx, x, y, color) {
    ctx.fillStyle = '#7ec070';
    ctx.fillRect(x-1, y-6, 2, 8);
    ctx.fillStyle = color;
    for (let i=0; i<5; i++) {
      const a = (i/5) * Math.PI*2;
      ctx.beginPath();
      ctx.arc(x + Math.cos(a)*3, y - 7 + Math.sin(a)*3, 2.5, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.fillStyle = '#ffe480';
    ctx.beginPath();
    ctx.arc(x, y-7, 1.8, 0, Math.PI*2);
    ctx.fill();
  },

  drawHouse(ctx, x, y, w, h, look) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = 'rgba(60,30,30,0.18)';
    ctx.fillRect(-w/2 + 4, h/2 - 4, w, 8);
    ctx.fillStyle = look.body;
    Sprites.roundRect(ctx, -w/2, -h/2, w, h, 6); ctx.fill();
    ctx.fillStyle = look.roof;
    ctx.beginPath();
    ctx.moveTo(-w/2 - 8, -h/2 + 4);
    ctx.lineTo(0, -h/2 - 24);
    ctx.lineTo(w/2 + 8, -h/2 + 4);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#5a3a2a';
    Sprites.roundRect(ctx, -8, h/2 - 24, 16, 24, 4); ctx.fill();
    ctx.fillStyle = '#ffe480';
    ctx.beginPath(); ctx.arc(4, h/2 - 12, 1.2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = look.window || '#b8e0ff';
    Sprites.roundRect(ctx, -w/2 + 8, -h/2 + 12, 16, 16, 2); ctx.fill();
    Sprites.roundRect(ctx, w/2 - 24, -h/2 + 12, 16, 16, 2); ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1.2;
    [[-w/2 + 16, -h/2 + 12, 0, 16], [-w/2 + 8, -h/2 + 20, 16, 0],
     [w/2 - 16, -h/2 + 12, 0, 16], [w/2 - 24, -h/2 + 20, 16, 0]].forEach(s => {
      ctx.beginPath(); ctx.moveTo(s[0], s[1]); ctx.lineTo(s[0]+s[2], s[1]+s[3]); ctx.stroke();
    });
    if (look.sign) {
      ctx.fillStyle = '#5a3a2a';
      Sprites.roundRect(ctx, -20, -h/2 - 4, 40, 12, 2); ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = 'bold 9px Fredoka';
      ctx.textAlign = 'center';
      ctx.fillText(look.sign, 0, -h/2 + 4);
    }
    ctx.restore();
  },

  drawLighthouse(ctx, x, y, t) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = 'rgba(60,30,30,0.2)';
    ctx.beginPath(); ctx.ellipse(6, 4, 36, 8, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#9a8888';
    Sprites.roundRect(ctx, -28, -10, 56, 18, 4); ctx.fill();
    const tw = 36, th = 110;
    ctx.fillStyle = 'white';
    Sprites.roundRect(ctx, -tw/2, -th, tw, th-10, 8); ctx.fill();
    ctx.fillStyle = '#e85088';
    for (let i=0; i<4; i++) {
      ctx.fillRect(-tw/2, -th + 12 + i*26, tw, 12);
    }
    ctx.fillStyle = '#5a3a4a';
    Sprites.roundRect(ctx, -tw/2 - 4, -th - 8, tw + 8, 10, 3); ctx.fill();
    const beam = (Math.sin(t * 0.002) * 0.5 + 0.5);
    ctx.fillStyle = `rgba(255, 230, 130, ${0.6 + beam * 0.4})`;
    Sprites.roundRect(ctx, -10, -th - 22, 20, 14, 4); ctx.fill();
    ctx.fillStyle = '#5a3a4a';
    ctx.beginPath();
    ctx.moveTo(-12, -th - 22);
    ctx.lineTo(0, -th - 36);
    ctx.lineTo(12, -th - 22);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = `rgba(255, 230, 130, ${beam * 0.18})`;
    ctx.beginPath();
    ctx.moveTo(0, -th - 14);
    ctx.lineTo(120, -th - 70 + Math.sin(t * 0.003) * 30);
    ctx.lineTo(120, -th + 10 + Math.sin(t * 0.003) * 30);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },

  drawMailbox(ctx, x, y, hasMail) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = 'rgba(60,30,30,0.2)';
    ctx.beginPath(); ctx.ellipse(0, 4, 14, 4, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#7a4a2a';
    ctx.fillRect(-2, -4, 4, 14);
    ctx.fillStyle = '#e85088';
    Sprites.roundRect(ctx, -12, -22, 24, 18, 5); ctx.fill();
    ctx.fillStyle = '#b03868';
    Sprites.roundRect(ctx, -10, -18, 20, 12, 2); ctx.fill();
    ctx.fillStyle = hasMail ? '#ffd060' : '#888';
    ctx.fillRect(11, -22, 2, 8);
    ctx.beginPath();
    ctx.moveTo(13, -22); ctx.lineTo(20, -19); ctx.lineTo(13, -16);
    ctx.closePath(); ctx.fill();
    if (hasMail) {
      ctx.fillStyle = 'white';
      Sprites.roundRect(ctx, -8, -10, 14, 8, 1); ctx.fill();
      ctx.strokeStyle = '#ccc';
      ctx.beginPath();
      ctx.moveTo(-8, -10); ctx.lineTo(-1, -4); ctx.lineTo(6, -10);
      ctx.stroke();
    }
    ctx.restore();
  }
};
