import React, { useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import ParallaxScrollView from '@/components/parallax-scroll-view'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
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
  Collapsible,
  Divider,
  FormSheet,
  // Layout / Navigation
  IconSymbol,
  // Form
  Input,
  ProgressBar,
  RadioGroup,
  ScrollableSheet,
  Select,
  Sidebar,
  SimpleSheet,
  SpeedDial,
  Switch,
  Tabs,
  ToastProvider,
  useToast,
  type AppBottomSheetRef,
  type CarouselItem,
} from '@/components/ui'
import { Button } from '@/components/ui/button'
import { Brand, Colors, Fonts, Spacing, Typography } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'
import { MaterialIcons } from '@expo/vector-icons'

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

// ─── Inner component that uses useToast ───────────────────────────────────────
function ExploreContent() {
  const { theme } = useTheme()
  const c = Colors[theme]
  const { show: showToast } = useToast()

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
  const [sidebarVisible, setSidebarVisible] = useState(false)

  // Bottom sheet refs
  const simpleSheetRef = useRef<AppBottomSheetRef>(null)
  const scrollableSheetRef = useRef<AppBottomSheetRef>(null)
  const actionSheetRef = useRef<AppBottomSheetRef>(null)
  const formSheetRef = useRef<AppBottomSheetRef>(null)

  const tabItems = [
    { key: 'home', label: 'Tổng quan' },
    { key: 'tasks', label: 'Nhiệm vụ' },
    { key: 'report', label: 'Báo cáo' },
  ]
  const periodTabs = [
    { key: 'day', label: 'Ngày' },
    { key: 'week', label: 'Tuần' },
    { key: 'month', label: 'Tháng' },
  ]
  const viewTabs = [
    { key: 'list', label: 'Danh sách' },
    { key: 'grid', label: 'Lưới' },
  ]

  return (
    <View style={{ flex: 1 }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={
          <IconSymbol
            size={310}
            color='#808080'
            name='chevron.left.forwardslash.chevron.right'
            style={styles.headerImage}
          />
        }
      >
        {/* ── HEADER ───────────────────────────────────────────────────────── */}
        <ThemedView style={styles.titleContainer}>
          <ThemedText type='title' style={{ fontFamily: Fonts.Playfair.bold }}>
            UI Kit
          </ThemedText>
          <Badge label='23 Components' variant='primary' />
        </ThemedView>
        <ThemedText style={{ marginBottom: Spacing.lg }}>
          Toàn bộ UI components trong hệ thống — tương tác để xem chúng hoạt
          động.
        </ThemedText>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* 1. CAROUSEL */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <Collapsible title='🎠 Carousel'>
          <Carousel data={CAROUSEL_DATA} height={180} />
        </Collapsible>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* 2. TABS */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <Collapsible title='🗂 Tabs'>
          <ThemedText style={styles.sectionLabel}>Underline</ThemedText>
          <Tabs
            tabs={tabItems}
            activeKey={activeTabUnderline}
            onChange={setActiveTabUnderline}
            variant='underline'
          />
          <Divider />

          <ThemedText style={styles.sectionLabel}>Pill</ThemedText>
          <Tabs
            tabs={periodTabs}
            activeKey={activeTabPill}
            onChange={setActiveTabPill}
            variant='pill'
          />
          <Divider />

          <ThemedText style={styles.sectionLabel}>Box</ThemedText>
          <Tabs
            tabs={viewTabs}
            activeKey={activeTabBox}
            onChange={setActiveTabBox}
            variant='box'
          />
        </Collapsible>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* 3. BUTTONS, BADGES & CHIPS */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <Collapsible title='🔘 Buttons, Badges & Chips'>
          <View style={styles.row}>
            <Button
              label='Primary'
              variant='primary'
              size='sm'
              style={{ flex: 1 }}
            />
            <Button
              label='Secondary'
              variant='secondary'
              size='sm'
              style={{ flex: 1 }}
            />
          </View>
          <View style={styles.row}>
            <Badge label='Success' variant='success' />
            <Badge label='Warning' variant='warning' />
            <Badge label='Error' variant='error' />
            <Badge label='Info' variant='info' />
            <Badge label='Primary' variant='primary' />
          </View>
          <View style={styles.row}>
            <Chip label='React Native' icon='code' selected />
            <Chip label='Expo' icon='flash-on' />
            <Chip label='Design' icon='brush' />
          </View>
        </Collapsible>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* 4. FORM CONTROLS */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <Collapsible title='📝 Form Controls'>
          <Input label='Text Input' placeholder='Gõ gì đó...' leftIcon='edit' />
          <Input
            label='Password'
            placeholder='••••••••'
            secureTextEntry
            leftIcon='lock'
          />
          <Select
            label='Select'
            options={[
              { label: 'Tùy chọn 1', value: 1, icon: 'star' },
              { label: 'Tùy chọn 2', value: 2, icon: 'favorite' },
              { label: 'Tùy chọn 3', value: 3, icon: 'bolt' },
            ]}
            value={selectVal}
            onChange={setSelectVal}
            required
          />
          <View style={styles.row}>
            <Switch
              label='Bật thông báo'
              value={switchVal}
              onChange={setSwitchVal}
            />
          </View>
          <Checkbox
            label='Đồng ý điều khoản sử dụng'
            checked={checkVal}
            onChange={setCheckVal}
          />
          <RadioGroup
            label='Chọn một mục'
            value={radioVal}
            onChange={setRadioVal}
            options={[
              { label: 'Lựa chọn A', value: 'a' },
              { label: 'Lựa chọn B', value: 'b' },
              { label: 'Lựa chọn C', value: 'c' },
            ]}
          />
        </Collapsible>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* 5. DATA DISPLAY */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <Collapsible title='📊 Data Display'>
          <ThemedText type='defaultSemiBold' style={{ marginBottom: 8 }}>
            Progress Bar (65%)
          </ThemedText>
          <ProgressBar value={progress} />
          <Divider />

          <Card style={{ padding: 16 }}>
            <ThemedText type='defaultSemiBold'>Card Component</ThemedText>
            <ThemedText style={{ fontSize: 13, marginTop: 4, lineHeight: 20 }}>
              Dùng để bao bọc các nội dung quan trọng với đổ bóng và bo góc
              chuẩn. Hỗ trợ light & dark mode tự động.
            </ThemedText>
          </Card>
          <Divider />

          <ThemedText type='defaultSemiBold' style={{ marginBottom: 10 }}>
            Static Menu
          </ThemedText>
        </Collapsible>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* 7. TOAST */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <Collapsible title='🔔 Toast Notifications'>
          <ThemedText style={{ marginBottom: 12 }}>
            Nhấn các nút bên dưới để hiển thị toast notification. Toast tự động
            biến mất sau 3 giây.
          </ThemedText>
          <View style={styles.row}>
            <Button
              label='Success'
              variant='primary'
              size='sm'
              style={{ flex: 1 }}
              onPress={() => showToast('Thao tác thành công!', 'success')}
            />
            <Button
              label='Error'
              variant='secondary'
              size='sm'
              style={{ flex: 1 }}
              onPress={() => showToast('Đã xảy ra lỗi. Thử lại!', 'error')}
            />
          </View>
          <View style={styles.row}>
            <Button
              label='Warning'
              variant='secondary'
              size='sm'
              style={{ flex: 1 }}
              onPress={() =>
                showToast('Lưu ý: Phiên làm việc sắp hết hạn!', 'warning')
              }
            />
            <Button
              label='Info'
              variant='secondary'
              size='sm'
              style={{ flex: 1 }}
              onPress={() => showToast('Bản cập nhật mới đã sẵn sàng.', 'info')}
            />
          </View>
        </Collapsible>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* 8. MODALS */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <Collapsible title='🪟 Modals'>
          <View style={styles.row}>
            <Button
              label='Alert Dialog'
              variant='primary'
              size='sm'
              style={{ flex: 1 }}
              onPress={() => setAlertVisible(true)}
            />
            <Button
              label='Center Modal'
              variant='secondary'
              size='sm'
              style={{ flex: 1 }}
              onPress={() => setModalCenter(true)}
            />
          </View>
          <View style={[styles.row, { marginTop: 0 }]}>
            <Button
              label='Bottom Modal'
              variant='secondary'
              size='sm'
              style={{ flex: 1 }}
              onPress={() => setModalBottom(true)}
            />
            <Button
              label='Sidebar'
              variant='secondary'
              size='sm'
              style={{ flex: 1 }}
              onPress={() => setSidebarVisible(true)}
            />
          </View>
        </Collapsible>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* 9. BOTTOM SHEETS */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <Collapsible title='📋 Bottom Sheets'>
          <View style={styles.row}>
            <Button
              label='Simple'
              variant='primary'
              size='sm'
              style={{ flex: 1 }}
              onPress={() => simpleSheetRef.current?.open()}
            />
            <Button
              label='Scrollable'
              variant='secondary'
              size='sm'
              style={{ flex: 1 }}
              onPress={() => scrollableSheetRef.current?.open()}
            />
          </View>
          <View style={[styles.row, { marginTop: 0 }]}>
            <Button
              label='Action Sheet'
              variant='secondary'
              size='sm'
              style={{ flex: 1 }}
              onPress={() => actionSheetRef.current?.open()}
            />
            <Button
              label='Form Sheet'
              variant='secondary'
              size='sm'
              style={{ flex: 1 }}
              onPress={() => formSheetRef.current?.open()}
            />
          </View>
        </Collapsible>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* 10. TYPOGRAPHY & ICONS */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <Collapsible title='✍️ Typography & Icons'>
          <ThemedText type='title' style={{ marginBottom: 4 }}>
            Title
          </ThemedText>
          <ThemedText type='subtitle' style={{ marginBottom: 4 }}>
            Subtitle
          </ThemedText>
          <ThemedText type='defaultSemiBold' style={{ marginBottom: 4 }}>
            Semibold
          </ThemedText>
          <ThemedText type='default' style={{ marginBottom: 4 }}>
            Default body text
          </ThemedText>
          <ThemedText type='link' style={{ marginBottom: 12 }}>
            Link text
          </ThemedText>
          <Divider />
          <View style={[styles.row, { flexWrap: 'wrap' }]}>
            {(
              [
                'star',
                'favorite',
                'home',
                'settings',
                'person',
                'search',
                'edit',
                'delete',
                'share',
                'lock',
              ] as const
            ).map((name) => (
              <View key={name} style={styles.iconCell}>
                <MaterialIcons name={name} size={24} color={c.icon} />
                <Text style={[styles.iconLabel, { color: c.textSecondary }]}>
                  {name}
                </Text>
              </View>
            ))}
          </View>
        </Collapsible>
      </ParallaxScrollView>

      {/* ── OVERLAYS (rendered outside scroll) ─────────────────────────── */}

      {/* Alert Dialog */}
      <AlertDialog
        visible={alertVisible}
        title='Xác nhận xoá'
        message='Bạn có chắc muốn xoá mục này không? Hành động này không thể hoàn tác.'
        confirmLabel='Xoá'
        cancelLabel='Huỷ'
        confirmDestructive
        onConfirm={() => {
          setAlertVisible(false)
          showToast('Đã xoá thành công!', 'success')
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
          <ThemedText>Đây là nội dung modal trung tâm.</ThemedText>
          <ThemedText
            style={{ marginTop: 8, color: Colors[theme].textSecondary }}
          >
            Nhấn backdrop hoặc nút ✕ để đóng.
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
          <ThemedText>Đây là nội dung modal từ phía dưới màn hình.</ThemedText>
          <ThemedText
            style={{ marginTop: 8, color: Colors[theme].textSecondary }}
          >
            Vuốt xuống hoặc nhấn ✕ để đóng.
          </ThemedText>
        </View>
      </AppModal>

      {/* Sidebar */}
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        activeKey='dashboard'
        header={
          <ThemedText type='defaultSemiBold' style={{ fontSize: 18 }}>
            ⚡ Step Up
          </ThemedText>
        }
        sections={[
          {
            title: 'MAIN',
            items: [
              {
                key: 'dashboard',
                label: 'Dashboard',
                icon: 'dashboard',
                badge: 3,
              },
              { key: 'tasks', label: 'Nhiệm vụ', icon: 'task-alt' },
              { key: 'reports', label: 'Báo cáo', icon: 'bar-chart' },
            ],
          },
          {
            title: 'SETTINGS',
            items: [
              { key: 'profile', label: 'Hồ sơ', icon: 'person' },
              { key: 'settings', label: 'Cài đặt', icon: 'settings' },
            ],
          },
        ]}
      />

      {/* Bottom Sheets */}
      <SimpleSheet
        ref={simpleSheetRef}
        title='Simple Sheet'
        snapPoints={['40%']}
      >
        <View style={{ padding: Spacing.md }}>
          <ThemedText>Nội dung đơn giản không cuộn.</ThemedText>
          <ThemedText
            style={{ marginTop: 8, color: Colors[theme].textSecondary }}
          >
            Kéo xuống để đóng sheet.
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
                Mục nội dung #{i + 1}
              </ThemedText>
            </View>
          ))}
        </View>
      </ScrollableSheet>

      <ActionSheet
        ref={actionSheetRef}
        title='Chọn hành động'
        actions={[
          {
            label: 'Chỉnh sửa',
            icon: 'edit',
            onPress: () => showToast('Edit pressed', 'info'),
          },
          {
            label: 'Chia sẻ',
            icon: 'share',
            onPress: () => showToast('Share pressed', 'info'),
          },
          {
            label: 'Xoá',
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
        submitLabel='Lưu thay đổi'
        onSubmit={() => showToast('Form đã được lưu!', 'success')}
      >
        <View style={{ padding: Spacing.md }}>
          <Input
            label='Tên'
            placeholder='Nhập tên của bạn...'
            leftIcon='person'
          />
          <Input label='Email' placeholder='you@email.com' leftIcon='email' />
        </View>
      </FormSheet>

      {/* Speed Dial FAB */}
      <SpeedDial
        icon='add'
        position='top-right'
        color={Brand.primary}
        actions={[
          {
            icon: 'description',
            label: 'Báo cáo',
            onPress: () => showToast('Mở báo cáo', 'info'),
          },
          {
            icon: 'edit-document',
            label: 'Tạo nhiệm vụ',
            onPress: () => showToast('Tạo nhiệm vụ mới', 'success'),
          },
          {
            icon: 'chat-bubble',
            label: 'Nhắn tin',
            onPress: () => showToast('Mở chat', 'info'),
          },
        ]}
      />
    </View>
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
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: Typography.size.sm,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.6,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  triggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  triggerLabel: {
    fontSize: Typography.size.sm,
    fontWeight: '600',
  },
  iconCell: {
    alignItems: 'center',
    width: 60,
    marginBottom: 12,
  },
  iconLabel: {
    fontSize: 9,
    marginTop: 4,
    textAlign: 'center',
  },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
})
