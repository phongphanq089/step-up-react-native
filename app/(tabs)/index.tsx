import ParallaxScrollView from '@/components/parallax-scroll-view'
import { LinkUi, Section } from '@/components/ui'
import { VStack } from '@/components/ui/stack'
import { Colors } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'
import AntDesign from '@expo/vector-icons/AntDesign'
import { Image } from 'expo-image'
import { StyleSheet } from 'react-native'

export default function HomeScreen() {
  const { theme } = useTheme()

  const c = Colors[theme]
  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: Colors.light.headerBackground,
        dark: Colors.dark.headerBackground,
      }}
      headerImage={
        <Image
          source={require('@/assets/images/og-image.jpg')}
          style={styles.reactLogo}
          contentFit='cover'
        />
      }
    >
      <VStack spacing={10}>
        <Section
          theme={theme}
          c={Colors[theme]}
          useGradient={true}
          gradientColors={c.gradients.primary}
        >
          <LinkUi
            href='/explore'
            iconPosition='right'
            bg='transparent'
            icon={
              <AntDesign
                name='arrow-right'
                size={18}
                color={c.colorSecondary}
              />
            }
          >
            Theme Colors
          </LinkUi>
        </Section>
        <Section
          theme={theme}
          c={Colors[theme]}
          useGradient={true}
          gradientColors={c.gradients.primary}
        >
          <LinkUi
            href='/ui/button'
            iconPosition='right'
            bg='transparent'
            icon={
              <AntDesign
                name='arrow-right'
                size={18}
                color={c.colorSecondary}
              />
            }
          >
            Button
          </LinkUi>
        </Section>
      </VStack>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
})
