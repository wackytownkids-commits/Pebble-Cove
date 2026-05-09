# PEBBLE COVE

A pastel chibi life-sim — Tomodachi vibes, brand new game, runs in your browser, ready to wrap into a Steam release later.

## How to play

Double-click **Play Pebble Cove.bat** (or open `index.html` in any browser). That's it.

## Controls

- **WASD / arrows** — walk
- **E** — interact (talk, open mailbox, sleep, forage, buy)
- **M** — mailbox
- **Tab** — inventory
- **R** — relationships screen
- **B** — cookbook (crafting)
- **Esc** — menu (save / load / quit)

## What's in v0.1

- Walkable pastel cove with 12 chibi residents living their lives
- Real day/night cycle, four seasons, weather (sakura petals in spring, snow in winter)
- **Hunger / Thirst / Energy / Social** meters that you must keep topped up
- Eat at the bakery, drink at the fountain, sleep at the lighthouse
- **Letter mail** from residents every morning — read, reply (warm/sassy/formal), build affinity
- **Friendship → Best Friend → Dating → Engaged → Married** progression with everyone
- **NPCs date and marry each other** organically based on compatibility + proximity
- Married couples **kiss visibly** with hearts in-world, often
- Married couples ask if they want **a baby** — they walk to their house, three days later a baby arrives
- Babies grow into the family (named procedurally)
- **Crafting**: forage on the beach, combine items into gifts at the cookbook
- **Save / load** to localStorage (Steam Cloud-ready when wrapped in Electron)
- A whole UI — mailbox panel, inventory, relationships book, mini-map, cookbook, pause menu

## Why this is different from Tomodachi

- It doesn't run out of things to do — there are systems you keep coming back to (seasons, NPC drama, babies maturing, letter arcs)
- Hunger/thirst keeps you actually inhabiting the world
- NPC romances happen WITHOUT you driving them — the cove feels alive even when you idle
- You can date and marry residents yourself
- All survival-life-sim staples (sleep, eat, drink, gather, craft, build relationships) wrapped in a chibi shell

## Steam release plan

Once the game feels good, wrap it in **Electron** (same setup as Cookup). That gives you:
- A real Windows .exe and macOS .app and Linux build
- Can publish to Steam — Electron games on Steam are common (Slay the Spire's UI layer, Cult of the Lamb tools, lots of indies)
- Steamworks integration via `steamworks.js` — achievements, cloud saves, rich presence
- Trading cards
- Steam Workshop (later, for community letter packs)

See `STEAM_PLAN.md` for the full release checklist.

## File map

```
PebbleCove/
├── index.html
├── style.css
├── Play Pebble Cove.bat
├── js/
│   ├── game.js          ← main loop + state
│   ├── world.js         ← terrain, buildings
│   ├── sprites.js       ← chibi character renderer
│   ├── residents.js     ← 12 villagers + AI
│   ├── relationships.js ← friendship / dating / marriage / babies
│   ├── needs.js         ← hunger / thirst / energy / social
│   ├── letters.js       ← daily mail
│   ├── ui.js            ← all panels + dialogue
│   ├── save.js          ← localStorage save
│   └── input.js         ← keyboard + mouse
├── README.md
└── STEAM_PLAN.md
```

## What's NOT in v0.1 (next session)

- Music + sound effects (gibberish TTS voices, ambient ocean, soft strings)
- Festivals (summer fishing tournament, autumn leaf-rake, winter gift exchange)
- House decorating (place furniture in the lighthouse)
- More letters (currently 12 templates — need ~100 for launch)
- More crafting recipes
- Babies aging into kid → teen → adult residents (currently they're listed but don't fully spawn as chibis yet)
- Steam wrapper (Electron + steamworks.js)
- Settings menu (currently a stub)
- Screen-shake / juice polish
- The deeper letter arcs (compost war, Quill's book, twin code, etc.)

Tell me which of those to do next.
