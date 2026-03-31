import { MaterialIcons } from '@expo/vector-icons'
import React, { useRef } from 'react'
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Brand, Colors, Radius, Spacing, Typography } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'

// ─── Types ────────────────────────────────────────────────────────────────────
export interface TabItem {
  key: string
  label: string
  icon?: keyof typeof MaterialIcons.glyphMap
  badge?: number
  disabled?: boolean
}

export type TabVariant = 'underline' | 'pill' | 'box' | 'segment' | 'card'

export interface TabsProps {
  tabs: TabItem[]
  activeKey: string
  onChange: (key: string) => void
  variant?: TabVariant
  scrollable?: boolean
  fullWidth?: boolean
}

// ─── TabButton ────────────────────────────────────────────────────────────────
function TabButton({
  tab,
  isActive,
  variant,
  onPress,
  fullWidth,
}: {
  tab: TabItem
  isActive: boolean
  variant: TabVariant
  onPress: () => void
  fullWidth?: boolean
}) {
  const { theme } = useTheme()
  const c = Colors[theme]
  const scale = useRef(new Animated.Value(1)).current

  const handlePress = () => {
    if (tab.disabled) return
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.93, duration: 70, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start()
    onPress()
  }

  const activeColor = Brand.primary
  const inactiveColor = c.textSecondary
  const disabledColor = c.textDisabled

  const labelColor = tab.disabled ? disabledColor : isActive ? activeColor : inactiveColor

  // ── Underline ──
  if (variant === 'underline') {
    return (
      <Pressable
        onPress={handlePress}
        style={[styles.underlineTab, fullWidth && styles.grow]}
        disabled={tab.disabled}
      >
        <Animated.View style={[styles.tabInner, { transform: [{ scale }] }]}>
          {tab.icon && (
            <MaterialIcons name={tab.icon} size={16} color={labelColor} style={styles.icon} />
          )}
          <Text style={[styles.tabLabel, { color: labelColor }]}>{tab.label}</Text>
          {(tab.badge ?? 0) > 0 && (
            <View style={[styles.badge, { backgroundColor: Brand.primary }]}>
              <Text style={styles.badgeText}>{tab.badge! > 99 ? '99+' : tab.badge}</Text>
            </View>
          )}
        </Animated.View>
        {isActive && (
          <View style={[styles.underlineIndicator, { backgroundColor: activeColor }]} />
        )}
      </Pressable>
    )
  }

  // ── Pill ──
  if (variant === 'pill') {
    return (
      <Pressable
        onPress={handlePress}
        style={[styles.pillTab, isActive && { backgroundColor: Brand.primary }, fullWidth && styles.grow]}
        disabled={tab.disabled}
      >
        <Animated.View style={[styles.tabInner, { transform: [{ scale }] }]}>
          {tab.icon && (
            <MaterialIcons
              name={tab.icon}
              size={15}
              color={tab.disabled ? disabledColor : isActive ? '#fff' : inactiveColor}
              style={styles.icon}
            />
          )}
          <Text style={[styles.tabLabel, { color: tab.disabled ? disabledColor : isActive ? '#fff' : inactiveColor }]}>
            {tab.label}
          </Text>
          {(tab.badge ?? 0) > 0 && (
            <View style={[styles.badge, { backgroundColor: isActive ? 'rgba(255,255,255,0.4)' : Brand.primary }]}>
              <Text style={styles.badgeText}>{tab.badge! > 99 ? '99+' : tab.badge}</Text>
            </View>
          )}
        </Animated.View>
      </Pressable>
    )
  }

  // ── Box ──
  if (variant === 'box') {
    return (
      <Pressable
        onPress={handlePress}
        style={[
          styles.boxTab,
          fullWidth && styles.grow,
          { backgroundColor: isActive ? c.surface : 'transparent', borderColor: c.border },
        ]}
        disabled={tab.disabled}
      >
        <Animated.View style={[styles.tabInner, { transform: [{ scale }] }]}>
          {tab.icon && (
            <MaterialIcons name={tab.icon} size={15} color={labelColor} style={styles.icon} />
          )}
          <Text style={[styles.tabLabel, { color: labelColor }]}>{tab.label}</Text>
          {(tab.badge ?? 0) > 0 && (
            <View style={[styles.badge, { backgroundColor: Brand.primary }]}>
              <Text style={styles.badgeText}>{tab.badge! > 99 ? '99+' : tab.badge}</Text>
            </View>
          )}
        </Animated.View>
      </Pressable>
    )
  }

  // ── Segment ──
  if (variant === 'segment') {
    return (
      <Pressable
        onPress={handlePress}
        style={[styles.segmentTab, fullWidth && styles.grow]}
        disabled={tab.disabled}
      >
        <Animated.View
          style={[
            styles.segmentTabInner,
            isActive && { backgroundColor: c.surface },
            { transform: [{ scale }] },
          ]}
        >
          {tab.icon && (
            <MaterialIcons name={tab.icon} size={15} color={labelColor} style={styles.icon} />
          )}
          <Text style={[styles.tabLabel, { color: labelColor }]}>{tab.label}</Text>
        </Animated.View>
      </Pressable>
    )
  }

  // ── Card ──
  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.cardTab,
        isActive && {
          backgroundColor: Brand.primary,
          borderColor: Brand.primary,
        },
        !isActive && { borderColor: c.border, backgroundColor: 'transparent' },
        fullWidth && styles.grow,
      ]}
      disabled={tab.disabled}
    >
      <Animated.View style={[styles.cardTabInner, { transform: [{ scale }] }]}>
        {tab.icon && (
          <MaterialIcons
            name={tab.icon}
            size={22}
            color={tab.disabled ? disabledColor : isActive ? '#fff' : activeColor}
          />
        )}
        <Text
          style={[
            styles.cardTabLabel,
            { color: tab.disabled ? disabledColor : isActive ? '#fff' : c.text },
          ]}
        >
          {tab.label}
        </Text>
        {(tab.badge ?? 0) > 0 && (
          <View
            style={[
              styles.badge,
              { backgroundColor: isActive ? 'rgba(255,255,255,0.35)' : Brand.primary },
            ]}
          >
            <Text style={styles.badgeText}>{tab.badge! > 99 ? '99+' : tab.badge}</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
export function Tabs({
  tabs,
  activeKey,
  onChange,
  variant = 'underline',
  scrollable = false,
  fullWidth = false,
}: TabsProps) {
  const { theme } = useTheme()
  const c = Colors[theme]

  const wrapperStyle = (() => {
    switch (variant) {
      case 'underline':
        return [styles.underlineWrapper, { borderBottomColor: c.border }]
      case 'pill':
        return [styles.pillWrapper, { backgroundColor: c.backgroundSecondary }]
      case 'box':
        return [styles.boxWrapper, { borderColor: c.border }]
      case 'segment':
        return [styles.segmentWrapper, { backgroundColor: c.backgroundSecondary, borderColor: c.border }]
      case 'card':
        return [styles.cardWrapper]
    }
  })()

  const content = (
    <View style={[wrapperStyle as any, fullWidth && variant !== 'card' && styles.fullWidth]}>
      {tabs.map((tab) => (
        <TabButton
          key={tab.key}
          tab={tab}
          isActive={tab.key === activeKey}
          variant={variant}
          onPress={() => onChange(tab.key)}
          fullWidth={fullWidth}
        />
      ))}
    </View>
  )

  if (scrollable) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {content}
      </ScrollView>
    )
  }

  return content
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  grow: { flex: 1 },
  fullWidth: { alignSelf: 'stretch' },
  scrollContent: { flexGrow: 0 },

  tabLabel: {
    fontSize: Typography.size.sm,
    fontWeight: '600',
  },
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: { marginRight: 4 },

  badge: {
    marginLeft: 5,
    minWidth: 16,
    height: 16,
    borderRadius: 99,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },

  // ── Underline ──
  underlineWrapper: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  underlineTab: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    paddingTop: Spacing.xs,
    alignItems: 'center',
  },
  underlineIndicator: {
    height: 2,
    borderRadius: 2,
    marginTop: 6,
    width: '100%',
  },

  // ── Pill ──
  pillWrapper: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    gap: 2,
  },
  pillTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radius.full,
  },

  // ── Box ──
  boxWrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: Radius.md,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  boxTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 9,
    borderRightWidth: 1,
  },

  // ── Segment (iOS-style) ──
  segmentWrapper: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignSelf: 'flex-start',
    gap: 2,
  },
  segmentTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentTabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },

  // ── Card ──
  cardWrapper: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  cardTab: {
    borderRadius: Radius.md,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minWidth: 80,
  },
  cardTabInner: {
    alignItems: 'center',
    gap: 4,
  },
  cardTabLabel: {
    fontSize: Typography.size.xs,
    fontWeight: '600',
    textAlign: 'center',
  },
})
