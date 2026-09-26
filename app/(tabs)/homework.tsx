import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { Assignment, assignments } from '@/data/mock';
import { colors, fontSize, radius, spacing } from '@/theme';

type TabKey = 'todo' | 'submitted' | 'graded';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'todo', label: 'Cần làm' },
  { key: 'submitted', label: 'Đã nộp' },
  { key: 'graded', label: 'Đã chấm' },
];

const GROUP_LABELS: Record<Assignment['group'], string> = {
  today: 'HÔM NAY',
  week: 'TRONG TUẦN',
  upcoming: 'SẮP TỚI',
};

export default function HomeworkScreen() {
  const [tab, setTab] = useState<TabKey>('todo');

  const counts = useMemo(
    () => ({
      todo: assignments.filter((a) => a.status === 'todo').length,
      submitted: assignments.filter((a) => a.status === 'submitted').length,
      graded: assignments.filter((a) => a.status === 'graded').length,
    }),
    []
  );

  const dueTodayCount = assignments.filter((a) => a.status === 'todo' && a.group === 'today').length;

  const groupedTodo = useMemo(() => {
    const groups: Assignment['group'][] = ['today', 'week', 'upcoming'];
    return groups
      .map((g) => ({
        group: g,
        items: assignments.filter((a) => a.status === 'todo' && a.group === g),
      }))
      .filter((g) => g.items.length > 0);
  }, []);

  const recentlyGraded = assignments.filter((a) => a.status === 'graded');
  const listForTab = assignments.filter((a) => a.status === tab);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Bài tập về nhà</Text>
          <Text style={styles.subtitle}>
            {counts.todo} bài cần làm · {dueTodayCount} bài đến hạn hôm nay
          </Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        {TABS.map((t) => {
          const active = t.key === tab;
          return (
            <TouchableOpacity key={t.key} style={styles.tabItem} onPress={() => setTab(t.key)}>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {t.label} · {counts[t.key]}
              </Text>
              {active && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {tab === 'todo' ? (
          <>
            {groupedTodo.map((g) => (
              <View key={g.group} style={{ gap: spacing.md }}>
                <Text style={styles.groupLabel}>{GROUP_LABELS[g.group]}</Text>
                {g.items.map((item) => (
                  <AssignmentCard key={item.id} item={item} />
                ))}
              </View>
            ))}
            {recentlyGraded.length > 0 && (
              <View style={{ gap: spacing.md }}>
                <Text style={styles.groupLabel}>VỪA ĐƯỢC CHẤM</Text>
                {recentlyGraded.map((item) => (
                  <GradedRow key={item.id} item={item} />
                ))}
              </View>
            )}
          </>
        ) : (
          <View style={{ gap: spacing.md }}>
            {listForTab.length === 0 ? (
              <Text style={styles.emptyText}>Chưa có bài tập nào.</Text>
            ) : (
              listForTab.map((item) =>
                tab === 'graded' ? (
                  <GradedRow key={item.id} item={item} />
                ) : (
                  <AssignmentCard key={item.id} item={item} />
                )
              )
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function AssignmentCard({ item }: { item: Assignment }) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => router.push(`/homework/${item.id}`)}>
      <Card style={{ gap: spacing.sm }}>
        <View style={styles.cardTopRow}>
          <Text style={styles.subjectLabel}>{item.subject.toUpperCase()}</Text>
          <Badge label={item.timeLeftLabel ?? ''} tone="primary" />
        </View>
        <Text style={styles.assignmentTitle}>{item.title}</Text>
        <Text style={styles.assignmentMeta}>
          {item.questionsCount} câu · {item.dueLabel} · {item.teacher}
        </Text>
        {item.progress && (
          <View style={{ gap: spacing.xs }}>
            <ProgressBar percent={(item.progress.done / item.progress.total) * 100} />
            <Text style={styles.progressText}>
              {item.progress.done}/{item.progress.total} câu
            </Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
}

function GradedRow({ item }: { item: Assignment }) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => router.push(`/homework/${item.id}/result`)}>
      <Card style={styles.gradedRow}>
        <View style={styles.gradedScoreBox}>
          <Text style={styles.gradedScoreText}>{item.score?.toFixed(1)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.assignmentTitle}>{item.title}</Text>
          <Text style={styles.assignmentMeta}>
            Đã chấm {item.gradedAt} · {item.feedback ? 'có nhận xét của thầy' : ''}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabItem: { marginRight: spacing.xl, paddingBottom: spacing.md },
  tabLabel: { fontSize: fontSize.sm, fontWeight: '600', color: colors.textMuted },
  tabLabelActive: { color: colors.primary, fontWeight: '700' },
  tabIndicator: {
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    marginTop: spacing.sm,
  },
  content: { padding: spacing.lg, gap: spacing.xl, paddingBottom: spacing.xxxl },
  groupLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subjectLabel: { fontSize: fontSize.xs, fontWeight: '700', color: colors.textSecondary },
  assignmentTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.textPrimary },
  assignmentMeta: { fontSize: fontSize.sm, color: colors.textSecondary },
  progressText: { fontSize: fontSize.xs, color: colors.textMuted, textAlign: 'right' },
  gradedRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  gradedScoreBox: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradedScoreText: { fontSize: fontSize.lg, fontWeight: '800', color: colors.success },
  emptyText: { fontSize: fontSize.sm, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xxl },
});
