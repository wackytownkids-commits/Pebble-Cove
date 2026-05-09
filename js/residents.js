/* ============================================================
   residents.js — the chibi villagers of Pebble Cove
   Defines who they are, their look, schedule, dialogue lines,
   and their daily wandering AI.
   ============================================================ */

const Residents = {
  defs: [
    {
      id:'mum', name:'Mum', archetype:'baker', voice:'low-soft',
      look:{ skin:'#fbd9b8', hair:'#c08060', hairStyle:'bun', outfit:'#f5a3a3', legs:'#88503a', mood:'happy', accessory:'none', bgTint:'#ffe0d0' },
      home:{ x: 1100, y: 540, name:'The Bakery' },
      schedule: [
        { time:6,  spot:[1100, 540] },  // home
        { time:9,  spot:[700,  500] },  // bakery shop
        { time:14, spot:[640,  640] },  // plaza
        { time:18, spot:[1100, 540] },  // home
      ],
      lines:[
        "Made too many cinnamon buns this morning. Take one, love.",
        "Did you eat? You should eat. Here.",
        "Bunny told me everything. Don't worry, I won't repeat it.",
        "Lighthouse keeper {playerName}, you look thin today."
      ],
      gifts:{ love:['pressed_flower','herbs'], hate:['bug_jar'] },
      compatible:['tide','bramble']
    },
    {
      id:'tide', name:'Tide', archetype:'fisherman', voice:'low-gravel',
      look:{ skin:'#dab0a0', hair:'#3a2a4a', hairStyle:'spiky', outfit:'#5894c0', legs:'#3a3a4a', mood:'neutral', accessory:'hat', hatColor:'#3a4a5a', bgTint:'#b8d8e8' },
      home:{ x: 250, y: 580, name:'Tide\'s Cabin' },
      schedule: [
        { time:5,  spot:[120,  640] },  // beach
        { time:11, spot:[250,  580] },  // home
        { time:14, spot:[120,  640] },  // beach
        { time:20, spot:[250,  580] },  // home
      ],
      lines:[
        "Foam on the rock face... the mailbox glints in dawn light...",
        "Caught a fish today. Same fish as yesterday.",
        "...",
        "The sea remembers what we forget."
      ],
      gifts:{ love:['polished_pebble','driftwood'], hate:['mayor_form'] },
      compatible:['mum','rosa']
    },
    {
      id:'bunny', name:'Bunny', archetype:'drama-queen', voice:'high-fast',
      look:{ skin:'#ffe0d0', hair:'#ffb0c8', hairStyle:'long', hairBack:true, outfit:'#f5b0d0', legs:'#888', mood:'happy', accessory:'none', bgTint:'#ffc8e0' },
      home:{ x: 880, y: 360, name:'Bunny\'s Cottage' },
      schedule: [
        { time:9,  spot:[640,  640] },  // plaza
        { time:12, spot:[880,  360] },  // home
        { time:15, spot:[700,  500] },  // gossip near bakery
        { time:21, spot:[880,  360] },  // home
      ],
      lines:[
        "Did you HEAR about Bramble and Pip?? I cannot believe it!!",
        "{playerName}, OH MY GOSH okay so —",
        "I heard a rumor I am NOT supposed to repeat. Lean closer.",
        "EVERYONE is talking about it. Everyone."
      ],
      gifts:{ love:['sea_glass','wildflower'], hate:['driftwood'] },
      compatible:['quill','grub']
    },
    {
      id:'quill', name:'Quill', archetype:'aspiring-poet', voice:'dreamy',
      look:{ skin:'#e8c8a8', hair:'#a888c8', hairStyle:'short', outfit:'#b0c0e0', legs:'#a08060', mood:'happy', accessory:'glasses', bgTint:'#d8c8f0' },
      home:{ x: 460, y: 420, name:'Quill\'s Garret' },
      schedule: [
        { time:8,  spot:[460,  420] },  // home (writing)
        { time:13, spot:[640,  640] },  // plaza (drinking)
        { time:16, spot:[460,  420] },
        { time:22, spot:[460,  420] },
      ],
      lines:[
        "Read chapter eleven yet? Greg the Seagull has BIG plans now.",
        "It's not derivative. They're SPIRITUAL ancestors.",
        "Just one more rewrite. Just one. (Just five.)",
        "Here is a poem: 'oh sea / oh sea / oh sea / — fin —' (still polishing)"
      ],
      gifts:{ love:['sea_glass_blue','driftwood'], hate:['herbs'] },
      compatible:['bunny','astra']
    },
    {
      id:'grub', name:'Grub', archetype:'gremlin-child', voice:'squeaky',
      look:{ skin:'#fbd9b8', hair:'#88c068', hairStyle:'puff', outfit:'#a0e090', legs:'#5a3a2a', mood:'happy', accessory:'none', bgTint:'#c8e8b8' },
      home:{ x: 1100, y: 540, name:'(lives with Mum)' },
      schedule: [
        { time:7,  spot:[1100, 540] },
        { time:10, spot:[140,  640] },  // beach!
        { time:14, spot:[640,  640] },
        { time:17, spot:[1100, 540] },
      ],
      lines:[
        "LOOK!! Six legs!! I named it Greg.",
        "Mum said no bugs at the table. I do not consent.",
        "I traded a snail for a rock. Best deal of my life.",
        "Wanna see something cool??? Come to the rocks at sundown."
      ],
      gifts:{ love:['bug_jar','shells'], hate:['herbs'] },
      compatible:['bunny']
    },
    {
      id:'rosa', name:'Rosa', archetype:'retired-rocker', voice:'smoky',
      look:{ skin:'#d8a888', hair:'#3a1a1a', hairStyle:'long', hairBack:true, outfit:'#3a1a3a', legs:'#1a1a1a', mood:'sad', accessory:'none', bgTint:'#5a3a4a' },
      home:{ x: 1180, y: 380, name:'Rosa\'s Caravan' },
      schedule: [
        { time:11, spot:[1180, 380] },
        { time:15, spot:[640,  640] },  // plaza scowl
        { time:19, spot:[1180, 380] },
      ],
      lines:[
        "Don't look at me. Don't write to me. Just... be here, I guess.",
        "Sea Witch was a great band. Don't listen to anyone who says we weren't.",
        "I miss the road. Don't tell anyone I said that.",
        "Did you bring flowers? You did NOT have to bring flowers."
      ],
      gifts:{ love:['wildflower','driftwood'], hate:['mayor_form'] },
      compatible:['tide']
    },
    {
      id:'pip', name:'Pip', archetype:'shop-owner', voice:'chirpy',
      look:{ skin:'#fbd9b8', hair:'#ffd870', hairStyle:'short', outfit:'#ffd870', legs:'#fbb070', mood:'happy', accessory:'none', bgTint:'#fff0c0' },
      home:{ x: 800, y: 280, name:'General Store' },
      schedule: [
        { time:8,  spot:[800,  280] },
        { time:13, spot:[800,  280] },
        { time:19, spot:[800,  280] },
      ],
      lines:[
        "Hi {playerName}! Anything I can grab for you today?",
        "Bramble left more zucchini. I'm starting to feel threatened.",
        "Today's special: pebble paint. Don't ask why.",
        "Closing soon — come by tomorrow okay??"
      ],
      gifts:{ love:['herbs','dried_seaweed'], hate:['zucchini'] },
      compatible:['quill']
    },
    {
      id:'astra', name:'Astra', archetype:'mystic', voice:'echoey',
      look:{ skin:'#e8c8d8', hair:'#a868c8', hairStyle:'long', hairBack:true, outfit:'#7848a8', legs:'#5a3a6a', mood:'neutral', accessory:'none', bgTint:'#dcc8f0' },
      home:{ x: 220, y: 320, name:'Astra\'s Hut' },
      schedule: [
        { time:10, spot:[220,  320] },
        { time:14, spot:[640,  640] },
        { time:23, spot:[220,  320] },
      ],
      lines:[
        "The tide will rise in three days. The seagull-king has been deposed.",
        "I felt your footsteps on the path before you arrived.",
        "{randomResident} will receive a Strange Gift before the moon turns full.",
        "I am 60% accurate. Statistically speaking, you should listen."
      ],
      gifts:{ love:['shells','sea_glass_purple'], hate:[] },
      compatible:['quill']
    },
    {
      id:'bramble', name:'Bramble', archetype:'gardener', voice:'grumbly',
      look:{ skin:'#c8a888', hair:'#5a3a2a', hairStyle:'short', outfit:'#4a7048', legs:'#5a3a2a', mood:'sad', accessory:'hat', hatColor:'#7a5a3a', bgTint:'#b8d8a0' },
      home:{ x: 380, y: 660, name:'Bramble\'s Garden' },
      schedule: [
        { time:6,  spot:[380,  660] },
        { time:13, spot:[380,  660] },
        { time:18, spot:[380,  660] },
      ],
      lines:[
        "Compost is sacred. Some people don't seem to understand that.",
        "I left zucchini for Pip again. As a gesture.",
        "Tomatoes are coming in. You may have one. ONE.",
        "Stop stepping on the marigolds."
      ],
      gifts:{ love:['berries','herbs'], hate:[] },
      compatible:['mum']
    },
    {
      id:'echo', name:'Echo', archetype:'twin-quiet', voice:'whisper',
      look:{ skin:'#fbe8d8', hair:'#e8d8f0', hairStyle:'short', outfit:'#dcc8f0', legs:'#aaa', mood:'neutral', accessory:'none', bgTint:'#f0e0ff' },
      home:{ x: 540, y: 340, name:'Twin Cottage' },
      schedule: [
        { time:9,  spot:[540,  340] },
        { time:14, spot:[540,  340] },
      ],
      lines:[
        "...",
        "(silent nod)",
        "...mh.",
        "(Wren said we should say hi.)"
      ],
      gifts:{ love:['polished_pebble'], hate:[] },
      compatible:['wren']  // they ARE compatible with each other? no — handled specially
    },
    {
      id:'wren', name:'Wren', archetype:'twin-speaker', voice:'whisper',
      look:{ skin:'#fbe8d8', hair:'#e8d8f0', hairStyle:'short', outfit:'#c8b8e0', legs:'#aaa', mood:'neutral', accessory:'none', bgTint:'#e0d0ff' },
      home:{ x: 540, y: 340, name:'Twin Cottage' },
      schedule: [
        { time:9,  spot:[540,  340] },
        { time:14, spot:[540,  340] },
      ],
      lines:[
        "Echo says hello. (Echo did not say hello.)",
        "We don't agree on what to write. So we wrote nothing.",
        "Echo would like a pebble. ANY pebble.",
        "Don't ask which of us is which."
      ],
      gifts:{ love:['polished_pebble'], hate:[] },
      compatible:[]
    },
    {
      id:'mayor', name:'The Mayor', archetype:'self-important', voice:'nasal-loud',
      look:{ skin:'#e8c0a8', hair:'#7878a0', hairStyle:'short', outfit:'#5a4a8a', legs:'#3a3a5a', mood:'neutral', accessory:'glasses', bgTint:'#aaa8d0' },
      home:{ x: 740, y: 300, name:'Town Hall' },
      schedule: [
        { time:9,  spot:[740,  300] },
        { time:13, spot:[640,  640] },
        { time:17, spot:[740,  300] },
      ],
      lines:[
        "RE: lighthouse rotation. We must discuss.",
        "Effective Tuesday, the seagull noise tax is in effect.",
        "Re-elect THE MAYOR. Slogan: 'It Could Be Worse.'",
        "Have I given you a campaign pin yet? I have? Take another."
      ],
      gifts:{ love:['mayor_form'], hate:['bug_jar'] },
      compatible:[]
    }
  ],

  // runtime instances built at game start
  runtime: [],

  init() {
    Residents.runtime = Residents.defs.map(d => ({
      def: d,
      x: d.home.x,
      y: d.home.y + 50,   // stand in FRONT of house, not centered on it
      tx: d.home.x,
      ty: d.home.y + 50,
      walking: false,
      facing: 1,
      portraitCanvas: Sprites.portraitCanvas(d.look),
      lastLineAt: 0,
      currentLine: '',
      partner: null,    // resident id of romantic partner
      lastKissAt: 0,
      pregnant: false,
      pregnancyStartedAt: 0,
      // friendship per OTHER resident (NPC<->NPC) — handled in Relationships
    }));
  },

  byId(id) { return Residents.runtime.find(r => r.def.id === id); },

  // returns target spot for current hour-of-day. If the schedule sends them to
  // their home position, offset the Y so they stand at the doorstep (not inside the house).
  scheduledSpot(r, hour) {
    const sched = r.def.schedule;
    let cur = sched[0];
    for (const s of sched) {
      if (hour >= s.time) cur = s;
    }
    // if this matches the home spot exactly, offset Y so the resident stands in front
    if (cur.spot[0] === r.def.home.x && cur.spot[1] === r.def.home.y) {
      return [r.def.home.x, r.def.home.y + 50];
    }
    return cur.spot;
  },

  update(dt, gameTime, hour) {
    for (const r of Residents.runtime) {
      // partner stuff overrides schedule sometimes — kissing
      if (r.partner) {
        const p = Residents.byId(r.partner);
        if (p && Math.abs(r.x - p.x) > 30 && Math.random() < 0.0008) {
          // walk toward partner sometimes
          r.tx = p.x + 28; r.ty = p.y;
        }
        if (p && Math.abs(r.x - p.x) < 30 && Math.abs(r.y - p.y) < 25) {
          // close enough to kiss
          if (gameTime - r.lastKissAt > 7000 && Math.random() < 0.005) {
            Relationships.kiss(r, p, gameTime);
          }
        }
      } else {
        // follow schedule
        const [sx, sy] = Residents.scheduledSpot(r, hour);
        if (Math.hypot(r.x - sx, r.y - sy) > 6) {
          r.tx = sx; r.ty = sy;
        } else {
          // micro wander when arrived — much more active now
          if (Math.random() < 0.012) {
            r.tx = sx + (Math.random()*120-60);
            r.ty = sy + (Math.random()*100-50);
          }
        }
      }

      // walk toward target
      const dx = r.tx - r.x;
      const dy = r.ty - r.y;
      const d  = Math.hypot(dx, dy);
      if (d > 1) {
        const speed = 55 * dt; // faster walk
        r.x += (dx/d) * Math.min(speed, d);
        r.y += (dy/d) * Math.min(speed, d);
        r.facing = dx >= 0 ? 1 : -1;
        r.walking = true;
      } else {
        r.walking = false;
      }
    }
  },

  draw(ctx, t) {
    // sort by Y for proper depth
    const sorted = [...Residents.runtime].sort((a,b) => a.y - b.y);
    for (const r of sorted) {
      Sprites.drawChibi(ctx, r.x, r.y, r.def.look, t, r.walking);
      // kiss heart
      if (r.partner && t - r.lastKissAt < 1500) {
        const p = Residents.byId(r.partner);
        if (p) {
          const cx = (r.x + p.x) / 2;
          const cy = ((r.y + p.y) / 2) - 60;
          const age = (t - r.lastKissAt) / 1500;
          Sprites.drawHeart(ctx, cx, cy - age * 30, 18 + age * 10, '#ff5894');
        }
      }
      // pregnancy belly
      if (r.pregnant) {
        ctx.fillStyle = r.def.look.outfit;
        ctx.beginPath();
        ctx.arc(r.x + r.facing * 4, r.y - 22, 9, 0, Math.PI*2);
        ctx.fill();
      }
    }
  }
};

