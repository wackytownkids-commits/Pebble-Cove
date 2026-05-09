const Letters = {
  templates: [
    { from:'bunny', body:`Dear {playerName},\n\nDon't tell ANYONE I said this but I think Bramble has been leaving extra zucchini on Pip's doorstep. They had ANOTHER fight at the market about the compost bin and now zucchini? I'm DYING.\n\n— Bunny` },
    { from:'mum',   body:`Hello love,\n\nMade too many cinnamon buns this morning. Sending you one. Please do not feed it to Grub's bug. Grub already tried.\n\nTake care of yourself out there.\n\n— Mum` },
    { from:'tide',  body:`Foam on the rock face\nThe mailbox glints in dawn light\nI cast — the line snaps.\n\n— Tide` },
    { from:'quill', body:`Keeper —\n\nFirst chapter enclosed. Be honest. (Be kind. But be honest.)\n\n"It was a darkly luminous morning. The seagull, named Greg, had Big Plans..."\n\n— Quill` },
    { from:'grub',  body:`KEEEPERRRR look what i found!! please give it to mum she will love it. it has SIX legs i counted. (it might also bite)\n\n— Grub` },
    { from:'rosa',  body:`Don't write back. I just need to scream into a paper.\n\nThe mayor is a buffoon. The wind is too loud. My amp is broken. I am surrounded by IDIOTS.\n\n— Rosa\nP.S. Maybe one line back. Just one.` },
    { from:'astra', body:`Dearest Lighthouse-Friend,\n\nThe tide will rise in three days. The seagull-king has been deposed. {randomResident} will receive a Strange Gift before the moon turns full.\n\n☽ Astra ☾` },
    { from:'bramble', body:`Keeper. Once again I write to inform you that PIP is hoarding the compost bin. I have left zucchini for them as a gesture. THEY DID NOT THANK ME.\n\nPlease intercede.\n\n— Bramble` },
    { from:'pip', body:`Hi Keeper!\n\nQuick note. Bramble keeps leaving me zucchini. I would like to make it stop.\n\n— Pip ✿` },
    { from:'mayor', body:`RE: COVE ORDINANCE 4.7B (REVISED)\n\nDear Citizen,\n\nEffective immediately, lighthouse beams may no longer rotate counter-clockwise on Tuesdays.\n\nSincerely,\nTHE MAYOR\n(Re-elect THE MAYOR)` },
    { from:'echo',  body:`I am told to tell you nothing.\n\nSo I have written nothing here.\n\nThe blank space below is on purpose.\n\n— E.` },
    { from:'wren',  body:`Echo says hello. (Echo did not say hello.) We don't agree on what to write.\n\n— W.` },
  ],

  todays: [],

  generateForDay() {
    Letters.todays = [];
    if (typeof Arcs !== 'undefined') {
      Arcs.autoStart();
      Arcs.injectMorningLetters(Letters.todays);
    }
    const count = Math.max(2, 4 + Math.floor(Math.random() * 3) - Letters.todays.length);
    const pool  = [...Letters.templates];
    for (let i = 0; i < count && pool.length; i++) {
      const idx = (Math.random() * pool.length) | 0;
      const t = pool.splice(idx, 1)[0];
      Letters.todays.push({
        id: 'L' + Date.now() + '_' + i,
        from: t.from,
        body: Letters.resolveVars(t.body),
        read: false,
        replied: false,
      });
    }
  },

  resolveVars(text) {
    const others = Residents.defs.map(r => r.name);
    const rand = others[(Math.random()*others.length)|0];
    return text.replace(/\{playerName\}/g, gameState.playerName)
               .replace(/\{randomResident\}/g, rand);
  }
};
