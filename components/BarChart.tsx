import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '@/theme';

export type BarDatum = {
  label: string;
  value: number;
  highlighted?: boolean;
  valueLabel?: string;
};

type BarChartProps = {
  data: BarDatum[];
  maxValue?: number;
  height?: number;
  target?: number;
  showValueOnHighlighted?: boolean;
};

export function BarChart({
  data,
  maxValue,
  height = 140,
  target,
  showValueOnHighlighted = false,
}: BarChartProps) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);
  const targetRatio = target != null ? Math.min(1, target / max) : null;

  return (
    <View style={[styles.wrapper, { height: height + 28 }]}>
      {targetRatio != null && (
        <View
          pointerEvents="none"
          style={[styles.targetLine, { bottom: 28 + targetRatio * height }]}
        />
      )}
      <View style={[styles.row, { height }]}>
        {data.map((d, idx) => {
          const barHeight = max > 0 ? Math.max(4, (d.value / max) * height) : 4;
          const shouldShowLabel = showValueOnHighlighted ? d.highlighted : true;
          return (
            <View key={idx} style={styles.barColumn}>
              {shouldShowLabel && d.value > 0 && (
                <Text
                  style={[
                    styles.valueLabel,
                    { color: d.highlighted ? colors.primary : colors.textSecondary },
                  ]}
                >
                  {d.valueLabel ?? d.value}
                </Text>
              )}
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: d.highlighted ? colors.primary : colors.primaryLight,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.labelRow}>
        {data.map((d, idx) => (
          <Text
            key={idx}
            style={[
              styles.axisLabel,
              d.highlighted && { color: colors.textPrimary, fontWeight: '700' },
            ]}
          >
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  targetLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.textMuted,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: '58%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    borderRadius: radius.sm,
  },
  valueLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    marginBottom: spacing.xs / 2,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  axisLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
});
