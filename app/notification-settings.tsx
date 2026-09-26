import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { colors, fontSize, spacing } from '@/theme';

type SettingKey = 'dueSoon' | 'graded' | 'classReminder' | 'streak' | 'announcements';

const OPTIONS: { key: SettingKey; label: string; description: string }[] = [
  { key: 'dueSoon', label: 'Bài tập sắp đến hạn', description: 'Nhắc trước 6 giờ và 1 giờ khi hết hạn.' },
  { key: 'graded', label: 'Bài tập đã được chấm', description: 'Báo ngay khi thầy/cô chấm xong bài.' },
  { key: 'classReminder', label: 'Nhắc lịch học', description: 'Thông báo trước giờ học 30 phút.' },
  { key: 'streak', label: 'Chuỗi ngày học tập', description: 'Nhắc luyện tập để giữ chuỗi ngày liên tiếp.' },
  { key: 'announcements', label: 'Thông báo từ MindMath', description: 'Tin tức, cập nhật tính năng mới.' },
];

const defaultState: Record<SettingKey, boolean> = {
  dueSoon: true,
  graded: true,
  classReminder: true,
  streak: false,
  announcements: false,
};

export default function NotificationSettingsScreen() {
  const [settings, setSettings] = useState(defaultState);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt thông báo</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <Card padded={false}>
          {OPTIONS.map((opt, idx) => (
            <View key={opt.key} style={[styles.row, idx !== OPTIONS.length - 1 && styles.rowBorder]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{opt.label}</Text>
                <Text style={styles.description}>{opt.description}</Text>
              </View>
              <Switch
                value={settings[opt.key]}
                onValueChange={(v) => setSettings((prev) => ({ ...prev, [opt.key]: v }))}
                trackColor={{ true: colors.primary, false: colors.chipInactive }}
                thumbColor={colors.white}
              />
            </View>
          ))}
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  iconButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  content: { padding: spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  description: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
});
