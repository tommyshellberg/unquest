import { QUEST_MAP_MAPPING } from "@/app/data/maps";
import type { MapId } from "@/app/data/maps";

export function getMapForQuest(questId: string): MapId {
  for (const [mapId, quests] of Object.entries(QUEST_MAP_MAPPING)) {
    if (quests.some((quest) => quest.id === questId)) {
      return mapId as MapId;
    }
  }
  // Default to 'map-1' if no matching map found
  return "map-1";
}
