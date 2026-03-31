import { ScreenContainer } from '@/components/layout/screen-container'
import { ThemedView } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Section } from '@/components/ui/section'
import { ThemedText } from '@/components/ui/themed-text'
import { Colors, Spacing } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'

export default function ProgressBarScreen() {
  const { theme } = useTheme() as { theme: 'light' | 'dark' }
  const c = Colors[theme]
  const [progress, setProgress] = useState(65)

  return (
    <ScreenContainer scrollable withPadding withGap>
      <ThemedView style={styles.header}>
        <ThemedText type='title'>Progress Bar</ThemedText>
        <ThemedText style={{ color: c.textSecondary }}>
          A premium, highly customizable progress indicator component.
        </ThemedText>
      </ThemedView>

      <Section title='Interactive Playground' theme={theme} c={c}>
        <ProgressBar
          value={progress}
          variant='primary'
          size='lg'
          showValue
          label='Adjustable Progress'
          labelPosition='top'
          gradient
          glow
          animatedStripe
        />
        <ThemedView style={styles.controls}>
          <Button
            onPress={() => setProgress((prev) => Math.max(0, prev - 10))}
            variant='outline'
            leftIcon='remove'
          />
          <Button
            onPress={() => setProgress((prev) => Math.min(100, prev + 10))}
            variant='primary'
            leftIcon='add'
          />
        </ThemedView>
      </Section>

      <Section title='Sizes' theme={theme} c={c}>
        <ProgressBar value={45} size='xs' label='Extra Small (xs)' />
        <ProgressBar value={60} size='sm' label='Small (sm)' />
        <ProgressBar value={75} size='md' label='Medium (md)' />
        <ProgressBar value={90} size='lg' label='Large (lg)' />
        <ProgressBar value={100} size='xl' label='Extra Large (xl)' />
      </Section>

      <Section title='Variants & Gradients' theme={theme} c={c}>
        <ProgressBar
          value={80}
          variant='primary'
          gradient
          label='Primary Gradient'
        />
        <ProgressBar
          value={70}
          variant='secondary'
          gradient
          label='Secondary Gradient'
        />
        <ProgressBar
          value={95}
          variant='success'
          gradient
          label='Success Gradient'
        />
        <ProgressBar
          value={40}
          variant='warning'
          gradient
          label='Warning Gradient'
        />
        <ProgressBar
          value={25}
          variant='error'
          gradient
          label='Error Gradient'
        />
        <ProgressBar value={55} variant='info' gradient label='Info Gradient' />
      </Section>

      <Section title='Premium Aesthetics' theme={theme} c={c}>
        <ProgressBar
          value={85}
          variant='primary'
          gradient
          glow
          label='With Outer Glow'
        />
        <ProgressBar
          value={65}
          variant='success'
          gradient
          striped
          label='Striped Pattern'
        />
        <ProgressBar
          value={50}
          variant='warning'
          gradient
          animatedStripe
          label='Animated Stripes'
        />
      </Section>

      <Section title='Discrete Steps' theme={theme} c={c}>
        <ProgressBar value={40} steps={5} label='5 Discrete Steps' showValue />
        <ProgressBar
          value={75}
          steps={4}
          variant='success'
          label='4 Journey Steps'
          showValue
        />
      </Section>

      <Section title='Label Positions' theme={theme} c={c}>
        <ProgressBar
          value={65}
          label='Top Label (Default)'
          labelPosition='top'
          showValue
        />
        <ProgressBar
          value={45}
          label='Bottom Label'
          labelPosition='bottom'
          showValue
        />
        <ProgressBar
          value={85}
          size='xl'
          label='Inside Label'
          labelPosition='inside'
          showValue
        />
      </Section>

      <Section title='States' theme={theme} c={c}>
        <ProgressBar value={0} indeterminate label='Indeterminate (Loading)' />
      </Section>

      <ThemedView style={{ height: Spacing.xl }} />
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.sm,
  },
  controls: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    justifyContent: 'space-between',
    width: '100%',
  },
})
