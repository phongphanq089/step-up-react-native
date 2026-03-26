import { Colors } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'
import { MaterialIcons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import { Pressable, View } from 'react-native'

export default function UILayout() {
  const { theme } = useTheme()
  const router = useRouter()
  const c = Colors[theme]

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: c.headerBackground,
        },
        headerShadowVisible: false,
        headerTintColor: c.headerText,
        headerLeft: () => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 20,
            }}
          >
            <Pressable
              onPress={() => router.push('/')}
              style={{ marginLeft: 15 }}
              hitSlop={10}
            >
              <MaterialIcons name='arrow-back' size={24} color={c.headerText} />
            </Pressable>
          </View>
        ),
      }}
    >
      <Stack.Screen name='theme-base' options={{ title: 'Theme Base' }} />
      <Stack.Screen name='card' options={{ title: 'Card Component' }} />
      <Stack.Screen name='button' options={{ title: 'Button Component' }} />
    </Stack>
  )
}
