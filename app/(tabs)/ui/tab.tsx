import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { Tabs, TabItem } from '@/components/ui/tabs'
import { ThemedView } from '@/components/ui/themed-view'
import { ThemedText } from '@/components/ui/themed-text'
import { Colors, Spacing, Radius, Shadows, Typography, Brand } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'

// ─── Sample Data ──────────────────────────────────────────────────────────────
const basicTabs: TabItem[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'draft', label: 'Draft' },
  { key: 'archived', label: 'Archived' },
]

const iconTabs: TabItem[] = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'search', label: 'Explore', icon: 'search' },
  { key: 'saved', label: 'Saved', icon: 'bookmark' },
  { key: 'profile', label: 'Profile', icon: 'person' },
]

const badgeTabs: TabItem[] = [
  { key: 'inbox', label: 'Inbox', icon: 'inbox', badge: 12 },
  { key: 'sent', label: 'Sent', icon: 'send' },
  { key: 'drafts', label: 'Drafts', icon: 'drafts', badge: 3 },
  { key: 'spam', label: 'Spam', icon: 'report', badge: 108 },
]

const scrollableTabs: TabItem[] = [
  { key: 'trending', label: 'Trending' },
  { key: 'news', label: 'News' },
  { key: 'sports', label: 'Sports' },
  { key: 'tech', label: 'Technology' },
  { key: 'science', label: 'Science' },
  { key: 'health', label: 'Health' },
  { key: 'art', label: 'Art & Design' },
]

const disabledTabs: TabItem[] = [
  { key: 'basic', label: 'Basic' },
  { key: 'premium', label: 'Premium' },
  { key: 'enterprise', label: 'Enterprise', disabled: true },
]

const navigationTabs: TabItem[] = [
  { key: 'orders', label: 'Orders', icon: 'shopping-bag', badge: 5 },
  { key: 'wishlist', label: 'Wishlist', icon: 'favorite' },
  { key: 'reviews', label: 'Reviews', icon: 'star' },
  { key: 'history', label: 'History', icon: 'history' },
]

// ─── Tab Content ──────────────────────────────────────────────────────────────
const contentMap: Record<string, { icon: keyof typeof MaterialIcons.glyphMap; text: string; desc: string }> = {
  all: { icon: 'list-alt', text: 'All Items', desc: 'Showing all 128 items across every category.' },
  active: { icon: 'check-circle', text: 'Active Items', desc: 'These 72 items are currently live and visible.' },
  draft: { icon: 'edit', text: 'Drafts', desc: '34 drafts waiting for your final review.' },
  archived: { icon: 'archive', text: 'Archived', desc: '22 items have been archived and hidden.' },
  home: { icon: 'home', text: 'Home Feed', desc: 'Your personalized home feed with latest updates.' },
  search: { icon: 'search', text: 'Explore', desc: 'Discover new content and trending topics.' },
  saved: { icon: 'bookmark', text: 'Saved Posts', desc: 'Your bookmarked and saved content.' },
  profile: { icon: 'person', text: 'Your Profile', desc: 'Manage your account settings and preferences.' },
  inbox: { icon: 'inbox', text: 'Inbox', desc: '12 unread messages waiting for you.' },
  sent: { icon: 'send', text: 'Sent', desc: 'Messages you have sent to others.' },
  drafts: { icon: 'drafts', text: 'Drafts', desc: '3 unfinished drafts.' },
  spam: { icon: 'report', text: 'Spam', desc: '108 messages filtered as spam.' },
  trending: { icon: 'trending-up', text: 'Trending', desc: "What's hot right now." },
  news: { icon: 'article', text: 'News', desc: 'Top headlines from around the world.' },
  sports: { icon: 'sports-soccer', text: 'Sports', desc: 'Latest scores and sports news.' },
  tech: { icon: 'computer', text: 'Technology', desc: 'Cutting-edge tech news and reviews.' },
  science: { icon: 'science', text: 'Science', desc: 'Discoveries and research updates.' },
  health: { icon: 'health-and-safety', text: 'Health', desc: 'Wellness and health tips.' },
  art: { icon: 'palette', text: 'Art & Design', desc: 'Creative works and design inspiration.' },
  basic: { icon: 'workspace-premium', text: 'Basic Plan', desc: 'Great for individuals just getting started.' },
  premium: { icon: 'star', text: 'Premium Plan', desc: 'Ideal for growing teams and professionals.' },
  enterprise: { icon: 'business', text: 'Enterprise Plan', desc: 'This plan is not available in your region.' },
  orders: { icon: 'shopping-bag', text: 'My Orders', desc: '5 active orders being processed.' },
  wishlist: { icon: 'favorite', text: 'Wishlist', desc: '18 items on your wishlist.' },
  reviews: { icon: 'star', text: 'My Reviews', desc: 'You have written 7 product reviews.' },
  history: { icon: 'history', text: 'Browse History', desc: 'Recently viewed items.' },
}

