import { ScreenContainer } from '@/components/layout/screen-container'
import { Carousel, ThemedText, ThemedView, VStack } from '@/components/ui'
import { Brand, Colors, Spacing } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Dimensions, StyleSheet, Text, View } from 'react-native'

const { width } = Dimensions.get('window')
const CAROUSEL_WIDTH = width - Spacing.md * 2

// ─── Sample Data ─────────────────────────────────────────────────────────────

const bannerData = [
  {
    id: '1',
    title: 'Summer Sale',
    subtitle: 'Up to 60% off on selected items',
    gradient: ['#FF6B6B', '#FF8E53'] as [string, string],
    emoji: '🌊',
  },
  {
    id: '2',
    title: 'New Arrivals',
    subtitle: 'Check out the latest collections',
    gradient: ['#4776E6', '#8E54E9'] as [string, string],
    emoji: '✨',
  },
  {
    id: '3',
    title: 'Members Only',
    subtitle: 'Exclusive deals just for you',
    gradient: ['#11998e', '#38ef7d'] as [string, string],
    emoji: '👑',
  },
  {
    id: '4',
    title: 'Travel Deals',
    subtitle: 'Explore the world at a lower price',
    gradient: ['#F7971E', '#FFD200'] as [string, string],
    emoji: '✈️',
  },
]

const cardData = [
  {
    id: '1',
    name: 'Mountain Peak',
    location: 'Nepal',
    rating: '4.9',
    color: '#5C6265',
    accent: '#B3C680',
  },
  {
    id: '2',
    name: 'Ocean Sunset',
    location: 'Maldives',
    rating: '4.8',
    color: '#B0604D',
    accent: '#F5D399',
  },
  {
    id: '3',
    name: 'City Lights',
    location: 'Tokyo',
    rating: '4.7',
    color: '#1a1a2e',
    accent: '#e94560',
  },
  {
    id: '4',
    name: 'Desert Dunes',
    location: 'Morocco',
    rating: '4.6',
    color: '#c79a6e',
    accent: '#e8c99a',
  },
]

const testimonialData = [
  {
    id: '1',
    name: 'Sarah M.',
    role: 'Product Designer',
    text: '"Absolutely amazing experience. Highly recommend to everyone who wants quality!"',
    avatar: '🧑‍🎨',
  },
  {
    id: '2',
    name: 'James K.',
    role: 'Software Engineer',
    text: '"Outstanding quality and fast delivery. Will definitely order again!"',
    avatar: '👨‍💻',
  },
  {
    id: '3',
    name: 'Priya S.',
    role: 'UI/UX Lead',
    text: '"The best investment I made this year. The design is just breathtaking."',
    avatar: '👩‍💼',
  },
]

