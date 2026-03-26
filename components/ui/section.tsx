import { Fonts, Spacing } from '@/constants/theme'
import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { ThemedText } from './themed-text'

interface SectionProps {
  title?: string
  children: React.ReactNode
  theme: 'light' | 'dark'
  c: any
  useGradient?: boolean
  gradientColors?: any // Để linh hoạt hơn khi truyền từ theme
  style?: ViewStyle
}

export function Section({
  title,
  children,
  theme,
  c,
  useGradient = false,
  gradientColors,
  style,
}: SectionProps) {
  const sectionBorder = theme === 'dark' ? c.border : c.border
  const titleColor = theme === 'dark' ? c.text : c.text

  // Xác định mảng màu, đảm bảo luôn có giá trị fallback
  const colors = gradientColors ||
    c.gradients?.surface || [
      c.background,
      c.backgroundSecondary || c.background,
    ]

  const combinedStyle = StyleSheet.flatten([
    styles.section,
    { borderColor: sectionBorder },
    style,
  ])

  const Content = (
    <>
      {title ? (
        <ThemedText style={[styles.sectionTitle, { color: titleColor }]}>
          {title}
        </ThemedText>
      ) : (
        ''
      )}
      <View style={styles.sectionContent}>{children}</View>
    </>
  )

  if (useGradient) {
    return (
      <LinearGradient
        colors={colors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={combinedStyle}
      >
        {Content}
      </LinearGradient>
    )
  }

  return (
    <View
      style={[
        combinedStyle,
        { backgroundColor: c.backgroundSecondary || c.background },
      ]}
    >
      {Content}
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: Fonts.Playfair.bold,
    fontSize: 20,
    marginBottom: Spacing.md,
  },
  sectionContent: {
    gap: Spacing.md,
  },
})
