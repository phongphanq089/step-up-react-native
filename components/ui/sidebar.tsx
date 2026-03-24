import { Colors, Shadows, Spacing, Typography } from '@/constants/theme'
import { useSidebar } from '@/context/sidebar-context'
import { useTheme } from '@/context/theme-context'
import { MaterialIcons } from '@expo/vector-icons'
import { usePathname, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useRef } from 'react'
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ThemedText } from '../themed-text'

const SIDEBAR_WIDTH = 280
const { width: SCREEN_WIDTH } = Dimensions.get('window')

export interface SidebarItem {
  key: string
  label: string
  icon?: keyof typeof MaterialIcons.glyphMap
  badge?: number | string
  onPress?: () => void
  route?: string
}

export interface SidebarSection {
  title?: string
  items: SidebarItem[]
}

export const DEFAULT_SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: 'MAIN',
    items: [
      { key: 'home', label: 'Dashboard', icon: 'dashboard', route: '/(tabs)' },
      {
        key: 'explore',
        label: 'UI Library',
        icon: 'color-lens',
        route: '/(tabs)/explore',
      },
      { key: 'reports', label: 'Reports', icon: 'bar-chart' },
    ],
  },
  {
    title: 'SETTINGS',
    items: [
      { key: 'profile', label: 'Profile', icon: 'person' },
      { key: 'settings', label: 'Settings', icon: 'settings' },
    ],
  },
]

interface SidebarProps {
  visible?: boolean
  onClose?: () => void
  sections?: SidebarSection[]
  activeKey?: string
  header?: React.ReactNode
  footer?: React.ReactNode
}

export function Sidebar({
  visible: propsVisible,
  onClose: propsOnClose,
  sections = DEFAULT_SIDEBAR_SECTIONS,
  activeKey: propsActiveKey,
  header,
  footer,
}: SidebarProps) {
  const { theme } = useTheme()
  const { isOpen, close } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()

  const visible = propsVisible !== undefined ? propsVisible : isOpen
  const onClose = propsOnClose || close

  // Determine active key from pathname if not provided
  const activeKey =
    propsActiveKey || (pathname === '/' ? 'home' : pathname.split('/').pop())

  const c = Colors[theme]
  const insets = useSafeAreaInsets()
  const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current
  const backdropOpacity = useRef(new Animated.Value(0)).current

  const openSidebar = useCallback(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
        speed: 20,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start()
  }, [translateX, backdropOpacity])

  const closeSidebar = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -SIDEBAR_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onClose())
  }, [translateX, backdropOpacity, onClose])

  useEffect(() => {
    if (visible) openSidebar()
    else {
      translateX.setValue(-SIDEBAR_WIDTH)
      backdropOpacity.setValue(0)
    }
  }, [visible])

  if (!visible) return null

  const defaultHeader = (
    <View style={{ marginBottom: Spacing.sm }}>
      <ThemedText type='defaultSemiBold' style={{ fontSize: 20 }}>
        ⚡ Step Up
      </ThemedText>
      <ThemedText style={{ fontSize: 12, color: c.textSecondary }}>
        v1.0.0 · Component Library
      </ThemedText>
    </View>
  )

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents='box-none'>
      {/* Backdrop */}
      <Animated.View
        style={[
          styles.backdrop,
          { backgroundColor: c.backdrop, opacity: backdropOpacity },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={closeSidebar} />
      </Animated.View>

      {/* Sidebar panel */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            backgroundColor: c.surface,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            transform: [{ translateX }],
          },
          Shadows.lg,
        ]}
      >
        {/* Header */}
        <View style={styles.sidebarHeader}>{header || defaultHeader}</View>

        {/* Close button */}
        <Pressable
          onPress={closeSidebar}
          style={[
            styles.closeBtn,
            { right: Spacing.md, top: insets.top + Spacing.sm },
          ]}
        >
          <MaterialIcons name='close' size={22} color={c.textSecondary} />
        </Pressable>

        {/* Content */}
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {sections.map((section, si) => (
            <View key={si}>
              {si > 0 && (
                <View
                  style={[styles.sectionDivider, { backgroundColor: c.border }]}
                />
              )}
              {section.title && (
                <Text style={[styles.sectionTitle, { color: c.textSecondary }]}>
                  {section.title}
                </Text>
              )}
              {section.items.map((item) => {
                const isActive = item.key === activeKey
                return (
                  <Pressable
                    key={item.key}
                    onPress={() => {
                      if (item.route) {
                        router.push(item.route as any)
                      }
                      item.onPress?.()
                      closeSidebar()
                    }}
                    style={[
                      styles.navItem,
                      isActive && { backgroundColor: c.infoBg },
                    ]}
                  >
                    {item.icon && (
                      <MaterialIcons
                        name={item.icon}
                        size={22}
                        color={isActive ? c.tint : c.icon}
                        style={styles.navIcon}
                      />
                    )}
                    <Text
                      style={[
                        styles.navLabel,
                        { color: isActive ? c.tint : c.text, flex: 1 },
                      ]}
                    >
                      {item.label}
                    </Text>
                    {item.badge !== undefined && (
                      <View style={[styles.badge, { backgroundColor: c.tint }]}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                      </View>
                    )}
                  </Pressable>
                )
              })}
            </View>
          ))}
        </ScrollView>

        {/* Footer */}
        {footer && (
          <View style={[styles.sidebarFooter, { borderTopColor: c.border }]}>
            {footer}
          </View>
        )}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
  },
  closeBtn: { position: 'absolute', zIndex: 10, padding: 4 },
  sidebarHeader: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  scroll: { flex: 1, paddingTop: Spacing.sm },
  sectionDivider: { height: 1, marginVertical: Spacing.sm },
  sectionTitle: {
    fontSize: Typography.size.xs,
    fontWeight: '700',
    letterSpacing: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    marginHorizontal: Spacing.sm,
    borderRadius: 10,
    marginBottom: 2,
  },
  navIcon: { marginRight: Spacing.sm },
  navLabel: { fontSize: Typography.size.md },
  badge: {
    borderRadius: 999,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  sidebarFooter: {
    borderTopWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
})
