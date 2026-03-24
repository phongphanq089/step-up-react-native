import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { useTheme } from '@/context/theme-context'
import { Colors, Radius, Semantic, Spacing, Typography } from '@/constants/theme'

type ProgressVariant = 'default' | 'success' | 'warning' | 'error'
type ProgressSize = 'xs' | 'sm' | 'md' | 'lg'

interface ProgressBarProps {
  value: number // 0-100
  variant?: ProgressVariant
  size?: ProgressSize
  label?: string
  showValue?: boolean
  animated?: boolean
  indeterminate?: boolean
}

export function ProgressBar({
  value,
  variant = 'default',
  size = 'md',
  label,
  showValue = false,
  animated = true,
  indeterminate = false,
}: ProgressBarProps) {
  const { theme } = useTheme()
  const c = Colors[theme]
  const progress = useRef(new Animated.Value(indeterminate ? 0 : value)).current
  const shimmer = useRef(new Animated.Value(0)).current

  const colorMap: Record<ProgressVariant, string> = {
    default: c.tint,
    success: Semantic.success,
    warning: Semantic.warning,
    error: Semantic.error,
  }

  const heightMap: Record<ProgressSize, number> = {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
  }

  useEffect(() => {
    if (indeterminate) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmer, { toValue: 1, duration: 1200, useNativeDriver: false }),
          Animated.timing(shimmer, { toValue: 0, duration: 0, useNativeDriver: false }),
        ])
      ).start()
    } else if (animated) {
      Animated.timing(progress, {
        toValue: value,
        duration: 500,
        useNativeDriver: false,
      }).start()
    } else {
      progress.setValue(value)
    }
  }, [value, indeterminate])

  const barColor = colorMap[variant]
  const barHeight = heightMap[size]

  return (
    <View style={styles.wrapper}>
      {(label || showValue) && (
        <View style={styles.labelRow}>
          {label && <Text style={[styles.label, { color: c.text }]}>{label}</Text>}
          {showValue && !indeterminate && (
            <Text style={[styles.valueText, { color: c.textSecondary }]}>{Math.round(value)}%</Text>
          )}
        </View>
      )}
      <View style={[styles.track, { backgroundColor: c.backgroundTertiary, height: barHeight, borderRadius: barHeight / 2 }]}>
        {indeterminate ? (
          <Animated.View
            style={[
              styles.fill,
              {
                height: barHeight,
                borderRadius: barHeight / 2,
                backgroundColor: barColor,
                width: shimmer.interpolate({ inputRange: [0, 1], outputRange: ['0%', '60%'] }),
                left: shimmer.interpolate({ inputRange: [0, 1], outputRange: ['-30%', '100%'] }),
                position: 'absolute',
              },
            ]}
          />
        ) : (
          <Animated.View
            style={[
              styles.fill,
              {
                height: barHeight,
                borderRadius: barHeight / 2,
                backgroundColor: barColor,
                width: progress.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
              },
            ]}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { width: '100%' },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  label: { fontSize: Typography.size.sm, fontWeight: '500' },
  valueText: { fontSize: Typography.size.sm },
  track: { width: '100%', overflow: 'hidden' },
  fill: {},
})
