import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '@/components/Avatar';
import { Card } from '@/components/Card';
import { colors, fontSize, radius, spacing } from '@/theme';

type Parent = { id: string; name: string; relation: string; phone: string };

const seedParents: Parent[] = [
  { id: 'p1', name: 'Phạm Thị Hoa', relation: 'Mẹ', phone: '0987 654 321' },
];

export default function LinkedParentsScreen() {
  const [parents] = useState<Parent[]>(seedParents);

  function handleAddParent() {
    Alert.alert(
      'Thêm phụ huynh',
      'Gửi lời mời liên kết qua số điện thoại hoặc email để phụ huynh theo dõi tiến độ học tập của bạn.'
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phụ huynh liên kết</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        {parents.map((p) => (
          <Card key={p.id} style={styles.row}>
            <Avatar initials={p.name.split(' ').slice(-1)[0].charAt(0)} size={44} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{p.name}</Text>
              <Text style={styles.meta}>
                {p.relation} · {p.phone}
              </Text>
            </View>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          </Card>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={handleAddParent}>
          <Ionicons name="add" size={18} color={colors.primary} />
          <Text style={styles.addButtonText}>Thêm phụ huynh</Text>
        </TouchableOpacity>
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
  content: { padding: spacing.lg, gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  name: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  meta: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  addButtonText: { fontSize: fontSize.md, fontWeight: '700', color: colors.primary },
});
