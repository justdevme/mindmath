import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { Assignment, SUBJECTS } from '@/data/mock';
import { useAssignments } from '@/store/AssignmentsContext';
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
  const { assignments } = useAssignments();
  const [tab, setTab] = useState<TabKey>('todo');
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeSubjects, setActiveSubjects] = useState<Assignment['subject'][]>([]);

  const filtered = useMemo(
    () =>
      activeSubjects.length === 0
        ? assignments
        : assignments.filter((a) => activeSubjects.includes(a.subject)),
    [assignments, activeSubjects]
  );

  const counts = useMemo(
    () => ({
      todo: filtered.filter((a) => a.status === 'todo').length,
      submitted: filtered.filter((a) => a.status === 'submitted').length,
      graded: filtered.filter((a) => a.status === 'graded').length,
    }),
    [filtered]
  );

  const dueTodayCount = filtered.filter((a) => a.status === 'todo' && a.group === 'today').length;

  const groupedTodo = useMemo(() => {
    const groups: Assignment['group'][] = ['today', 'week', 'upcoming'];
    return groups
      .map((g) => ({
        group: g,
        items: filtered.filter((a) => a.status === 'todo' && a.group === g),
      }))
      .filter((g) => g.items.length > 0);
  }, [filtered]);

  const recentlyGraded = filtered.filter((a) => a.status === 'graded');
  const listForTab = filtered.filter((a) => a.status === tab);

  function toggleSubject(subject: Assignment['subject']) {
    setActiveSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Bài tập về nhà</Text>
          <Text style={styles.subtitle}>
            {counts.todo} bài cần làm · {dueTodayCount} bài đến hạn hôm nay
          </Text>
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}>
          <Ionicons name="options-outline" size={18} color={colors.textPrimary} />
          {activeSubjects.length > 0 && <View style={styles.filterDot} />}
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
            {groupedTodo.length === 0 && (
              <Text style={styles.emptyText}>Không có bài tập nào phù hợp bộ lọc.</Text>
            )}
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
                ) : tab === 'submitted' ? (
                  <SubmittedRow key={item.id} item={item} />
                ) : (
                  <AssignmentCard key={item.id} item={item} />
                )
              )
            )}
          </View>
        )}
      </ScrollView>

      <Modal visible={filterVisible} animationType="slide" transparent onRequestClose={() => setFilterVisible(false)}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setFilterVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalSheet}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Lọc theo môn học</Text>
              {activeSubjects.length > 0 && (
                <TouchableOpacity onPress={() => setActiveSubjects([])}>
                  <Text style={styles.modalClearText}>Xóa lọc</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={{ gap: spacing.sm }}>
              {SUBJECTS.map((subject) => {
                const active = activeSubjects.includes(subject);
                return (
                  <TouchableOpacity
                    key={subject}
                    style={[styles.subjectOption, active && styles.subjectOptionActive]}
                    onPress={() => toggleSubject(subject)}
                  >
                    <Text style={[styles.subjectOptionText, active && styles.subjectOptionTextActive]}>
                      {subject}
                    </Text>
                    {active && <Ionicons name="checkmark" size={18} color={colors.white} />}
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity style={styles.modalApplyButton} onPress={() => setFilterVisible(false)}>
              <Text style={styles.modalApplyText}>Áp dụng</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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

function SubmittedRow({ item }: { item: Assignment }) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => router.push(`/homework/${item.id}`)}>
      <Card style={{ gap: spacing.sm }}>
        <View style={styles.cardTopRow}>
          <Text style={styles.subjectLabel}>{item.subject.toUpperCase()}</Text>
          <Badge label="Chờ chấm" tone="info" />
        </View>
        <Text style={styles.assignmentTitle}>{item.title}</Text>
        <Text style={styles.assignmentMeta}>
          Đã nộp {item.submittedAt} · {item.submittedFiles?.length ?? 0} tệp · {item.teacher}
        </Text>
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
    position: 'relative',
  },
  filterDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(36,20,20,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: fontSize.lg, fontWeight: '800', color: colors.textPrimary },
  modalClearText: { fontSize: fontSize.sm, fontWeight: '700', color: colors.primary },
  subjectOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.chipInactive,
  },
  subjectOptionActive: { backgroundColor: colors.primary },
  subjectOptionText: { fontSize: fontSize.md, fontWeight: '600', color: colors.textPrimary },
  subjectOptionTextActive: { color: colors.white },
  modalApplyButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  modalApplyText: { color: colors.white, fontWeight: '700', fontSize: fontSize.md },
});
