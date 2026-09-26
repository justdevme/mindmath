import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { getPracticeQuestion } from '@/data/practice';
import { useAssignments } from '@/store/AssignmentsContext';
import { colors, fontSize, radius, spacing } from '@/theme';

export default function PracticeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getById } = useAssignments();
  const item = getById(id);
  const [seed, setSeed] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  if (!item) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>Không tìm thấy bài tập.</Text>
      </SafeAreaView>
    );
  }

  const question = getPracticeQuestion(item.subject, seed);
  const answered = selected !== null;
  const isCorrect = selected === question.correctIndex;

  function nextQuestion() {
    setSeed((s) => s + 1);
    setSelected(null);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Luyện tập</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          {item.subject} · Bài tương tự &ldquo;{item.title}&rdquo;
        </Text>

        <Card style={{ gap: spacing.lg }}>
          <Text style={styles.prompt}>{question.prompt}</Text>
          <View style={{ gap: spacing.sm }}>
            {question.choices.map((choice, idx) => {
              const isSelected = selected === idx;
              const isRightAnswer = answered && idx === question.correctIndex;
              const isWrongSelected = answered && isSelected && !isCorrect;
              return (
                <TouchableOpacity
                  key={idx}
                  disabled={answered}
                  onPress={() => setSelected(idx)}
                  style={[
                    styles.choice,
                    isSelected && !answered && styles.choiceSelected,
                    isRightAnswer && styles.choiceCorrect,
                    isWrongSelected && styles.choiceWrong,
                  ]}
                >
                  <Text
                    style={[
                      styles.choiceText,
                      (isRightAnswer || isWrongSelected) && { color: colors.white },
                    ]}
                  >
                    {choice}
                  </Text>
                  {isRightAnswer && <Ionicons name="checkmark-circle" size={18} color={colors.white} />}
                  {isWrongSelected && <Ionicons name="close-circle" size={18} color={colors.white} />}
                </TouchableOpacity>
              );
            })}
          </View>

          {answered && (
            <View style={styles.explanationBox}>
              <Text style={styles.explanationLabel}>
                {isCorrect ? 'Chính xác!' : 'Chưa đúng — giải thích:'}
              </Text>
              <Text style={styles.explanationText}>{question.explanation}</Text>
            </View>
          )}
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>Quay lại</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, !answered && { opacity: 0.5 }]}
          disabled={!answered}
          onPress={nextQuestion}
        >
          <Text style={styles.primaryButtonText}>Câu tiếp theo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  notFound: { textAlign: 'center', marginTop: spacing.xxxl, color: colors.textSecondary },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  iconButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxxl },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary },
  prompt: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary, lineHeight: 22 },
  choice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  choiceSelected: { borderColor: colors.primary },
  choiceCorrect: { backgroundColor: colors.success, borderColor: colors.success },
  choiceWrong: { backgroundColor: colors.primary, borderColor: colors.primary },
  choiceText: { fontSize: fontSize.md, fontWeight: '600', color: colors.textPrimary },
  explanationBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  explanationLabel: { fontSize: fontSize.sm, fontWeight: '700', color: colors.textPrimary },
  explanationText: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20 },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  secondaryButtonText: { fontWeight: '700', color: colors.textPrimary, fontSize: fontSize.md },
  primaryButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  primaryButtonText: { fontWeight: '700', color: colors.white, fontSize: fontSize.md },
});
