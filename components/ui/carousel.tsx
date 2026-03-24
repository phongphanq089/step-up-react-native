import React, { useCallback, useRef } from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native'
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { Colors, Radius, Spacing, Typography } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const ITEM_WIDTH = SCREEN_WIDTH * 0.85
const ITEM_SPACING = (SCREEN_WIDTH - ITEM_WIDTH) / 2

export interface CarouselItem {
  id: string
  title: string
  subtitle?: string
  image?: string
  color?: string
}

interface CarouselProps {
  data: CarouselItem[]
  autoPlay?: boolean
  height?: number
}

/**
 * Carousel Component Premium
 * Dùng Reanimated + FlatList để tối ưu hiệu năng và animation mượt mà.
 */
export function Carousel({ data, height = 200 }: CarouselProps) {
  const { theme } = useTheme()
  const c = Colors[theme]
  const scrollX = useSharedValue(0)

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x
    },
  })

  const renderItem = ({ item, index }: { item: CarouselItem; index: number }) => {
    return (
      <CarouselCard
        item={item}
        index={index}
        scrollX={scrollX}
        height={height}
        c={c}
      />
    )
  }

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={data}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate='fast'
        contentContainerStyle={{
          paddingHorizontal: ITEM_SPACING,
        }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
      />
      
      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {data.map((_, index) => (
          <PaginationDot key={index} index={index} scrollX={scrollX} c={c} />
        ))}
      </View>
    </View>
  )
}

function CarouselCard({ item, index, scrollX, height, c }: any) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ]

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.9, 1, 0.9],
      'clamp'
    )

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.6, 1, 0.6],
      'clamp'
    )

    return {
      transform: [{ scale }],
      opacity,
    }
  })

  return (
    <Animated.View style={[styles.cardContainer, { width: ITEM_WIDTH, height }, animatedStyle]}>
      <View style={[styles.card, { backgroundColor: item.color || c.surface, borderColor: c.border }]}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} resizeMode='cover' />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: c.backgroundSecondary }]} />
        )}
        
        <View style={styles.content}>
          <Text style={[styles.title, { color: '#fff' }]} numberOfLines={1}>{item.title}</Text>
          {item.subtitle && (
            <Text style={[styles.subtitle, { color: 'rgba(255,255,255,0.8)' }]} numberOfLines={2}>
              {item.subtitle}
            </Text>
          )}
        </View>
        
        {/* Overlay for readability if image exists */}
        {item.image && <View style={styles.overlay} />}
      </View>
    </Animated.View>
  )
}

function PaginationDot({ index, scrollX, c }: any) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ]

    const width = interpolate(
      scrollX.value,
      inputRange,
      [8, 20, 8],
      'clamp'
    )

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.4, 1, 0.4],
      'clamp'
    )

    return {
      width,
      opacity,
    }
  })

  return (
    <Animated.View 
      style={[
        styles.dot, 
        { backgroundColor: c.tint }, 
        animatedStyle
      ]} 
    />
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
  },
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '95%',
    height: '100%',
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  imagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    zIndex: 10,
  },
  title: {
    fontSize: Typography.size.lg,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Typography.size.sm,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
})
