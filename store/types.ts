// Shared types
export type XP = number;
export type Minutes = number;
export type Timestamp = number;

export interface Reward {
  xp: XP;
  // Future: items, achievements, etc.
}

export interface QuestTemplate {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  reward: Reward;
  poiSlug: string;
  story: string;
}

export interface Quest extends QuestTemplate {
  startTime: number;
}

export interface QuestCompletion {
  quest: Quest;
  story: string;
}

export interface Character {
  id: string;
  type: CharacterType;
  name: string;
  level: number;
  currentXP: XP;
  xpToNextLevel: XP;
}

export type CharacterType =
  | "alchemist"
  | "bard"
  | "druid"
  | "knight"
  | "scholar"
  | "wizard";

export interface Account {
  id: string;
  averageScreenTimeMinutes: Minutes;
  screenTimeGoalMinutes: Minutes;
  created: Timestamp;
  lastActive: Timestamp;
}
