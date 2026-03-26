import React, { useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import ParallaxScrollView from '@/components/parallax-scroll-view'
import {
  ActionSheet,
  // Overlays
  AlertDialog,
  AppModal,
  // Feedback
  Badge,
  Card,
  // Data
  Carousel,
  Checkbox,
  Chip,
  Divider,
  FormSheet,
  // Form
  Input,
  ProgressBar,
  RadioGroup,
  ScrollableSheet,
  Select,
  SimpleSheet,
  SpeedDial,
  Switch,
  Tabs,
  ToastProvider,
  useToast,
  type AppBottomSheetRef,
  type CarouselItem,
} from '@/components/ui'
import { Button, ScreenContainer } from '@/components/ui'
import { ThemedText } from '@/components/ui/themed-text'
import { Brand, Colors, Fonts, Spacing, Typography } from '@/constants/theme'
import { useSidebar } from '@/context/sidebar-context'
import { useTheme } from '@/context/theme-context'
import { MaterialIcons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// ─── Carousel data ────────────────────────────────────────────────────────────
const CAROUSEL_DATA: CarouselItem[] = [
  {
    id: '1',
    title: 'Design System',
    subtitle: 'Tokens · Colors · Typography',
    color: '#5B4FCF',
  },
  {
    id: '2',
    title: 'UI Components',
    subtitle: 'Buttons · Inputs · Cards',
    color: '#1A7F5A',
  },
  {
    id: '3',
    title: 'Navigation',
    subtitle: 'Tabs · Sidebar · Modals',
    color: '#C0392B',
  },
]

// ─── Small helper for color showcase ──────────────────────────────────────────
function ColorBox({
  color,
  label,
  textColor,
}: {
  color: string
  label: string
  textColor: string
}) {
  return (
    <View style={{ alignItems: 'center', width: 76, marginBottom: Spacing.md }}>
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: color,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: 'rgba(150,150,150,0.3)',
          marginBottom: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      />
      <Text
        style={{
          fontSize: 11,
          color: textColor,
          fontWeight: '600',
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
    </View>
  )
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────
function UISection({
  title,
  children,
  theme,
  c,
}: {
  title: string
  children: React.ReactNode
  theme: 'light' | 'dark'
  c: any
}) {
  // Use a distinct background to make it look like a showcase section
  const sectionBg = theme === 'dark' ? '#1E293B' : '#F8FAFC' // Slight slate blue tint
  const sectionBorder = theme === 'dark' ? '#334155' : '#E2E8F0'
  const titleColor = theme === 'dark' ? '#F8FAFC' : '#0F172A'

  return (
    <View
      style={[
        styles.section,
        { backgroundColor: sectionBg, borderColor: sectionBorder },
      ]}
    >
      <ThemedText style={[styles.sectionTitle, { color: titleColor }]}>
        {title}
      </ThemedText>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  )
}

// ─── Inner component that uses useToast ───────────────────────────────────────
function ExploreContent() {
  const { theme } = useTheme()
  const { open: openSidebar } = useSidebar()
  const c = Colors[theme]
  const { show: showToast } = useToast()
  const insets = useSafeAreaInsets()

  // Form states
  const [selectVal, setSelectVal] = useState<string | number>('')
  const [switchVal, setSwitchVal] = useState(true)
  const [checkVal, setCheckVal] = useState(false)
  const [radioVal, setRadioVal] = useState('a')
  const [progress] = useState(0.65)

  // Tab states
  const [activeTabUnderline, setActiveTabUnderline] = useState('home')
  const [activeTabPill, setActiveTabPill] = useState('day')
  const [activeTabBox, setActiveTabBox] = useState('list')

  // Overlay visibility
  const [alertVisible, setAlertVisible] = useState(false)
  const [modalCenter, setModalCenter] = useState(false)
  const [modalBottom, setModalBottom] = useState(false)

  // Bottom sheet refs
  const simpleSheetRef = useRef<AppBottomSheetRef>(null)
  const scrollableSheetRef = useRef<AppBottomSheetRef>(null)
  const actionSheetRef = useRef<AppBottomSheetRef>(null)
  const formSheetRef = useRef<AppBottomSheetRef>(null)

  const tabItems = [
    { key: 'home', label: 'Overview' },
    { key: 'tasks', label: 'Tasks' },
    { key: 'report', label: 'Reports' },
  ]
  const periodTabs = [
    { key: 'day', label: 'Day' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
  ]
  const viewTabs = [
    { key: 'list', label: 'List View' },
    { key: 'grid', label: 'Grid View' },
  ]

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: Colors.light.headerBackground,
        dark: Colors.dark.headerBackground,
      }}
      headerImage={
        <Image
          source={require('@/assets/images/bg-component-ui.jpg')}
          style={styles.reactLogo}
          contentFit='cover'
        />
      }
    >
      <ScreenContainer
        scrollable={false}
        backgroundColor={c.background}
        style={{
          paddingTop: insets.top + Spacing.sm, // Spacing.sm (8) + ScreenContainer's Spacing.md (16) = 24 (close to original 32)
          paddingBottom: insets.bottom + Spacing.xl * 3,
        }}
      >
          {/* ── HEADER ───────────────────────────────────────────────────────── */}
          <View style={styles.header}>
            <ThemedText
              type='title'
              style={{ fontFamily: Fonts.Playfair.bold, fontSize: 32 }}
            >
              Step Up UI
            </ThemedText>
            <Badge label='Component Library' variant='primary' />
          </View>
          <ThemedText
            style={{
              marginBottom: Spacing.xl,
              color: c.textSecondary,
              fontSize: 16,
            }}
          >
            Explore the atomic elements and complete components that makeup the
            Step Up application experience.
          </ThemedText>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* THEME COLORS */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <UISection title='Theme Colors' theme={theme} c={c}>
            <View style={styles.rowAuto}>
              <ColorBox
                color={Brand.primary}
                label='Primary'
                textColor={c.textSecondary}
              />
              <ColorBox
                color={Brand.secondary}
                label='Secondary'
                textColor={c.textSecondary}
              />
              <ColorBox
                color={c.background}
                label='Background'
                textColor={c.textSecondary}
              />
              <ColorBox
                color={c.surface}
                label='Surface'
                textColor={c.textSecondary}
              />
              <ColorBox
                color={c.text}
                label='Text Main'
                textColor={c.textSecondary}
              />
              <ColorBox
                color={c.border}
                label='Border'
                textColor={c.textSecondary}
              />
              <ColorBox
                color={c.success}
                label='Success'
                textColor={c.textSecondary}
              />
              <ColorBox
                color={c.warning}
                label='Warning'
                textColor={c.textSecondary}
              />
              <ColorBox
                color={c.error}
                label='Error'
                textColor={c.textSecondary}
              />
              <ColorBox
                color={c.info}
                label='Info'
                textColor={c.textSecondary}
              />
            </View>
          </UISection>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* TYPOGRAPHY */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <UISection title='Typography' theme={theme} c={c}>
            {(['4xl', '3xl', '2xl', 'xl', 'lg', 'md', 'sm', 'xs'] as const).map(
              (size) => (
                <View
                  key={size}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: Spacing.sm,
                    borderBottomWidth:
                      size !== 'xs' ? StyleSheet.hairlineWidth : 0,
                    borderBottomColor: c.border,
                  }}
                >
                  <View style={{ width: 48 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        color: c.textSecondary,
                        fontWeight: 'bold',
                      }}
                    >
                      {size}
                    </Text>
                  </View>
                  <ThemedText
                    style={{ fontSize: Typography.size[size], flex: 1 }}
                    numberOfLines={1}
                  >
                    The quick brown fox
                  </ThemedText>
                </View>
              ),
            )}
          </UISection>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* BUTTONS */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <UISection title='Buttons' theme={theme} c={c}>
            <View style={styles.row}>
              <Button label='Primary' variant='primary' style={{ flex: 1 }} />
              <Button
                label='Secondary'
                variant='secondary'
                style={{ flex: 1 }}
              />
            </View>
            <View style={styles.row}>
              <Button label='Outline' variant='outline' style={{ flex: 1 }} />
              <Button label='Ghost' variant='ghost' style={{ flex: 1 }} />
            </View>
            <View style={styles.row}>
              <Button
                label='Error Action'
                variant='ghost'
                style={{ flex: 1 }}
              />
              <Button label='Disabled' disabled style={{ flex: 1 }} />
            </View>
            <View style={styles.row}>
              <Button
                label='With Icon'
                leftIcon='star'
                variant='primary'
                style={{ flex: 1 }}
              />
              <Button
                label='Small'
                size='sm'
                variant='secondary'
                style={{ flex: 1 }}
              />
              <Button
                label='Lg'
                size='lg'
                variant='outline'
                style={{ flex: 1 }}
              />
            </View>
          </UISection>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* TABS & SEGMENTED CONTROLS */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <UISection title='Tabs & Segments' theme={theme} c={c}>
            <ThemedText style={styles.subLabel}>
              Box Variant (Segmented)
            </ThemedText>
            <Tabs
              tabs={viewTabs}
              activeKey={activeTabBox}
              onChange={setActiveTabBox}
              variant='box'
            />
            <Divider style={{ marginVertical: Spacing.md }} />

            <ThemedText style={styles.subLabel}>Pill Variant</ThemedText>
            <Tabs
              tabs={periodTabs}
              activeKey={activeTabPill}
              onChange={setActiveTabPill}
              variant='pill'
            />
            <Divider style={{ marginVertical: Spacing.md }} />

            <ThemedText style={styles.subLabel}>Underline Variant</ThemedText>
            <Tabs
              tabs={tabItems}
              activeKey={activeTabUnderline}
              onChange={setActiveTabUnderline}
              variant='underline'
            />
          </UISection>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* BADGES & CHIPS */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <UISection title='Badges & Chips' theme={theme} c={c}>
            <View style={styles.rowAuto}>
              <Badge label='Success' variant='success' />
              <Badge label='Warning' variant='warning' />
              <Badge label='Error' variant='error' />
              <Badge label='Info' variant='info' />
              <Badge label='Primary' variant='primary' />
            </View>
            <View style={[styles.rowAuto, { marginTop: Spacing.sm }]}>
              <Chip label='Selected' icon='check' selected />
              <Chip label='Unselected' icon='radio-button-unchecked' />
              <Chip label='Disabled' icon='block' disabled />
            </View>
          </UISection>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* FORM CONTROLS */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <UISection title='Form Controls' theme={theme} c={c}>
            <Input
              label='Text Input'
              placeholder='Enter details...'
              leftIcon='edit'
            />
            <Input
              label='Password'
              placeholder='••••••••'
              secureTextEntry
              leftIcon='lock'
            />
            <Select
              label='Dropdown Select'
              options={[
                { label: 'Option 1', value: 1, icon: 'star' },
                { label: 'Option 2', value: 2, icon: 'favorite' },
                { label: 'Option 3', value: 3, icon: 'bolt' },
              ]}
              value={selectVal}
              onChange={setSelectVal}
            />

            <RadioGroup
              label='Radio Group'
              value={radioVal}
              onChange={setRadioVal}
              options={[
                { label: 'Choice A', value: 'a' },
                { label: 'Choice B', value: 'b' },
              ]}
            />
            <View style={[styles.row, { marginTop: Spacing.sm }]}>
              <View style={{ flex: 1 }}>
                <Checkbox
                  label='Accept terms'
                  checked={checkVal}
                  onChange={setCheckVal}
                />
              </View>
              <View style={{ flex: 1, alignItems: 'flex-start' }}>
                <Switch
                  label='Enable feature'
                  value={switchVal}
                  onChange={setSwitchVal}
                />
              </View>
            </View>
          </UISection>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* DATA DISPLAY */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <UISection title='Data Display' theme={theme} c={c}>
            <ThemedText type='defaultSemiBold' style={{ marginBottom: 8 }}>
              Progress Bar (65%)
            </ThemedText>
            <ProgressBar value={progress} />
            <Divider style={{ marginVertical: Spacing.md }} />

            <Card style={{ padding: Spacing.md }}>
              <ThemedText type='defaultSemiBold'>Content Card</ThemedText>
              <ThemedText
                style={{
                  fontSize: 14,
                  marginTop: 4,
                  lineHeight: 22,
                  color: c.textSecondary,
                }}
              >
                Cards are used to group related logical content together. They
                feature elevated surfaces and maintain consistent padding
                bounds.
              </ThemedText>
            </Card>
          </UISection>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* OVERLAYS & MODALS */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <UISection title='Overlays & Bottom Sheets' theme={theme} c={c}>
            <View style={styles.grid}>
              <Button
                label='Show Alert'
                variant='outline'
                onPress={() => setAlertVisible(true)}
              />
              <Button
                label='Center Modal'
                variant='outline'
                onPress={() => setModalCenter(true)}
              />
              <Button
                label='Bottom Modal'
                variant='outline'
                onPress={() => setModalBottom(true)}
              />
              <Button
                label='Toggle Sidebar'
                variant='outline'
                onPress={openSidebar}
              />
              <Button
                label='Simple Sheet'
                variant='secondary'
                onPress={() => simpleSheetRef.current?.open()}
              />
              <Button
                label='Scrollable Sheet'
                variant='secondary'
                onPress={() => scrollableSheetRef.current?.open()}
              />
              <Button
                label='Action Sheet'
                variant='secondary'
                onPress={() => actionSheetRef.current?.open()}
              />
              <Button
                label='Form Sheet'
                variant='secondary'
                onPress={() => formSheetRef.current?.open()}
              />
            </View>
          </UISection>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* TOAST SYSTEM */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <UISection title='Toast System' theme={theme} c={c}>
            <View style={styles.grid}>
              <Button
                label='Success'
                variant='primary'
                onPress={() =>
                  showToast('Operation completed successfully!', 'success')
                }
              />
              <Button
                label='Error'
                variant='secondary'
                onPress={() =>
                  showToast('Failed to connect to the server.', 'error')
                }
              />
              <Button
                label='Warning'
                onPress={() =>
                  showToast('Your session will expire soon.', 'warning')
                }
                style={{ backgroundColor: c.warning }}
              />
              <Button
                label='Info'
                variant='secondary'
                onPress={() =>
                  showToast('A new software update is available.', 'info')
                }
              />
            </View>
          </UISection>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* CAROUSEL */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <UISection title='Carousel' theme={theme} c={c}>
            <Carousel data={CAROUSEL_DATA} height={180} />
          </UISection>


        {/* ── OVERLAYS (rendered outside scroll) ─────────────────────────── */}

        {/* Alert Dialog */}
        <AlertDialog
          visible={alertVisible}
          title='Confirm Delete'
          message='Are you sure you want to delete this item? This action cannot be undone.'
          confirmLabel='Delete'
          cancelLabel='Cancel'
          confirmDestructive
          onConfirm={() => {
            setAlertVisible(false)
            showToast('Item deleted!', 'success')
          }}
          onCancel={() => setAlertVisible(false)}
        />

        {/* Center Modal */}
        <AppModal
          visible={modalCenter}
          onClose={() => setModalCenter(false)}
          title='Modal (Center)'
          variant='center'
        >
          <View style={{ padding: 20 }}>
            <ThemedText>This is a centrally aligned modal.</ThemedText>
            <ThemedText
              style={{ marginTop: 8, color: Colors[theme].textSecondary }}
            >
              Tap backdrop or ✕ to close.
            </ThemedText>
          </View>
        </AppModal>

        {/* Bottom Modal */}
        <AppModal
          visible={modalBottom}
          onClose={() => setModalBottom(false)}
          title='Modal (Bottom)'
          variant='bottom'
        >
          <View style={{ padding: 20 }}>
            <ThemedText>This modal slides up from the bottom.</ThemedText>
            <ThemedText
              style={{ marginTop: 8, color: Colors[theme].textSecondary }}
            >
              Swipe down or tap ✕ to close.
            </ThemedText>
          </View>
        </AppModal>

        {/* Global Sidebar handled in root layout */}

        {/* Bottom Sheets */}
        <SimpleSheet
          ref={simpleSheetRef}
          title='Simple Sheet'
          snapPoints={['40%']}
        >
          <View style={{ padding: Spacing.md }}>
            <ThemedText>A simple non-scrollable bottom sheet.</ThemedText>
            <ThemedText
              style={{ marginTop: 8, color: Colors[theme].textSecondary }}
            >
              Drag down to dismiss.
            </ThemedText>
          </View>
        </SimpleSheet>

        <ScrollableSheet
          ref={scrollableSheetRef}
          title='Scrollable Sheet'
          snapPoints={['50%', '85%']}
        >
          <View style={{ padding: Spacing.md }}>
            {Array.from({ length: 12 }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.sheetItem,
                  { borderBottomColor: Colors[theme].border },
                ]}
              >
                <MaterialIcons name='circle' size={8} color={Brand.primary} />
                <ThemedText style={{ marginLeft: 12 }}>
                  List Item #{i + 1}
                </ThemedText>
              </View>
            ))}
          </View>
        </ScrollableSheet>

        <ActionSheet
          ref={actionSheetRef}
          title='Actions'
          actions={[
            {
              label: 'Edit',
              icon: 'edit',
              onPress: () => showToast('Edit pressed', 'info'),
            },
            {
              label: 'Share',
              icon: 'share',
              onPress: () => showToast('Share pressed', 'info'),
            },
            {
              label: 'Delete',
              icon: 'delete',
              destructive: true,
              onPress: () => showToast('Delete pressed', 'error'),
            },
          ]}
        />

        <FormSheet
          ref={formSheetRef}
          title='Form Sheet'
          snapPoints={['60%']}
          submitLabel='Save changes'
          onSubmit={() => showToast('Form saved successfully!', 'success')}
        >
          <View style={{ padding: Spacing.md }}>
            <Input
              label='Name'
              placeholder='Enter your name...'
              leftIcon='person'
            />
            <Input label='Email' placeholder='you@email.com' leftIcon='email' />
          </View>
        </FormSheet>

        {/* Speed Dial FAB */}
        <SpeedDial
          icon='add'
          position='bottom-right'
          color={Brand.primary}
          actions={[
            {
              icon: 'color-lens',
              label: 'Toggle Theme',
              onPress: () => showToast('Thiết lập theme trong Sidebar', 'info'),
            },
            {
              icon: 'share',
              label: 'Share Kit',
              onPress: () => showToast('Sharing UI Kit...', 'success'),
            },
          ]}
        />
      </ScreenContainer>
    </ParallaxScrollView>
  )
}

// ─── Root export wraps with ToastProvider ─────────────────────────────────────
export default function TabTwoScreen() {
  return (
    <ToastProvider>
      <ExploreContent />
    </ToastProvider>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    // Add subtle shadow for library feel
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: Fonts.Playfair.bold,
    fontSize: 20,
    marginBottom: Spacing.md,
  },
  sectionContent: {
    gap: Spacing.md,
  },
  subLabel: {
    fontSize: Typography.size.sm,
    fontWeight: '600',
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowAuto: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  reactLogo: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
})
