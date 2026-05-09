/* minigames.js — small activities. Rock-paper-scissors at the plaza,
   fishing at the beach, dance-off at the bakery. */
const Minigames = {
  open(kind) {
    UI.closeAllPanels();
    const p = document.getElementById('panel-minigames');
    p.classList.remove('hidden');
    const body = document.getElementById('mg-body');
    if (kind === 'rps')   Minigames.rps(body);
    if (kind === 'fish')  Minigames.fish(body);
    if (kind === 'dance') Minigames.dance(body);
  },
  close() { document.getElementById('panel-minigames').classList.add('hidden'); },

  rps(body) {
    body.innerHTML = `<h3 style="margin:8px 0;">Rock · Paper · Scissors</h3>
      <p style="color:#7a5a5a;margin-bottom:12px;">Win 5 coins per round.</p>
      <div class="mg-row">
        <button class="big-btn" data-c="rock">🪨 Rock</button>
        <button class="big-btn" data-c="paper">📄 Paper</button>
        <button class="big-btn" data-c="scissors">✂ Scissors</button>
      </div>
      <p id="mg-result" style="margin-top:14px;font-size:18px;"></p>`;
    body.querySelectorAll('button[data-c]').forEach(b => {
      b.addEventListener('click', () => {
        const choices = ['rock','paper','scissors'];
        const me = b.dataset.c;
        const them = choices[(Math.random()*3)|0];
        let result;
        if (me === them) result = `It's a tie. Both ${me}.`;
        else if ((me==='rock'&&them==='scissors')||(me==='paper'&&them==='rock')||(me==='scissors'&&them==='paper')) {
          result = `You win! +5 coins.`;
          gameState.coins += 5;
        } else {
          result = `You lose. They had ${them}.`;
        }
        document.getElementById('mg-result').textContent = result;
        Audio.pop();
      });
    });
  },

  fish(body) {
    body.innerHTML = `<h3 style="margin:8px 0;">Fishing</h3>
      <p style="color:#7a5a5a;margin-bottom:12px;">Click when the bobber dips. Time it right!</p>
      <div id="mg-fish" style="height:80px;background:linear-gradient(180deg,#a8d8ff,#5894c0);border-radius:12px;position:relative;overflow:hidden;">
        <div id="mg-bobber" style="position:absolute;width:14px;height:14px;background:red;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%);"></div>
      </div>
      <button class="big-btn primary" id="mg-fish-go" style="margin-top:14px;">Cast!</button>
      <p id="mg-result" style="margin-top:14px;"></p>`;
    let phase = 'idle', dipAt = 0, casted = 0;
    const bobber = body.querySelector('#mg-bobber');
    const result = body.querySelector('#mg-result');
    body.querySelector('#mg-fish-go').addEventListener('click', () => {
      if (phase !== 'idle') return;
      phase = 'wait';
      result.textContent = 'Waiting...';
      casted = performance.now();
      dipAt = casted + 1500 + Math.random()*3000;
      const tick = () => {
        if (phase !== 'wait' && phase !== 'dip') return;
        const t = performance.now();
        if (t < dipAt) bobber.style.background = 'red';
        else if (t < dipAt + 800) {
          bobber.style.background = 'yellow';
          phase = 'dip';
          bobber.style.top = (50 + Math.sin(t*0.02)*20) + '%';
        } else if (phase === 'dip') {
          phase = 'missed';
          result.textContent = 'It got away.';
          phase = 'idle';
          return;
        }
        requestAnimationFrame(tick);
      };
      tick();
    });
    body.querySelector('#mg-fish').addEventListener('click', () => {
      if (phase === 'wait') {
        phase = 'idle';
        result.textContent = 'Too early. The fish saw you. -1 patience.';
      } else if (phase === 'dip') {
        phase = 'idle';
        bobber.style.top = '50%';
        const finds = ['polished_pebble','sea_glass','driftwood','shell'];
        const item = finds[(Math.random()*finds.length)|0];
        gameState.inventory[item] = (gameState.inventory[item] || 0) + 1;
        gameState.coins += 3;
        result.textContent = `Caught a ${item.replace(/_/g,' ')}! +3 coins.`;
        Audio.coin();
      }
    });
  },

  dance(body) {
    body.innerHTML = `<h3 style="margin:8px 0;">Dance-off</h3>
      <p style="color:#7a5a5a;margin-bottom:12px;">Match the sequence. Tap the highlighted button.</p>
      <div id="mg-dance-row" class="mg-row">
        <button class="big-btn" data-d="0">↑</button>
        <button class="big-btn" data-d="1">←</button>
        <button class="big-btn" data-d="2">↓</button>
        <button class="big-btn" data-d="3">→</button>
      </div>
      <p id="mg-result" style="margin-top:14px;"></p>`;
    const seq = [];
    for (let i=0;i<6;i++) seq.push(Math.floor(Math.random()*4));
    let idx = 0;
    const btns = body.querySelectorAll('button[data-d]');
    const flash = (n) => {
      btns[n].style.background = '#ffd060';
      setTimeout(() => btns[n].style.background = '', 350);
    };
    const playSeq = () => {
      for (let i=0;i<seq.length;i++) setTimeout(() => flash(seq[i]), i*450);
    };
    setTimeout(playSeq, 400);
    btns.forEach(b => b.addEventListener('click', () => {
      const d = parseInt(b.dataset.d);
      if (d === seq[idx]) {
        idx++;
        flash(d);
        if (idx === seq.length) {
          gameState.coins += 12;
          body.querySelector('#mg-result').textContent = 'Nailed it! +12 coins.';
          Audio.heart();
        }
      } else {
        body.querySelector('#mg-result').textContent = 'Wrong step. Try again.';
        idx = 0;
      }
    }));
  },
};
