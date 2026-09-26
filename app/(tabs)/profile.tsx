import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '@/components/Avatar';
import { Card } from '@/components/Card';
import { progressByPeriod, student } from '@/data/mock';
import { colors, fontSize, radius, spacing } from '@/theme';

const rankStats = progressByPeriod['Tháng này'];

const MENU_ITEMS: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}[] = [
  { icon: 'person-outline', label: 'Thông tin cá nhân', onPress: () => router.push('/personal-info') },
  { icon: 'people-outline', label: 'Phụ huynh liên kết', onPress: () => router.push('/linked-parents') },
  {
    icon: 'notifications-outline',
    label: 'Cài đặt thông báo',
    onPress: () => router.push('/notification-settings'),
  },
  { icon: 'lock-closed-outline', label: 'Đổi mật khẩu', onPress: () => router.push('/change-password') },
  { icon: 'help-circle-outline', label: 'Trợ giúp & phản hồi', onPress: () => router.push('/help') },
];

export default function ProfileScreen() {
  function handleLogout() {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất khỏi MindMath?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: () => Alert.alert('Đã đăng xuất') },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Cá nhân</Text>

        <Card style={styles.profileCard}>
          <Avatar initials={student.initials} size={60} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{student.name}</Text>
            <Text style={styles.meta}>
              Lớp {student.className} · {student.courseName}
            </Text>
          </View>
        </Card>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{student.monthlyAverage.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Điểm TB</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>
              {rankStats.rank}/{rankStats.classSize}
            </Text>
            <Text style={styles.statLabel}>Hạng lớp</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{student.streakDays}</Text>
            <Text style={styles.statLabel}>Ngày liên tiếp</Text>
          </Card>
        </View>

        <Card padded={false}>
          {MENU_ITEMS.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuRow, idx !== MENU_ITEMS.length - 1 && styles.menuRowBorder]}
              onPress={item.onPress}
            >
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon} size={18} color={colors.primary} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </Card>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={colors.primary} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxxl },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.textPrimary },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  name: { fontSize: fontSize.lg, fontWeight: '800', color: colors.textPrimary },
  meta: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  statValue: { fontSize: fontSize.lg, fontWeight: '800', color: colors.textPrimary },
  statLabel: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
  },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: fontSize.md, fontWeight: '600', color: colors.textPrimary },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  logoutText: { fontSize: fontSize.md, fontWeight: '700', color: colors.primary },
});
