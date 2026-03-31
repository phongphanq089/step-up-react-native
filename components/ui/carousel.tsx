/**
 * Custom Carousel — built from scratch with React Native core APIs.
 * Uses ScrollView + Animated for smooth, native-thread friendly animations.
 * No third-party carousel library required.
 *
 * Supported modes:
 *  - default       : Basic horizontal snap scroll with dot pagination
 *  - parallax      : Items scale + translate to create depth perspective
 *  - fade          : Cross-fades between slides (ScrollView-based)
 *  - card-stack    : Cards peek behind the active card with scale/rotation
 *  - vertical      : Vertical snapping scroll
 */

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react'
import {
  Animated,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'

import { Brand, Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

// ─── Types ───────────────────────────────────────────────────────────────────

export type CarouselVariant = 'default' | 'parallax' | 'fade' | 'card-stack' | 'vertical'
export type PaginationVariant = 'dots' | 'line' | 'number' | 'none'

export interface CarouselItem {
  id: string | number
  [key: string]: any
}

export interface CarouselRef {
  scrollTo: (index: number, animated?: boolean) => void
  prev: () => void
  next: () => void
}

export interface CarouselProps<T extends CarouselItem> {
  data: T[]
  renderItem: (info: { item: T; index: number; isActive: boolean }) => React.ReactElement
  variant?: CarouselVariant
  /** Carousel width — defaults to screen width */
  width?: number
  /** Carousel height */
  height?: number
  /** Auto play interval in ms. 0 = disabled */
  autoPlay?: number
  /** Show pagination indicator */
  pagination?: PaginationVariant
  /** Gap between cards (default / vertical modes) */
  gap?: number
  /** Side padding so adjacent cards peek (single-item mode) */
  peekSize?: number
  /** How many items visible at once. Use 2 to show 2 full items, 1.5 to show 1.5, etc. */
  itemsToShow?: number
  containerStyle?: StyleProp<ViewStyle>
  onIndexChange?: (index: number) => void
  loop?: boolean
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clamp(val: number, min: number, max: number) {
  'worklet'
  return Math.max(min, Math.min(max, val))
}

// ─── Default / Parallax / Vertical Carousel ──────────────────────────────────

function ScrollCarousel<T extends CarouselItem>({
  data,
  renderItem,
  variant = 'default',
  width = SCREEN_WIDTH,
  height = 220,
  autoPlay = 0,
  pagination = 'dots',
  gap = 0,
  peekSize = 0,
  itemsToShow = 1,
  containerStyle,
  onIndexChange,
  loop = false,
}: CarouselProps<T> & { carouselRef?: React.Ref<CarouselRef> }) {
  const { theme } = useTheme()
  const c = Colors[theme]
  const isVertical = variant === 'vertical'

  // ── Build the list with clones at both ends when loop=true ─────────────────
  // Loop layout: [last_clone, ...real_items, first_clone]
  // We start scrolled to index=1 (real item 0) and silent-jump when hitting clones.
  const loopedData: T[] = loop
    ? [data[data.length - 1], ...data, data[0]]
    : data

  // The "real" first item lives at loopedIndex=1 when looping, at 0 otherwise
  const startIndex = loop ? 1 : 0

  // ── itemSize ───────────────────────────────────────────────────────────────
  const itemSize = isVertical
    ? height
    : itemsToShow > 1
      ? (width - gap * (Math.floor(itemsToShow) - 1) - peekSize * 2) / itemsToShow
      : width - peekSize * 2

  const snapInterval = itemSize + gap

  // ── Refs & state ───────────────────────────────────────────────────────────
  const scrollX = useRef(new Animated.Value(startIndex * snapInterval)).current
  const scrollRef = useRef<ScrollView>(null)
  // loopedIndex tracks position inside loopedData
  const loopedIndex = useRef(startIndex)
  // realIndex for UI (0-based, maps to original data)
  const [activeIndex, setActiveIndex] = useState(0)
  const isJumping = useRef(false)
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Scroll to looped position ───────────────────────────────────────────────
  const scrollToLooped = useCallback(
    (lIdx: number, animated = true) => {
      const offset = lIdx * snapInterval + (peekSize > 0 ? 0 : 0)
      scrollRef.current?.scrollTo(
        isVertical ? { y: offset, animated } : { x: offset, animated },
      )
    },
    [isVertical, snapInterval],
  )

  // ── Initialise scroll position on mount ────────────────────────────────────
  useEffect(() => {
    if (loop) {
      // Use a tiny delay so the ScrollView has laid out
      setTimeout(() => scrollToLooped(startIndex, false), 0)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Scroll event → detect clones & silent-jump ─────────────────────────────
  const handleScroll = Animated.event(
    [
      {
        nativeEvent: isVertical
          ? { contentOffset: { y: scrollX } }
          : { contentOffset: { x: scrollX } },
      },
    ],
    {
      useNativeDriver: true,
      listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (isJumping.current) return
        const offset = isVertical
          ? e.nativeEvent.contentOffset.y
          : e.nativeEvent.contentOffset.x
        const idx = Math.round(offset / snapInterval)
        loopedIndex.current = idx

        if (loop) {
          // Map looped index → real data index
          const realIdx = (idx - startIndex + data.length) % data.length
          setActiveIndex(realIdx)
          onIndexChange?.(realIdx)
        } else {
          setActiveIndex(idx)
          onIndexChange?.(idx)
        }
      },
    },
  )

  // ── Called when scroll momentum ends → check if we landed on a clone ───────
  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!loop) return
      const offset = isVertical
        ? e.nativeEvent.contentOffset.y
        : e.nativeEvent.contentOffset.x
      const idx = Math.round(offset / snapInterval)
      const lastLooped = loopedData.length - 1

      if (idx === 0) {
        // Landed on the leading clone (copy of last real item)
        // → silently jump to the real last item
        isJumping.current = true
        const realLastIdx = data.length // index in loopedData
        scrollToLooped(realLastIdx, false)
        loopedIndex.current = realLastIdx
        setTimeout(() => { isJumping.current = false }, 50)
      } else if (idx === lastLooped) {
        // Landed on the trailing clone (copy of first real item)
        // → silently jump to the real first item
        isJumping.current = true
        scrollToLooped(startIndex, false)
        loopedIndex.current = startIndex
        setTimeout(() => { isJumping.current = false }, 50)
      }
    },
    [loop, isVertical, snapInterval, loopedData.length, data.length, scrollToLooped, startIndex],
  )

  // ── Auto play ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!autoPlay) return
    autoPlayRef.current = setInterval(() => {
      if (loop) {
        const nextLooped = loopedIndex.current + 1
        loopedIndex.current = nextLooped
        const realIdx = (nextLooped - startIndex + data.length) % data.length
        setActiveIndex(realIdx)
        onIndexChange?.(realIdx)
        scrollToLooped(nextLooped, true)

        // Check if we just scrolled to the trailing clone → schedule silent-jump
        if (nextLooped === loopedData.length - 1) {
          setTimeout(() => {
            isJumping.current = true
            scrollToLooped(startIndex, false)
            loopedIndex.current = startIndex
            setTimeout(() => { isJumping.current = false }, 50)
          }, 400) // wait for animation to finish
        }
      } else {
        setActiveIndex((prev) => {
          const next = Math.min(prev + 1, data.length - 1)
          const offset = next * snapInterval
          scrollRef.current?.scrollTo(
            isVertical ? { y: offset, animated: true } : { x: offset, animated: true },
          )
          return next
        })
      }
    }, autoPlay)
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current) }
  }, [autoPlay, loop, data.length, loopedData.length, startIndex, snapInterval, isVertical, scrollToLooped, onIndexChange])

  // ── Pagination scrollTo (by real index) ────────────────────────────────────
  const scrollToReal = useCallback(
    (realIdx: number) => {
      if (loop) {
        const lIdx = realIdx + startIndex
        loopedIndex.current = lIdx
        scrollToLooped(lIdx, true)
        setActiveIndex(realIdx)
      } else {
        const offset = realIdx * snapInterval
        scrollRef.current?.scrollTo(
          isVertical ? { y: offset, animated: true } : { x: offset, animated: true },
        )
        setActiveIndex(realIdx)
      }
    },
    [loop, startIndex, scrollToLooped, snapInterval, isVertical],
  )

  // ── Layout helpers ─────────────────────────────────────────────────────────
  const horizontalInset = peekSize

  return (
    <View style={[{ width }, containerStyle]}>
      <View style={{ height, overflow: 'hidden' }}>
        <Animated.ScrollView
          ref={scrollRef}
          horizontal={!isVertical}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          pagingEnabled={false}
          snapToInterval={snapInterval}
          snapToAlignment='start'
          decelerationRate='fast'
          scrollEventThrottle={16}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleScrollEnd}
          contentContainerStyle={
            isVertical
              ? { gap }
              : { gap, paddingHorizontal: horizontalInset }
          }
        >
          {loopedData.map((item, loopIdx) => {
            // Animated input range uses looped position
            const inputRange = [
              (loopIdx - 1) * snapInterval,
              loopIdx * snapInterval,
              (loopIdx + 1) * snapInterval,
            ]

            let animStyle: Animated.AnimatedProps<ViewStyle> = {}

            if (variant === 'parallax') {
              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [0.88, 1, 0.88],
                extrapolate: 'clamp',
              })
              animStyle = { transform: [{ scale }] }
            }

            // Real index for renderItem (loop clones map back to original)
            const realIdx = loop
              ? (loopIdx - startIndex + data.length) % data.length
              : loopIdx

            return (
              <Animated.View
                // Use loopIdx as key so clones get unique keys
                key={`${item.id}-${loopIdx}`}
                style={[
                  {
                    width: itemSize,
                    height,
                    borderRadius: Radius.lg,
                    overflow: 'hidden',
                  },
                  animStyle,
                ]}
              >
                {renderItem({
                  item: data[realIdx],
                  index: realIdx,
                  isActive: realIdx === activeIndex,
                })}
              </Animated.View>
            )
          })}
        </Animated.ScrollView>
      </View>

      {/* Pagination */}
      <PaginationBar
        total={data.length}
        activeIndex={activeIndex}
        variant={pagination}
        scrollX={scrollX}
        itemWidth={itemSize}
        color={c.colorPrimary}
        onPress={scrollToReal}
      />
    </View>
  )
}

