import React, { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useTheme } from '@/context/theme-context'
import { Colors, Radius, Semantic, Spacing, Typography } from '@/constants/theme'
import { ThemedText } from './themed-text'

type ProgressVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
type ProgressSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type LabelPosition = 'top' | 'bottom' | 'inside' | 'floating'

interface ProgressBarProps {
  value: number // 0-100
  variant?: ProgressVariant
  size?: ProgressSize
  label?: string
  showValue?: boolean
  labelPosition?: LabelPosition
  animated?: boolean
  indeterminate?: boolean
  gradient?: boolean
  glow?: boolean
  striped?: boolean
  animatedStripe?: boolean
  steps?: number // Number of discrete segments
  height?: number // Custom height override
}

export function ProgressBar({
  value,
  variant = 'primary',
  size = 'md',
  label,
  showValue = false,
  labelPosition = 'top',
  animated = true,
  indeterminate = false,
  gradient = false,
  glow = false,
  striped = false,
  animatedStripe = false,
  steps,
  height: customHeight,
}: ProgressBarProps) {
  const { theme } = useTheme()
  const c = Colors[theme]
  
  const animatedValue = useRef(new Animated.Value(indeterminate ? 0 : value)).current
  const indeterminateAnim = useRef(new Animated.Value(0)).current
  const stripeAnim = useRef(new Animated.Value(0)).current

  const colorMap: Record<ProgressVariant, string> = {
    primary: c.tint,
    secondary: c.colorSecondary,
    success: Semantic.success,
    warning: Semantic.warning,
    error: Semantic.error,
    info: Semantic.info,
  }

  const gradientMap: Record<ProgressVariant, readonly [string, string, ...string[]]> = {
    primary: c.gradients.primary,
    secondary: c.gradients.secondary,
    success: [Semantic.success, '#10b981'],
    warning: [Semantic.warning, '#fbbf24'],
    error: [Semantic.error, '#f87171'],
    info: [Semantic.info, '#60a5fa'],
  }

  const heightMap: Record<ProgressSize, number> = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  }

  const barHeight = customHeight || heightMap[size]
  const activeColor = colorMap[variant]
  const activeGradient = gradientMap[variant]

  useEffect(() => {
    if (indeterminate) {
      indeterminateAnim.setValue(0)
      Animated.loop(
        Animated.timing(indeterminateAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: false,
        })
      ).start()
    } else {
      Animated.timing(animatedValue, {
        toValue: value,
        duration: animated ? 500 : 0,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start()
    }
  }, [value, indeterminate, animated])

  useEffect(() => {
    if (animatedStripe) {
      stripeAnim.setValue(0)
      Animated.loop(
        Animated.timing(stripeAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      ).start()
    } else {
      stripeAnim.stopAnimation()
    }
  }, [animatedStripe])

  const renderFills = () => {
    if (indeterminate) {
      return (
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: activeColor,
              width: indeterminateAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: ['0%', '50%', '0%'],
              }),
              left: indeterminateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['-20%', '120%'],
              }),
              position: 'absolute',
            },
          ]}
        >
          {gradient && (
            <LinearGradient
              colors={activeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          )}
        </Animated.View>
      )
    }

    return (
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: activeColor,
            width: animatedValue.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      >
        {gradient && (
          <LinearGradient
            colors={activeGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        )}
        {(striped || animatedStripe) && (
          <Animated.View
            style={[
              styles.stripeContainer,
              {
                transform: [{
                  translateX: stripeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 40],
                  })
                }]
              }
            ]}
          >
            {[...Array(60)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.stripe,
                  { backgroundColor: 'rgba(255,255,255,0.2)', width: barHeight, height: barHeight * 2 }
                ]}
              />
            ))}
          </Animated.View>
        )}
        {labelPosition === 'inside' && barHeight >= 16 && (
          <ThemedText style={styles.insideLabel} size={Typography.size.xs}>
            {Math.round(value)}%
          </ThemedText>
        )}
      </Animated.View>
    )
  }

  const renderSteps = () => {
    if (!steps) return null
    return (
      <View style={styles.stepsOverlay}>
        {[...Array(steps - 1)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.stepDivider,
              { 
                backgroundColor: c.background,
                left: `${((i + 1) / steps) * 100}%` 
              }
            ]}
          />
        ))}
      </View>
    )
  }

  return (
    <View style={styles.wrapper}>
      {labelPosition === 'top' && (label || showValue) && (
        <View style={styles.labelRow}>
          {label && <ThemedText type="defaultSemiBold" size={Typography.size.sm}>{label}</ThemedText>}
          {showValue && !indeterminate && (
            <ThemedText size={Typography.size.sm} style={{ color: c.textSecondary }}>{Math.round(value)}%</ThemedText>
          )}
        </View>
      )}

      <View 
        style={[
          styles.track, 
          { 
            backgroundColor: c.backgroundTertiary, 
            height: barHeight, 
            borderRadius: barHeight / 2 
          },
          glow && {
            shadowColor: activeColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 4,
          }
        ]}
      >
        {renderFills()}
        {renderSteps()}
      </View>

      {labelPosition === 'bottom' && (label || showValue) && (
        <View style={[styles.labelRow, { marginTop: Spacing.xs }]}>
          {label && <ThemedText size={Typography.size.xs}>{label}</ThemedText>}
          {showValue && !indeterminate && (
            <ThemedText size={Typography.size.xs} style={{ color: c.textSecondary }}>{Math.round(value)}%</ThemedText>
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', marginVertical: Spacing.sm },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
    paddingHorizontal: 2,
  },
  track: { 
    width: '100%', 
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    height: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  stripeContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: -20,
    left: -40,
    right: -40,
    bottom: -20,
  },
  stripe: {
    opacity: 0.8,
    transform: [{ rotate: '45deg' }],
    marginRight: 20,
  },
  insideLabel: {
    color: '#FFF',
    fontWeight: '700',
    textAlign: 'center',
    position: 'absolute',
    width: '100%',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  stepsOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  stepDivider: {
    position: 'absolute',
    width: 2,
    height: '100%',
    opacity: 0.3,
  },
})

