import React, { useRef } from 'react'
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Brand, Colors, Spacing, Typography } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'

interface TabItem {
  key: string
  label: string
}

type TabVariant = 'underline' | 'pill' | 'box'

interface TabsProps {
  tabs: TabItem[]
  activeKey: string
  onChange: (key: string) => void
  variant?: TabVariant
  scrollable?: boolean
}

export function Tabs({ tabs, activeKey, onChange, variant = 'underline', scrollable = false }: TabsProps) {
  const { theme } = useTheme()
  const c = Colors[theme]

  const TabButton = ({ tab }: { tab: TabItem }) => {
    const isActive = tab.key === activeKey
    const scale = useRef(new Animated.Value(1)).current

    const handlePress = () => {
      Animated.sequence([
        Animated.timing(scale, { toValue: 0.95, duration: 60, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 60, useNativeDriver: true }),
      ]).start()
      onChange(tab.key)
    }

    if (variant === 'underline') {
      return (
        <Pressable onPress={handlePress} style={styles.underlineTab}>
          <Animated.View style={{ transform: [{ scale }] }}>
            <Text style={[styles.tabLabel, { color: isActive ? Brand.primary : c.textSecondary }]}>
              {tab.label}
            </Text>
          </Animated.View>
          {isActive && <View style={[styles.underlineIndicator, { backgroundColor: Brand.primary }]} />}
        </Pressable>
      )
    }

    if (variant === 'pill') {
      return (
        <Pressable
          onPress={handlePress}
          style={[
            styles.pillTab,
            isActive && { backgroundColor: Brand.primary },
          ]}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <Text style={[styles.tabLabel, { color: isActive ? '#fff' : c.textSecondary }]}>
              {tab.label}
            </Text>
          </Animated.View>
        </Pressable>
      )
    }

    // box
    return (
      <Pressable
        onPress={handlePress}
        style={[
          styles.boxTab,
          {
            backgroundColor: isActive ? c.surface : 'transparent',
            borderColor: c.border,
          },
        ]}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Text style={[styles.tabLabel, { color: isActive ? c.text : c.textSecondary }]}>
            {tab.label}
          </Text>
        </Animated.View>
      </Pressable>
    )
  }

  const wrapperStyle =
    variant === 'underline'
      ? [styles.underlineWrapper, { borderBottomColor: c.border }]
      : variant === 'pill'
      ? [styles.pillWrapper, { backgroundColor: c.backgroundSecondary }]
      : [styles.boxWrapper, { borderColor: c.border }]

  const content = (
    <View style={wrapperStyle as any}>
      {tabs.map((tab) => (
        <TabButton key={tab.key} tab={tab} />
      ))}
    </View>
  )

  if (scrollable) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {content}
      </ScrollView>
    )
  }

  return content
}

const styles = StyleSheet.create({
  tabLabel: { fontSize: Typography.size.sm, fontWeight: '600' },

  // underline variant
  underlineWrapper: { flexDirection: 'row', borderBottomWidth: 1 },
  underlineTab: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm, alignItems: 'center' },
  underlineIndicator: { height: 2, width: '100%', borderRadius: 2, marginTop: 4 },

  // pill variant
  pillWrapper: {
    flexDirection: 'row', padding: 4,
    borderRadius: 999, alignSelf: 'flex-start',
  },
  pillTab: {
    paddingHorizontal: Spacing.md, paddingVertical: 8,
    borderRadius: 999,
  },

  // box variant
  boxWrapper: {
    flexDirection: 'row', borderWidth: 1,
    borderRadius: 8, overflow: 'hidden', alignSelf: 'flex-start',
  },
  boxTab: {
    paddingHorizontal: Spacing.md, paddingVertical: 8,
    borderRightWidth: 1,
  },
})
