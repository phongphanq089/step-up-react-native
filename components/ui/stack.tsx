import React from 'react'
import { FlexStyle, StyleProp, ViewStyle } from 'react-native' // Thêm StyleProp
import { ThemedView, ThemedViewProps } from './themed-view'

export interface StackProps extends ThemedViewProps {
  children: React.ReactNode
  spacing?: number
  align?: FlexStyle['alignItems']
  justify?: FlexStyle['justifyContent']
  flex?: number
  p?: number
  px?: number
  py?: number
  radius?: number
  fullWidth?: boolean
  style?: StyleProp<ViewStyle>
}

interface InternalStackProps extends StackProps {
  direction: 'row' | 'column'
}

export const Stack = ({
  children,
  direction,
  spacing = 0,
  align = 'stretch',
  justify = 'flex-start',
  flex,
  p,
  px,
  py,
  radius,
  fullWidth,
  style,
  ...rest
}: InternalStackProps) => {
  const baseStyle: ViewStyle = {
    flexDirection: direction,
    gap: spacing,
    alignItems: align,
    justifyContent: justify,
    flex: flex,
    padding: p,
    paddingHorizontal: px,
    paddingVertical: py,
    borderRadius: radius,
    width: fullWidth ? '100%' : undefined,
    backgroundColor: 'transparent',
  }

  return (
    <ThemedView style={[baseStyle, style]} {...rest}>
      {children}
    </ThemedView>
  )
}

export const VStack = (props: StackProps) => (
  <Stack {...props} direction='column' />
)
export const HStack = (props: StackProps) => (
  <Stack {...props} direction='row' />
)
