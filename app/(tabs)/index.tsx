import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '@/components/Avatar';
import { BarChart } from '@/components/BarChart';
import { Card } from '@/components/Card';
import { assignments, nextClass, student, weeklyActivity, weeklySummary } from '@/data/mock';
import { useCountdown } from '@/hooks/useCountdown';
import { colors, fontSize, radius, spacing } from '@/theme';

export default function HomeScreen() {
  const todayAssignment = assignments.find((a) => a.status === 'todo' && a.group === 'today');
  const countdown = useCountdown(todayAssignment?.dueAt ?? new Date().toISOString());

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
          <TouchableOpacity style={styles.bellButton}>
            <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <Avatar initials={student.initials} />
        </View>

        <View style={styles.statsRow}>
          <StatCard value={String(student.streakDays)} label="ngày liên tiếp" />
          <StatCard value={student.totalPoints.toLocaleString('vi-VN')} label="điểm tích lũy" />
          <StatCard value={student.monthlyAverage.toFixed(1)} label="điểm TB tháng" />
        </View>

        {todayAssignment && (
          <Card style={styles.dueCard}>
            <View style={styles.dueHeaderRow}>
              <View style={styles.dueHeaderLeft}>
                <Ionicons name="time-outline" size={15} color={colors.textSecondary} />
                <Text style={styles.dueHeaderText}>
                  Hạn hôm nay · {new Date(todayAssignment.dueAt).getHours()}:00
                </Text>
              </View>
              <Text style={styles.dueCountdown}>
                {countdown.expired ? 'Đã hết hạn' : `Còn ${countdown.hours} giờ`}
              </Text>
            </View>
            <Text style={styles.dueTitle}>{todayAssignment.title}</Text>
            <Text style={styles.dueMeta}>
              {todayAssignment.subject} · {todayAssignment.questionsCount} câu · {todayAssignment.teacher}
            </Text>
            <View style={styles.dueButtonRow}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.push(`/homework/${todayAssignment.id}/submit`)}
              >
                <Text style={styles.primaryButtonText}>Nộp bài</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.push(`/homework/${todayAssignment.id}`)}
              >
                <Text style={styles.secondaryButtonText}>Xem đề bài</Text>
              </TouchableOpacity>
            </View>
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
  dueCard: {
    borderColor: colors.primarySoft,
    gap: spacing.sm,
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
