import { HapticTab } from '@/components/haptic-tab'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { Colors } from '@/constants/theme'
import { useSidebar } from '@/context/sidebar-context'
import { useTheme } from '@/context/theme-context'
import { MaterialIcons } from '@expo/vector-icons'
import { Tabs, useRouter } from 'expo-router'
import React from 'react'
import { Pressable, View } from 'react-native'

export default function TabLayout() {
  const { theme, toggleTheme } = useTheme()
  const { open: openSidebar } = useSidebar()
  const router = useRouter()

  const c = Colors[theme]

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: c.colorPrimary,
        headerShown: true,
        headerStyle: {
          backgroundColor: c.headerBackground,
        },
        headerShadowVisible: false,
        headerTintColor: c.headerText,
        tabBarButton: HapticTab,
        headerLeft: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Pressable
              onPress={openSidebar}
              style={{ marginLeft: 15 }}
              hitSlop={10}
            >
              <MaterialIcons name='menu' size={24} color={c.headerText} />
            </Pressable>
            {router.canGoBack() && (
              <Pressable
                onPress={() => (router.canGoBack() ? router.back() : {})}
                style={{ marginLeft: 15 }}
                hitSlop={10}
              >
                <MaterialIcons
                  name='arrow-back'
                  size={24}
                  color={c.headerText}
                />
              </Pressable>
            )}
          </View>
        ),
        headerRight: () => (
          <Pressable onPress={toggleTheme} style={{ marginRight: 15 }}>
            <MaterialIcons
              name={theme === 'dark' ? 'light-mode' : 'dark-mode'}
              size={24}
              color={c.headerText}
            />
          </Pressable>
        ),
        tabBarStyle: {
          backgroundColor: c.tabBackground,
          // height: Platform.OS === 'ios' ? 88 : 68,
          // borderTopLeftRadius: 20,
          // borderTopRightRadius: 20,
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name='house.fill' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='block-ui'
        options={{
          title: 'Block UI',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name='paintpalette.fill' color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='form-demo'
        options={{
          title: 'Forms',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name='doc.text.fill' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='ui'
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
          headerShown: false,
        }}
      />
    </Tabs>
  )
}