// ─── Fade Carousel ─────────────────────────────────────────────────────────

function FadeCarousel<T extends CarouselItem>({
  data,
  renderItem,
  width = SCREEN_WIDTH,
  height = 220,
  autoPlay = 0,
  pagination = 'dots',
  containerStyle,
  onIndexChange,
}: CarouselProps<T>) {
  const { theme } = useTheme()
  const c = Colors[theme]
  const [activeIndex, setActiveIndex] = useState(0)
  const opacities = useRef(data.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))).current
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback(
    (next: number) => {
      const prev = activeIndex
      Animated.parallel([
        Animated.timing(opacities[prev], { toValue: 0, duration: 350, useNativeDriver: true }),
        Animated.timing(opacities[next], { toValue: 1, duration: 350, useNativeDriver: true }),
      ]).start()
      setActiveIndex(next)
      onIndexChange?.(next)
    },
    [activeIndex, onIndexChange, opacities],
  )

  useEffect(() => {
    if (!autoPlay) return
    autoPlayRef.current = setInterval(() => {
      goTo((activeIndex + 1) % data.length)
    }, autoPlay)
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current) }
  }, [autoPlay, activeIndex, data.length, goTo])

  return (
    <View style={[{ width, height }, containerStyle]}>
      <View style={{ width, height, borderRadius: Radius.lg, overflow: 'hidden' }}>
        {data.map((item, index) => (
          <Animated.View
            key={item.id}
            style={[
              StyleSheet.absoluteFillObject,
              { opacity: opacities[index], zIndex: index === activeIndex ? 1 : 0 },
            ]}
          >
            {renderItem({ item, index, isActive: index === activeIndex })}
          </Animated.View>
        ))}
      </View>

      <PaginationBar
        total={data.length}
        activeIndex={activeIndex}
        variant={pagination}
        color={c.colorPrimary}
        onPress={goTo}
      />
    </View>
  )
}

