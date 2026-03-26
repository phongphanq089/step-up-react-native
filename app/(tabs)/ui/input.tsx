import { ScreenContainer } from '@/components/layout/screen-container'
import { Section } from '@/components/ui'
import { Input } from '@/components/ui/input'
import { VStack } from '@/components/ui/stack'
import { Colors } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'
import { useState } from 'react'

export default function InputShowcase() {
  const { theme } = useTheme()
  const c = Colors[theme]
  const [value, setValue] = useState('')

  return (
    <ScreenContainer>
      <VStack spacing={20}>
        <Section theme={theme} c={c} title='Text Input'>
          <Input
            label='Default Input'
            placeholder='Type something...'
            value={value}
            onChangeText={setValue}
          />
        </Section>

        <Section theme={theme} c={c} title='Input with Icons'>
          <Input label='Search' placeholder='Search...' leftIcon='search' />
          <Input
            label='Password'
            placeholder='Enter password'
            secureTextEntry
          />
        </Section>

        <Section theme={theme} c={c} title='Input States'>
          <Input label='Required Input' placeholder='Must fill this' required />
          <Input
            label='Error State'
            placeholder='Invalid input'
            error='This field is required'
          />
          <Input
            label='Disabled Input'
            placeholder='Cannot type here'
            editable={false}
          />
        </Section>
      </VStack>
    </ScreenContainer>
  )
}
