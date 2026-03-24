import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import {
  BarChart as RNBarChart,
  LineChart as RNLineChart,
  PieChart as RNPieChart,
} from 'react-native-gifted-charts'
import { Colors, Radius, Spacing, Typography, Brand, Semantic } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChartData {
  value: number
  label?: string
  frontColor?: string
  sideColor?: string
  topColor?: string
  labelTextStyle?: object
}

interface BaseChartProps {
  data: any[]
  height?: number
  title?: string
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────

export function BarChart({ data, height = 200, title }: BaseChartProps) {
  const { theme } = useTheme()
  const c = Colors[theme]
  const isDark = theme === 'dark'

  return (
    <View style={[styles.container, { backgroundColor: c.surface, borderColor: c.border }]}>
      {title && <Text style={[styles.title, { color: c.text }]}>{title}</Text>}
      <RNBarChart
        data={data}
        height={height}
        width={SCREEN_WIDTH - 80}
        barWidth={22}
        barBorderRadius={4}
        noOfSections={4}
        frontColor={Brand.primary}
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisTextStyle={{ color: c.textSecondary, fontSize: 10 }}
        xAxisLabelTextStyle={{ color: c.textSecondary, fontSize: 10 }}
        hideRules
        isAnimated
        animationDuration={800}
      />
    </View>
  )
}

// ─── Line Chart ───────────────────────────────────────────────────────────────

export function LineChart({ data, height = 200, title }: BaseChartProps) {
  const { theme } = useTheme()
  const c = Colors[theme]

  return (
    <View style={[styles.container, { backgroundColor: c.surface, borderColor: c.border }]}>
      {title && <Text style={[styles.title, { color: c.text }]}>{title}</Text>}
      <RNLineChart
        data={data}
        height={height}
        width={SCREEN_WIDTH - 80}
        color={Brand.primary}
        thickness={3}
        dataPointsColor={Brand.primary}
        curved
        noOfSections={4}
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisTextStyle={{ color: c.textSecondary, fontSize: 10 }}
        xAxisLabelTextStyle={{ color: c.textSecondary, fontSize: 10 }}
        hideRules
        isAnimated
        animateOnDataChange
        animationDuration={1000}
        areaChart
        startFillColor={Brand.primary}
        startOpacity={0.2}
        endOpacity={0.01}
      />
    </View>
  )
}

// ─── Pie Chart ────────────────────────────────────────────────────────────────

export function PieChart({ data, title }: BaseChartProps) {
  const { theme } = useTheme()
  const c = Colors[theme]

  return (
    <View style={[styles.container, { backgroundColor: c.surface, borderColor: c.border, alignItems: 'center' }]}>
      {title && <Text style={[styles.title, { color: c.text, alignSelf: 'flex-start' }]}>{title}</Text>}
      <RNPieChart
        data={data}
        donut
        showGradient
        sectionAutoFocus
        radius={70}
        innerRadius={50}
        innerCircleColor={c.surface}
        centerLabelComponent={() => {
          return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, color: c.text, fontWeight: 'bold' }}>70%</Text>
              <Text style={{ fontSize: 10, color: c.textSecondary }}>Done</Text>
            </View>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginVertical: Spacing.xs,
  },
  title: {
    fontSize: Typography.size.sm,
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
})
