import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { colors, fontSize, radius, spacing } from '@/theme';

const FAQ = [
  {
    q: 'Làm sao để nộp bài tập?',
    a: 'Vào mục Bài tập, chọn bài cần nộp, bấm "Nộp bài làm", chụp ảnh hoặc chọn tệp bài làm rồi xác nhận nộp.',
  },
  {
    q: 'Tôi có thể nộp lại bài đã nộp không?',
    a: 'Có, bạn có thể nộp lại nhiều lần trước hạn nộp. Lần nộp mới nhất sẽ được thầy/cô chấm.',
  },
  {
    q: 'Vì sao tôi chưa thấy điểm bài kiểm tra?',
    a: 'Bài tập cần thời gian để thầy/cô chấm. Bạn sẽ nhận được thông báo ngay khi có kết quả.',
  },
];

export default function HelpScreen() {
  const [feedback, setFeedback] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function handleSend() {
    if (!feedback.trim()) {
      Alert.alert('Chưa có nội dung', 'Vui lòng nhập phản hồi trước khi gửi.');
      return;
    }
    Alert.alert('Cảm ơn bạn!', 'Phản hồi của bạn đã được gửi tới đội ngũ MindMath.', [
      { text: 'OK', onPress: () => setFeedback('') },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trợ giúp & phản hồi</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Câu hỏi thường gặp</Text>
        <Card padded={false}>
          {FAQ.map((item, idx) => {
            const open = openIndex === idx;
            return (
              <TouchableOpacity
                key={item.q}
                style={[styles.faqRow, idx !== FAQ.length - 1 && styles.faqRowBorder]}
                onPress={() => setOpenIndex(open ? null : idx)}
              >
                <View style={styles.faqHeaderRow}>
                  <Text style={styles.faqQuestion}>{item.q}</Text>
                  <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textMuted} />
                </View>
                {open && <Text style={styles.faqAnswer}>{item.a}</Text>}
              </TouchableOpacity>
            );
          })}
        </Card>

        <Text style={styles.sectionTitle}>Gửi phản hồi cho MindMath</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Mô tả vấn đề bạn gặp phải hoặc góp ý cho ứng dụng..."
          placeholderTextColor={colors.textMuted}
          multiline
          value={feedback}
          onChangeText={setFeedback}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Gửi phản hồi</Text>
        </TouchableOpacity>
      </ScrollView>
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
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxxl },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  faqRow: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md + 2, gap: spacing.sm },
  faqRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  faqHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  faqQuestion: { flex: 1, fontSize: fontSize.sm, fontWeight: '700', color: colors.textPrimary },
  faqAnswer: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20 },
  textArea: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    textAlignVertical: 'top',
    backgroundColor: colors.surface,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  sendButtonText: { color: colors.white, fontWeight: '700', fontSize: fontSize.md },
});
