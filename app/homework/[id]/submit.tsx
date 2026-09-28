import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
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
import { Card } from '@/components/Card';
import { useCountdown } from '@/hooks/useCountdown';
import { useAssignments } from '@/store/AssignmentsContext';
import { colors, fontSize, radius, spacing } from '@/theme';

type PickedFile = { id: string; name: string; sizeLabel: string; uri: string };

export default function SubmitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getById, submitAssignment } = useAssignments();
  const item = getById(id);
  const countdown = useCountdown(item?.dueAt ?? new Date().toISOString());
  const [files, setFiles] = useState<PickedFile[]>([]);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!item) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>Không tìm thấy bài tập.</Text>
      </SafeAreaView>
    );
  }

  function formatSize(bytes?: number) {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  }

  async function handleTakePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Cần quyền truy cập camera', 'Vui lòng cho phép MindMath dùng camera để chụp bài làm.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      setFiles((prev) => [
        ...prev,
        {
          id: `${Date.now()}`,
          name: asset.fileName ?? `bai-lam-trang-${prev.length + 1}.jpg`,
          sizeLabel: formatSize(asset.fileSize),
          uri: asset.uri,
        },
      ]);
    }
  }

  async function handlePickFile() {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/*', 'application/pdf'],
      multiple: true,
    });
    if (!result.canceled) {
      setFiles((prev) => [
        ...prev,
        ...result.assets.map((asset) => ({
          id: `${Date.now()}-${asset.name}`,
          name: asset.name,
          sizeLabel: formatSize(asset.size ?? undefined),
          uri: asset.uri,
        })),
      ]);
    }
  }

  function removeFile(fileId: string) {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  }

  async function handleSubmit() {
    if (!item) return;
    if (files.length === 0) {
      Alert.alert('Chưa có tệp bài làm', 'Vui lòng chụp ảnh hoặc chọn tệp trước khi nộp bài.');
      return;
    }
    const assignmentId = item.id;
    setSubmitting(true);
    const { error } = await submitAssignment(assignmentId, { files, note });
    setSubmitting(false);
    if (error) {
      Alert.alert('Không nộp được bài', error);
      return;
    }
    router.replace(`/homework/${assignmentId}/result`);
  }

  const totalSizeLabel = files.length > 0 ? `${files.length} tệp` : '0 tệp';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Để bài</Text>
          <View style={styles.countdownPill}>
            <Ionicons name="time-outline" size={12} color={colors.primary} />
            <Text style={styles.countdownPillText}>
              {countdown.expired ? 'Hết hạn' : `Còn ${countdown.hours} giờ`}
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Nộp bài làm</Text>
          <Text style={styles.subtitle}>
            {item.subject} · {item.title} · {item.questionsCount} câu
          </Text>

          <Card style={styles.dropZone}>
            <View style={styles.uploadIcon}>
              <Ionicons name="cloud-upload-outline" size={24} color={colors.primary} />
            </View>
            <Text style={styles.dropTitle}>Chụp ảnh hoặc chọn tệp bài làm</Text>
            <Text style={styles.dropSubtitle}>JPG, PNG hoặc PDF · tối đa 10 MB mỗi tệp</Text>
            <View style={styles.dropButtonsRow}>
              <TouchableOpacity style={styles.cameraButton} onPress={handleTakePhoto}>
                <Ionicons name="camera-outline" size={16} color={colors.white} />
                <Text style={styles.cameraButtonText}>Chụp ảnh</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.fileButton} onPress={handlePickFile}>
                <Ionicons name="document-outline" size={16} color={colors.textPrimary} />
                <Text style={styles.fileButtonText}>Chọn tệp</Text>
              </TouchableOpacity>
            </View>
          </Card>

          <View style={styles.filesHeaderRow}>
            <Text style={styles.filesHeaderTitle}>Tệp đã chọn</Text>
            <Text style={styles.filesHeaderMeta}>{totalSizeLabel}</Text>
          </View>

          {files.length === 0 ? (
            <Text style={styles.noFilesText}>Chưa có tệp nào được chọn.</Text>
          ) : (
            <View style={{ gap: spacing.md }}>
              {files.map((file, idx) => (
                <Card key={file.id} style={styles.fileRow}>
                  <View style={styles.filePageBadge}>
                    <Text style={styles.filePageText}>Trang {idx + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {file.name}
                    </Text>
                    <Text style={styles.fileStatus}>
                      Đã tải lên{file.sizeLabel ? ` · ${file.sizeLabel}` : ''}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => removeFile(file.id)}>
                    <Ionicons name="close" size={18} color={colors.textMuted} />
                  </TouchableOpacity>
                </Card>
              ))}
            </View>
          )}

          <Text style={styles.noteLabel}>Ghi chú cho thầy cô</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Ví dụ: em chưa làm được câu 7, mong thầy chữa kỹ phần này."
            placeholderTextColor={colors.textMuted}
            multiline
            value={note}
            onChangeText={setNote}
          />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, submitting && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Ionicons name="checkmark" size={18} color={colors.white} />
            <Text style={styles.submitButtonText}>
              {submitting ? 'Đang nộp bài...' : 'Xác nhận nộp bài'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.footerHint}>
            Nộp trước {item.dueLabel.replace('Hạn ', '')} để được tính đúng hạn
          </Text>
        </View>
      </KeyboardAvoidingView>
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
  countdownPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.dangerSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  countdownPillText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.primary },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxxl },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: -spacing.sm },
  dropZone: { alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.xxl },
  uploadIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  dropTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  dropSubtitle: { fontSize: fontSize.xs, color: colors.textMuted },
  dropButtonsRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  cameraButton: {
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
  },
  cameraButtonText: { color: colors.white, fontWeight: '700', fontSize: fontSize.sm },
  fileButton: {
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
  },
  fileButtonText: { color: colors.textPrimary, fontWeight: '700', fontSize: fontSize.sm },
  filesHeaderRow: { flexDirection: 'row', justifyContent: 'space-between' },
  filesHeaderTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  filesHeaderMeta: { fontSize: fontSize.sm, color: colors.textSecondary },
  noFilesText: { fontSize: fontSize.sm, color: colors.textMuted },
  fileRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  filePageBadge: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filePageText: { fontSize: 10, fontWeight: '700', color: colors.primary },
  fileName: { fontSize: fontSize.sm, fontWeight: '700', color: colors.textPrimary },
  fileStatus: { fontSize: fontSize.xs, color: colors.success, marginTop: 2 },
  noteLabel: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  noteInput: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    textAlignVertical: 'top',
    backgroundColor: colors.surface,
  },
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