// ─── Section Component ────────────────────────────────────────────────────────
function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  const { theme } = useTheme()
  const c = Colors[theme]
  return (
    <View style={styles.section}>
      <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>{title}</ThemedText>
      {subtitle && <ThemedText style={[styles.sectionSubtitle, { color: c.textSecondary }]}>{subtitle}</ThemedText>}
      {children}
    </View>
  )
}

// ─── Content Preview Component ────────────────────────────────────────────────
function ContentPreview({ activeKey }: { activeKey: string }) {
  const { theme } = useTheme()
  const c = Colors[theme]
  const info = contentMap[activeKey]
  if (!info) return null
  return (
    <View style={[styles.contentPreview, { backgroundColor: c.backgroundSecondary, borderColor: c.border }]}>
      <MaterialIcons name={info.icon} size={24} color={Brand.primary} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.contentTitle, { color: c.text }]}>{info.text}</Text>
        <Text style={[styles.contentDesc, { color: c.textSecondary }]}>{info.desc}</Text>
      </View>
    </View>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TabShowcase() {
  const { theme } = useTheme()
  const c = Colors[theme]

  const [underline, setUnderline] = useState('all')
  const [underlineIcon, setUnderlineIcon] = useState('home')
  const [pill, setPill] = useState('all')
  const [pillIcon, setPillIcon] = useState('home')
  const [box, setBox] = useState('all')
  const [segment, setSegment] = useState('all')
  const [card, setCard] = useState('orders')
  const [badgeTab, setBadgeTab] = useState('inbox')
  const [scrollable, setScrollable] = useState('trending')
  const [disabled, setDisabled] = useState('basic')
  const [fullWidth, setFullWidth] = useState('all')

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Tabs', headerShadowVisible: false }} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.headerIcon, { backgroundColor: Brand.primary + '15' }]}>
            <MaterialIcons name='tab' size={32} color={Brand.primary} />
          </View>
          <ThemedText type='title'>Tabs</ThemedText>
          <ThemedText style={[styles.headerDesc, { color: c.textSecondary }]}>
            5 variants, icons, badges, disabled states, scrollable, and full-width support.
          </ThemedText>
        </View>

        {/* ── 1. Underline ── */}
        <Section title='Underline' subtitle='Classic tab bar with an animated active indicator line.'>
          <Tabs tabs={basicTabs} activeKey={underline} onChange={setUnderline} variant='underline' />
          <ContentPreview activeKey={underline} />
        </Section>

        {/* ── 2. Underline with Icons ── */}
        <Section title='Underline + Icons'>
          <Tabs tabs={iconTabs} activeKey={underlineIcon} onChange={setUnderlineIcon} variant='underline' />
          <ContentPreview activeKey={underlineIcon} />
        </Section>

        {/* ── 3. Pill ── */}
        <Section title='Pill' subtitle='Rounded badge-style tabs on a tinted background.'>
          <Tabs tabs={basicTabs} activeKey={pill} onChange={setPill} variant='pill' />
          <ContentPreview activeKey={pill} />
        </Section>

        {/* ── 4. Pill with Icons ── */}
        <Section title='Pill + Icons'>
          <Tabs tabs={iconTabs} activeKey={pillIcon} onChange={setPillIcon} variant='pill' />
          <ContentPreview activeKey={pillIcon} />
        </Section>

        {/* ── 5. Box / Bordered ── */}
        <Section title='Box / Bordered' subtitle='Segments separated by bordered dividers.'>
          <Tabs tabs={basicTabs} activeKey={box} onChange={setBox} variant='box' />
          <ContentPreview activeKey={box} />
        </Section>

        {/* ── 6. Segment (iOS-style) ── */}
        <Section title='Segment Control' subtitle='iOS-native style tabs with a floating active background.'>
          <Tabs tabs={basicTabs} activeKey={segment} onChange={setSegment} variant='segment' />
          <ContentPreview activeKey={segment} />
        </Section>

        {/* ── 7. Card Tabs ── */}
        <Section title='Card Tabs' subtitle='Large icon-first cards perfect for navigation menus.'>
          <Tabs tabs={navigationTabs} activeKey={card} onChange={setCard} variant='card' />
          <ContentPreview activeKey={card} />
        </Section>

        {/* ── 8. With Badges ── */}
        <Section title='With Notification Badges' subtitle='Show unread counts or alert indicators on tabs.'>
          <Tabs tabs={badgeTabs} activeKey={badgeTab} onChange={setBadgeTab} variant='underline' />
          <ContentPreview activeKey={badgeTab} />
        </Section>

        {/* ── 9. Scrollable ── */}
        <Section title='Scrollable' subtitle='Horizontal scrolling for many category tabs.'>
          <Tabs tabs={scrollableTabs} activeKey={scrollable} onChange={setScrollable} variant='underline' scrollable />
          <ContentPreview activeKey={scrollable} />
        </Section>

        {/* ── 10. Scrollable Pill ── */}
        <Section title='Scrollable Pill'>
          <Tabs tabs={scrollableTabs} activeKey={scrollable} onChange={setScrollable} variant='pill' scrollable />
        </Section>

        {/* ── 11. Full Width ── */}
        <Section title='Full Width' subtitle='Tabs stretch to fill the container equally.'>
          <Tabs tabs={basicTabs} activeKey={fullWidth} onChange={setFullWidth} variant='underline' fullWidth />
          <ContentPreview activeKey={fullWidth} />
        </Section>

        {/* ── 12. Full Width Segment ── */}
        <Section title='Full Width Segment'>
          <Tabs tabs={basicTabs} activeKey={segment} onChange={setSegment} variant='segment' fullWidth />
        </Section>

        {/* ── 13. Disabled State ── */}
        <Section title='Disabled State' subtitle='Some tabs can be disabled and made non-interactive.'>
          <Tabs tabs={disabledTabs} activeKey={disabled} onChange={setDisabled} variant='pill' />
          <ContentPreview activeKey={disabled} />
        </Section>

        {/* ── Reference Card ── */}
        <View style={[styles.refCard, { backgroundColor: c.backgroundSecondary, borderColor: c.border }]}>
          <Text style={[styles.refTitle, { color: c.text }]}>Props Reference</Text>
          {[
            { prop: 'variant', desc: '"underline" | "pill" | "box" | "segment" | "card"' },
            { prop: 'scrollable', desc: 'boolean — enables horizontal scroll' },
            { prop: 'fullWidth', desc: 'boolean — stretches tabs to fill container' },
            { prop: 'tab.icon', desc: 'MaterialIcons glyph key (optional)' },
            { prop: 'tab.badge', desc: 'number — unread indicator (optional)' },
            { prop: 'tab.disabled', desc: 'boolean — disables a single tab' },
          ].map((item) => (
            <View key={item.prop} style={styles.refRow}>
              <Text style={[styles.refProp, { color: Brand.primary }]}>{item.prop}</Text>
              <Text style={[styles.refDesc, { color: c.textSecondary }]}>{item.desc}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.lg, paddingBottom: 100 },

  header: { alignItems: 'center', marginBottom: Spacing.xl, marginTop: Spacing.sm },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerDesc: {
    textAlign: 'center',
    fontSize: Typography.size.sm,
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    lineHeight: 20,
  },

  section: { marginBottom: Spacing.xl, gap: Spacing.md },
  sectionTitle: { fontSize: Typography.size.md, marginBottom: 0 },
  sectionSubtitle: { fontSize: Typography.size.sm, marginTop: -8, lineHeight: 18 },

  contentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  contentTitle: { fontSize: Typography.size.sm, fontWeight: '600', marginBottom: 2 },
  contentDesc: { fontSize: Typography.size.sm, lineHeight: 18 },

  refCard: {
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  refTitle: {
    fontSize: Typography.size.md,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  refRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' },
  refProp: { fontSize: Typography.size.sm, fontWeight: '600', minWidth: 90 },
  refDesc: { fontSize: Typography.size.sm, flex: 1, lineHeight: 18 },
})
