import React from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { ThemedText } from '@/components/ui/themed-text'
import { ThemedView } from '@/components/ui/themed-view'
import { Spacing, Typography, Radius } from '@/constants/theme'
import { Stack } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { useTheme } from '@/context/theme-context'
import { Colors } from '@/constants/theme'

export default function ToastShowcase() {
  const { show } = useToast()
  const { theme } = useTheme()
  const c = Colors[theme]

  const showSuccess = () => show('Operation completed successfully!', { variant: 'success' })
  const showError = () => show('Something went wrong. Please try again.', { variant: 'error' })
  const showWarning = () => show('Your subscription will expire soon.', { variant: 'warning' })
  const showInfo = () => show('New update is available for download.', { variant: 'info' })
  const showMessage = () => show('This is a simple message without an icon.', { variant: 'message' })
  
  const showBottom = () => show('This toast is at the bottom!', { position: 'bottom', variant: 'success' })
  const showLong = () => show(
    'This is a very long message to test how the toast handles multiple lines of text efficiently without breaking the layout. It should wrap nicely. ' +
    'And it continues to see if it reaches 3 lines limit or beyond.', 
    { variant: 'info', duration: 5000 }
  )

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>{title}</ThemedText>
      <View style={styles.buttonGrid}>
        {children}
      </View>
    </View>
  )

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Toast Notification', headerShadowVisible: false }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: c.colorPrimary + '15' }]}>
            <MaterialIcons name="notifications-active" size={32} color={c.colorPrimary} />
          </View>
          <ThemedText type="title">Notifications</ThemedText>
          <ThemedText style={[styles.subtitle, { color: c.tabIconDefault }]}>
            Premium Toast system with smooth animations and gesture support.
          </ThemedText>
        </View>

        <Section title="Variants">
          <Button label="Success Toast" onPress={showSuccess} variant="outline" style={styles.button} />
          <Button label="Error Toast" onPress={showError} variant="outline" style={styles.button} />
          <Button label="Warning Toast" onPress={showWarning} variant="outline" style={styles.button} />
          <Button label="Info Toast" onPress={showInfo} variant="outline" style={styles.button} />
          <Button label="Simple Message" onPress={showMessage} variant="outline" style={styles.button} />
        </Section>

        <Section title="Positions & Layout">
          <Button label="Show at Bottom" onPress={showBottom} variant="primary" style={styles.button} />
          <Button label="Long Content" onPress={showLong} variant="primary" style={styles.button} />
        </Section>

        <View style={[styles.infoCard, { backgroundColor: c.surface, borderColor: c.border }]}>
          <MaterialIcons name="info-outline" size={20} color={c.colorPrimary} />
          <View style={styles.infoTextContainer}>
            <ThemedText type="defaultSemiBold" style={{ fontSize: 13 }}>Interactive Dismissal</ThemedText>
            <ThemedText style={{ fontSize: 13, opacity: 0.7 }}>
              Try swiping any toast notification left or right to dismiss it instantly.
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  button: {
    minWidth: '47%',
    flexGrow: 1,
  },
  infoCard: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  infoTextContainer: {
    flex: 1,
  },
})
