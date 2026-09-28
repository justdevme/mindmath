import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { translateAuthError } from '@/lib/authErrors';
import { useAuth } from '@/store/AuthContext';
import { colors, fontSize, radius, spacing } from '@/theme';

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSignUp() {
    if (!fullName.trim() || !email.trim() || !password) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ họ tên, email và mật khẩu.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Mật khẩu quá ngắn', 'Mật khẩu cần ít nhất 6 ký tự.');
      return;
    }
    setSubmitting(true);
    const { error } = await signUp(email.trim(), password, fullName.trim());
    setSubmitting(false);
    if (error) {
      Alert.alert('Không đăng ký được', translateAuthError(error));
      return;
    }
    Alert.alert(
      'Đăng ký thành công',
      'Nếu project bật xác nhận email, hãy kiểm tra hộp thư trước khi đăng nhập. Nếu không, bạn đã đăng nhập luôn.'
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.logo}>MindMath</Text>
          <Text style={styles.title}>Tạo tài khoản mới</Text>
          <Text style={styles.subtitle}>Bắt đầu hành trình học tập của bạn</Text>

          <View style={{ gap: spacing.lg, marginTop: spacing.xl }}>
            <Field label="Họ và tên" value={fullName} onChangeText={setFullName} autoCapitalize="words" />
            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Field label="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, submitting && { opacity: 0.7 }]}
            onPress={handleSignUp}
            disabled={submitting}
          >
            <Text style={styles.submitButtonText}>{submitting ? 'Đang tạo tài khoản...' : 'Đăng ký'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.linkText}>
              Đã có tài khoản? <Text style={styles.linkTextBold}>Đăng nhập</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'words';
}) {
  return (
    <View style={{ gap: spacing.xs }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholderTextColor={colors.textMuted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingTop: spacing.xxxl * 1.5, flexGrow: 1 },
  logo: { fontSize: fontSize.lg, fontWeight: '800', color: colors.primary },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.textPrimary, marginTop: spacing.lg },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs },
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
    marginTop: spacing.xxl,
  },
  submitButtonText: { color: colors.white, fontWeight: '700', fontSize: fontSize.md },
  linkRow: { marginTop: spacing.lg, alignItems: 'center' },
  linkText: { fontSize: fontSize.sm, color: colors.textSecondary },
  linkTextBold: { color: colors.primary, fontWeight: '700' },
});
