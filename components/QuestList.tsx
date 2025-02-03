import { StyleSheet, View, Pressable } from "react-native";
import { ThemedText } from "./ThemedText";
import { QuestCard } from "./QuestCard";
import { Colors, FontSizes, Spacing } from "@/constants/theme";
import { QuestTemplate } from "@/store/types";

type Props = {
  quests: Array<QuestTemplate>;
  onSelectQuest: (quest: QuestTemplate) => void;
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
              <ThemedText type="subtitle" style={styles.questTitle}>
                {quest.title}
              </ThemedText>
              <ThemedText type="body" style={styles.questDuration}>
                {quest.durationMinutes} minutes
              </ThemedText>
            </View>

            <ThemedText type="body" style={styles.questDescription}>
              {quest.description}
            </ThemedText>

            <View style={styles.questReward}>
              <ThemedText type="bodyBold" style={styles.rewardText}>
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
    color: Colors.cream,
    flex: 1,
  },
  questDuration: {
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
    color: Colors.cream,
  },
});
