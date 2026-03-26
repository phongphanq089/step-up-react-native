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
      }}
    >
      <Stack.Screen name='button' options={{ title: 'Button Component' }} />
    </Stack>
  )
}
