import {
  Button,
  HStack,
  ScreenContainer,
  Section,
  ThemedText,
  VStack,
} from '@/components/ui'
import { Colors, Spacing } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'
import { StyleSheet } from 'react-native'

export default function ButtonUI() {
  const { theme } = useTheme() as { theme: 'light' | 'dark' }
  const c = Colors[theme]

  return (
    <ScreenContainer>
      {/* ─── Sizes ─────────────────────────────────────────────────────────── */}
      <Section title='Sizes' theme={theme} c={c}>
        <HStack spacing={10}>
          <Button label='Small' size='sm' style={{ flex: 1 }} />
          <Button label='Medium' size='md' style={{ flex: 1 }} />
          <Button label='Large' size='lg' style={{ flex: 1 }} />
        </HStack>
      </Section>

      {/* ─── Variants ──────────────────────────────────────────────────────── */}
      <Section title='Variants' theme={theme} c={c}>
        <VStack spacing={10}>
          <Button label='Primary' variant='primary' style={{ flex: 1 }} />
          <Button label='Secondary' variant='secondary' style={{ flex: 1 }} />
        </VStack>
        <VStack spacing={10}>
          <Button label='Outline' variant='outline' style={{ flex: 1 }} />
          <Button label='Ghost' variant='ghost' style={{ flex: 1 }} />
        </VStack>
        <VStack spacing={10}>
          <Button label='Gradient' variant='gradient' style={{ flex: 1 }} />
        </VStack>
      </Section>

      {/* ─── States ────────────────────────────────────────────────────────── */}
      <Section title='States (Loading & Disabled)' theme={theme} c={c}>
        <HStack spacing={10}>
          <Button label='Loading' loading style={{ flex: 1 }} />
          <Button label='Disabled' disabled style={{ flex: 1 }} />
        </HStack>

        <HStack spacing={10}>
          <Button
            label='Outline Loading'
            variant='outline'
            loading
            style={{ flex: 1 }}
          />
          <Button
            label='Ghost Disabled'
            variant='ghost'
            disabled
            style={{ flex: 1 }}
          />
        </HStack>
      </Section>

      {/* ─── Width ─────────────────────────────────────────────────────────── */}
      <Section title='Width (Full & Fit)' theme={theme} c={c}>
        <Button label='Full Width Button' fullWidth variant='primary' />
        <HStack spacing={10}>
          <Button label='Fit Content' variant='secondary' />
          <Button label='Fit Content' variant='outline' />
        </HStack>
      </Section>

      {/* ─── Icons ─────────────────────────────────────────────────────────── */}
      <Section title='Icons' theme={theme} c={c}>
        <VStack spacing={10}>
          <Button
            label='Left Icon'
            leftIcon='star'
            variant='primary'
            style={{ flex: 1 }}
          />
          <Button
            label='Right Icon'
            rightIcon='arrow-forward'
            variant='secondary'
            style={{ flex: 1 }}
          />
        </VStack>
        <ThemedText style={styles.subLabel}>Icon Only</ThemedText>
        <HStack spacing={10}>
          <Button leftIcon='add' variant='primary' />
          <Button leftIcon='edit' variant='secondary' />
          <Button leftIcon='delete' variant='outline' />
          <Button leftIcon='share' variant='ghost' />
          <Button leftIcon='favorite' variant='gradient' />
        </HStack>
      </Section>

      {/* ─── Custom Gradients ──────────────────────────────────────────────── */}
      <Section title='Custom Gradients' theme={theme} c={c}>
        <Button
          label='Sunset Gradient'
          variant='gradient'
          gradient={['#FF512F', '#DD2476']}
          fullWidth
        />
        <Button
          label='Ocean Breeze'
          variant='gradient'
          gradient={['#2193b0', '#6dd5ed']}
          fullWidth
        />
        <Button
          label='Deep Purple'
          variant='gradient'
          gradient={['#4e54c8', '#8f94fb']}
          fullWidth
        />
      </Section>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  subLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    opacity: 0.7,
  },
})
