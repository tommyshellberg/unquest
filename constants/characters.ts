import { ImageSourcePropType } from "react-native";

export type Character = {
  id: string;
  name: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
};

export const CHARACTERS: Character[] = [
  {
    id: "alchemist",
    name: "Alchemist",
    title: "Master of Transformation",
    description:
      "Transforms idle time into powerful elixirs and mystical concoctions.",
    image: require("../assets/images/characters/alchemist.png"),
  },
  {
    id: "druid",
    name: "Druid",
    title: "Guardian of Nature",
    description:
      "Grows stronger through harmony with the natural world and peaceful moments.",
    image: require("../assets/images/characters/druid.png"),
  },
  {
    id: "scholar",
    name: "Scholar",
    title: "Seeker of Knowledge",
    description:
      "Gains wisdom and unlocks ancient secrets through contemplation.",
    image: require("../assets/images/characters/scholar.png"),
  },
  {
    id: "wizard",
    name: "Wizard",
    title: "Wielder of Magic",
    description:
      "Channels the power of focus into devastating magical abilities.",
    image: require("../assets/images/characters/wizard.png"),
  },
  {
    id: "knight",
    name: "Knight",
    title: "Paragon of Discipline",
    description: "Builds strength and honor through dedication and restraint.",
    image: require("../assets/images/characters/knight.png"),
  },
  {
    id: "bard",
    name: "Bard",
    title: "Voice of Inspiration",
    description: "Creates harmony from silence and inspiration from solitude.",
    image: require("../assets/images/characters/bard.png"),
  },
];
