# v0.4 — What changed while you slept

Everything below is on your PC ready to push. Double-click **Publish to Web.bat** once when you wake up — that's all that's needed.

## New panels (top-right buttons in-game)
- **PAIR** — Pairing shop. Pick two residents. Pay 50 coins. They get a +35 affinity boost and walk to meet. Tomodachi-style.
- **PAINT** — Face paint. Pick yourself or any resident, pick a pattern (whiskers, star, heart, tribal mask, glitter, butterfly, sun…). Saves with the character.
- **DREAM** — Dream Journal. Every night a few residents have dreams. The text shows up here. Dreams nudge their morning mood up or down.
- **PLAY** — Activities hub. Three minigames: Rock-Paper-Scissors, Fishing (timing-based), Dance-off (memory game). Earn coins.

## Happiness + Leave-Island
Every resident now has a hidden happiness meter. If you ignore them, treat them rough, or their affinity stays super low, their happiness drops. If happiness < 30 AND they feel disrespected, they have a 5% daily chance of asking to leave the cove. A modal pops — beg them to stay or let them go.

## Auto move-in on marriage
When two residents marry, one literally moves into the other's home. Their schedule updates so they go home together.

## Babies actually grow up
Babies born to married couples now visibly age over in-game days: baby (5 days) → kid (7 days) → teen (10 days) → adult. They get bigger as they grow.

## Gift system
Press **G** when standing next to any resident. Pick an item from your pouch. They love some items, hate others. Big affinity bumps for matches.

## Audio
Procedural ocean ambient, gentle generative music that shifts per season, chibi voice gibberish per character. First tap unlocks sound (browser rule). Volume sliders in the Pause menu (Esc).

## Multi-day letter arcs
Five real story arcs unfold over many in-game days:
- The Compost War (Bramble vs Pip)
- Quill's Book (Greg the Seagull's coming-of-age novel)
- The Twin Code (Echo and Wren growing apart and back together)
- Rosa's Reunion (Sea Witch reunion show)
- The Lost Cove Letter (50-year-old bottle wash-up)

Reply with the right tone to advance the arc. Wrong tone stalls it. Each arc ends with rewards.

## Festivals
Day 3 of each season the cove gathers for a festival: Bloom Festival, Cove Fishing Tournament, Leaf-Rake Contest, Gift Exchange.

## Steam-ready Electron
- `package.json` configured with electron + electron-builder
- `electron-main.js` opens the game in a desktop window
- `Build Desktop.bat` runs `npm install` then `electron-builder --win` and produces `dist/PebbleCove-Setup-0.4.0.exe`
- Drop a Steam appid + steamworks.js when you're ready to ship

## Begin button fix
The "Begin" button on the name screen had a runtime error in residents.js that broke the game. Fixed. Also added touch-event handlers so mobile taps register cleanly.

## Hotkeys (PC)
- WASD/arrows — walk
- E — interact
- G — gift to nearby resident
- M — mailbox
- Tab — inventory
- R — relationships
- C — cookbook
- P — pairing shop
- F — face paint
- D — dream journal
- B — world editor
- Esc — pause + settings

## Mobile
- Left half = touch joystick
- Right half = tap to interact
- Drag any chibi onto another to introduce them

## Still on the wishlist (future updates)
- More minigames (cooking, gardening, racing)
- Furniture / house decoration interior view
- Real Steam achievements + cloud saves
- Localization
- More resident archetypes
- Photo mode
