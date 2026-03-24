import { HapticTab } from '@/components/haptic-tab'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { Colors } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'
import { useSidebar } from '@/context/sidebar-context'
import { MaterialIcons } from '@expo/vector-icons'
import { Tabs, useRouter } from 'expo-router'
import React from 'react'
import { Pressable, View } from 'react-native'

export default function TabLayout() {
  const { theme, toggleTheme } = useTheme()
  const { open: openSidebar } = useSidebar()
  const router = useRouter()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[theme].tabIconSelected,
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors[theme].headerBackground,
        },
        headerShadowVisible: false,
        headerTintColor: Colors[theme].headerText,
        tabBarButton: HapticTab,
        headerLeft: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Pressable
              onPress={openSidebar}
              style={{ marginLeft: 15 }}
              hitSlop={10}
            >
              <MaterialIcons
                name='menu'
                size={24}
                color={Colors[theme].headerText}
              />
            </Pressable>
            <Pressable
              onPress={() => router.back()}
              style={{ marginLeft: 15 }}
              hitSlop={10}
            >
              <MaterialIcons
                name='arrow-back'
                size={24}
                color={Colors[theme].headerText}
              />
            </Pressable>
          </View>
        ),
        headerRight: () => (
          <Pressable onPress={toggleTheme} style={{ marginRight: 15 }}>
            <MaterialIcons
              name={theme === 'dark' ? 'light-mode' : 'dark-mode'}
              size={24}
              color={Colors[theme].headerText}
            />
          </Pressable>
        ),
        tabBarStyle: {
          backgroundColor: Colors[theme].tabBackground,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
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
        name='explore'
        options={{
          title: 'UI Themes',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name='paintpalette.fill' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='about'
        options={{
          title: 'About',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name='person.crop.circle.fill'
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='form-demo'
        options={{
          title: 'Form Demo',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name='doc.text.fill' color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
