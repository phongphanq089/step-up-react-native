import { ScreenContainer } from '@/components/layout/screen-container'
import {
  HStack,
  Section,
  ThemedText,
  ThemedView,
  VStack,
} from '@/components/ui'
import { Colors, Spacing, Typography } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { StyleSheet } from 'react-native'

function ColorToken({
  color,
  label,
  textColor,
}: {
  color: string
  label: string
  textColor: string
}) {
  return (
    <HStack
      style={{
        alignItems: 'center',
        width: '48%',
        marginBottom: Spacing.md,
        backgroundColor: 'transparent',
      }}
    >
      <ThemedView
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: color,
          borderWidth: 1,
          borderColor: 'rgba(150,150,150,0.1)',
          marginRight: 10,
        }}
      />
      <VStack>
        <ThemedText
          style={{ fontSize: 13, fontWeight: '700', color: textColor }}
          numberOfLines={1}
        >
          {label}
        </ThemedText>
        <ThemedText style={{ fontSize: 11, color: textColor, opacity: 0.6 }}>
          {color.toUpperCase()}
        </ThemedText>
      </VStack>
    </HStack>
  )
}

const ThemeBase = () => {
  const { theme } = useTheme() as { theme: 'light' | 'dark' }
  const c = Colors[theme]
  return (
    <ScreenContainer>
      <Section title='Theme color' theme={theme} c={c}>
        <HStack spacing={10} wrap={true}>
          <ColorToken
            color={c.colorPrimary}
            label='Primary'
            textColor={c.text}
          />
          <ColorToken
            color={c.colorSecondary}
            label='Secondary'
            textColor={c.text}
          />
          <ColorToken
            color={c.background}
            label='Background'
            textColor={c.text}
          />
          <ColorToken color={c.surface} label='Surface' textColor={c.text} />
          <ColorToken color={c.text} label='Text Main' textColor={c.text} />
          <ColorToken
            color={c.textSecondary}
            label='Text Secondary'
            textColor={c.text}
          />
          <ColorToken color={c.border} label='Border' textColor={c.text} />
          <ColorToken color={c.tint} label='Tint' textColor={c.text} />
          <ColorToken color={c.success} label='Success' textColor={c.text} />
          <ColorToken color={c.warning} label='Warning' textColor={c.text} />
          <ColorToken color={c.error} label='Error' textColor={c.text} />
          <ColorToken color={c.info} label='Info' textColor={c.text} />
        </HStack>
      </Section>

      <Section title='Gradient color' theme={theme} c={c}>
        <VStack spacing={16}>
          {Object.entries(c.gradients).map(([key, colors]) => (
            <VStack key={key}>
              <ThemedText
                style={{
                  fontSize: 13,
                  fontWeight: '700',
                  marginBottom: 8,
                  textTransform: 'capitalize',
                  opacity: 0.7,
                }}
              >
                {key}
              </ThemedText>
              <LinearGradient
                colors={colors as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  height: 48,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: c.border,
                }}
              />
            </VStack>
          ))}
        </VStack>
      </Section>

      <Section title='Typography' theme={theme} c={c}>
        {(['4xl', '3xl', '2xl', 'xl', 'lg', 'md', 'sm', 'xs'] as const).map(
          (size) => (
            <HStack
              key={size}
              spacing={10}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: Spacing.sm,
                borderBottomWidth: size !== 'xs' ? StyleSheet.hairlineWidth : 0,
                borderBottomColor: c.border,
              }}
            >
              <ThemedText
                style={{
                  fontSize: 13,
                  color: c.textSecondary,
                  fontWeight: 'bold',
                }}
              >
                {size}
              </ThemedText>
              <ThemedText
                size={Typography.size[size]}
                numberOfLines={1}
                style={{ flex: 1 }}
              >
                Typogaphy
              </ThemedText>
            </HStack>
          ),
        )}
      </Section>
    </ScreenContainer>
  )
}

export default ThemeBase
