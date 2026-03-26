import { ScreenContainer } from '@/components/layout/screen-container'
import {
  Badge,
  Button,
  Card,
  HStack,
  Section,
  ThemedText,
  ThemedView,
  VStack,
} from '@/components/ui'
import { Colors, Spacing } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'
import { MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet } from 'react-native'

export default function CardShowcase() {
  const { theme } = useTheme() as { theme: 'light' | 'dark' }
  const c = Colors[theme]
  return (
    <ScreenContainer>
      <VStack spacing={24}>
        {/* ── SECTION: VARIANTS ─────────────────────────────────────────── */}
        <Section title='Sizes' theme={theme} c={c} bgTransparent>
          <VStack spacing={16}>
            <Card variant='elevated' title='Elevated Card'>
              <ThemedText>
                This is the default elevated card style with a subtle shadow.
              </ThemedText>
            </Card>

            <Card variant='outlined' title='Outlined Card'>
              <ThemedText>
                An outlined variant for a flatter, more structured appearance.
              </ThemedText>
            </Card>

            <Card variant='flat' title='Flat Card'>
              <ThemedText>
                A completely flat card that blends with the surface background.
              </ThemedText>
            </Card>
          </VStack>
        </Section>

        {/* ── SECTION: SUB-COMPONENTS ───────────────────────────────────── */}
        <Section title='Sub-components' theme={theme} c={c} bgTransparent>
          <Card padding='none'>
            <Card.Image
              source={require('@/assets/images/bg-component-ui.jpg')}
            />
            <ThemedView style={{ padding: Spacing.md }}>
              <Card.Header>
                <HStack
                  style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                  }}
                >
                  <ThemedText type='defaultSemiBold' style={{ fontSize: 18 }}>
                    Modern Architecture
                  </ThemedText>
                  <Badge label='New' variant='success' />
                </HStack>
              </Card.Header>
              <Card.Content>
                <ThemedText style={{ color: c.textSecondary }}>
                  Detailed compositions using Header, Content, and Footer
                  sub-components provide maximum layout control.
                </ThemedText>
              </Card.Content>
              <Card.Footer>
                <Button label='View Details' variant='ghost' size='sm' />
                <Button label='Explore' variant='primary' size='sm' />
              </Card.Footer>
            </ThemedView>
          </Card>
        </Section>

        {/* ── SECTION: GRADIENTS ────────────────────────────────────────── */}
        <Section title='Gradients & Interactions' theme={theme} c={c}>
          <VStack spacing={16}>
            <Card
              gradientColors={c.gradients.primary}
              onPress={() => console.log('Gradient card pressed')}
            >
              <ThemedText
                style={{ color: c.text, fontSize: 18, fontWeight: '700' }}
              >
                Premium Plan
              </ThemedText>
              <ThemedText
                style={{ color: 'rgba(255,255,255,0.8)', marginTop: 4 }}
              >
                Gradients can be used as backgrounds for premium feature
                highlights.
              </ThemedText>
            </Card>

            <Card
              gradientColors={c.gradients.secondary}
              variant='elevated'
              padding='lg'
            >
              <HStack
                style={{ alignItems: 'center', backgroundColor: 'transparent' }}
                spacing={12}
              >
                <ThemedView style={styles.iconCircle}>
                  <MaterialIcons name='bolt' size={24} color='#fff' />
                </ThemedView>
                <VStack style={{ flex: 1 }}>
                  <ThemedText style={{ color: '#fff', fontWeight: '700' }}>
                    Performance Optimization
                  </ThemedText>
                  <ThemedText
                    style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                  >
                    Enabled for your account
                  </ThemedText>
                </VStack>
              </HStack>
            </Card>
          </VStack>
        </Section>

        {/* ── SECTION: SIZES ────────────────────────────────────────────── */}
        <Section title='Padding Sizes' theme={theme} c={c} bgTransparent>
          <HStack spacing={12} wrap>
            <Card
              padding='sm'
              variant='outlined'
              style={{ flex: 1, minWidth: '45%' }}
            >
              <ThemedText type='defaultSemiBold'>Small</ThemedText>
              <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>
                Compact layout
              </ThemedText>
            </Card>
            <Card
              padding='lg'
              variant='outlined'
              style={{ flex: 1, minWidth: '45%' }}
            >
              <ThemedText type='defaultSemiBold'>Large</ThemedText>
              <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>
                Spacious layout
              </ThemedText>
            </Card>
          </HStack>
        </Section>
      </VStack>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
