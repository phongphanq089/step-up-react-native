import { ScreenContainer } from '@/components/layout/screen-container'
import {
  Checkbox,
  Input,
  RadioGroup,
  Section,
  Switch,
  VStack,
} from '@/components/ui'
import { Colors } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

export default function InputShowcase() {
  const { theme } = useTheme()
  const c = Colors[theme]

  // States
  const [textValue, setTextValue] = useState('')
  const [switch1, setSwitch1] = useState(true)
  const [switch2, setSwitch2] = useState(false)
  const [check1, setCheck1] = useState(true)
  const [check2, setCheck2] = useState(false)
  const [radio, setRadio] = useState('option1')

  const radioOptions = [
    { label: 'Standard Delivery', value: 'option1' },
    { label: 'Express Shipping (+$5.00)', value: 'option2' },
    { label: 'In-store Pickup', value: 'option3', disabled: true },
  ]

  return (
    <ScreenContainer withPadding withGap>
      <VStack spacing={24}>
        {/* ── SECTION: TEXT INPUTS ────────────────────────────────────────── */}
        <Section theme={theme} c={c} title='Text Input' bgTransparent>
          <VStack spacing={16}>
            <Input
              label='Full Name'
              placeholder='Enter your name'
              value={textValue}
              onChangeText={setTextValue}
            />
            <Input
              label='Email Address'
              placeholder='example@mail.com'
              leftIcon='mail-outline'
              autoCapitalize='none'
              keyboardType='email-address'
            />
            <Input
              label='Password'
              placeholder='Enter password'
              leftIcon='lock-outline'
              secureTextEntry
              rightIcon='visibility-off'
            />
          </VStack>
        </Section>

        {/* ── SECTION: INPUT STATES ───────────────────────────────────────── */}
        <Section theme={theme} c={c} title='Input States' bgTransparent>
          <VStack spacing={16}>
            <Input
              label='Required Field'
              placeholder='Must fill this'
              required
            />
            <Input
              label='Error State'
              placeholder='Invalid entry'
              error='The format is incorrect'
              defaultValue='invalid_email'
            />
            <Input
              label='Disabled State'
              placeholder='Read-only information'
              editable={false}
              defaultValue='This field is locked'
            />
          </VStack>
        </Section>

        {/* ── SECTION: SELECTION CONTROLS ─────────────────────────────────── */}
        <Section theme={theme} c={c} title='Selection Controls' bgTransparent>
          <VStack spacing={20}>
            {/* SWITCHES */}
            <View>
              <VStack spacing={12}>
                <Switch
                  label='Push Notifications'
                  value={switch1}
                  onChange={setSwitch1}
                />
                <Switch
                  label='Dark Mode (Auto)'
                  value={switch2}
                  onChange={setSwitch2}
                />
                <Switch
                  label='Airplane Mode (Disabled)'
                  value={false}
                  onChange={() => {}}
                  disabled
                />
              </VStack>
            </View>

            <View style={[styles.divider, { backgroundColor: c.border }]} />

            {/* CHECKBOXES */}
            <View>
              <VStack spacing={12}>
                <Checkbox
                  label='I agree to the Terms & Conditions'
                  checked={check1}
                  onChange={setCheck1}
                />
                <Checkbox
                  label='Subscribe to weekly newsletter'
                  checked={check2}
                  onChange={setCheck2}
                />
                <Checkbox
                  label='Show advanced settings'
                  checked={true}
                  onChange={() => {}}
                  indeterminate
                />
                <Checkbox
                  label='Enterprise Features (Locked)'
                  checked={false}
                  onChange={() => {}}
                  disabled
                />
              </VStack>
            </View>

            <View style={[styles.divider, { backgroundColor: c.border }]} />

            {/* RADIO GROUP */}
            <View>
              <RadioGroup
                label='Shipping Method'
                options={radioOptions}
                value={radio}
                onChange={setRadio}
              />
            </View>
          </VStack>
        </Section>
      </VStack>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 4,
    opacity: 0.5,
  },
})
