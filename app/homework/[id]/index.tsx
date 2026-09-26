import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { getAssignmentById } from '@/data/mock';
import { useCountdown } from '@/hooks/useCountdown';
import { colors, fontSize, radius, spacing } from '@/theme';

export default function HomeworkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = getAssignmentById(id);
  const countdown = useCountdown(item?.dueAt ?? new Date().toISOString());

  if (!item) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>Không tìm thấy bài tập.</Text>
      </SafeAreaView>
    );
  }

  const isGraded = item.status === 'graded';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bài tập</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="ellipsis-vertical" size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!isGraded && (
          <View style={styles.countdownCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.countdownLabel}>THỜI GIAN CÒN LẠI</Text>
              <Text style={styles.countdownValue}>
                {countdown.expired ? 'Đã hết hạn' : `${countdown.hours} giờ ${countdown.minutes} phút`}
              </Text>
              <Text style={styles.countdownSub}>{item.dueLabel}</Text>
            </View>
            <View style={styles.countdownIcon}>
              <Ionicons name="time-outline" size={22} color={colors.white} />
            </View>
          </View>
        )}

        <View style={styles.tagRow}>
          <Badge label={item.subject} tone="neutral" />
          <Badge label={`${item.questionsCount} câu`} tone="neutral" />
        </View>

        <Text style={styles.title}>{item.title}</Text>

        <Card style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>GIÁO VIÊN</Text>
            <Text style={styles.infoValue}>{item.teacher}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>NGÀY GIAO</Text>
            <Text style={styles.infoValue}>{item.assignedAt}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>HÌNH THỨC NỘP</Text>
            <Text style={styles.infoValue}>{item.submitMethod}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>ĐIỂM HỆ SỐ</Text>
            <Text style={styles.infoValue}>Hệ số {item.scoreCoefficient}</Text>
          </View>
        </Card>

        <Card style={{ gap: spacing.md }}>
          <Text style={styles.requirementTitle}>Yêu cầu</Text>
          <Text style={styles.requirementText}>{item.requirement}</Text>
          <View style={{ gap: spacing.xs }}>
            {item.requirementNotes.map((note, idx) => (
              <View key={idx} style={styles.noteRow}>
                <Text style={styles.noteBullet}>•</Text>
                <Text style={styles.noteText}>{note}</Text>
              </View>
            ))}
          </View>
        </Card>

        <TouchableOpacity activeOpacity={0.8}>
          <Card style={styles.attachmentRow}>
            <View style={styles.fileIcon}>
              <Ionicons name="document-text-outline" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fileName}>{item.attachment.name}</Text>
              <Text style={styles.fileMeta}>
                PDF · {item.attachment.size} · {item.attachment.pages} trang
              </Text>
            </View>
            <View style={styles.downloadButton}>
              <Text style={styles.downloadText}>Tải về</Text>
            </View>
          </Card>
        </TouchableOpacity>
      </ScrollView>

      {!isGraded && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => router.push(`/homework/${item.id}/submit`)}
          >
            <Ionicons name="cloud-upload-outline" size={18} color={colors.white} />
            <Text style={styles.submitButtonText}>Nộp bài làm</Text>
          </TouchableOpacity>
          <Text style={styles.footerHint}>Bạn có thể nộp lại nhiều lần trước {item.dueLabel.replace('Hạn ', '')}</Text>
        </View>
      )}
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
  countdownCard: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  countdownLabel: { fontSize: fontSize.xs, fontWeight: '700', color: '#F6D3D7', letterSpacing: 0.5 },
  countdownValue: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.white, marginTop: 4 },
  countdownSub: { fontSize: fontSize.sm, color: '#F6D3D7', marginTop: 2 },
  countdownIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagRow: { flexDirection: 'row', gap: spacing.sm },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.textPrimary },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  infoCol: { width: '45%' },
  infoLabel: { fontSize: fontSize.xs, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.4 },
  infoValue: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary, marginTop: 4 },
  requirementTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  requirementText: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20 },
  noteRow: { flexDirection: 'row', gap: spacing.sm },
  noteBullet: { color: colors.textSecondary },
  noteText: { flex: 1, fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20 },
  attachmentRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileName: { fontSize: fontSize.sm, fontWeight: '700', color: colors.textPrimary },
  fileMeta: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  downloadButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  downloadText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.textPrimary },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  submitButton: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: { color: colors.white, fontWeight: '700', fontSize: fontSize.md },
  footerHint: { fontSize: fontSize.xs, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm },
});
