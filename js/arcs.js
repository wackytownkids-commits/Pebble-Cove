/* ============================================================
   arcs.js — multi-day letter arcs that unfold over many in-game
   days. Each arc has steps with letters, conditions, choices,
   and a reward at the end.
   ============================================================ */

const Arcs = {
  // arc definitions
  defs: [
    {
      id: 'compost_war',
      title: 'The Compost War',
      steps: [
        { from: 'bunny', body: "Don't tell ANYONE I said this but Bramble has been leaving extra zucchini on Pip's doorstep. They had ANOTHER fight at the market about the compost bin. I'm DYING.\n— Bunny", advance: ['warm','sassy','formal'] },
        { from: 'bramble', body: "Keeper. Once again I write to inform you that PIP is hoarding the compost bin. I have left zucchini for them as a gesture. THEY DID NOT THANK ME. Please intercede.\n— Bramble", advance: ['warm','formal'] },
        { from: 'pip', body: "Hi Keeper! Quick note. Bramble keeps leaving me zucchini. I'd like to make it stop. The zucchini are starting to feel like a threat.\n— Pip ✿", advance: ['warm','sassy','formal'] },
        { from: 'bunny', body: "OK update. They had ANOTHER fight today and Pip cried IN PUBLIC. I'm so tired. Tell me how to fix this. I beg.\n— Bunny", advance: ['warm','formal'] },
        { from: 'bramble', body: "Pip and I... had a long talk. There were tears (not mine). The zucchini was wrong of me. Thank you for not laughing.\n— Bramble", advance: ['warm','formal','sassy'] },
      ],
      onComplete: () => {
        UI.toast('🥒 The Compost War is resolved.', 'heart');
        gameState.coins += 25;
        // mark Bramble & Pip as friends
        Phases.bumpAffinity('bramble','pip', 30);
      }
    },
    {
      id: 'quills_book',
      title: "Quill's Book",
      steps: [
        { from: 'quill', body: 'Keeper — first chapter enclosed. "It was a darkly luminous morning. The seagull, named Greg, had Big Plans..." Be honest. (Mostly kind.)\n— Quill', advance: ['warm','formal'] },
        { from: 'quill', body: "Chapter 4 enclosed. Greg has discovered ambition. He wants to become a notary. Don't laugh. (You can laugh a little.)\n— Quill", advance: ['warm','sassy'] },
        { from: 'quill', body: 'Chapter 9 — Greg meets a mysterious tern named Tatiana. She has secrets. So many secrets. I am unwell.\n— Quill', advance: ['warm','formal','sassy'] },
        { from: 'astra', body: "I have read your friend's manuscript without permission. The seagull has potential. Tatiana is a metaphor. Tell him keep going.\n— Astra", advance: ['warm','formal'] },
        { from: 'quill', body: "It's done. The book. THE BOOK. Pip is going to put it in the General Store. Will anyone buy it?? Should I be alone right now\n— Quill", advance: ['warm'] },
        { from: 'pip', body: "Hi! Quill's novel arrived this morning. We sold THREE copies before noon. To Mum, to Astra, and to the Mayor (?). Quill is in the back of the store sobbing happy tears.\n— Pip ✿", advance: ['warm','formal'] },
      ],
      onComplete: () => {
        UI.toast("📖 Quill's book is published. Greg the Seagull lives.", 'heart');
        gameState.coins += 40;
        gameState.inventory['quills_book'] = (gameState.inventory['quills_book'] || 0) + 1;
      }
    },
    {
      id: 'twin_code',
      title: 'The Twin Code',
      steps: [
        { from: 'echo', body: "I am told to tell you nothing.\n\nSo I have written nothing here.\n\nThe blank space below is on purpose.\n\n\n— E.", advance: ['warm','formal'] },
        { from: 'wren', body: "Echo says hello. (Echo did not say hello.)\nWe don't agree on what to write. So we wrote nothing in particular.\n— W.", advance: ['warm','sassy'] },
        { from: 'echo', body: "...do you ever feel like there are two of you and only one is allowed to speak.\n— E.", advance: ['warm'] },
        { from: 'wren', body: "Echo wants you to know they wrote a letter and then tore it up. I retrieved the pieces. I am sending them in this envelope. Sorry.\n— W.", advance: ['warm','formal'] },
        { from: 'echo', body: "We had a fight. She left for two days. The cottage was quiet in a way I did not like. Did you know I could miss her? I did not.\n— E.", advance: ['warm','formal'] },
        { from: 'wren', body: "Came back. Echo was crying. I was crying. We wrote a list of all the things we are NOT allowed to be the same about. It is a long list. Thank you for listening to my ramble.\n— W.", advance: ['warm'] },
      ],
      onComplete: () => {
        UI.toast('🪞 The twins are themselves now.', 'heart');
        gameState.coins += 35;
        Phases.bumpAffinity('echo','player', 20);
        Phases.bumpAffinity('wren','player', 20);
      }
    },
    {
      id: 'rosa_reunion',
      title: "Rosa's Reunion",
      steps: [
        { from: 'rosa', body: "Don't reply. Just so you know: Sea Witch was a real band. We had T-shirts. There were TWELVE of them.\n— R.", advance: ['warm'] },
        { from: 'rosa', body: "Got a letter from Marlene. Bass player. Hadn't heard from her in nine years. She just had a kid. A KID. Marlene.\n— R.", advance: ['warm','sassy'] },
        { from: 'rosa', body: "They want to do a reunion show. Just one. At the cove. I said no. Then I said maybe. Now I'm pacing.\n— R.", advance: ['warm','formal'] },
        { from: 'rosa', body: "Marlene's coming next week with her kid and a bass. Don't ask me how I feel about it. I don't know either.\n— R.", advance: ['warm'] },
        { from: 'rosa', body: "It happened. They came. We played three songs. Pip cried. Mum cried. I... had a moment. Anyway. Thanks.\n— R.\nP.S. Don't tell anyone I cried.", advance: ['warm','formal'] },
      ],
      onComplete: () => {
        UI.toast('🎸 Sea Witch reunites. The cove plays the chorus all week.', 'heart');
        gameState.coins += 30;
      }
    },
    {
      id: 'lost_letter',
      title: 'The Lost Cove Letter',
      steps: [
        { from: 'astra', body: "A bottle washed up overnight. The letter inside is fifty years old. The handwriting is gentle. The recipient was never named.\nI think it was meant for someone in this cove.\n— Astra", advance: ['warm','formal'] },
        { from: 'mum', body: "Astra showed me the letter. I cried for an hour. I will not say why. Please find who it was for.\n— Mum", advance: ['warm'] },
        { from: 'tide', body: "An old face / fades on yellowed paper / the sea remembers.\n— Tide", advance: ['warm','formal'] },
        { from: 'astra', body: "I have an idea. Bring the letter to the lighthouse at low tide. Look under the third stone, west side. The truth wants to be found.\n— Astra", advance: ['warm','formal'] },
        { from: 'mum', body: "It was for my grandmother. I knew. I knew the moment I saw the curve of the 'M'. She kept it on her dresser. Then she died and the letter was lost. Now it's home. Thank you.\n— Mum", advance: ['warm','formal'] },
      ],
      onComplete: () => {
        UI.toast('💌 The lost cove letter has come home.', 'heart');
        gameState.coins += 50;
        Phases.bumpAffinity('mum','player', 25);
      }
    },
  ],

  // runtime state: { arcId: stepIndex } — only present if arc is active
  active: {},
  completed: {},

  // start an arc (called when conditions met or by story)
  start(arcId) {
    if (Arcs.active[arcId] !== undefined || Arcs.completed[arcId]) return;
    Arcs.active[arcId] = 0;
    UI.toast(`📨 New arc: ${Arcs.defs.find(a => a.id === arcId).title}`, 'heart');
  },

  // called every morning to inject arc letters into today's mail
  injectMorningLetters(letters) {
    for (const arcId in Arcs.active) {
      const def = Arcs.defs.find(a => a.id === arcId);
      const idx = Arcs.active[arcId];
      if (idx >= def.steps.length) continue;
      const step = def.steps[idx];
      letters.push({
        id: 'arc_' + arcId + '_' + idx,
        from: step.from,
        body: step.body.replace(/\{playerName\}/g, gameState.playerName),
        read: false, replied: false,
        arcId, arcStep: idx,
      });
    }
  },

  // called when player replies to a letter
  onReply(letter, tone) {
    if (!letter.arcId) return;
    const def = Arcs.defs.find(a => a.id === letter.arcId);
    if (!def) return;
    const step = def.steps[letter.arcStep];
    if (!step) return;
    if (!step.advance.includes(tone)) return; // wrong tone, no advance
    Arcs.active[letter.arcId] = letter.arcStep + 1;
    if (Arcs.active[letter.arcId] >= def.steps.length) {
      Arcs.completed[letter.arcId] = true;
      delete Arcs.active[letter.arcId];
      if (def.onComplete) def.onComplete();
    }
  },

  // try to auto-trigger arcs based on world state
  autoStart() {
    if (gameState.dayNumber >= 2 && !Arcs.completed.compost_war) Arcs.start('compost_war');
    if (gameState.dayNumber >= 4 && !Arcs.completed.quills_book) Arcs.start('quills_book');
    if (gameState.dayNumber >= 8 && !Arcs.completed.twin_code) Arcs.start('twin_code');
    if (gameState.dayNumber >= 12 && !Arcs.completed.rosa_reunion) Arcs.start('rosa_reunion');
    if (gameState.dayNumber >= 18 && !Arcs.completed.lost_letter) Arcs.start('lost_letter');
  },
};