export default function CarouselUI() {
  // ─── Banner render item ─────────────────────────────────────────────────────
  const renderBanner = ({
    item,
  }: {
    item: (typeof bannerData)[0]
    index: number
    isActive: boolean
  }) => (
    <LinearGradient
      colors={item.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.bannerCard}
    >
      <Text style={styles.emoji}>{item.emoji}</Text>
      <View>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
      </View>
    </LinearGradient>
  )

  // ─── Travel card render item ────────────────────────────────────────────────
  const renderTravelCard = ({
    item,
    isActive,
  }: {
    item: (typeof cardData)[0]
    index: number
    isActive: boolean
  }) => (
    <View style={[styles.travelCard, { backgroundColor: item.color }]}>
      <View
        style={[styles.travelAccentDot, { backgroundColor: item.accent }]}
      />
      <View style={styles.travelBottom}>
        <Text style={styles.travelRating}>⭐ {item.rating}</Text>
        <Text style={styles.travelName}>{item.name}</Text>
        <Text style={styles.travelLocation}>📍 {item.location}</Text>
      </View>
    </View>
  )

  // ─── Testimonial render item ────────────────────────────────────────────────
  const renderTestimonial = ({
    item,
  }: {
    item: (typeof testimonialData)[0]
    index: number
    isActive: boolean
  }) => (
    <View style={styles.testimonialCard}>
      <Text style={styles.testimonialQuoteMark}>"</Text>
      <Text style={styles.testimonialText}>{item.text}</Text>
      <View style={styles.testimonialAuthor}>
        <View style={styles.testimonialAvatar}>
          <Text style={{ fontSize: 22 }}>{item.avatar}</Text>
        </View>
        <View>
          <Text style={styles.testimonialName}>{item.name}</Text>
          <Text style={styles.testimonialRole}>{item.role}</Text>
        </View>
      </View>
    </View>
  )

  // ─── Fade render item ───────────────────────────────────────────────────────
  const renderFadeItem = ({
    item,
    isActive,
  }: {
    item: (typeof bannerData)[0]
    index: number
    isActive: boolean
  }) => (
    <LinearGradient
      colors={item.gradient}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={[styles.fadeCard]}
    >
      <Text style={[styles.emoji, { fontSize: 56 }]}>{item.emoji}</Text>
      <Text style={styles.bannerTitle}>{item.title}</Text>
      <Text
        style={[
          styles.bannerSubtitle,
          { textAlign: 'center', paddingHorizontal: 24 },
        ]}
      >
        {item.subtitle}
      </Text>
    </LinearGradient>
  )

  const { theme } = useTheme() as { theme: 'light' | 'dark' }
  const c = Colors[theme]

  return (
    <ScreenContainer scrollable>
      <VStack spacing={30}>
        {/* 1. Default — Banner with Line Pagination */}
        <ThemedView>
          <ThemedText style={{ marginBottom: 12 }}>
            Basic snap scroll · line pagination
          </ThemedText>
          <Carousel
            data={bannerData}
            renderItem={renderBanner}
            width={CAROUSEL_WIDTH}
            height={180}
            variant='default'
            pagination='line'
            autoPlay={3500}
            loop
          />
        </ThemedView>

        {/* 2. Parallax — Travel Cards */}
        <ThemedView>
          <ThemedText style={{ marginBottom: 12 }}>
            Depth scaling · peek at adjacent cards
          </ThemedText>
          <Carousel
            data={cardData}
            renderItem={renderTravelCard}
            width={CAROUSEL_WIDTH}
            height={440}
            variant='parallax'
            pagination='dots'
            peekSize={40}
            gap={0}
            autoPlay={4000}
            loop
          />
        </ThemedView>

        {/* 3. Multi-item — 2 items visible at once */}
        <ThemedView>
          <ThemedText
            type='defaultSemiBold'
            style={{ marginBottom: 4, fontSize: 17 }}
          >
            2 Items Visible
          </ThemedText>
          <ThemedText style={{ marginBottom: 12, opacity: 0.6 }}>
            itemsToShow=2 · gap=12
          </ThemedText>
          <Carousel
            data={cardData}
            renderItem={renderTravelCard}
            width={CAROUSEL_WIDTH}
            height={350}
            variant='default'
            pagination='dots'
            itemsToShow={2}
            gap={12}
          />
        </ThemedView>

        {/* 4. Multi-item peek — 1.5 visible, adjacent half-visible */}
        <ThemedView>
          <ThemedText
            type='defaultSemiBold'
            style={{ marginBottom: 4, fontSize: 17 }}
          >
            1.5 Items (Peek Mode)
          </ThemedText>
          <ThemedText style={{ marginBottom: 12, opacity: 0.6 }}>
            itemsToShow=1.5 · adjacent card always visible
          </ThemedText>
          <Carousel
            data={bannerData}
            renderItem={renderBanner}
            width={CAROUSEL_WIDTH}
            height={280}
            variant='default'
            pagination='none'
            itemsToShow={1.5}
            gap={12}
            autoPlay={3000}
            loop
          />
        </ThemedView>

        {/* 5. Fade — Slide fade transition */}
        <ThemedView>
          <ThemedText style={{ marginBottom: 12 }}>
            Smooth cross-fade between slides · auto play
          </ThemedText>
          <Carousel
            data={bannerData}
            renderItem={renderFadeItem}
            width={CAROUSEL_WIDTH}
            height={220}
            variant='fade'
            pagination='number'
            autoPlay={3000}
          />
        </ThemedView>

        {/* 4. Card Stack */}
        <ThemedView>
          <ThemedText style={{ marginBottom: 12 }}>
            Cards stacked with depth · tap to advance
          </ThemedText>
          <Carousel
            data={cardData}
            renderItem={renderTravelCard}
            width={CAROUSEL_WIDTH}
            height={230}
            variant='card-stack'
            pagination='dots'
            autoPlay={4000}
          />
        </ThemedView>

        {/* 5. Vertical */}
        <ThemedView style={{ marginBottom: 40 }}>
          <ThemedText style={{ marginBottom: 12 }}>
            Vertical snap scroll · great for stories/feeds
          </ThemedText>
          <Carousel
            data={testimonialData}
            renderItem={renderTestimonial}
            width={CAROUSEL_WIDTH}
            height={180}
            variant='vertical'
            pagination='dots'
            autoPlay={4500}
          />
        </ThemedView>
      </VStack>
    </ScreenContainer>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Banner
  bannerCard: {
    flex: 1,
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  emoji: { fontSize: 44 },
  bannerTitle: { color: '#FFF', fontSize: 20, fontWeight: '800' },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: 4,
  },

  // Travel card
  travelCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  travelAccentDot: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    top: 16,
    right: 16,
    opacity: 0.5,
  },
  travelBottom: { marginTop: 'auto' },
  travelRating: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginBottom: 4,
  },
  travelName: { color: '#FFF', fontSize: 22, fontWeight: '800' },
  travelLocation: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 2,
  },

  // Fade card
  fadeCard: {
    flex: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  // Testimonial
  testimonialCard: {
    flex: 1,
    backgroundColor: '#1c1c2e',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
  },
  testimonialQuoteMark: {
    fontSize: 50,
    color: Brand.primary,
    lineHeight: 50,
    height: 44,
  },
  testimonialText: {
    color: '#ddd',
    fontSize: 14,
    lineHeight: 22,
    marginVertical: 8,
  },
  testimonialAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  testimonialAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  testimonialName: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  testimonialRole: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
})
