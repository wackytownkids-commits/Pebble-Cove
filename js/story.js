/* ============================================================
   story.js — optional Story Mode chapters.
   Doesn't end after completion; sandbox keeps going.
   ============================================================ */

const Story = {
  active: false,        // story mode toggled at start
  chapters: [
    { id:'arrival', title:'A New Keeper', goal: 'Read your first letter.',
      check: () => Letters.todays.some(l => l.read),
      reward: 'You earned 20 coins.', payout: 20 },
    { id:'friend', title:'First Friend', goal: 'Reach Friend with anyone.',
      check: () => Object.values(Phases.pairs).some(r =>
        (r.a === 'player' || r.b === 'player') && ['friend','good_friend','best_friend','sweetheart','dating','engaged','married'].includes(r.phase)),
      reward: 'You earned a Pebble Pendant.', payout: 0 },
    { id:'rebuild', title:'Rebuild the Plaza', goal: 'The President needs your help — accept their map request.',
      check: () => gameState.acceptedPresRequest,
      reward: 'The plaza is bigger now.', payout: 30 },
    { id:'family', title:'A New Arrival', goal: 'A baby is born in the cove.',
      check: () => Residents.runtime.some(r => (r.babies && r.babies.length > 0)) ||
                   Residents.runtime.some(r => r.def && r.def.archetype === 'child'),
      reward: 'The cove grows.', payout: 0 },
    { id:'expand', title:'A Bigger Cove', goal: 'Reach 18 residents.',
      check: () => Residents.runtime.length >= 18,
      reward: 'The barrier has grown.', payout: 50 },
  ],
  currentIndex: 0,

  start() { Story.active = true; Story.currentIndex = 0; UI.toast(`📖 ${Story.chapters[0].title}: ${Story.chapters[0].goal}`); },

  tick() {
    if (!Story.active) return;
    if (Story.currentIndex >= Story.chapters.length) return;
    const ch = Story.chapters[Story.currentIndex];
    if (ch.check()) {
      UI.toast(`✅ ${ch.title} complete! ${ch.reward}`, 'heart');
      if (ch.payout) gameState.coins += ch.payout;
      Story.currentIndex++;
      if (Story.currentIndex < Story.chapters.length) {
        const next = Story.chapters[Story.currentIndex];
        setTimeout(() => UI.toast(`📖 ${next.title}: ${next.goal}`), 2000);
      } else {
        UI.toast('🌅 Story complete — keep playing the cove forever.', 'heart');
      }
    }
  },

  current() {
    if (!Story.active || Story.currentIndex >= Story.chapters.length) return null;
    return Story.chapters[Story.currentIndex];
  },
};
