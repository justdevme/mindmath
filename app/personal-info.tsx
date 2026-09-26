import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '@/components/Avatar';
import { Card } from '@/components/Card';
import { student } from '@/data/mock';
import { colors, fontSize, spacing } from '@/theme';

const FIELDS: { label: string; value: string }[] = [
  { label: 'Họ và tên', value: student.name },
  { label: 'Lớp', value: student.className },
  { label: 'Khóa học', value: student.courseName },
  { label: 'Email', value: 'minhanh.9a2@mindmath.vn' },
  { label: 'Số điện thoại', value: '0912 345 678' },
  { label: 'Ngày sinh', value: '08/09/2011' },
];

export default function PersonalInfoScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.avatarRow}>
          <Avatar initials={student.initials} size={72} />
        </View>

        <Card padded={false}>
          {FIELDS.map((f, idx) => (
            <View key={f.label} style={[styles.row, idx !== FIELDS.length - 1 && styles.rowBorder]}>
              <Text style={styles.label}>{f.label}</Text>
              <Text style={styles.value}>{f.value}</Text>
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
  content: { padding: spacing.lg, gap: spacing.lg },
  avatarRow: { alignItems: 'center', marginBottom: spacing.sm },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { fontSize: fontSize.sm, color: colors.textSecondary },
  value: { fontSize: fontSize.sm, fontWeight: '700', color: colors.textPrimary },
});
