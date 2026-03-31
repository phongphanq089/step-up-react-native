import ParallaxScrollView from '@/components/layout/parallax-scroll-view'
import { LinkUi, Section } from '@/components/ui'
import { VStack } from '@/components/ui/stack'
import { Colors } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'
import AntDesign from '@expo/vector-icons/AntDesign'
import { Image } from 'expo-image'

const ListUi = [
  {
    name: 'Theme Base',
    href: '/ui/theme-base',
  },
  {
    name: 'Button',
    href: '/ui/button',
  },
  {
    name: 'Card',
    href: '/ui/card',
  },
  {
    name: 'Input',
    href: '/ui/input',
  },
  {
    name: 'Badge & Chip',
    href: '/ui/badge-chip',
  },
  {
    name: 'Progress Bar',
    href: '/ui/progress-bar',
  },
  {
    name: 'Modal',
    href: '/ui/modal',
  },
  {
    name: 'Sheet',
    href: '/ui/sheet',
  },
  {
    name: 'Toast',
    href: '/ui/toast',
  },
  {
    name: 'Tab',
    href: '/ui/tab',
  },
  {
    name: 'Select',
    href: '/ui/select',
  },
  {
    name: 'Carousel',
    href: '/ui/carousel',
  },
] as const

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
          style={{
            height: '100%',
            width: '100%',
            bottom: 0,
            left: 0,
            position: 'absolute',
          }}
          contentFit='cover'
        />
      }
    >
      <VStack spacing={10}>
        {ListUi.map((item) => (
          <Section
            key={item.href}
            theme={theme}
            c={Colors[theme]}
            useGradient={true}
            gradientColors={c.gradients.primary}
          >
            <LinkUi
              href={item.href}
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
              {item.name}
            </LinkUi>
          </Section>
        ))}
      </VStack>
    </ParallaxScrollView>
  )
}
