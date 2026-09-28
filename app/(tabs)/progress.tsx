import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '@/components/Avatar';
import { BarChart } from '@/components/BarChart';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { useProgressStats } from '@/hooks/useProgressStats';
import { useGradedResults } from '@/hooks/useGradedResults';
import { formatShortDate } from '@/lib/progress';
import { Period, PERIODS } from '@/lib/types';
import { useAuth } from '@/store/AuthContext';
import { colors, fontSize, radius, spacing } from '@/theme';

const SCORE_TARGET = 8.0;

export default function ProgressScreen() {
  const { profile } = useAuth();
  const [period, setPeriod] = useState<Period>(PERIODS[0]);
  const { stats } = useProgressStats(period);
  const { results: testHistory } = useGradedResults();

  const deltaPositive = stats.deltaFromLastMonth >= 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Tiến độ học tập</Text>
            <Text style={styles.subtitle}>
              {profile?.full_name ?? ''} · Lớp {profile?.class_name ?? '—'} · MindMath
            </Text>
          </View>
          <Avatar initials={profile?.avatar_initials ?? '??'} />
        </View>

        <View style={styles.periodRow}>
          {PERIODS.map((p) => {
            const active = p === period;
            return (
              <TouchableOpacity
                key={p}
                onPress={() => setPeriod(p)}
                style={[styles.periodChip, active && styles.periodChipActive]}
              >
                <Text style={[styles.periodText, active && styles.periodTextActive]}>{p}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Card>
          <Text style={styles.metricLabel}>ĐIỂM TRUNG BÌNH</Text>
          <View style={styles.averageRow}>
            <Text style={styles.averageValue}>{stats.average.toFixed(1)}</Text>
            <View
              style={[styles.deltaBadge, { backgroundColor: deltaPositive ? colors.successSoft : colors.dangerSoft }]}
            >
              <Ionicons
                name={deltaPositive ? 'arrow-up' : 'arrow-down'}
                size={12}
                color={deltaPositive ? colors.success : colors.primary}
              />
              <Text style={[styles.deltaText, { color: deltaPositive ? colors.success : colors.primary }]}>
                {deltaPositive ? '+' : ''}
                {stats.deltaFromLastMonth.toFixed(1)} so với kỳ trước
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.overviewStatsRow}>
            <OverviewStat value={String(stats.submitted)} label="bài đã nộp" />
            <OverviewStat value={`${stats.onTimeRate}%`} label="nộp đúng hạn" />
            <OverviewStat value={stats.highest.toFixed(1)} label="điểm cao nhất" />
          </View>
        </Card>

        <View>
          <Text style={styles.sectionTitle}>Điểm các bài kiểm tra gần nhất</Text>
          <Card style={{ marginTop: spacing.md }}>
            {stats.recentScores.length === 0 ? (
              <Text style={styles.emptyText}>Chưa có điểm nào trong kỳ này.</Text>
            ) : (
              <>
                <BarChart
                  data={stats.recentScores.map((s, idx) => ({
                    label: s.date,
                    value: s.score,
                    highlighted: idx === stats.recentScores.length - 1,
                    valueLabel: s.score.toFixed(1),
                  }))}
                  maxValue={10}
                  target={SCORE_TARGET}
                  height={130}
                />
                <Text style={styles.targetText}>Mục tiêu {SCORE_TARGET.toFixed(1)}</Text>
              </>
            )}
          </Card>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Mức độ thành thạo theo chủ đề</Text>
          <Card style={{ marginTop: spacing.md, gap: spacing.lg }}>
            {stats.topicMastery.length === 0 ? (
              <Text style={styles.emptyText}>Chưa có dữ liệu chủ đề trong kỳ này.</Text>
            ) : (
              stats.topicMastery.map((t) => (
                <View key={t.topic} style={{ gap: spacing.sm }}>
                  <View style={styles.topicHeaderRow}>
                    <Text style={styles.topicName}>{t.topic}</Text>
                    <View style={styles.topicRight}>
                      {t.needsWork && <Badge label="Cần cải thiện" tone="warning" />}
                      <Text style={styles.topicPercent}>{t.percent}%</Text>
                    </View>
                  </View>
                  <ProgressBar percent={t.percent} color={t.needsWork ? colors.warning : colors.primary} />
                </View>
              ))
            )}
          </Card>
        </View>

        <View>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Lịch sử kiểm tra</Text>
            <TouchableOpacity onPress={() => router.push('/test-history')}>
              <Text style={styles.linkText}>Tất cả</Text>
            </TouchableOpacity>
          </View>
          <View style={{ gap: spacing.md, marginTop: spacing.md }}>
            {testHistory.length === 0 ? (
              <Text style={styles.emptyText}>Chưa có bài kiểm tra nào.</Text>
            ) : (
              testHistory.slice(0, 3).map((t) => (
                <TouchableOpacity key={t.id} activeOpacity={0.8} onPress={() => router.push('/test-history')}>
                  <Card style={styles.historyRow}>
                    <View style={styles.historyScoreBox}>
                      <Text style={styles.historyScoreText}>{t.score.toFixed(1)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.historyTitle}>{t.title}</Text>
                      <Text style={styles.historyMeta}>
                        {formatShortDate(t.dateIso)} · {t.teacher}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                  </Card>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function OverviewStat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.overviewStat}>
      <Text style={styles.overviewValue}>{value}</Text>
      <Text style={styles.overviewLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxxl },
  header: { flexDirection: 'row', alignItems: 'flex-start' },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  periodRow: { flexDirection: 'row', gap: spacing.sm },
  periodChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.chipInactive,
  },
  periodChipActive: { backgroundColor: colors.primary },
  periodText: { fontSize: fontSize.sm, fontWeight: '700', color: colors.textSecondary },
  periodTextActive: { color: colors.white },
  metricLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  averageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  averageValue: { fontSize: 42, fontWeight: '800', color: colors.primary },
  deltaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  deltaText: { fontSize: fontSize.xs, fontWeight: '700' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.lg },
  overviewStatsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  overviewStat: { alignItems: 'flex-start' },
  overviewValue: { fontSize: fontSize.xl, fontWeight: '800', color: colors.textPrimary },
  overviewLabel: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  targetText: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: spacing.sm },
  topicHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topicName: { fontSize: fontSize.md, fontWeight: '600', color: colors.textPrimary },
  topicRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  topicPercent: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  linkText: { fontSize: fontSize.sm, fontWeight: '700', color: colors.primary },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  historyScoreBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyScoreText: { fontSize: fontSize.md, fontWeight: '800', color: colors.success },
  historyTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  historyMeta: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  emptyText: { fontSize: fontSize.sm, color: colors.textMuted, textAlign: 'center', paddingVertical: spacing.lg },
});