// ─── Card Stack Carousel ──────────────────────────────────────────────────────

function CardStackCarousel<T extends CarouselItem>({
  data,
  renderItem,
  width = SCREEN_WIDTH,
  height = 260,
  autoPlay = 0,
  pagination = 'dots',
  containerStyle,
  onIndexChange,
}: CarouselProps<T>) {
  const { theme } = useTheme()
  const c = Colors[theme]
  const [activeIndex, setActiveIndex] = useState(0)
  const animValues = useRef(data.map(() => new Animated.Value(0))).current
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const cardWidth = width * 0.78
  const cardHeight = height

  const goTo = useCallback(
    (next: number) => {
      const clamped = clamp(next, 0, data.length - 1)
      setActiveIndex(clamped)
      onIndexChange?.(clamped)
    },
    [data.length, onIndexChange],
  )

  useEffect(() => {
    if (!autoPlay) return
    autoPlayRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % data.length
        onIndexChange?.(next)
        return next
      })
    }, autoPlay)
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current) }
  }, [autoPlay, data.length, onIndexChange])

  const VISIBLE = 3

  return (
    <View style={[{ width, height: cardHeight + 48, alignItems: 'center' }, containerStyle]}>
      <View style={{ width: cardWidth, height: cardHeight }}>
        {data.map((item, absoluteIndex) => {
          // position relative to active
          let pos = absoluteIndex - activeIndex
          if (pos < 0) pos += data.length
          if (pos >= VISIBLE) return null

          const scale = 1 - pos * 0.06
          const translateY = pos * 14
          const zIndex = VISIBLE - pos

          return (
            <Animated.View
              key={item.id}
              style={[
                Shadows.md,
                {
                  position: 'absolute',
                  width: cardWidth,
                  height: cardHeight,
                  borderRadius: Radius.xl,
                  overflow: 'hidden',
                  transform: [{ scale }, { translateY }],
                  zIndex,
                  opacity: 1 - pos * 0.15,
                },
              ]}
            >
              <Pressable
                style={{ flex: 1 }}
                onPress={() => pos > 0 && goTo(activeIndex + 1)}
              >
                {renderItem({ item: data[(activeIndex + pos) % data.length], index: absoluteIndex, isActive: pos === 0 })}
              </Pressable>
            </Animated.View>
          )
        })}
      </View>

      <PaginationBar
        total={data.length}
        activeIndex={activeIndex}
        variant={pagination}
        color={c.colorPrimary}
        onPress={goTo}
      />
    </View>
  )
}

