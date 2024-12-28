import { StyleSheet, View, Pressable } from "react-native";
import { ThemedText } from "./ThemedText";
import { QuestCard } from "./QuestCard";
import { Colors, FontSizes, Spacing } from "@/constants/theme";
import { Quest } from "@/store/types";

type Props = {
  quests: Array<Omit<Quest, "startedAt">>;
  onSelectQuest: (quest: Omit<Quest, "startedAt">) => void;
};

export function QuestList({ quests, onSelectQuest }: Props) {
  return (
    <View style={styles.container}>
      {quests.map((quest) => (
        <Pressable
          key={quest.id}
          onPress={() => onSelectQuest(quest)}
          style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
        >
          <QuestCard>
            <View style={styles.questHeader}>
              <ThemedText style={styles.questTitle}>{quest.title}</ThemedText>
              <ThemedText style={styles.questDuration}>
                {quest.durationMinutes} minutes
              </ThemedText>
            </View>

            <ThemedText style={styles.questDescription}>
              {quest.description}
            </ThemedText>

            <View style={styles.questReward}>
              <ThemedText style={styles.rewardText}>
                Reward: {quest.reward.xp} XP
              </ThemedText>
            </View>
          </QuestCard>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },
  pressable: {
    opacity: 1,
  },
  pressed: {
    opacity: 0.8,
  },
  questHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.cream,
    flex: 1,
  },
  questDuration: {
    fontSize: FontSizes.sm,
    color: Colors.cream,
    opacity: 0.8,
  },
  questDescription: {
    fontSize: FontSizes.md,
    color: Colors.cream,
    lineHeight: 22,
    marginTop: Spacing.md,
  },
  questReward: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.cream + "20",
  },
  rewardText: {
    fontSize: FontSizes.sm,
    color: Colors.cream,
    fontWeight: "600",
  },
});
