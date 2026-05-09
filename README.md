# PEBBLE COVE — v0.4

A pastel chibi life-sim. Tomodachi vibes, Steam-bound. Plays in any browser, online or offline.

**Live URL:** https://wackytownkids-commits.github.io/Pebble-Cove/

## Controls

PC keyboard:
- WASD / arrows = walk
- E = interact (talk, mailbox, sleep, forage)
- G = give a gift to the resident you're next to
- M = mailbox · Tab = inventory · R = relationships · C = cookbook
- P = pairing shop · F = face paint · D = dream journal
- B = world editor (place / drag / erase)
- Esc = pause + settings

Mobile (phone):
- Left half = touch joystick
- Right half = tap to interact
- Drag any chibi onto another to introduce them (50/50 chance they hit it off)

## Features

**World** — pastel walkable cove, 12 launch residents, real day/night, four seasons, weather, lighthouse, mailbox, fountain plaza, beach, shops.

**Survival** — Hunger / Thirst / Energy / Social meters. Eat at bakery, drink at fountain, sleep at lighthouse, talk for social.

**Audio** — procedural ocean ambient, gentle generative season music, chibi voice gibberish per character. Web Audio, no files needed. Volume sliders in the pause menu.

**Letters + Arcs** — every morning 3-7 letters land in your mailbox. Reply warm/sassy/formal/ignore. Five multi-day story arcs (Compost War, Quill's Book, The Twin Code, Rosa's Reunion, Lost Cove Letter) unfold over weeks.

**Tomodachi-style relationship phases** — 11 stages: Stranger → Just met → Acquaintance → Friend → Good friend → Best friend → Crush → Sweetheart → Dating → Engaged → Married. Both affinity AND time-since-met required for each phase. "Thaw" period after meeting.

**NPC romance** — they date, marry, kiss visibly, and ask to have babies. Babies are spawned as real new residents and **age over time** (baby → kid → teen → adult).

**Auto move-in** — when two residents marry, one moves into the other's home.

**Drag-to-meet** — click-and-hold any chibi (or right-click), drag onto another, drop. 50/50 they hit it off. Bad first impression forces a longer thaw period.

**Pairing Shop** — pay 50 coins to introduce two residents (Tomodachi-style). Big affinity boost, they walk to meet.

**Roles** — President, Vice President, Shopkeeper, Worker, Citizen.

**President requests** — periodic modal: "trees along the south path." Approve and the world updates.

**Festivals** — one per season on day 3: Bloom Festival, Fishing Tournament, Leaf-Rake Contest, Gift Exchange.

**Happiness + Leave-Island** — every resident has a hidden happiness meter. If they get disrespected too often (low affinity + low happiness), they have a 5% daily chance of asking to leave. You can beg them to stay.

**Dreams** — every night a few residents dream. Dream Journal panel shows what they dreamed. Dreams nudge their morning mood.

**Mini-games** — Rock-Paper-Scissors, Fishing (timing-based), Dance-off (memory game).

**Face Paint** — apply patterns to any chibi (your character or any resident): whiskers, star, heart, tribal, glitter, cat mask, butterfly, sun.

**Gifts** — press G near a resident to give them an item from your pouch. Big affinity bump if they love it (each resident has favorite items).

**World Editor** — press B to enter edit mode. Place trees, flowers, houses, new residents. Drag-and-drop layout. Pink dashed line shows playable area.

**No character cap, expanding barrier** — every 10 residents the playable area grows.

**Story Mode** — separate button on title screen. 5 chapters that run alongside sandbox.

**Crafting** — beach combing → cookbook recipes → gifts.

**UI** — pastel paper aesthetic, HUD with clock + meters + coin, side panel for all menus.

**Save / Load** — localStorage, ready to mirror to Steam Cloud when wrapped in Electron.

**Phone testing** — `Test on Phone.bat` runs a server on port 8080 and shows your local IP. Open the URL on your phone.

**Steam-ready Electron build** — `Build Desktop.bat` packages a Windows installer via Electron + electron-builder.

## How to publish updates

After making code changes, double-click **Publish to Web.bat**. It commits, pushes, and updates GitHub Pages. URL: https://wackytownkids-commits.github.io/Pebble-Cove/

## File map

```
PebbleCove/
├── index.html
├── style.css
├── package.json           ← Electron config
├── electron-main.js       ← Electron entry
├── Play Pebble Cove.bat
├── Test on Phone.bat
├── Publish to Web.bat
├── Build Desktop.bat
├── js/
│   ├── audio.js           ← procedural Web Audio
│   ├── sprites.js         ← chibi renderer
│   ├── needs.js           ← hunger/thirst/energy/social
│   ├── phases.js          ← Tomodachi-style relationships
│   ├── relationships.js   ← affinity matrix
│   ├── letters.js         ← daily mail
│   ├── arcs.js            ← multi-day story arcs
│   ├── festivals.js       ← seasonal events
│   ├── residents.js       ← 12 villagers
│   ├── roles.js           ← role system
│   ├── spawn.js           ← runtime resident creation
│   ├── world.js           ← terrain + buildings
│   ├── ui.js              ← all panels
│   ├── editor.js          ← world editor
│   ├── story.js           ← story mode
│   ├── president.js       ← President requests
│   ├── happiness.js       ← happiness + leave-island
│   ├── pairing.js         ← Tomodachi pairing shop
│   ├── dreams.js          ← night dreams
│   ├── facepaint.js       ← face paint
│   ├── minigames.js       ← RPS / fishing / dance
│   ├── marriage.js        ← auto move-in
│   ├── babyaging.js       ← child → kid → teen → adult
│   ├── gifts.js           ← gift system
│   ├── save.js            ← localStorage
│   ├── input.js           ← keyboard + mouse
│   ├── touch.js           ← phone joystick + drag
│   └── game.js            ← main loop
└── README.md
```
