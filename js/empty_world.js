/* empty_world.js — start with empty cove (just terrain + lighthouse).
   Player has to place buildings, residents, decor themselves. */
const EmptyWorld = {
  apply() {
    World.buildings = [];   // no premade buildings
    World.trees = [];
    World.flowers = [];
    Residents.runtime = []; // no premade residents
    Residents.defs = [];    // wipe defs too so map starts empty
    World.barrierLevel = 0;
    UI.toast('Welcome to your empty cove. Press B to build, then drop in residents.', 'heart');
  }
};
