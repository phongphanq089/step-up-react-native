import { ScreenContainer } from '@/components/layout/screen-container'
import { Badge, Chip, ChipGroup, Section } from '@/components/ui'
import { HStack, VStack } from '@/components/ui/stack'
import { Colors } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'
import { useState } from 'react'

export default function BadgeChipShowcase() {
  const { theme } = useTheme()
  const c = Colors[theme]

  const [selectedChips, setSelectedChips] = useState<string[]>(['React'])
  const categories = [
    'React',
    'React Native',
    'Expo',
    'TypeScript',
    'Tailwind',
    'Tamagui',
  ]

  const toggleChip = (chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip],
    )
  }

  return (
    <ScreenContainer>
      <VStack spacing={20}>
        <Section theme={theme} c={c} title='Badges'>
          <VStack spacing={12}>
            <HStack spacing={8} align='center'>
              <Badge label='Default' variant='default' />
              <Badge label='Primary' variant='primary' />
              <Badge label='Success' variant='success' />
              <Badge label='Info' variant='info' />
            </HStack>
            <HStack spacing={8} align='center'>
              <Badge label='Warning' variant='warning' />
              <Badge label='Error' variant='error' />
            </HStack>
          </VStack>
        </Section>

        <Section theme={theme} c={c} title='Badge Sizes'>
          <HStack spacing={10} align='center'>
            <Badge label='Small Badge' size='sm' variant='primary' />
            <Badge label='Medium Badge' size='md' variant='primary' />
          </HStack>
        </Section>

        <Section theme={theme} c={c} title='Chips'>
          <VStack spacing={12}>
            <HStack spacing={8} align='center'>
              <Chip label='Soft Chip' variant='soft' />
              <Chip label='Filled Chip' variant='filled' />
              <Chip label='Outline Chip' variant='outline' />
            </HStack>
            <HStack spacing={8} align='center'>
              <Chip label='With Icon' icon='star' variant='soft' />
              <Chip label='Selected' selected variant='soft' />
              <Chip label='Removable' onRemove={() => {}} variant='soft' />
            </HStack>
          </VStack>
        </Section>

        <Section theme={theme} c={c} title='Chip Group (Interactive)'>
          <ChipGroup
            chips={categories}
            selected={selectedChips}
            onToggle={toggleChip}
          />
        </Section>

        <Section theme={theme} c={c} title='Scrollable Chip Group'>
          <ChipGroup
            chips={categories}
            selected={selectedChips}
            onToggle={toggleChip}
            scrollable
          />
        </Section>
      </VStack>
    </ScreenContainer>
  )
}
