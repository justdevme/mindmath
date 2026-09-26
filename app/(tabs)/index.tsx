import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '@/components/Avatar';
import { BarChart } from '@/components/BarChart';
import { Card } from '@/components/Card';
import { nextClass, notifications, student, weeklyActivity, weeklySummary } from '@/data/mock';
import { useCountdown } from '@/hooks/useCountdown';
import { useAssignments } from '@/store/AssignmentsContext';
import { colors, fontSize, radius, spacing } from '@/theme';

export default function HomeScreen() {
  const { assignments } = useAssignments();
  const todoAssignments = assignments
    .filter((a) => a.status === 'todo')
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
  const nextDueAssignment = todoAssignments[0];
  const countdown = useCountdown(nextDueAssignment?.dueAt ?? new Date().toISOString());
  const hasUnreadNotifications = notifications.some((n) => !n.read);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.dateText}>{student.greetingDate.toUpperCase()}</Text>
            <Text style={styles.greeting}>Chào {student.name}</Text>
            <Text style={styles.subtitle}>
              Lớp {student.className} · {student.courseName}
            </Text>
          </View>
          <TouchableOpacity style={styles.bellButton} onPress={() => router.push('/notifications')}>
            <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
            {hasUnreadNotifications && <View style={styles.bellDot} />}
          </TouchableOpacity>
          <Avatar initials={student.initials} />
        </View>

        <View style={styles.statsRow}>
          <StatCard value={String(student.streakDays)} label="ngày liên tiếp" />
          <StatCard value={student.totalPoints.toLocaleString('vi-VN')} label="điểm tích lũy" />
          <StatCard value={student.monthlyAverage.toFixed(1)} label="điểm TB tháng" />
        </View>

        {nextDueAssignment ? (
          <Card style={styles.dueCard}>
            <View style={styles.dueHeaderRow}>
              <View style={styles.dueHeaderLeft}>
                <Ionicons name="time-outline" size={15} color={colors.textSecondary} />
                <Text style={styles.dueHeaderText}>{nextDueAssignment.dueLabel}</Text>
              </View>
              <Text style={styles.dueCountdown}>
                {countdown.expired
                  ? 'Đã hết hạn'
                  : countdown.hours > 0
                    ? `Còn ${countdown.hours} giờ`
                    : `Còn ${countdown.minutes} phút`}
              </Text>
            </View>
            <Text style={styles.dueTitle}>{nextDueAssignment.title}</Text>
            <Text style={styles.dueMeta}>
              {nextDueAssignment.subject} · {nextDueAssignment.questionsCount} câu ·{' '}
              {nextDueAssignment.teacher}
            </Text>
            <View style={styles.dueButtonRow}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.push(`/homework/${nextDueAssignment.id}/submit`)}
              >
                <Text style={styles.primaryButtonText}>Nộp bài</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.push(`/homework/${nextDueAssignment.id}`)}
              >
                <Text style={styles.secondaryButtonText}>Xem đề bài</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ) : (
          <Card style={styles.emptyDueCard}>
            <Ionicons name="checkmark-circle" size={28} color={colors.success} />
            <Text style={styles.emptyDueTitle}>Bạn đã hoàn thành hết bài tập!</Text>
            <Text style={styles.emptyDueSubtitle}>Ghé lại sau để xem bài tập mới nhé.</Text>
          </Card>
        )}

        <Card style={styles.nextClassCard}>
          <View style={styles.nextClassIcon}>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.nextClassLabel}>BUỔI HỌC TIẾP THEO</Text>
            <Text style={styles.nextClassTitle}>{nextClass.label}</Text>
            <Text style={styles.nextClassRoom}>{nextClass.room}</Text>
          </View>
        </Card>

        <Card>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Hoạt động tuần này</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/progress')}>
              <Text style={styles.linkText}>Chi tiết</Text>
            </TouchableOpacity>
          </View>
          <BarChart
            data={weeklyActivity.map((d) => ({
              label: d.day,
              value: d.value,
              highlighted: d.day === 'T5',
            }))}
            height={110}
            showValueOnHighlighted
          />
          <Text style={styles.weeklySummaryText}>
            {weeklySummary.exercisesDone} bài đã làm · {weeklySummary.daysPracticed}/
            {weeklySummary.daysTotal} ngày có luyện tập
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <Card style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  dateText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.4,
  },
  greeting: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  dueCard: {
    borderColor: colors.primarySoft,
    gap: spacing.sm,
  },
  emptyDueCard: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xl,
  },
  emptyDueTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  emptyDueSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  dueHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueHeaderText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  dueCountdown: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: '700',
  },
  dueTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  dueMeta: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  dueButtonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: fontSize.md,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: fontSize.md,
  },
  nextClassCard: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  nextClassIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextClassLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
  nextClassTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  nextClassRoom: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  linkText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.primary,
  },
  weeklySummaryText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
});
