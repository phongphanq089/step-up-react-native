import React from 'react'
import {
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
  type ViewProps,
} from 'react-native'

import { Spacing } from '@/constants/theme'
import { useThemeColor } from '@/hooks/use-theme-color'

export type ScreenContainerProps = (ViewProps & ScrollViewProps) & {
  scrollable?: boolean
  withPadding?: boolean
  withGap?: boolean
  backgroundColor?: string
}

export function ScreenContainer({
  children,
  style,
  scrollable = true,
  withPadding = true,
  withGap = true,
  backgroundColor,
  contentContainerStyle,
  ...props
}: ScreenContainerProps) {
  const themeBg = useThemeColor({}, 'background')
  const finalBg = backgroundColor ?? themeBg

  const containerStyle = [styles.container, { backgroundColor: finalBg }, style]

  const combinedContentStyle = [
    withPadding && styles.padding,
    withGap && styles.gap,
    contentContainerStyle,
  ]

  if (scrollable) {
    return (
      <ScrollView
        style={containerStyle}
        contentContainerStyle={combinedContentStyle}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
        {...props}
      >
        {children}
      </ScrollView>
    )
  }

  return (
    <View style={[containerStyle, combinedContentStyle]} {...props}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  padding: {
    padding: Spacing.md,
  },
  gap: {
    gap: Spacing.md,
  },
})
