import { Colors } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'
import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  spacing?: number
  style?: ViewStyle
}

export function Divider({
  orientation = 'horizontal',
  spacing = 0,
  style,
}: DividerProps) {
  const { theme } = useTheme()
  const c = Colors[theme]

  if (orientation === 'vertical') {
    return (
      <View
        style={[
          styles.vertical,
          { backgroundColor: c.border, marginHorizontal: spacing },
          style,
        ]}
      />
    )
  }
  return (
    <View
      style={[
        styles.horizontal,
        { backgroundColor: c.border, marginVertical: spacing },
        style,
      ]}
    />
  )
}

const styles = StyleSheet.create({
  horizontal: { height: 1, width: '100%' },
  vertical: { width: 1, alignSelf: 'stretch' },
})
