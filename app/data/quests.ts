import { QuestTemplate } from "@/store/types";
import { Character } from "@/store/types";

export const AVAILABLE_QUESTS: QuestTemplate[] = [
  {
    id: "quest-1",
    title: "A Confused Awakening",
    description:
      "Awaken in a dark forest with no memory, as a distant hut beckons through the gloom.",
    durationMinutes: 3,
    reward: { xp: 100 },
    poiSlug: "darkwood-awakening",
    generateStory: (character: Character) => {
      if (!character) throw new Error("Character not found");

      return `
      In the heart of a shadowed forest, ${character.name} awakens with a veil of confusion.
      Memories lie hidden in the mists, yet the faint glow of a distant hut stirs a spark of hope.
      With hesitant steps, the hero embarks on a journey into an uncertain destiny.
      `;
    },
  },
  {
    id: "quest-2",
    title: "Shelter of Whispers",
    description:
      "Seek refuge in a modest hut and discover a mysterious map that reveals only your immediate surroundings.",
    durationMinutes: 10,
    reward: { xp: 120 },
    poiSlug: "hut-of-whispers",
    generateStory: (character: Character) => {
      if (!character) throw new Error("Character not found");

      return `
      Within the humble walls of the Hut of Whispers, ${character.name} finds shelter from the night.
      Amidst the quiet, a weathered map—its markings enigmatic—appears as if by magic,
      hinting at a path known only to those brave enough to seek its secrets.
      `;
    },
  },
  {
    id: "quest-3",
    title: "The Weary Crossing",
    description:
      "Build a makeshift raft and brave a torrential river, emerging on the far shore, breathless and spent.",
    durationMinutes: 15,
    reward: { xp: 150 },
    poiSlug: "weary-crossing",
    generateStory: (character: Character) => {
      if (!character) throw new Error("Character not found");

      return `
      With determination and raw ingenuity, ${character.name} fashions a crude raft from fallen logs.
      Battling a furious current that roars like an untamed beast, the hero crosses the raging river.
      On the far shore, amidst heavy breaths and pounding hearts, relief and resolve intertwine.
      `;
    },
  },
  {
    id: "quest-4",
    title: "Echoes of the Ancients",
    description:
      "Follow the shoreline to a colossal ancient arch inscribed with cryptic messages that whisper secrets of the past.",
    durationMinutes: 20,
    reward: { xp: 200 },
    poiSlug: "arch-of-echoes",
    generateStory: (character: Character) => {
      if (!character) throw new Error("Character not found");

      return `
      As ${character.name} strolls along the shimmering shoreline, a monumental arch emerges from the mist.
      Its weathered stones bear mysterious inscriptions that echo forgotten lore.
      Each symbol kindles a question, inviting the hero to unravel a legacy woven into the very fabric of time.
      `;
    },
  },
  {
    id: "quest-5",
    title: "The Obsidian Impasse",
    description:
      "Venture inland until you confront a formidable rock crag at the edge of a tranquil lake, forcing you to turn back.",
    durationMinutes: 25,
    reward: { xp: 250 },
    poiSlug: "obsidian-crag",
    generateStory: (character: Character) => {
      if (!character) throw new Error("Character not found");

      return `
      Trekking deeper into the unknown, ${character.name} arrives at a vast, impassable crag—The Obsidian Crag—
      towering at the edge of a serene lake. Realizing the barrier cannot be surmounted,
      the hero is compelled to reflect and retrace their steps, gleaning wisdom from the obstacle.
      `;
    },
  },
];
