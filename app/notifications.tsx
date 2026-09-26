import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificationItem, notifications as seedNotifications } from '@/data/mock';
import { colors, fontSize, radius, spacing } from '@/theme';

function iconFor(icon: NotificationItem['icon']): keyof typeof Ionicons.glyphMap {
  switch (icon) {
    case 'document-text':
      return 'document-text-outline';
    case 'checkmark-circle':
      return 'checkmark-circle-outline';
    case 'calendar':
      return 'calendar-outline';
    case 'trophy':
      return 'trophy-outline';
    default:
      return 'notifications-outline';
  }
}

export default function NotificationsScreen() {
  const [items, setItems] = useState<NotificationItem[]>(seedNotifications);

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <TouchableOpacity onPress={markAllRead}>
          <Text style={styles.markAllText}>Đọc hết</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setItems((prev) => prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)))}
            style={[styles.row, !item.read && styles.rowUnread]}
          >
            <View style={styles.icon}>
              <Ionicons name={iconFor(item.icon)} size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            {!item.read && <View style={styles.dot} />}
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      />
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
  markAllText: { fontSize: fontSize.sm, fontWeight: '700', color: colors.primary },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: 'flex-start',
  },
  rowUnread: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.primarySoft,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  body: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  time: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: spacing.xs },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 4 },
});
