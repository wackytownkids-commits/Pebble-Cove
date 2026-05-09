/* placemode.js — generic "tap to place X" overlay. Used for shops, residents
   that the player creates, etc. */
const PlaceMode = {
  active: null,    // { kind, label, onPlace }

  start(kind, label, onPlace) {
    PlaceMode.active = { kind, label, onPlace };
    const banner = document.getElementById('place-banner');
    if (banner) {
      banner.style.display = 'flex';
      banner.querySelector('.pm-text').textContent = label;
    }
  },

  cancel() {
    PlaceMode.active = null;
    const banner = document.getElementById('place-banner');
    if (banner) banner.style.display = 'none';
  },

  // called by tap handler with WORLD coords
  tryPlace(x, y) {
    if (!PlaceMode.active) return false;
    const fn = PlaceMode.active.onPlace;
    PlaceMode.active = null;
    const banner = document.getElementById('place-banner');
    if (banner) banner.style.display = 'none';
    fn(x, y);
    return true;
  }
};
