import { QuestTemplate } from "@/store/types";

export const AVAILABLE_QUESTS: QuestTemplate[] = [
  {
    id: "quest-1",
    title: "A Confused Awakening",
    description:
      "Awaken in a dark forest with no memory, as a distant hut beckons through the gloom.",
    durationMinutes: 3,
    reward: { xp: 100 },
    poiSlug: "darkwood-awakening",
    story: `
      In the quiet solitude of a mist-laden forest, you awaken with no memory of how you arrived. 
      Amid the dew and silence, you discover a weathered map in your pocket. 
      At first glance, it seems to chart only the immediate forest around you—but its intricate lines hint at a path beyond, toward a forgotten realm.
    `,
  },
  {
    id: "quest-2",
    title: "Shelter of Whispers",
    description:
      "Seek refuge in a modest hut and discover a mysterious map that reveals only your immediate surroundings.",
    durationMinutes: 10,
    reward: { xp: 120 },
    poiSlug: "hut-of-whispers",
    story: `
      Within the humble walls of the Hut of Whispers, you find shelter from the night.
      Amidst the quiet, a weathered map—its markings enigmatic—appears as if by magic,
      hinting at a path known only to those brave enough to seek its secrets.
    `,
  },
  {
    id: "quest-3",
    title: "The Weary Crossing",
    description:
      "Build a makeshift raft and brave a torrential river, emerging on the far shore, breathless and spent.",
    durationMinutes: 15,
    reward: { xp: 150 },
    poiSlug: "weary-crossing",
    story: `
      With determination and raw ingenuity, you fashion a crude raft from fallen logs.
      Battling a furious current that roars like an untamed beast, you cross the raging river.
      On the far shore, amidst heavy breaths and a pounding heart, relief and resolve intertwine.
    `,
  },
  {
    id: "quest-4",
    title: "Echoes of the Ancients",
    description:
      "Follow the shoreline to a colossal ancient arch inscribed with cryptic messages that whisper secrets of the past.",
    durationMinutes: 20,
    reward: { xp: 200 },
    poiSlug: "arch-of-echoes",
    story: `
      As you stroll along the shimmering shoreline, a monumental arch emerges from the mist.
      Its weathered stones bear mysterious inscriptions that echo forgotten lore.
      Each symbol kindles a question, inviting you to unravel a legacy woven into the very fabric of time.
    `,
  },
  {
    id: "quest-5",
    title: "The Rugged Outcropping",
    description:
      "Venture inland until you confront a formidable rock crag at the edge of a tranquil lake, forcing you to turn back.",
    durationMinutes: 25,
    reward: { xp: 250 },
    poiSlug: "rugged-outcropping",
    story: `As you journey inland, a rugged outcropping comes into view at the edge of a vast, 
    tranquil lake. Unlike the river crossed earlier, 
    the calm yet expansive waters now present a boundary too great to traverse. 
    Recognizing that this serene lake offers no easy passage, you pause to reflect, 
    understanding that sometimes progress lies in retracing one's steps and gathering new wisdom.
    `,
  },
];
