import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { translateAuthError } from '@/lib/authErrors';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/store/AuthContext';
import { colors, fontSize, radius, spacing } from '@/theme';

export default function ChangePasswordScreen() {
  const { session } = useAuth();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!current || !next || !confirm) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ các trường.');
      return;
    }
    if (next.length < 6) {
      Alert.alert('Mật khẩu quá ngắn', 'Mật khẩu mới cần ít nhất 6 ký tự.');
      return;
    }
    if (next !== confirm) {
      Alert.alert('Mật khẩu không khớp', 'Xác nhận mật khẩu không trùng với mật khẩu mới.');
      return;
    }
    const email = session?.user.email;
    if (!email) return;

    setSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: current });
    if (signInError) {
      setSubmitting(false);
      Alert.alert('Không đổi được mật khẩu', 'Mật khẩu hiện tại không đúng.');
      return;
    }
    const { error: updateError } = await supabase.auth.updateUser({ password: next });
    setSubmitting(false);
    if (updateError) {
      Alert.alert('Không đổi được mật khẩu', translateAuthError(updateError.message));
      return;
    }
    Alert.alert('Thành công', 'Mật khẩu của bạn đã được cập nhật.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đổi mật khẩu</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <Field label="Mật khẩu hiện tại" value={current} onChangeText={setCurrent} />
        <Field label="Mật khẩu mới" value={next} onChangeText={setNext} />
        <Field label="Xác nhận mật khẩu mới" value={confirm} onChangeText={setConfirm} />

        <TouchableOpacity
          style={[styles.submitButton, submitting && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
}) {
  return (
    <View style={{ gap: spacing.xs }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry
        placeholder="••••••••"
        placeholderTextColor={colors.textMuted}
      />
    </View>
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
  label: { fontSize: fontSize.sm, fontWeight: '700', color: colors.textPrimary },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  submitButtonText: { color: colors.white, fontWeight: '700', fontSize: fontSize.md },
});
