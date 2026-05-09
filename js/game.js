/* ============================================================
   game.js — main loop + state + bootstrap (v0.2)
   ============================================================ */

let canvas, ctx;

const gameState = {
  playerName: 'Keeper',
  player: {
    x: 950, y: 400,
    look: {
      skin:'#fbe0c8', hair:'#88c8e8', hairStyle:'short', outfit:'#5894c0',
      legs:'#3a3a4a', mood:'happy', accessory:'none', bgTint:'#b8d8ff'
    },
    walking: false,
    facing: 1,
    speed: 110,
  },
  coins: 25,
  dayNumber: 1,
  seasonIndex: 0,
  timeOfDay: 6/24,
  secondsPerInGameHour: 30,
  inventory: { polished_pebble: 2, herbs: 1 },
  unreadMail: 0,
  acceptedPresRequest: false,
};

const GameState = gameState;

const Game = {
  lastT: 0,
  running: false,

  start() {
    canvas = document.getElementById('world');
    ctx = canvas.getContext('2d');
    Game.fitCanvas();
    window.addEventListener('resize', Game.fitCanvas);

    World.init();
    Residents.init();
    Relationships.init();
    Roles.init();
    Letters.generateForDay();
    gameState.unreadMail = Letters.todays.length;
    UI.init();
    Input.init();
    Touch.init();

    Game.running = true;
    Game.lastT = performance.now();
    requestAnimationFrame(Game.tick);
  },

  fitCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  },

  tick(t) {
    if (!Game.running) return;
    const dt = Math.min(0.05, (t - Game.lastT) / 1000);
    Game.lastT = t;

    Game.update(dt, t);
    Game.draw(t);

    requestAnimationFrame(Game.tick);
  },

  update(dt, t) {
    const dayDelta = dt / (gameState.secondsPerInGameHour * 24);
    const prevHour = Game.currentHour();
    gameState.timeOfDay = (gameState.timeOfDay + dayDelta) % 1;
    const newHour = Game.currentHour();

    if (newHour < prevHour) Game.endDay();

    let m = Input.movement();
    if (m.vx === 0 && m.vy === 0) {
      const j = Touch.joystickVec();
      if (j) m = j;
    }
    const p = gameState.player;
    if (m.vx !== 0 || m.vy !== 0) {
      p.x += m.vx * p.speed * dt;
      p.y += m.vy * p.speed * dt;
      p.facing = m.vx >= 0 ? 1 : -1;
      p.walking = true;
    } else {
      p.walking = false;
    }
    const b = World.barrier();
    p.x = Math.max(b.x + 20, Math.min(b.x + b.w - 20, p.x));
    p.y = Math.max(b.y + 30, Math.min(b.y + b.h - 30, p.y));

    if (Story.active) Story.tick();

    Residents.update(dt, t, Game.currentHour());
    Relationships.tickNpcAffinities(t, dt);
    Needs.tick(dt);

    const inter = World.nearbyInteraction(p.x, p.y);
    if (inter) {
      UI.showInteract(inter.label);
      Game.currentInteraction = inter;
    } else {
      UI.hideInteract();
      Game.currentInteraction = null;
    }

    document.getElementById('m-hunger').style.width = Needs.hunger + '%';
    document.getElementById('m-thirst').style.width = Needs.thirst + '%';
    document.getElementById('m-energy').style.width = Needs.energy + '%';
    document.getElementById('m-social').style.width = Needs.social + '%';
    document.getElementById('coin-count').textContent = gameState.coins;

    document.getElementById('time-of-day').textContent = Game.formatTime();
    const seasons = ['Spring','Summer','Autumn','Winter'];
    document.getElementById('day-label').textContent = `Day ${gameState.dayNumber} · ${seasons[gameState.seasonIndex]}`;
  },

  draw(t) {
    const hour = Game.currentHour();
    World.drawSky(ctx, hour);
    World.drawTerrain(ctx);
    World.drawDecor(ctx, t);
    World.drawBuildings(ctx, t);
    World.drawTrees(ctx, t);
    Residents.draw(ctx, t);
    Sprites.drawChibi(ctx, gameState.player.x, gameState.player.y, gameState.player.look, t, gameState.player.walking);
    World.drawNightOverlay(ctx, hour);
    Game.drawWeather(t);
    if (Editor.active) {
      Editor.drawBarrier(ctx);
      Editor.drawHover(ctx);
    }
    if (UI.drawSparks) UI.drawSparks(ctx, 1/60);
    Touch.drawJoystick(ctx);
  },

  drawWeather(t) {
    if (gameState.seasonIndex === 0) {
      ctx.fillStyle = 'rgba(255, 180, 200, 0.7)';
      for (let i = 0; i < 30; i++) {
        const x = (i * 137 + (t*0.04)) % canvas.width;
        const y = ((i * 91 + t*0.06) % canvas.height);
        ctx.fillRect(x, y, 3, 3);
      }
    }
    if (gameState.seasonIndex === 3) {
      ctx.fillStyle = 'rgba(220, 230, 255, 0.85)';
      for (let i = 0; i < 100; i++) {
        const x = (i * 83 + (t*0.03)) % canvas.width;
        const y = ((i * 113 + t*0.4) % canvas.height);
        ctx.fillRect(x, y, 2, 5);
      }
    }
  },

  currentHour() { return gameState.timeOfDay * 24; },

  formatTime() {
    const h = gameState.timeOfDay * 24;
    const hh = Math.floor(h);
    const mm = Math.floor((h - hh) * 60);
    const ampm = hh < 12 ? 'AM' : 'PM';
    const h12 = ((hh + 11) % 12) + 1;
    return `${h12}:${String(mm).padStart(2,'0')} ${ampm}`;
  },

  endDay() {
    gameState.dayNumber++;
    if (gameState.dayNumber % 7 === 1 && gameState.dayNumber > 1) {
      gameState.seasonIndex = (gameState.seasonIndex + 1) % 4;
      UI.toast(`Welcome to ${['Spring','Summer','Autumn','Winter'][gameState.seasonIndex]}!`);
    }
    Letters.generateForDay();
    gameState.unreadMail = Letters.todays.length;
    Relationships.tickPregnancies(gameState.dayNumber);
    Phases.dailyTick();
    if (typeof Festivals !== 'undefined') Festivals.tick();
    President.maybeRequest();
    UI.toast(`A new day in Pebble Cove. Day ${gameState.dayNumber}.`);
    Save.save();
  },

  tryInteract() {
    if (!Game.currentInteraction) return;
    const inter = Game.currentInteraction;
    switch (inter.kind) {
      case 'mailbox':  UI.openPanel('mailbox'); break;
      case 'home': {
        Needs.sleep(80);
        gameState.timeOfDay = 6/24;
        Game.endDay();
        UI.toast('Rested through the night.');
        break;
      }
      case 'fountain': Needs.drink(40); break;
      case 'beach': {
        const finds = ['polished_pebble','sea_glass','driftwood','shell','wildflower','herbs'];
        const item = finds[(Math.random()*finds.length)|0];
        gameState.inventory[item] = (gameState.inventory[item] || 0) + 1;
        UI.toast(`Found a ${item.replace(/_/g,' ')}!`);
        break;
      }
      case 'store': {
        if (gameState.coins >= 8) {
          gameState.coins -= 8;
          gameState.inventory.bread = (gameState.inventory.bread || 0) + 1;
          gameState.inventory.water = (gameState.inventory.water || 0) + 1;
          UI.toast('Bought bread + water (8 coin)');
        } else { UI.toast('Need 8 coin for the bundle.'); }
        break;
      }
      case 'bakery': {
        if (gameState.coins >= 5) {
          gameState.coins -= 5;
          gameState.inventory.cinnamon_bun = (gameState.inventory.cinnamon_bun || 0) + 1;
          Needs.eat(35);
          UI.toast('Mum slips you a warm bun.');
        } else { UI.toast('Need 5 coin for a bun.'); }
        break;
      }
      case 'talk': {
        const r = inter.resident;
        const line = r.def.lines[(Math.random()*r.def.lines.length)|0]
                       .replace(/\{playerName\}/g, gameState.playerName)
                       .replace(/\{randomResident\}/g,
                                Residents.defs[(Math.random()*Residents.defs.length)|0].name);
        UI.speak(r.def.name, line, r.x, r.y - 60);
        if (!Phases.hasMet(r.def.id, 'player')) Phases.meet(r.def.id, 'player');
        Phases.bumpAffinity(r.def.id, 'player', 3);
        Relationships.nudge(r.def.id, 'player', 2);
        if (UI.spark) UI.spark(r.x, r.y - 60, '+3');
        Needs.socialize(8);
        const aff = Relationships.affinity(r.def.id, 'player');
        const status = Relationships.status(r.def.id, 'player');
        if (status === 'best_friend' && aff >= 70 && !Relationships.playerLove && Math.random() < 0.25) {
          UI.askPropose(r);
        }
        break;
      }
    }
  },

  async newGame(name) {
    Save.wipe();
    gameState.playerName = name || 'Keeper';
    gameState.coins = 25;
    gameState.dayNumber = 1;
    gameState.seasonIndex = 0;
    gameState.timeOfDay = 6/24;
    gameState.inventory = { polished_pebble: 2, herbs: 1 };

    Game.start();
    if (Story.active) Story.start();
    showScreen('game-screen');
  }
};

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('visible'));
  document.getElementById(id).classList.add('visible');
}

document.addEventListener('DOMContentLoaded', () => {
  if (!Save.exists()) document.getElementById('btn-cont').style.opacity = 0.4;

  document.getElementById('btn-new').addEventListener('click', () => {
    Story.active = false;
    showScreen('name-screen');
    setTimeout(() => document.getElementById('name-input').focus(), 100);
  });
  const storyBtn = document.getElementById('btn-story');
  if (storyBtn) storyBtn.addEventListener('click', () => {
    Story.active = true;
    showScreen('name-screen');
    setTimeout(() => document.getElementById('name-input').focus(), 100);
  });

  document.getElementById('btn-cont').addEventListener('click', () => {
    if (!Save.exists()) return;
    Game.start();
    Save.load();
    showScreen('game-screen');
  });

  document.getElementById('btn-set').addEventListener('click', () => alert('Settings coming soon'));
  document.getElementById('btn-quit').addEventListener('click', () => window.close());

  document.getElementById('name-go').addEventListener('click', () => {
    const v = document.getElementById('name-input').value.trim() || 'Keeper';
    Game.newGame(v);
  });
  document.getElementById('name-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('name-go').click();
  });
});