// ─── Pagination Bar ───────────────────────────────────────────────────────────

interface PaginationBarProps {
  total: number
  activeIndex: number
  variant: PaginationVariant
  color: string
  scrollX?: Animated.Value
  itemWidth?: number
  onPress?: (index: number) => void
}

function PaginationBar({
  total,
  activeIndex,
  variant,
  color,
  scrollX,
  itemWidth,
  onPress,
}: PaginationBarProps) {
  if (variant === 'none' || total <= 1) return null

  if (variant === 'number') {
    return (
      <View style={paginationStyles.numberContainer}>
        <Text style={[paginationStyles.numberText, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
          {activeIndex + 1} / {total}
        </Text>
      </View>
    )
  }

  if (variant === 'line' && scrollX && itemWidth) {
    return (
      <View style={paginationStyles.lineContainer}>
        {Array.from({ length: total }).map((_, i) => {
          const width = scrollX.interpolate({
            inputRange: [(i - 1) * itemWidth, i * itemWidth, (i + 1) * itemWidth],
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          })
          const opacity = scrollX.interpolate({
            inputRange: [(i - 1) * itemWidth, i * itemWidth, (i + 1) * itemWidth],
            outputRange: [0.35, 1, 0.35],
            extrapolate: 'clamp',
          })
          return (
            <TouchableOpacity key={i} onPress={() => onPress?.(i)} activeOpacity={0.7}>
              <Animated.View
                style={[
                  paginationStyles.lineDot,
                  { backgroundColor: color, width, opacity },
                ]}
              />
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  // Default: dots
  return (
    <View style={paginationStyles.dotsContainer}>
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === activeIndex
        return (
          <TouchableOpacity key={i} onPress={() => onPress?.(i)} activeOpacity={0.7}>
            <Animated.View
              style={[
                paginationStyles.dot,
                {
                  backgroundColor: isActive ? color : 'rgba(150,150,150,0.4)',
                  width: isActive ? 20 : 8,
                  opacity: isActive ? 1 : 0.6,
                },
              ]}
            />
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const paginationStyles = StyleSheet.create({
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  lineContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 5,
  },
  lineDot: {
    height: 4,
    borderRadius: 2,
  },
  numberContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  numberText: {
    color: '#fff',
    fontSize: Typography.size.xs,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
})

// ─── Public Carousel Component ───────────────────────────────────────────────

export function Carousel<T extends CarouselItem>(props: CarouselProps<T>) {
  switch (props.variant) {
    case 'fade':
      return <FadeCarousel {...props} />
    case 'card-stack':
      return <CardStackCarousel {...props} />
    default:
      return <ScrollCarousel {...props} />
  }
}

export default Carousel
