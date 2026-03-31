import { ScreenContainer } from '@/components/layout/screen-container'
import { ThemedView } from '@/components/ui'
import {
  ActionSheet,
  AppBottomSheetRef,
  BottomSheetModalProvider,
  FormSheet,
  GestureHandlerRootView,
  ScrollableSheet,
  SimpleSheet,
} from '@/components/ui/bottom-sheet'
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
import React, { useRef, useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native'

// ─── Trigger Card Component ───────────────────────────────────────────────────

function TriggerCard({
  icon,
  iconColor,
  iconBg,
  label,
  desc,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap
  iconColor: string
  iconBg: string
  label: string
  desc: string
  onPress: () => void
}) {
  const { theme } = useTheme()
  const c = Colors[theme]
  return (
    <TouchableOpacity
      style={[
        styles.triggerCard,
        { backgroundColor: c.surface, borderColor: c.border },
        Shadows.sm,
      ]}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <ThemedView style={[styles.triggerIcon, { backgroundColor: iconBg }]}>
        <MaterialIcons name={icon} size={22} color={iconColor} />
      </ThemedView>
      <ThemedView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <Text style={[styles.triggerLabel, { color: c.text }]}>{label}</Text>
        <Text style={[styles.triggerDesc, { color: c.textSecondary }]}>
          {desc}
        </Text>
      </ThemedView>
      <MaterialIcons name='chevron-right' size={20} color={c.textSecondary} />
    </TouchableOpacity>
  )
}

// ─── Product Card used inside ScrollableSheet ─────────────────────────────────

function ProductItem({
  name,
  price,
  tag,
  tagColor,
  tagBg,
  icon,
}: {
  name: string
  price: string
  tag: string
  tagColor: string
  tagBg: string
  icon: keyof typeof MaterialIcons.glyphMap
}) {
  const { theme } = useTheme()
  const c = Colors[theme]
  return (
    <ThemedView style={[styles.productItem, { borderBottomColor: c.border }]}>
      <ThemedView style={[styles.productIcon, { backgroundColor: tagBg }]}>
        <MaterialIcons name={icon} size={22} color={tagColor} />
      </ThemedView>
      <ThemedView style={{ flex: 1 }}>
        <Text style={[styles.productName, { color: c.text }]}>{name}</Text>
        <Text style={[styles.productPrice, { color: c.textSecondary }]}>
          {price}
        </Text>
      </ThemedView>
      <ThemedView style={[styles.productBadge, { backgroundColor: tagBg }]}>
        <Text style={[styles.productBadgeText, { color: tagColor }]}>
          {tag}
        </Text>
      </ThemedView>
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: c.colorPrimary }]}
      >
        <MaterialIcons name='add' size={16} color='#fff' />
      </TouchableOpacity>
    </ThemedView>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function SheetShowcaseScreen() {
  const { theme } = useTheme()
  const c = Colors[theme]

  const simpleRef = useRef<AppBottomSheetRef>(null)
  const scrollRef = useRef<AppBottomSheetRef>(null)
  const actionRef = useRef<AppBottomSheetRef>(null)
  const formRef = useRef<AppBottomSheetRef>(null)

  const [darkMode, setDarkMode] = useState(false)
  const [analytics, setAnalytics] = useState(true)
  const [autoSave, setAutoSave] = useState(true)

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ScreenContainer withPadding withGap>
          {/* Header */}
          <ThemedView style={styles.header}>
            <ThemedText
              type='title'
              style={{ fontSize: Typography.size['2xl'] }}
            >
              Bottom Sheet
            </ThemedText>
            <ThemedText style={{ color: c.textSecondary, marginTop: 2 }}>
              Powered by @gorhom/bottom-sheet — tap to preview
            </ThemedText>
          </ThemedView>

          {/* Trigger Cards */}
          <ThemedView style={styles.grid}>
            <TriggerCard
              icon='layers'
              iconColor='#3B82F6'
              iconBg='#DBEAFE'
              label='Simple Sheet'
              desc='Static content · dynamic height'
              onPress={() => simpleRef.current?.open()}
            />
            <TriggerCard
              icon='list'
              iconColor={Semantic.success}
              iconBg='#DCFCE7'
              label='Scrollable Sheet'
              desc='Long product list · multi snap points'
              onPress={() => scrollRef.current?.open()}
            />
            <TriggerCard
              icon='more-horiz'
              iconColor={Semantic.warning}
              iconBg='#FEF3C7'
              label='Action Sheet'
              desc='Context menu · destructive actions'
              onPress={() => actionRef.current?.open()}
            />
            <TriggerCard
              icon='edit'
              iconColor='#8B5CF6'
              iconBg='#EDE9FE'
              label='Form Sheet'
              desc='TextInput · keyboard-interactive'
              onPress={() => formRef.current?.open()}
            />
          </ThemedView>

          {/* Feature tags */}
          <ThemedView
            style={[
              styles.featureBox,
              { backgroundColor: c.backgroundSecondary, borderColor: c.border },
            ]}
          >
            <Text style={[styles.featureTitle, { color: c.text }]}>
              ✨ Features
            </Text>
            <ThemedView
              style={[styles.featureTags, { backgroundColor: 'transparent' }]}
            >
              {[
                'Swipe to close',
                'Snap points',
                'Backdrop dim',
                'Keyboard-aware',
                'Dark mode',
                'Gesture handled',
              ].map((f) => (
                <ThemedView
                  key={f}
                  style={[
                    styles.featureTag,
                    { backgroundColor: c.backgroundTertiary },
                  ]}
                >
                  <Text
                    style={[styles.featureTagText, { color: c.textSecondary }]}
                  >
                    {f}
                  </Text>
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>

          {/* ── 1. Simple Sheet: User Profile Card ────────────────────────────── */}
          <SimpleSheet ref={simpleRef} title='Your Profile' enableDynamicSizing>
            <ThemedView style={styles.profileSheet}>
              {/* Avatar */}
              <ThemedView style={styles.profileAvatarWrap}>
                <ThemedView
                  style={[
                    styles.profileAvatar,
                    { backgroundColor: c.colorPrimary },
                  ]}
                >
                  <MaterialIcons name='person' size={40} color='#fff' />
                </ThemedView>
                <ThemedView
                  style={[styles.onlineDot, { borderColor: c.surface }]}
                />
              </ThemedView>
              <Text style={[styles.profileName, { color: c.text }]}>
                Alex Johnson
              </Text>
              <Text style={[styles.profileRole, { color: c.textSecondary }]}>
                Senior Product Designer · San Francisco
              </Text>

              {/* Stats row */}
              <ThemedView style={[styles.statsRow, { borderColor: c.border }]}>
                {[
                  { label: 'Projects', value: '48' },
                  { label: 'Followers', value: '1.2K' },
                  { label: 'Following', value: '234' },
                ].map((stat, i) => (
                  <ThemedView
                    key={stat.label}
                    style={[
                      styles.stat,
                      i > 0 && {
                        borderLeftColor: c.border,
                        borderLeftWidth: 1,
                      },
                    ]}
                  >
                    <Text style={[styles.statVal, { color: c.text }]}>
                      {stat.value}
                    </Text>
                    <Text
                      style={[styles.statLabel, { color: c.textSecondary }]}
                    >
                      {stat.label}
                    </Text>
                  </ThemedView>
                ))}
              </ThemedView>

              {/* Skill tags */}
              <ThemedView style={styles.skillRow}>
                {['Figma', 'React Native', 'Design Systems', 'Prototyping'].map(
                  (skill) => (
                    <ThemedView
                      key={skill}
                      style={[
                        styles.skillTag,
                        {
                          backgroundColor: c.colorPrimary + '18',
                          borderColor: c.colorPrimary + '44',
                        },
                      ]}
                    >
                      <Text
                        style={[styles.skillText, { color: c.colorPrimary }]}
                      >
                        {skill}
                      </Text>
                    </ThemedView>
                  ),
                )}
              </ThemedView>

              {/* Actions */}
              <ThemedView style={styles.profileActions}>
                <Button label='Follow' variant='primary' style={{ flex: 1 }} />
                <Button
                  label='Message'
                  variant='outline'
                  style={{ flex: 1 }}
                  leftIcon={
                    <MaterialIcons
                      name='mail'
                      size={16}
                      color={c.colorPrimary}
                    />
                  }
                />
              </ThemedView>
            </ThemedView>
          </SimpleSheet>

          {/* ── 2. Scrollable Sheet: Product Catalog ──────────────────────────── */}
          <ScrollableSheet
            ref={scrollRef}
            title='Featured Products'
            snapPoints={['55%', '90%']}
          >
            <ThemedView
              style={[
                styles.searchBar,
                {
                  backgroundColor: c.backgroundSecondary,
                  borderColor: c.border,
                },
              ]}
            >
              <MaterialIcons name='search' size={18} color={c.textSecondary} />
              <Text
                style={[styles.searchPlaceholder, { color: c.textSecondary }]}
              >
                Search products...
              </Text>
            </ThemedView>

            {/* Category chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.catScroll}
              contentContainerStyle={{ paddingHorizontal: Spacing.md }}
            >
              {[
                { label: 'All', active: true },
                { label: '🌿 Organic', active: false },
                { label: '⚡ New', active: false },
                { label: '🔥 Hot Deal', active: false },
                { label: '⭐ Top Rated', active: false },
              ].map((cat) => (
                <TouchableOpacity
                  key={cat.label}
                  style={[
                    styles.catChip,
                    {
                      backgroundColor: cat.active
                        ? c.colorPrimary
                        : c.backgroundTertiary,
                      borderColor: cat.active ? c.colorPrimary : c.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.catChipText,
                      { color: cat.active ? '#fff' : c.text },
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Product list */}
            <ProductItem
              name='Wireless Headphones Pro'
              price='$129.99'
              tag='Sale -20%'
              tagColor='#16a34a'
              tagBg='#DCFCE7'
              icon='headphones'
            />
            <ProductItem
              name='Smart Watch Series 5'
              price='$299.00'
              tag='New'
              tagColor='#3B82F6'
              tagBg='#DBEAFE'
              icon='watch'
            />
            <ProductItem
              name='Mechanical Keyboard'
              price='$89.00'
              tag='Hot 🔥'
              tagColor='#EF4444'
              tagBg='#FEE2E2'
              icon='keyboard'
            />
            <ProductItem
              name='4K Webcam Ultra'
              price='$149.99'
              tag='Limited'
              tagColor='#8B5CF6'
              tagBg='#EDE9FE'
              icon='videocam'
            />
            <ProductItem
              name='Ergonomic Mouse'
              price='$59.99'
              tag='Top ⭐'
              tagColor='#F59E0B'
              tagBg='#FEF3C7'
              icon='mouse'
            />
            <ProductItem
              name='USB-C Hub 10 in 1'
              price='$49.99'
              tag='Sale -15%'
              tagColor='#16a34a'
              tagBg='#DCFCE7'
              icon='usb'
            />
            <ProductItem
              name='Gaming Chair Pro'
              price='$349.00'
              tag='Popular'
              tagColor='#0EA5E9'
              tagBg='#E0F2FE'
              icon='chair'
            />
          </ScrollableSheet>

          {/* ── 3. Action Sheet: Post Options ─────────────────────────────────── */}
          <ActionSheet
            ref={actionRef}
            title='Post Options'
            actions={[
              {
                label: 'Edit Post',
                icon: 'edit',
                onPress: () => {},
              },
              {
                label: 'Pin to Profile',
                icon: 'push-pin',
                onPress: () => {},
              },
              {
                label: 'Share via...',
                icon: 'share',
                onPress: () => {},
              },
              {
                label: 'Copy Link',
                icon: 'link',
                onPress: () => {},
              },
              {
                label: 'Archive Post',
                icon: 'archive',
                onPress: () => {},
              },
              {
                label: 'Delete Post',
                icon: 'delete',
                onPress: () => {},
                destructive: true,
              },
            ]}
          />

          {/* ── 4. Form Sheet: Quick Reply ─────────────────────────────────────── */}
          <FormSheet
            ref={formRef}
            title='Leave a Review'
            submitLabel='Publish Review'
            snapPoints={['60%', '85%']}
            onSubmit={() => {}}
          >
            <ThemedView style={styles.formSheet}>
              {/* Product being reviewed */}
              <ThemedView
                style={[
                  styles.reviewProduct,
                  {
                    backgroundColor: c.backgroundSecondary,
                    borderColor: c.border,
                  },
                ]}
              >
                <ThemedView
                  style={[styles.reviewIcon, { backgroundColor: '#DBEAFE' }]}
                >
                  <MaterialIcons name='headphones' size={24} color='#3B82F6' />
                </ThemedView>
                <ThemedView>
                  <Text style={[styles.reviewProductName, { color: c.text }]}>
                    Wireless Headphones Pro
                  </Text>
                  <Text
                    style={[
                      styles.reviewProductSub,
                      { color: c.textSecondary },
                    ]}
                  >
                    Verified Purchase · 2 days ago
                  </Text>
                </ThemedView>
              </ThemedView>

              {/* Star rating selector */}
              <ThemedView style={styles.starSection}>
                <Text style={[styles.starLabel, { color: c.textSecondary }]}>
                  Your Rating
                </Text>
                <ThemedView style={styles.starRow}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <MaterialIcons
                      key={s}
                      name={s <= 4 ? 'star' : 'star-border'}
                      size={36}
                      color={s <= 4 ? '#F59E0B' : c.border}
                    />
                  ))}
                </ThemedView>
                <Text style={[styles.starHint, { color: '#F59E0B' }]}>
                  Very Good 😊
                </Text>
              </ThemedView>

              {/* Review title */}
              <ThemedView style={styles.formField}>
                <Text style={[styles.formLabel, { color: c.textSecondary }]}>
                  Title
                </Text>
                <TextInput
                  placeholder='Summarize your experience'
                  placeholderTextColor={c.textSecondary}
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: c.backgroundSecondary,
                      borderColor: c.border,
                      color: c.text,
                    },
                  ]}
                />
              </ThemedView>

              {/* Review body */}
              <ThemedView style={styles.formField}>
                <Text style={[styles.formLabel, { color: c.textSecondary }]}>
                  Review
                </Text>
                <TextInput
                  placeholder='What did you like or dislike?'
                  placeholderTextColor={c.textSecondary}
                  multiline
                  numberOfLines={4}
                  style={[
                    styles.formTextArea,
                    {
                      backgroundColor: c.backgroundSecondary,
                      borderColor: c.border,
                      color: c.text,
                    },
                  ]}
                />
              </ThemedView>

              {/* Toggle — recommend */}
              <ThemedView style={[styles.toggleRow, { borderColor: c.border }]}>
                <ThemedView style={{ flex: 1 }}>
                  <Text style={[styles.toggleLabel, { color: c.text }]}>
                    Recommend this product
                  </Text>
                  <Text style={[styles.toggleSub, { color: c.textSecondary }]}>
                    Help other customers decide
                  </Text>
                </ThemedView>
                <Switch
                  value={analytics}
                  onValueChange={setAnalytics}
                  trackColor={{ false: c.border, true: c.colorPrimary + '66' }}
                  thumbColor={analytics ? c.colorPrimary : c.textSecondary}
                />
              </ThemedView>
            </ThemedView>
          </FormSheet>
        </ScreenContainer>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  header: { marginBottom: Spacing.xs },
  grid: { gap: Spacing.sm },

  // Trigger card
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

  // Feature box
  featureBox: {
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  featureTitle: {
    fontSize: Typography.size.sm,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  featureTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  featureTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  featureTagText: { fontSize: Typography.size.xs, fontWeight: '500' },

  // ─── Simple Sheet: Profile
  profileSheet: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.md,
  },
  profileAvatarWrap: { position: 'relative' },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Semantic.success,
    borderWidth: 2,
  },
  profileName: {
    fontSize: Typography.size.xl,
    fontWeight: '700',
    marginTop: -Spacing.xs,
  },
  profileRole: { fontSize: Typography.size.sm, textAlign: 'center' },
  statsRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: Radius.lg,
    width: '100%',
    overflow: 'hidden',
  },
  stat: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center' },
  statVal: { fontSize: Typography.size.lg, fontWeight: '700' },
  statLabel: { fontSize: Typography.size.xs, marginTop: 2 },
  skillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  skillTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  skillText: { fontSize: Typography.size.xs, fontWeight: '600' },
  profileActions: { flexDirection: 'row', gap: Spacing.sm, width: '100%' },

  // ─── Scrollable Sheet: Products
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  searchPlaceholder: { fontSize: Typography.size.md },
  catScroll: { marginBottom: Spacing.sm },
  catChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    marginRight: Spacing.sm,
    borderWidth: 1,
  },
  catChipText: { fontSize: Typography.size.sm, fontWeight: '600' },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  productIcon: {
    width: 46,
    height: 46,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productName: { fontSize: Typography.size.md, fontWeight: '600' },
  productPrice: { fontSize: Typography.size.sm, marginTop: 2 },
  productBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  productBadgeText: { fontSize: 10, fontWeight: '700' },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ─── Form Sheet: Review
  formSheet: { paddingHorizontal: Spacing.md, gap: Spacing.md },
  reviewProduct: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  reviewIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewProductName: { fontSize: Typography.size.md, fontWeight: '600' },
  reviewProductSub: { fontSize: Typography.size.xs, marginTop: 2 },
  starSection: { alignItems: 'center', gap: 6, paddingVertical: Spacing.sm },
  starLabel: { fontSize: Typography.size.sm },
  starRow: { flexDirection: 'row', gap: 2 },
  starHint: { fontSize: Typography.size.sm, fontWeight: '600' },
  formField: { gap: 6 },
  formLabel: { fontSize: Typography.size.sm, fontWeight: '500' },
  formInput: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    fontSize: Typography.size.md,
  },
  formTextArea: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    fontSize: Typography.size.md,
    minHeight: 90,
    textAlignVertical: 'top',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
  },
  toggleLabel: { fontSize: Typography.size.md, fontWeight: '500' },
  toggleSub: { fontSize: Typography.size.xs, marginTop: 2 },
})
