import { QuestTemplate } from "@/store/quest-store";

export const AVAILABLE_QUESTS: QuestTemplate[] = [
  {
    id: "quest-1",
    title: "The Journey Begins",
    description:
      "Cold and without shelter, the hero starts in the dense woods.",
    durationMinutes: 10,
    reward: { xp: 100 },
    minLevel: 1,
    poiSlug: "shrouded-forest",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `
      In the depths of the Veiled Canopy, ${character.name} awoke shivering beneath the towering trees.
      The chill seeped into their bones, and the dense fog clouded all paths.
      Without shelter or warmth, ${character.name} gathered courage and ventured forward,
      igniting the spark of an epic journey.
      `;
    },
  },
  {
    id: "quest-2",
    title: "Hints of Serenity",
    description: "Discover a small hut with hints about the path to serenity.",
    durationMinutes: 10,
    reward: { xp: 120 },
    minLevel: 2,
    poiSlug: "cave-in-the-hillside",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `
      Emerging from the shadows, ${character.name} spotted a humble hut nestled against the hillside.
      Inside, old scrolls and cryptic symbols hinted at a path toward inner peace and enlightenment.
      The whispers of ancient wisdom filled the air, guiding ${character.name} to ponder the true meaning of their quest.
      `;
    },
  },
  {
    id: "quest-3",
    title: "Crossing the Divide",
    description: "Desperate, the hero crosses the river in a makeshift raft.",
    durationMinutes: 15,
    reward: { xp: 140 },
    minLevel: 2,
    poiSlug: "river-with-bridges",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `
      The River of Whispers flowed swiftly, its currents a daunting barrier.
      With resources scarce, ${character.name} crafted a makeshift raft from fallen branches and vines.
      Battling the relentless waters, they crossed the river, each stroke a testament to their determination and will to survive.
      `;
    },
  },
  {
    id: "quest-4",
    title: "Wisdom's Echo",
    description: "Discover an ancient arch with wisdom etched into the walls.",
    durationMinutes: 10,
    reward: { xp: 160 },
    minLevel: 2,
    poiSlug: "white-marble-archway",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `
      Standing before the Archway of Forgotten Oaths, ${character.name} traced fingers over the time-worn inscriptions.
      The ancient symbols glowed faintly, imparting forgotten wisdom and truths long lost to the world.
      Enlightened by these revelations, ${character.name} felt a surge of clarity and purpose.
      `;
    },
  },
  {
    id: "quest-5",
    title: "The Impasse",
    description: "Advance to the edge of a rocky lake, getting stuck.",
    durationMinutes: 10,
    reward: { xp: 180 },
    minLevel: 2,
    poiSlug: "blue-lake",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `
      Reaching the shores of the Azure Lagoon, ${character.name} faced an imposing obstacle.
      The rocky lake stretched far and wide, its jagged edges offering no easy passage.
      Stuck and contemplating the next move, ${character.name} realized that ingenuity would be the key to overcoming this impasse.
      `;
    },
  },
  {
    id: "quest-6",
    title: "The Whispering Woods",
    description:
      "Take 15 minutes to step away from your phone and into the world around you. Let your thoughts roam free as you walk, observe the beauty of your surroundings, and reconnect with the present moment.",
    durationMinutes: 2,
    reward: { xp: 100 },
    minLevel: 3,
    poiSlug: "twilight-spire",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `In a moment of profound stillness, ${character.name} discovered more than just peace in the Whispering Woods. 
      As the ancient trees swayed gently overhead, their wisdom seemed to seep into ${character.name}'s very being. 
      Through this simple act of presence, ${character.name} found that true strength often lies in moments of quiet contemplation. 
      The forest had taught a lesson that would resonate far beyond its peaceful borders.`;
    },
  },
  {
    id: "quest-7",
    title: "The Unexpected Friend",
    description: "Choose to help someone in need along your path.",
    durationMinutes: 3,
    reward: { xp: 150 },
    minLevel: 2,
    poiSlug: "dragons-cave",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `What began as a simple act of kindness blossomed into something extraordinary. 
      ${character.name} encountered a traveler struggling with their own journey, and without hesitation, offered assistance. 
      In that moment of connection, both ${character.name} and the stranger were reminded that the greatest adventures often come 
      from reaching out to others. Sometimes the most heroic acts are the smallest ones.`;
    },
  },
  {
    id: "quest-8",
    title: "The Sage's Legacy",
    description:
      "Journey to the Summit to retrieve a forgotten artifact: the Orb of Clarity. Along the way, encounter illusions created by rogue spirits.",
    durationMinutes: 20,
    reward: { xp: 200 },
    minLevel: 3,
    poiSlug: "castle-on-the-peak",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `${character.name}'s ascent to the Castle on the Peak was fraught with challenges.  
      Surrounded by illusions crafted by rogue spirits, ${character.name} had to rely on inner wisdom and clarity to distinguish reality from deception.  
      Upon reaching the summit, the Orb of Clarity shimmered with a light that seemed to cleanse the very air, and ${character.name} felt a profound sense of enlightenment.`;
    },
  },
  {
    id: "quest-9",
    title: "Echoes of Harmony",
    description:
      "Tune your energy with the forest to find the source of the mysterious melody.",
    durationMinutes: 10,
    reward: { xp: 150 },
    minLevel: 2,
    poiSlug: "dense-wooded-area",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `${character.name} stepped into the Forest of Resonance, where every leaf whispered songs of old.  
      Guided by a haunting melody, ${character.name} moved deeper into the woods, attuning to the subtle harmonies of nature.  
      At the heart of the forest, the source of the melody revealed itself—a guardian spirit who bestowed a blessing upon those who truly listened.`;
    },
  },
  {
    id: "quest-10",
    title: "The Silent Current",
    description:
      "Gather fragments of memories by meditating near the river's banks.",
    durationMinutes: 15,
    reward: { xp: 180 },
    minLevel: 2,
    poiSlug: "river-with-bridges",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `Sitting beside the shimmering waters of the River of Whispers, ${character.name} closed their eyes and listened.  
      The murmurs of the river unfolded stories of travelers long gone.  
      Through quiet reflection, ${character.name} pieced together the fragments of these memories, gaining wisdom from the past to guide the future.`;
    },
  },
  {
    id: "quest-11",
    title: "The Keeper's Flame",
    description:
      "Light a ceremonial flame to banish the shadows surrounding the pavilion.",
    durationMinutes: 10,
    reward: { xp: 160 },
    minLevel: 2,
    poiSlug: "golden-pavilion",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `Arriving at the Pavilion of Eternal Light, ${character.name} found it dimmed by encroaching shadows.  
      With a steady hand and a pure heart, ${character.name} lit the ceremonial flame.  
      The pavilion burst into radiant light, dispelling darkness and renewing hope throughout the land.`;
    },
  },
  {
    id: "quest-12",
    title: "The Broken Vow",
    description:
      "Solve the puzzle to restore the oath inscribed on the archway.",
    durationMinutes: 10,
    reward: { xp: 150 },
    minLevel: 3,
    poiSlug: "white-marble-archway",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `Before the Archway of Forgotten Oaths, ${character.name} felt a weight of ancient promises.  
      Carefully studying the faded inscriptions, ${character.name} rearranged the fragmented pieces to restore the sacred vow.  
      As the last word fell into place, the archway glowed, and the legacy of old was rekindled.`;
    },
  },
  {
    id: "quest-13",
    title: "The Phantom's Gambit",
    description:
      "Engage in a game of wits with a spirit in exchange for safe passage.",
    durationMinutes: 15,
    reward: { xp: 170 },
    minLevel: 3,
    poiSlug: "cave-in-the-hillside",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `In the depths of the Crypt of Lingering Shadows, ${character.name} met the elusive Phantom.  
      The spirit challenged ${character.name} to a battle of intellect.  
      Through clever strategy and sharp thinking, ${character.name} emerged victorious, earning safe passage and the Phantom's respect.`;
    },
  },
  {
    id: "quest-14",
    title: "The Trial of Silence",
    description:
      "Ascend the pagoda, passing through trials of silence and focus.",
    durationMinutes: 20,
    reward: { xp: 200 },
    minLevel: 4,
    poiSlug: "multi-tiered-pagoda",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `${character.name} began the ascent of the Pagoda of Stillness, each level presenting a new challenge of silence.  
      Facing echoes of doubt and distraction, ${character.name} maintained unwavering focus.  
      At the summit, a wise monk greeted ${character.name}, acknowledging the mastery of inner peace.`;
    },
  },
  {
    id: "quest-15",
    title: "The Test of Balance",
    description:
      "Gather balance crystals to cross the mystical bridge in the sky.",
    durationMinutes: 10,
    reward: { xp: 160 },
    minLevel: 4,
    poiSlug: "bridge-in-the-sky",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `Standing before the Floating Bridge of Unity, ${character.name} was tasked with collecting balance crystals scattered among the cliffs.  
      With agility and poise, ${character.name} gathered the crystals, each step bringing harmony between body and spirit.  
      The bridge glowed brighter with each crystal returned, allowing safe passage across the sky.`;
    },
  },
  {
    id: "quest-16",
    title: "The Spirit of the Falls",
    description:
      "Purify the waterfall by returning a stolen artifact to its source.",
    durationMinutes: 15,
    reward: { xp: 180 },
    minLevel: 3,
    poiSlug: "waterfall-near-the-base",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `${character.name} approached the Serene Falls, only to find its waters tainted.  
      Retrieving the stolen artifact, ${character.name} returned it to the heart of the waterfall.  
      The waters began to shimmer once more, and a gentle mist enveloped ${character.name}, whispering words of gratitude.`;
    },
  },
  {
    id: "quest-17",
    title: "Seeds of Renewal",
    description:
      "Plant and nurture a symbolic seed to restore the gardens' vitality.",
    durationMinutes: 10,
    reward: { xp: 150 },
    minLevel: 2,
    poiSlug: "terraced-area-with-stairs",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `In the neglected Gardens of Flowing Time, ${character.name} felt the weight of forgotten beauty.  
      Planting a small seed with care, ${character.name} watched as it sprouted instantly, revitalizing the terraces.  
      Streams flowed anew, and the gardens bloomed, symbolizing hope and the cyclical nature of time.`;
    },
  },
  {
    id: "quest-18",
    title: "The Star Seeker",
    description:
      "Restore a broken celestial lens to reveal hidden constellations that guide travelers.",
    durationMinutes: 15,
    reward: { xp: 180 },
    minLevel: 3,
    poiSlug: "hilltop-observatory",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `At the Celestial Observatory, ${character.name} discovered the remnants of a once-magnificent celestial lens.  
      By carefully piecing together the shattered fragments, ${character.name} restored its brilliance.  
      The night sky ignited with hidden constellations, their light guiding travelers and igniting hope across the land.`;
    },
  },
  {
    id: "quest-19",
    title: "The Woodland Pact",
    description:
      "Negotiate peace with the mischievous forest spirits disturbing the trees.",
    durationMinutes: 20,
    reward: { xp: 200 },
    minLevel: 4,
    poiSlug: "dense-forest",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `${character.name} ventured into the Whispering Pines, where trees whispered tales of mischief.  
      The forest spirits were restless, and only through patience and understanding did ${character.name} negotiate peace.  
      The trees sighed in relief, and harmony was restored to the forest.`;
    },
  },
  {
    id: "quest-20",
    title: "The Crystal Harbinger",
    description:
      "Retrieve a radiant crystal to stabilize the balance of the cavern's energies.",
    durationMinutes: 15,
    reward: { xp: 170 },
    minLevel: 3,
    poiSlug: "crystal-cave",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `Deep within the Glimmering Caverns, ${character.name} was surrounded by dazzling lights and shifting shadows.  
      Retrieving the radiant crystal was no simple task, but with steadfast resolve, ${character.name} secured it, bringing balance back to the caverns.  
      The energies calmed, and the caverns pulsed with a soothing glow.`;
    },
  },
  {
    id: "quest-21",
    title: "The Ashes of Rebirth",
    description:
      "Help a wounded phoenix regain its strength and witness its rebirth.",
    durationMinutes: 15,
    reward: { xp: 190 },
    minLevel: 3,
    poiSlug: "high-cliff",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `Atop the high cliffs of the Phoenix Roost, ${character.name} found a majestic phoenix weakened and forlorn.  
      Through care and compassion, ${character.name} aided the creature, witnessing its fiery rebirth.  
      The phoenix soared into the sky, its renewed vitality a testament to resilience and hope.`;
    },
  },
  {
    id: "quest-22",
    title: "Moonlit Harvest",
    description:
      "Collect glowing lunar blossoms before the moon sets to assist a wandering herbalist.",
    durationMinutes: 15,
    reward: { xp: 160 },
    minLevel: 2,
    poiSlug: "moonlit-garden",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `Under the soft glow of the moon in the Lunar Gardens, ${character.name} collected the rare lunar blossoms.  
      Time was fleeting, but with swift action, ${character.name} gathered enough to assist the grateful herbalist.  
      The blossoms shimmered gently, symbolizing kindness and community.`;
    },
  },
  {
    id: "quest-23",
    title: "Fragments of the Sky",
    description:
      "Piece together shards of a fallen star scattered across the mountain.",
    durationMinutes: 20,
    reward: { xp: 210 },
    minLevel: 4,
    poiSlug: "mountain-ridge",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `On the rugged paths of the Shattered Peak, ${character.name} sought the scattered shards of a fallen star.  
      Each fragment held a piece of celestial magic.  
      Upon reuniting them, the star ascended back to the heavens, restoring a piece of the night sky.`;
    },
  },
  {
    id: "quest-24",
    title: "The Merchant's Gambit",
    description:
      "Help a merchant recover stolen treasures scattered across the spires.",
    durationMinutes: 20,
    reward: { xp: 200 },
    minLevel: 4,
    poiSlug: "city-on-the-mountain",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `${character.name} explored the Golden Spires in search of the merchant's lost treasures.  
      Navigating through towering structures and hidden passages, ${character.name} retrieved the valuables.  
      The merchant's gratitude was immense, and trade flourished once more in the city.`;
    },
  },
  {
    id: "quest-25",
    title: "The Silent Chant",
    description:
      "Uncover the lost chant of the shrine and harmonize its energy.",
    durationMinutes: 20,
    reward: { xp: 210 },
    minLevel: 4,
    poiSlug: "sacred-shrine",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `In the hushed halls of the Shrine of Echoes, ${character.name} listened intently for the lost chant.  
      Through deep meditation, the ancient melody surfaced.  
      As ${character.name} recited it, the shrine resonated with harmonious energy, healing the land around it.`;
    },
  },
  {
    id: "quest-26",
    title: "The Frostwarden's Favor",
    description:
      "Brave the icy sanctuary and assist the Frostwarden in guarding the ancient relics.",
    durationMinutes: 15,
    reward: { xp: 180 },
    minLevel: 3,
    poiSlug: "icy-cave",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `Within the Frozen Sanctuary, ${character.name} faced chilling winds and treacherous ice.  
      The Frostwarden, impressed by the courage displayed, accepted ${character.name}'s help in safeguarding the ancient relics.  
      Together, they secured the sanctuary, preserving its secrets for generations to come.`;
    },
  },
  {
    id: "quest-27",
    title: "The Ashen Rebirth",
    description:
      "Rekindle the flames of an ancient forge to craft a powerful artifact.",
    durationMinutes: 15,
    reward: { xp: 190 },
    minLevel: 3,
    poiSlug: "charred-fortress",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `Amidst the Ember Ruins, ${character.name} sought to reignite the legendary forge.  
      With determination and skill, the flames roared back to life.  
      From the blazing heat, ${character.name} crafted an artifact of immense power, symbolizing rebirth and renewal.`;
    },
  },
  {
    id: "quest-28",
    title: "The Water's Secret",
    description:
      "Dive into the lagoon to retrieve a lost pearl for the water nymphs.",
    durationMinutes: 10,
    reward: { xp: 150 },
    minLevel: 2,
    poiSlug: "blue-lake",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `${character.name} dove into the crystal-clear waters of the Azure Lagoon.  
      Navigating the shimmering depths, ${character.name} retrieved the lost pearl cherished by the water nymphs.  
      Grateful, the nymphs blessed ${character.name} with a tranquility that echoed the serenity of the lagoon.`;
    },
  },
  {
    id: "quest-29",
    title: "The Firekeeper's Trial",
    description:
      "Test your courage by guiding a flame through the grove's trials.",
    durationMinutes: 20,
    reward: { xp: 200 },
    minLevel: 3,
    poiSlug: "firelit-forest",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `Entering the Emberwood Grove, ${character.name} was tasked with carrying a sacred flame through its trials.  
      Faced with challenges that tested courage and resolve, ${character.name} kept the flame alive.  
      Emerging victorious, the grove acknowledged ${character.name} as a true Firekeeper.`;
    },
  },
  {
    id: "quest-30",
    title: "The Merchant's Call",
    description:
      "Help restore the bazaar by gathering materials from the nearby hills.",
    durationMinutes: 20,
    reward: { xp: 180 },
    minLevel: 3,
    poiSlug: "golden-market",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `${character.name} ventured to the Gilded Bazaar, finding it in disrepair.  
      Gathering rare materials from the surrounding hills, ${character.name} aided in restoring its former glory.  
      The merchants celebrated, and commerce thrived once more thanks to ${character.name}'s efforts.`;
    },
  },
  {
    id: "quest-31",
    title: "The Wind's Whisper",
    description: "Learn the ancient wind techniques from a floating monk.",
    durationMinutes: 20,
    reward: { xp: 210 },
    minLevel: 4,
    poiSlug: "floating-monastery",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `At the Cloudspire Monastery, ${character.name} met a monk who seemed to float with the breeze.  
      Through patience and practice, ${character.name} learned the ancient techniques of the wind.  
      The whispers of the wind became clear, granting ${character.name} newfound wisdom and agility.`;
    },
  },
  {
    id: "quest-32",
    title: "The Abyss Beckons",
    description:
      "Descend into the chasm to retrieve a stolen artifact guarded by shadows.",
    durationMinutes: 20,
    reward: { xp: 220 },
    minLevel: 4,
    poiSlug: "dark-chasm",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `Braving the depths of the Abyssal Rift, ${character.name} confronted the shadows guarding the stolen artifact.  
      With courage and sharp wit, ${character.name} reclaimed the artifact, bringing light back to the abyss.  
      The shadows receded, acknowledging the heroism of ${character.name}.`;
    },
  },
  {
    id: "quest-33",
    title: "The Radiant Keeper",
    description: "Climb the tower to light the beacon and guide lost souls.",
    durationMinutes: 20,
    reward: { xp: 210 },
    minLevel: 4,
    poiSlug: "tower-of-light",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `${character.name} ascended the Seraphic Tower, each step radiating with increasing light.  
      At the summit, ${character.name} ignited the ancient beacon, its light piercing the skies.  
      Lost souls found their way, drawn by the beacon, thanks to ${character.name}'s compassion.`;
    },
  },
  {
    id: "quest-34",
    title: "The Eternal Balance",
    description:
      "Balance the energies of the ring by solving its shifting puzzles.",
    durationMinutes: 20,
    reward: { xp: 220 },
    minLevel: 4,
    poiSlug: "circular-island",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `Upon the Celestial Ring, ${character.name} faced puzzles that shifted like the tides.  
      By harmonizing the energies and solving the enigmas, ${character.name} restored balance to the ring.  
      The island glowed with a serene light, echoing the equilibrium achieved by ${character.name}.`;
    },
  },
  {
    id: "quest-35",
    title: "The Rapids' Call",
    description: "Help a stranded ferryman navigate the treacherous rapids.",
    durationMinutes: 15,
    reward: { xp: 170 },
    minLevel: 3,
    poiSlug: "waterfalls-and-streams",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `${character.name} encountered a ferryman stranded by the tumultuous Silver Rapids.  
      Using quick thinking and bravery, ${character.name} guided the ferryman safely through the waters.  
      Grateful, the ferryman offered a token of appreciation and tales of distant lands.`;
    },
  },
  {
    id: "quest-36",
    title: "The Warden's Test",
    description:
      "Prove your worth by facing trials set by the forest's warden.",
    durationMinutes: 15,
    reward: { xp: 180 },
    minLevel: 3,
    poiSlug: "shrouded-forest",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `In the depths of the Veiled Canopy, ${character.name} faced the Warden's trials.  
      Challenged by both physical obstacles and riddles, ${character.name} demonstrated skill and wisdom.  
      The Warden acknowledged ${character.name}'s worth, granting safe passage and a blessing.`;
    },
  },
  {
    id: "quest-37",
    title: "The Stairway to Serenity",
    description:
      "Ascend the steps while solving riddles left by ancient monks.",
    durationMinutes: 15,
    reward: { xp: 190 },
    minLevel: 3,
    poiSlug: "mystic-staircase",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `At the base of the Moonlit Steps, ${character.name} began the ascent under the silvery glow.  
      Each step presented a riddle, testing intellect and insight.  
      Solving them all, ${character.name} reached the top, finding serenity and a panoramic view of the realm.`;
    },
  },
  {
    id: "quest-38",
    title: "The Grotto's Secret",
    description:
      "Uncover an ancient treasure by solving the grotto's water puzzles.",
    durationMinutes: 20,
    reward: { xp: 200 },
    minLevel: 4,
    poiSlug: "hidden-cave",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `Deep within the Eternal Grotto, ${character.name} encountered intricate water puzzles guarding ancient treasures.  
      By observing the flow and patterns, ${character.name} unlocked the grotto's secrets.  
      The hidden treasure was revealed, a testament to ${character.name}'s perseverance and ingenuity.`;
    },
  },
  {
    id: "quest-39",
    title: "The Meadow's Bloom",
    description:
      "Restore the meadow's glowing flowers by gathering scattered seeds.",
    durationMinutes: 20,
    reward: { xp: 180 },
    minLevel: 2,
    poiSlug: "bright-meadow",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `In the Luminous Plains, the once-glowing flowers had dimmed.  
      ${character.name} collected scattered seeds across the meadow, planting them with care.  
      As the new blooms emerged, the plains lit up in a radiant display, symbolizing renewal and hope.`;
    },
  },
  {
    id: "quest-40",
    title: "The Shadowed Flame",
    description:
      "Light the dark fortress with a magical flame from the Emberwood Grove.",
    durationMinutes: 20,
    reward: { xp: 220 },
    minLevel: 4,
    poiSlug: "dark-fortress",
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `${character.name} journeyed from the Emberwood Grove carrying a magical flame.  
      Reaching the Obsidian Fortress, ${character.name} ignited its ancient torches, dispelling darkness.  
      The fortress shimmered, revealing hidden passages and secrets, all thanks to ${character.name}'s courage.`;
    },
  },
];
