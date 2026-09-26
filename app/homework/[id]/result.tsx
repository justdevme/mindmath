import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { getAssignmentById } from '@/data/mock';
import { colors, fontSize, radius, spacing } from '@/theme';

export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = getAssignmentById(id);

  if (!item) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>Không tìm thấy bài tập.</Text>
      </SafeAreaView>
    );
  }

  const graded = item.status === 'graded';
  const correctCount = item.questionResults?.filter((q) => q.correct).length ?? item.correctCount ?? 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bài tập</Text>
        {graded ? (
          <Badge label="Đã chấm" tone="success" icon={<Ionicons name="checkmark" size={12} color={colors.success} />} />
        ) : (
          <View style={{ width: 36 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {graded ? (
          <>
            <Card style={styles.scoreCard}>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreValue}>{item.score?.toFixed(1)}</Text>
                <Text style={styles.scoreOutOf}>trên 10</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.meta}>
                  Nộp {item.submittedAt} · Chấm {item.gradedAt} · {item.teacher}
                </Text>
                <View style={styles.tagRow}>
                  <Badge label={`${correctCount}/${item.questionsCount} câu đúng`} tone="success" />
                  {item.onTime && <Badge label="Đúng hạn" tone="info" />}
                </View>
              </View>
            </Card>

            {item.feedback && (
              <Card style={{ gap: spacing.md }}>
                <View style={styles.feedbackHeaderRow}>
                  <Avatar initials={item.feedback.initials} size={36} />
                  <View>
                    <Text style={styles.feedbackTeacher}>{item.feedback.teacher}</Text>
                    <Text style={styles.feedbackAt}>Nhận xét · {item.feedback.at}</Text>
                  </View>
                </View>
                <Text style={styles.feedbackText}>{item.feedback.text}</Text>
                <View style={styles.tagRow}>
                  {item.feedback.tags.map((tag, idx) => (
                    <Badge key={idx} label={tag} tone={idx === 0 ? 'success' : 'warning'} />
                  ))}
                </View>
              </Card>
            )}

            {item.questionResults && (
              <View>
                <View style={styles.questionHeaderRow}>
                  <Text style={styles.sectionTitle}>Kết quả từng câu</Text>
                  <View style={styles.legendRow}>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
                      <Text style={styles.legendText}>Đúng</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                      <Text style={styles.legendText}>Sai</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.questionGrid}>
                  {item.questionResults.map((q) => (
                    <View
                      key={q.number}
                      style={[
                        styles.questionCell,
                        { backgroundColor: q.correct ? colors.successSoft : colors.primary },
                      ]}
                    >
                      <Text
                        style={[
                          styles.questionCellText,
                          { color: q.correct ? colors.success : colors.white },
                        ]}
                      >
                        {q.number}
                      </Text>
                    </View>
                  ))}
                </View>
                {item.questionResults.some((q) => !q.correct) && (
                  <TouchableOpacity activeOpacity={0.8}>
                    <Card style={styles.wrongQuestionRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.wrongQuestionTitle}>
                          Câu {item.questionResults.find((q) => !q.correct)?.number} · Sai
                        </Text>
                        <Text style={styles.wrongQuestionSub}>Xem lời giải chi tiết của thầy</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color={colors.primary} />
                    </Card>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </>
        ) : (
          <Card style={{ alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxxl }}>
            <Ionicons name="checkmark-circle" size={48} color={colors.success} />
            <Text style={styles.title}>Đã nộp bài thành công!</Text>
            <Text style={styles.meta}>Thầy/cô sẽ chấm và gửi phản hồi sớm nhất có thể.</Text>
          </Card>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/(tabs)/homework')}>
          <Text style={styles.secondaryButtonText}>Về danh sách</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Luyện bài tương tự</Text>
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
  scoreCard: { flexDirection: 'row', gap: spacing.lg, alignItems: 'flex-start' },
  scoreCircle: {
    width: 76,
    height: 76,
    borderRadius: radius.xl,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: { fontSize: fontSize.xl, fontWeight: '800', color: colors.success },
  scoreOutOf: { fontSize: 10, color: colors.success },
  title: { fontSize: fontSize.lg, fontWeight: '800', color: colors.textPrimary },
  meta: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4 },
  tagRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm, flexWrap: 'wrap' },
  feedbackHeaderRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  feedbackTeacher: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  feedbackAt: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
  feedbackText: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20 },
  questionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  legendRow: { flexDirection: 'row', gap: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: fontSize.xs, color: colors.textSecondary },
  questionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  questionCell: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionCellText: { fontWeight: '700', fontSize: fontSize.sm },
  wrongQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    backgroundColor: colors.dangerSoft,
    borderColor: colors.primarySoft,
  },
  wrongQuestionTitle: { fontSize: fontSize.sm, fontWeight: '700', color: colors.primary },
  wrongQuestionSub: { fontSize: fontSize.xs, color: colors.primary, marginTop: 2 },
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
