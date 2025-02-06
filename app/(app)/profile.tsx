import { CharacterProgress } from "@/components/CharacterProgress";
import { useCharacterStore } from "@/store/character-store";

export default function ProfileScreen() {
  const character = useCharacterStore((state) => state.character);

  if (!character) return null;

  return <CharacterProgress character={character} />;
}
