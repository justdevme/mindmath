import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme';

export function ProgressBar({
  percent,
  color = colors.primary,
  height = 8,
}: {
  percent: number;
  color?: string;
  height?: number;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View
        style={[
          styles.fill,
          { width: `${clamped}%`, backgroundColor: color, borderRadius: height / 2 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: colors.barTrack,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
