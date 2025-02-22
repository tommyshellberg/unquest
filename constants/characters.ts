import { ImageSourcePropType } from "react-native";

export type Character = {
  id: string;
  type: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
  profileImage: ImageSourcePropType;
};

export const CHARACTERS: Character[] = [
  {
    id: "alchemist",
    type: "Alchemist",
    title: "Master of Transformation",
    description:
      "Transforms idle time into powerful elixirs and mystical concoctions.",
    image: require("@/assets/images/characters/alchemist.png"),
    profileImage: require("@/assets/images/characters/alchemist-profile.png"),
  },
  {
    id: "druid",
    type: "Druid",
    title: "Guardian of Nature",
    description:
      "Grows stronger through harmony with the natural world and peaceful moments.",
    image: require("@/assets/images/characters/druid.png"),
    profileImage: require("@/assets/images/characters/druid-profile.png"),
  },
  {
    id: "scholar",
    type: "Scholar",
    title: "Seeker of Knowledge",
    description:
      "Gains wisdom and unlocks ancient secrets through contemplation.",
    image: require("@/assets/images/characters/scholar.png"),
    profileImage: require("@/assets/images/characters/scholar-profile.png"),
  },
  {
    id: "wizard",
    type: "Wizard",
    title: "Wielder of Magic",
    description:
      "Channels the power of focus into devastating magical abilities.",
    image: require("@/assets/images/characters/wizard.png"),
    profileImage: require("@/assets/images/characters/wizard-profile.png"),
  },
  {
    id: "knight",
    type: "Knight",
    title: "Paragon of Discipline",
    description: "Builds strength and honor through dedication and restraint.",
    image: require("@/assets/images/characters/knight.png"),
    profileImage: require("@/assets/images/characters/knight-profile.png"),
  },
  {
    id: "bard",
    type: "Bard",
    title: "Voice of Inspiration",
    description: "Creates harmony from silence and inspiration from solitude.",
    image: require("@/assets/images/characters/bard.png"),
    profileImage: require("@/assets/images/characters/bard-profile.png"),
  },
];
