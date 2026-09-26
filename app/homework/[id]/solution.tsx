import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { useAssignments } from '@/store/AssignmentsContext';
import { colors, fontSize, radius, spacing } from '@/theme';

export default function SolutionScreen() {
  const { id, q } = useLocalSearchParams<{ id: string; q: string }>();
  const { getById } = useAssignments();
  const item = getById(id);
  const questionNumber = Number(q);
  const solutionText = item?.solutions?.[questionNumber];

  if (!item) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>Không tìm thấy bài tập.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lời giải câu {questionNumber}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>
          {item.subject} · Câu {questionNumber}
        </Text>

        <Card style={{ gap: spacing.sm }}>
          <View style={styles.badgeRow}>
            <Ionicons name="close-circle" size={16} color={colors.primary} />
            <Text style={styles.badgeText}>Câu này em đã làm sai</Text>
          </View>
          <Text style={styles.solutionText}>
            {solutionText ?? 'Thầy/cô chưa đính kèm lời giải chi tiết cho câu này.'}
          </Text>
        </Card>

        {item.feedback && (
          <Card style={{ gap: spacing.xs }}>
            <Text style={styles.feedbackLabel}>Nhận xét chung của {item.feedback.teacher}</Text>
            <Text style={styles.solutionText}>{item.feedback.text}</Text>
          </Card>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push(`/homework/${item.id}/practice`)}
        >
          <Text style={styles.primaryButtonText}>Luyện bài tương tự câu này</Text>
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
  title: { fontSize: fontSize.xl, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: -spacing.sm },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  badgeText: { fontSize: fontSize.sm, fontWeight: '700', color: colors.primary },
  solutionText: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 21 },
  feedbackLabel: { fontSize: fontSize.sm, fontWeight: '700', color: colors.textPrimary },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  primaryButtonText: { color: colors.white, fontWeight: '700', fontSize: fontSize.md },
});
