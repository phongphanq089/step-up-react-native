import { ScreenContainer } from '@/components/layout/screen-container'
import { ThemedView } from '@/components/ui'
import { AppModal } from '@/components/ui/app-modal'
import { Button } from '@/components/ui/button'
import { ThemedText } from '@/components/ui/themed-text'
import {
  Colors,
  Radius,
  Semantic,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme'
import { useTheme } from '@/context/theme-context'
import { MaterialIcons } from '@expo/vector-icons'
import React, { useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native'

export default function ModalShowcaseScreen() {
  const { theme } = useTheme()
  const c = Colors[theme]

  const [modals, setModals] = useState({
    alert: false,
    confirm: false,
    profile: false,
    shareSheet: false,
    notification: false,
    settings: false,
    rateApp: false,
  })

  const [star, setStar] = useState(0)
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: true,
  })
  const [inputText, setInputText] = useState('')

  const open = (key: keyof typeof modals) =>
    setModals((p) => ({ ...p, [key]: true }))
  const close = (key: keyof typeof modals) =>
    setModals((p) => ({ ...p, [key]: false }))

  // ── Trigger Cards ──────────────────────────────────────────────────────────

  const cards = [
    {
      key: 'alert' as const,
      icon: 'warning-amber' as const,
      iconColor: Semantic.warning,
      iconBg: '#FEF9C3',
      label: 'Alert Dialog',
      desc: 'Center modal · zoom animation',
    },
    {
      key: 'confirm' as const,
      icon: 'delete-outline' as const,
      iconColor: Semantic.error,
      iconBg: '#FEE2E2',
      label: 'Confirm Delete',
      desc: 'Destructive action prompt',
    },
    {
      key: 'profile' as const,
      icon: 'person-outline' as const,
      iconColor: '#3B82F6',
      iconBg: '#DBEAFE',
      label: 'Edit Profile',
      desc: 'Form modal · keyboard-aware',
    },
    {
      key: 'shareSheet' as const,
      icon: 'share' as const,
      iconColor: Semantic.success,
      iconBg: '#DCFCE7',
      label: 'Share Sheet',
      desc: 'Bottom variant · swipe to close',
    },
    {
      key: 'notification' as const,
      icon: 'notifications-none' as const,
      iconColor: '#8B5CF6',
      iconBg: '#EDE9FE',
      label: 'Push Notification',
      desc: 'Top banner · auto-dismiss',
    },
    {
      key: 'settings' as const,
      icon: 'tune' as const,
      iconColor: '#0EA5E9',
      iconBg: '#E0F2FE',
      label: 'Notification Settings',
      desc: 'Fullscreen settings panel',
    },
    {
      key: 'rateApp' as const,
      icon: 'star-border' as const,
      iconColor: '#F59E0B',
      iconBg: '#FEF3C7',
      label: 'Rate the App',
      desc: 'Interactive star rating modal',
    },
  ]

  return (
    <ScreenContainer withPadding withGap>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type='title' style={{ fontSize: Typography.size['2xl'] }}>
          Modal Library
        </ThemedText>
        <ThemedText style={{ color: c.textSecondary, marginTop: 2 }}>
          Tap any card to see the modal variant
        </ThemedText>
      </ThemedView>

      {/* Trigger Cards */}
      <ThemedView style={styles.cardGrid}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.key}
            style={[
              styles.triggerCard,
              { backgroundColor: c.surface, borderColor: c.border },
              Shadows.sm,
            ]}
            activeOpacity={0.75}
            onPress={() => open(card.key)}
          >
            <ThemedView
              style={[styles.triggerIcon, { backgroundColor: card.iconBg }]}
            >
              <MaterialIcons
                name={card.icon}
                size={22}
                color={card.iconColor}
              />
            </ThemedView>
            <ThemedView style={{ flex: 1, backgroundColor: 'transparent' }}>
              <Text style={[styles.triggerLabel, { color: c.text }]}>
                {card.label}
              </Text>
              <Text style={[styles.triggerDesc, { color: c.textSecondary }]}>
                {card.desc}
              </Text>
            </ThemedView>
            <MaterialIcons
              name='chevron-right'
              size={20}
              color={c.textSecondary}
            />
          </TouchableOpacity>
        ))}
      </ThemedView>

      {/* ── 1. Alert Modal ─────────────────────────────────────────────────── */}
      <AppModal
        visible={modals.alert}
        onClose={() => close('alert')}
        title='Session Expired'
        subtitle='Your login session has ended'
        size='md'
        hideCloseButton
        footer={
          <Button
            label='Log back in'
            onPress={() => close('alert')}
            fullWidth
            variant='gradient'
          />
        }
      >
        <ThemedView style={styles.alertBody}>
          <ThemedView
            style={[styles.alertIconWrap, { backgroundColor: '#FEF9C3' }]}
          >
            <MaterialIcons
              name='warning-amber'
              size={40}
              color={Semantic.warning}
            />
          </ThemedView>
          <Text style={[styles.alertMsg, { color: c.text }]}>
            You have been automatically logged out after 30 minutes of
            inactivity. Please sign in again to continue where you left off.
          </Text>
          <ThemedView
            style={[
              styles.alertInfoBox,
              { backgroundColor: c.backgroundSecondary, borderColor: c.border },
            ]}
          >
            <MaterialIcons
              name='info-outline'
              size={16}
              color={c.textSecondary}
            />
            <Text style={[styles.alertInfoText, { color: c.textSecondary }]}>
              Your data has been saved automatically.
            </Text>
          </ThemedView>
        </ThemedView>
      </AppModal>

      {/* ── 2. Confirm Delete ──────────────────────────────────────────────── */}
      <AppModal
        visible={modals.confirm}
        onClose={() => close('confirm')}
        title='Delete Project?'
        size='md'
        hideCloseButton
        footer={
          <ThemedView style={[styles.row, { backgroundColor: 'transparent' }]}>
            <Button
              label='Keep it'
              variant='outline'
              onPress={() => close('confirm')}
              style={{ flex: 1 }}
            />
            <Button
              label='Delete'
              variant='primary'
              leftIcon={<MaterialIcons name='delete' size={16} color='#fff' />}
              onPress={() => close('confirm')}
            />
          </ThemedView>
        }
      >
        <ThemedView style={styles.deleteBody}>
          <ThemedView
            style={[styles.deleteIconWrap, { backgroundColor: '#FEE2E2' }]}
          >
            <MaterialIcons
              name='delete-forever'
              size={36}
              color={Semantic.error}
            />
          </ThemedView>
          <Text style={[styles.deleteTitle, { color: c.text }]}>
            This is permanent
          </Text>
          <Text style={[styles.deleteMsg, { color: c.textSecondary }]}>
            "Design System v2" and all its assets, comments, and revision
            history will be deleted forever and cannot be restored.
          </Text>
          <ThemedView
            style={[
              styles.warningChip,
              { borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' },
            ]}
          >
            <MaterialIcons
              name='error-outline'
              size={14}
              color={Semantic.error}
            />
            <Text style={[styles.warningText, { color: Semantic.error }]}>
              3 collaborators will lose access
            </Text>
          </ThemedView>
        </ThemedView>
      </AppModal>

      {/* ── 3. Edit Profile Form ───────────────────────────────────────────── */}
      <AppModal
        visible={modals.profile}
        onClose={() => close('profile')}
        title='Edit Profile'
        subtitle='Update your public information'
        size='lg'
        footer={
          <ThemedView style={styles.row}>
            <Button
              label='Cancel'
              variant='ghost'
              onPress={() => close('profile')}
              style={{ flex: 1 }}
            />
            <Button
              label='Save Changes'
              onPress={() => close('profile')}
              style={{ flex: 1 }}
            />
          </ThemedView>
        }
      >
        <ThemedView style={styles.formBody}>
          {/* Avatar */}
          <ThemedView style={styles.avatarRow}>
            <ThemedView
              style={[styles.avatarCircle, { backgroundColor: c.colorPrimary }]}
            >
              <MaterialIcons name='person' size={36} color='#fff' />
            </ThemedView>
            <TouchableOpacity
              style={[
                styles.avatarEdit,
                { backgroundColor: c.surface, borderColor: c.border },
              ]}
            >
              <MaterialIcons
                name='camera-alt'
                size={14}
                color={c.textSecondary}
              />
            </TouchableOpacity>
          </ThemedView>
          {/* Fields */}
          {[
            {
              label: 'Full Name',
              placeholder: 'Alex Johnson',
              icon: 'badge' as const,
            },
            {
              label: 'Username',
              placeholder: '@alexj',
              icon: 'alternate-email' as const,
            },
            {
              label: 'Email',
              placeholder: 'alex@example.com',
              icon: 'mail-outline' as const,
            },
          ].map((field) => (
            <ThemedView key={field.label} style={styles.field}>
              <Text style={[styles.fieldLabel, { color: c.textSecondary }]}>
                {field.label}
              </Text>
              <ThemedView
                style={[
                  styles.inputWrap,
                  {
                    backgroundColor: c.backgroundSecondary,
                    borderColor: c.border,
                  },
                ]}
              >
                <MaterialIcons
                  name={field.icon}
                  size={18}
                  color={c.textSecondary}
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  placeholder={field.placeholder}
                  placeholderTextColor={c.textSecondary}
                  style={[styles.input, { color: c.text }]}
                />
              </ThemedView>
            </ThemedView>
          ))}
          {/* Bio */}
          <ThemedView style={styles.field}>
            <Text style={[styles.fieldLabel, { color: c.textSecondary }]}>
              Bio
            </Text>
            <TextInput
              placeholder='Tell us about yourself...'
              placeholderTextColor={c.textSecondary}
              multiline
              numberOfLines={3}
              style={[
                styles.textArea,
                {
                  backgroundColor: c.backgroundSecondary,
                  borderColor: c.border,
                  color: c.text,
                },
              ]}
            />
          </ThemedView>
        </ThemedView>
      </AppModal>

      {/* ── 4. Share Sheet ─────────────────────────────────────────────────── */}
      <AppModal
        visible={modals.shareSheet}
        onClose={() => close('shareSheet')}
        variant='bottom'
        title='Share Article'
        hideCloseButton
        footer={
          <Button
            label='Cancel'
            variant='ghost'
            onPress={() => close('shareSheet')}
            fullWidth
          />
        }
      >
        <ThemedView style={styles.shareBody}>
          {/* Preview card */}
          <ThemedView
            style={[
              styles.sharePreview,
              { backgroundColor: c.backgroundSecondary, borderColor: c.border },
            ]}
          >
            <ThemedView
              style={[styles.shareThumb, { backgroundColor: c.colorPrimary }]}
            >
              <MaterialIcons name='article' size={24} color='#fff' />
            </ThemedView>
            <ThemedView style={{ flex: 1 }}>
              <Text
                style={[styles.shareTitle, { color: c.text }]}
                numberOfLines={1}
              >
                10 Design Patterns Every Dev Should Know
              </Text>
              <Text style={[styles.shareUrl, { color: c.textSecondary }]}>
                design.dev/patterns
              </Text>
            </ThemedView>
          </ThemedView>
          {/* App grid */}
          <ThemedView style={styles.appGrid}>
            {[
              {
                name: 'Messages',
                icon: 'sms',
                color: '#22C55E',
                bg: '#DCFCE7',
              },
              {
                name: 'WhatsApp',
                icon: 'chat',
                color: '#16a34a',
                bg: '#D1FAE5',
              },
              {
                name: 'Twitter',
                icon: 'alternate-email',
                color: '#3B82F6',
                bg: '#DBEAFE',
              },
              {
                name: 'Slack',
                icon: 'grid-view',
                color: '#8B5CF6',
                bg: '#EDE9FE',
              },
              { name: 'Mail', icon: 'mail', color: '#F59E0B', bg: '#FEF3C7' },
              {
                name: 'Copy Link',
                icon: 'link',
                color: '#0EA5E9',
                bg: '#E0F2FE',
              },
            ].map((app) => (
              <TouchableOpacity
                key={app.name}
                style={styles.appItem}
                activeOpacity={0.7}
              >
                <ThemedView
                  style={[styles.appIcon, { backgroundColor: app.bg }]}
                >
                  <MaterialIcons
                    name={app.icon as any}
                    size={22}
                    color={app.color}
                  />
                </ThemedView>
                <Text style={[styles.appName, { color: c.textSecondary }]}>
                  {app.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ThemedView>
          {/* More options */}
          {[
            { icon: 'bookmark-border' as const, label: 'Save to Reading List' },
            { icon: 'flag' as const, label: 'Report Article' },
          ].map((opt) => (
            <TouchableOpacity
              key={opt.label}
              style={[styles.shareOption, { borderTopColor: c.border }]}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={opt.icon}
                size={20}
                color={c.textSecondary}
              />
              <Text style={[styles.shareOptionText, { color: c.text }]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </AppModal>

      {/* ── 5. Top Notification Banner ─────────────────────────────────────── */}
      <AppModal
        visible={modals.notification}
        onClose={() => close('notification')}
        variant='top'
        hideCloseButton
        backdropDismiss
      >
        <ThemedView style={[styles.notifBody, { backgroundColor: c.surface }]}>
          <ThemedView
            style={[styles.notifIcon, { backgroundColor: '#EDE9FE' }]}
          >
            <MaterialIcons
              name='notifications-active'
              size={24}
              color='#8B5CF6'
            />
          </ThemedView>
          <ThemedView style={{ flex: 1 }} transparent>
            <Text style={[styles.notifTitle, { color: c.text }]}>
              New message from Sarah
            </Text>
            <Text style={[styles.notifMsg, { color: c.textSecondary }]}>
              "Hey! Are you free for a quick call this afternoon?"
            </Text>
            <ThemedView style={styles.notifActions} transparent>
              <TouchableOpacity onPress={() => close('notification')}>
                <Text style={[styles.notifAction, { color: c.textSecondary }]}>
                  Dismiss
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => close('notification')}>
                <Text
                  style={[
                    styles.notifAction,
                    { color: c.colorPrimary, fontWeight: '600' },
                  ]}
                >
                  Reply
                </Text>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </AppModal>

      {/* ── 6. Settings Fullscreen ─────────────────────────────────────────── */}
      <AppModal
        visible={modals.settings}
        onClose={() => close('settings')}
        variant='fullscreen'
        title='Notification Settings'
        footer={
          <Button
            label='Save Preferences'
            onPress={() => close('settings')}
            fullWidth
            variant='gradient'
          />
        }
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.settingsBody}>
            {/* Profile row */}
            <ThemedView
              style={[
                styles.profileRow,
                {
                  backgroundColor: c.backgroundSecondary,
                  borderColor: c.border,
                },
              ]}
            >
              <ThemedView
                style={[
                  styles.avatarCircle,
                  { backgroundColor: c.colorPrimary },
                ]}
              >
                <MaterialIcons name='person' size={28} color='#fff' />
              </ThemedView>
              <ThemedView transparent>
                <Text style={[styles.profileName, { color: c.text }]}>
                  Alex Johnson
                </Text>
                <Text style={[styles.profileEmail, { color: c.textSecondary }]}>
                  alex@example.com
                </Text>
              </ThemedView>
            </ThemedView>

            <Text style={[styles.settingsSection, { color: c.textSecondary }]}>
              NOTIFICATION TYPES
            </Text>

            {[
              {
                key: 'push' as const,
                icon: 'smartphone',
                label: 'Push Notifications',
                desc: 'Alerts sent to your device',
              },
              {
                key: 'email' as const,
                icon: 'mail-outline',
                label: 'Email Notifications',
                desc: 'Delivered to your inbox',
              },
              {
                key: 'sms' as const,
                icon: 'sms',
                label: 'SMS Notifications',
                desc: 'Text messages to your phone',
              },
            ].map((item) => (
              <ThemedView
                key={item.key}
                style={[styles.settingRow, { borderBottomColor: c.border }]}
              >
                <ThemedView
                  style={[
                    styles.settingIconWrap,
                    { backgroundColor: c.backgroundSecondary },
                  ]}
                >
                  <MaterialIcons
                    name={item.icon as any}
                    size={20}
                    color={c.colorPrimary}
                  />
                </ThemedView>
                <ThemedView style={{ flex: 1 }}>
                  <Text style={[styles.settingLabel, { color: c.text }]}>
                    {item.label}
                  </Text>
                  <Text
                    style={[styles.settingDesc, { color: c.textSecondary }]}
                  >
                    {item.desc}
                  </Text>
                </ThemedView>
                <Switch
                  value={notifications[item.key]}
                  onValueChange={(val) =>
                    setNotifications((p) => ({ ...p, [item.key]: val }))
                  }
                  trackColor={{ false: c.border, true: c.colorPrimary + '66' }}
                  thumbColor={
                    notifications[item.key] ? c.colorPrimary : c.textSecondary
                  }
                />
              </ThemedView>
            ))}

            <Text
              style={[
                styles.settingsSection,
                { color: c.textSecondary, marginTop: Spacing.lg },
              ]}
            >
              FREQUENCY
            </Text>
            {['Real-time', 'Every hour', 'Daily digest'].map((f, i) => (
              <TouchableOpacity
                key={f}
                style={[styles.radioRow, { borderBottomColor: c.border }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.radioLabel, { color: c.text }]}>{f}</Text>
                <ThemedView
                  style={[
                    styles.radioDot,
                    { borderColor: c.colorPrimary },
                    i === 0 && styles.radioDotActive,
                    i === 0 && { backgroundColor: c.colorPrimary },
                  ]}
                >
                  {i === 0 && <ThemedView style={styles.radioDotInner} />}
                </ThemedView>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ScrollView>
      </AppModal>

      {/* ── 7. Rate App Modal ──────────────────────────────────────────────── */}
      <AppModal
        visible={modals.rateApp}
        onClose={() => close('rateApp')}
        title='Enjoying the App?'
        size='md'
        hideCloseButton
        footer={
          <ThemedView transparent>
            <Button
              label={
                star > 0 ? `Submit ${star}-Star Review` : 'Select a rating'
              }
              disabled={star === 0}
              onPress={() => close('rateApp')}
              fullWidth
              variant='gradient'
            />
            <TouchableOpacity
              style={{ alignItems: 'center', marginTop: Spacing.sm }}
              onPress={() => close('rateApp')}
            >
              <Text style={[styles.skipText, { color: c.textSecondary }]}>
                Maybe later
              </Text>
            </TouchableOpacity>
          </ThemedView>
        }
      >
        <ThemedView style={styles.rateBody}>
          <ThemedView
            style={[styles.rateAppIcon, { backgroundColor: c.colorPrimary }]}
          >
            <MaterialIcons name='bolt' size={36} color='#fff' />
          </ThemedView>
          <Text style={[styles.rateTagline, { color: c.textSecondary }]}>
            Your feedback helps us improve and reach more people. It only takes
            10 seconds!
          </Text>
          <ThemedView style={styles.stars}>
            {[1, 2, 3, 4, 5].map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => setStar(s)}
                activeOpacity={0.7}
              >
                <MaterialIcons
                  name={s <= star ? 'star' : 'star-border'}
                  size={44}
                  color={s <= star ? '#F59E0B' : c.border}
                />
              </TouchableOpacity>
            ))}
          </ThemedView>
          {star > 0 && (
            <Text style={[styles.starFeedback, { color: c.textSecondary }]}>
              {
                [
                  '',
                  'Needs improvement 😕',
                  'Getting there 🙂',
                  'Pretty good 😊',
                  'Really nice! 😍',
                  'Absolutely love it! 🤩',
                ][star]
              }
            </Text>
          )}
          {star > 0 && (
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder='Tell us more (optional)...'
              placeholderTextColor={c.textSecondary}
              multiline
              numberOfLines={2}
              style={[
                styles.reviewInput,
                {
                  backgroundColor: c.backgroundSecondary,
                  borderColor: c.border,
                  color: c.text,
                },
              ]}
            />
          )}
        </ThemedView>
      </AppModal>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  header: { marginBottom: Spacing.xs },

  // Trigger Cards
  cardGrid: { gap: Spacing.sm },
  triggerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  triggerIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  triggerLabel: { fontSize: Typography.size.md, fontWeight: '600' },
  triggerDesc: { fontSize: Typography.size.sm, marginTop: 1 },

  // Row helper
  row: { flexDirection: 'row', gap: Spacing.sm },

  // ─── Alert Modal
  alertBody: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  alertIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  alertMsg: {
    textAlign: 'center',
    fontSize: Typography.size.md,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  alertInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    width: '100%',
  },
  alertInfoText: { fontSize: Typography.size.sm, flex: 1 },

  // ─── Delete Modal
  deleteBody: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  deleteIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  deleteTitle: {
    fontSize: Typography.size.lg,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  deleteMsg: {
    textAlign: 'center',
    fontSize: Typography.size.sm,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  warningChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  warningText: { fontSize: Typography.size.xs, fontWeight: '600' },

  // ─── Profile Form
  formBody: { gap: Spacing.md, padding: Spacing.md },
  avatarRow: { alignItems: 'center', marginBottom: Spacing.sm },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEdit: {
    position: 'absolute',
    bottom: 0,
    right: '30%',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  field: { gap: 6 },
  fieldLabel: { fontSize: Typography.size.sm, fontWeight: '500' },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  input: { flex: 1, fontSize: Typography.size.md },
  textArea: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    fontSize: Typography.size.md,
    minHeight: 80,
    textAlignVertical: 'top',
  },

  // ─── Share Sheet
  shareBody: { padding: Spacing.md, gap: Spacing.md },
  sharePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.sm,
  },
  shareThumb: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareTitle: { fontSize: Typography.size.sm, fontWeight: '600' },
  shareUrl: { fontSize: Typography.size.xs, marginTop: 2 },
  appGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'space-between',
  },
  appItem: { width: '15%', alignItems: 'center', gap: 4 },
  appIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: { fontSize: 10, textAlign: 'center' },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
  },
  shareOptionText: { fontSize: Typography.size.md },

  // ─── Notification Banner
  notifBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  notifIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifTitle: {
    fontSize: Typography.size.md,
    fontWeight: '600',
    marginBottom: 2,
  },
  notifMsg: { fontSize: Typography.size.sm, lineHeight: 18 },
  notifActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  notifAction: { fontSize: Typography.size.sm },

  // ─── Settings
  settingsBody: { padding: Spacing.md },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  profileName: { fontSize: Typography.size.md, fontWeight: '600' },
  profileEmail: { fontSize: Typography.size.sm },
  settingsSection: {
    fontSize: Typography.size.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  settingIconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: { fontSize: Typography.size.md, fontWeight: '500' },
  settingDesc: { fontSize: Typography.size.sm },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  radioLabel: { flex: 1, fontSize: Typography.size.md },
  radioDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDotActive: {},
  radioDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },

  // ─── Rate App
  rateBody: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    gap: Spacing.md,
  },
  rateAppIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateTagline: {
    textAlign: 'center',
    fontSize: Typography.size.sm,
    lineHeight: 20,
  },
  stars: { flexDirection: 'row', gap: 4 },
  starFeedback: { fontSize: Typography.size.md, fontWeight: '500' },
  reviewInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    width: '100%',
    fontSize: Typography.size.sm,
    textAlignVertical: 'top',
  },
  skipText: { fontSize: Typography.size.sm, paddingVertical: Spacing.xs },
})
