import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'

import { Sidebar } from '@/components/ui/sidebar'
import { ToastProvider } from '@/components/ui/toast'
import { SidebarProvider } from '@/context/sidebar-context'
import { ThemeProvider, useTheme } from '@/context/theme-context'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

SplashScreen.preventAutoHideAsync()

export const unstable_settings = {
  anchor: '(tabs)',
}

function AppContent() {
  const { theme } = useTheme()

  const [loaded, error] = useFonts({
    'Roboto-Black': require('../assets/fonts/Roboto-Black.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
    'Roboto-ExtraBold': require('../assets/fonts/Roboto-ExtraBold.ttf'),
    'Roboto-Italic': require('../assets/fonts/Roboto-Italic.ttf'),
    'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf'),
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'Roboto-SemiBold': require('../assets/fonts/Roboto-SemiBold.ttf'),
  })

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  if (!loaded && !error) {
    return null
  }

  return (
    <NavProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen
          name='modal'
          options={{ presentation: 'modal', title: 'Modal' }}
        />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Sidebar />
    </NavProvider>
  )
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <ThemeProvider>
        <SidebarProvider>
          <BottomSheetModalProvider>
            <ToastProvider>
              <AppContent />
            </ToastProvider>
          </BottomSheetModalProvider>
        </SidebarProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}
