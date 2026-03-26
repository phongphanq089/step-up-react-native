import React from 'react'

import ParallaxScrollView from '@/components/layout/parallax-scroll-view'

import { ThemedText } from '@/components/ui/themed-text'
import { Colors, Spacing } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'
import { Image } from 'expo-image'

export default function BlockUI() {
  const { theme } = useTheme()
  const c = Colors[theme]

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: Colors.light.headerBackground,
        dark: Colors.dark.headerBackground,
      }}
      headerImage={
        <Image
          source={require('@/assets/images/bg-component-ui.jpg')}
          style={{
            height: '100%',
            width: '100%',
            bottom: 0,
            left: 0,
            position: 'absolute',
          }}
          contentFit='cover'
        />
      }
    >
      <ThemedText
        style={{
          marginBottom: Spacing.xl,
          color: c.textSecondary,
          fontSize: 16,
        }}
      >
        Explore the atomic elements and complete components that makeup the Step
        Up application experience.
      </ThemedText>
    </ParallaxScrollView>
  )
}
