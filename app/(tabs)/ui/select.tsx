import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { Select, SelectOption } from '@/components/ui/select'
import { ThemedView } from '@/components/ui/themed-view'
import { ThemedText } from '@/components/ui/themed-text'
import { Colors, Spacing, Radius, Typography, Brand, Semantic } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'

// ─── Sample Data ──────────────────────────────────────────────────────────────

const countryOptions: SelectOption[] = [
  { label: 'United States', value: 'us', icon: 'flag', description: 'North America' },
  { label: 'United Kingdom', value: 'uk', icon: 'flag', description: 'Europe' },
  { label: 'Vietnam', value: 'vn', icon: 'flag', description: 'Southeast Asia' },
  { label: 'Japan', value: 'jp', icon: 'flag', description: 'East Asia' },
  { label: 'Germany', value: 'de', icon: 'flag', description: 'Europe' },
  { label: 'Australia', value: 'au', icon: 'flag', description: 'Oceania' },
  { label: 'Canada', value: 'ca', icon: 'flag', description: 'North America' },
  { label: 'Brazil', value: 'br', icon: 'flag', description: 'South America' },
]

const roleOptions: SelectOption[] = [
  { label: 'Admin', value: 'admin', icon: 'admin-panel-settings', description: 'Full system access' },
  { label: 'Editor', value: 'editor', icon: 'edit', description: 'Can edit and publish content' },
  { label: 'Viewer', value: 'viewer', icon: 'visibility', description: 'Read-only access' },
  { label: 'Developer', value: 'dev', icon: 'code', description: 'API and technical access' },
  { label: 'Analyst', value: 'analyst', icon: 'analytics', description: 'Data and reporting access', disabled: true },
]

const priorityOptions: SelectOption[] = [
  { label: 'Critical', value: 'critical', color: Semantic.error, icon: 'error' },
  { label: 'High', value: 'high', color: '#F59E0B', icon: 'keyboard-arrow-up' },
  { label: 'Medium', value: 'medium', color: Semantic.info, icon: 'remove' },
  { label: 'Low', value: 'low', color: Semantic.success, icon: 'keyboard-arrow-down' },
]

const colorOptions: SelectOption[] = [
  { label: 'Red', value: 'red', color: '#EF4444' },
  { label: 'Orange', value: 'orange', color: '#F97316' },
  { label: 'Yellow', value: 'yellow', color: '#EAB308' },
  { label: 'Green', value: 'green', color: '#22C55E' },
  { label: 'Blue', value: 'blue', color: '#3B82F6' },
  { label: 'Purple', value: 'purple', color: '#A855F7' },
  { label: 'Pink', value: 'pink', color: '#EC4899' },
]

const skillOptions: SelectOption[] = [
  { label: 'React Native', value: 'rn', icon: 'phone-android' },
  { label: 'TypeScript', value: 'ts', icon: 'code' },
  { label: 'Node.js', value: 'node', icon: 'dns' },
  { label: 'GraphQL', value: 'graphql', icon: 'account-tree' },
  { label: 'PostgreSQL', value: 'pg', icon: 'storage' },
  { label: 'Docker', value: 'docker', icon: 'inventory' },
  { label: 'Figma', value: 'figma', icon: 'design-services' },
]

const cityOptions: SelectOption[] = [
  { label: 'Hanoi', value: 'hn', description: 'Capital of Vietnam' },
  { label: 'Ho Chi Minh City', value: 'hcmc', description: 'Largest city' },
  { label: 'Da Nang', value: 'dn', description: 'Central Vietnam' },
  { label: 'Can Tho', value: 'ct', description: 'Mekong Delta' },
  { label: 'Hue', value: 'hue', description: 'Ancient capital' },
  { label: 'Nha Trang', value: 'nt', description: 'Coastal city' },
  { label: 'Vung Tau', value: 'vt', description: 'Beach city' },
  { label: 'Dalat', value: 'dl', description: 'Highland city' },
  { label: 'Hai Phong', value: 'hp', description: 'Northern port city' },
]

// ─── Section ──────────────────────────────────────────────────────────────────

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  const { theme } = useTheme()
  const c = Colors[theme]
  return (
    <View style={styles.section}>
      <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>{title}</ThemedText>
      {subtitle && <Text style={[styles.sectionSubtitle, { color: c.textSecondary }]}>{subtitle}</Text>}
      {children}
    </View>
  )
}

// ─── Selected Tag ─────────────────────────────────────────────────────────────

function SelectedBadge({ label }: { label: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SelectShowcase() {
  const { theme } = useTheme()
  const c = Colors[theme]

  // single selects
  const [country, setCountry] = useState<string | number>()
  const [role, setRole] = useState<string | number>()
  const [priority, setPriority] = useState<string | number>()
  const [color, setColor] = useState<string | number>()
  const [city, setCity] = useState<string | number>()
  const [cityFilled, setCityFilled] = useState<string | number>()
  const [cityOutlined, setCityOutlined] = useState<string | number>()
  const [cityGhost, setCityGhost] = useState<string | number>()
  const [sizeSm, setSizeSm] = useState<string | number>()
  const [sizeMd, setSizeMd] = useState<string | number>()
  const [sizeLg, setSizeLg] = useState<string | number>()

  // multi selects
  const [skills, setSkills] = useState<(string | number)[]>([])
  const [countries, setCountries] = useState<(string | number)[]>([])

  const selectedSkillLabels = skillOptions.filter(o => skills.includes(o.value)).map(o => o.label)
  const selectedCountryLabels = countryOptions.filter(o => countries.includes(o.value)).map(o => o.label)

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Select', headerShadowVisible: false }} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.headerIcon, { backgroundColor: Brand.primary + '15' }]}>
            <MaterialIcons name='expand-circle-down' size={32} color={Brand.primary} />
          </View>
          <ThemedText type='title'>Select</ThemedText>
          <Text style={[styles.headerDesc, { color: c.textSecondary }]}>
            Bottom sheet picker with single/multi select, search, icons, color dots, variants, and sizes.
          </Text>
        </View>

        {/* ── 1. Basic ── */}
        <Section title='Basic' subtitle='Simple single-select with searchable list.'>
          <Select
            label='Country'
            options={countryOptions}
            value={country}
            onChange={setCountry}
            placeholder='Select a country'
            searchable
          />
        </Section>

        {/* ── 2. With Icons & Description ── */}
        <Section title='Icons + Description' subtitle='Options with icon boxes and descriptive subtitles.'>
          <Select
            label='Role'
            options={roleOptions}
            value={role}
            onChange={setRole}
            placeholder='Assign a role'
            required
            hint='Determines what actions this user can perform'
          />
        </Section>

        {/* ── 3. Priority with Colors ── */}
        <Section title='Color Icons' subtitle='Colored icons to visually distinguish options.'>
          <Select
            label='Priority'
            options={priorityOptions}
            value={priority}
            onChange={setPriority}
            placeholder='Set task priority'
          />
        </Section>

        {/* ── 4. Color Dots ── */}
        <Section title='Color Dots' subtitle='Options with color swatches instead of icons.'>
          <Select
            label='Label Color'
            options={colorOptions}
            value={color}
            onChange={setColor}
            placeholder='Pick a color'
          />
        </Section>

        {/* ── 5. Searchable ── */}
        <Section title='Searchable' subtitle='Large lists benefit from the built-in search bar.'>
          <Select
            label='City'
            options={cityOptions}
            value={city}
            onChange={setCity}
            placeholder='Find a city...'
            searchable
            prefixIcon='location-on'
          />
        </Section>

        {/* ── 6. Variants ── */}
        <Section title='Trigger Variants' subtitle='4 trigger styles work with any list.'>
          <Select
            label='Default (Surface Fill)'
            options={cityOptions}
            value={cityFilled}
            onChange={setCityFilled}
            placeholder='Select city'
            variant='default'
          />
          <Select
            label='Outlined (Border)'
            options={cityOptions}
            value={cityOutlined}
            onChange={setCityOutlined}
            placeholder='Select city'
            variant='outlined'
          />
          <Select
            label='Ghost (No Border)'
            options={cityOptions}
            value={cityGhost}
            onChange={setCityGhost}
            placeholder='Select city'
            variant='ghost'
          />
        </Section>

        {/* ── 7. Sizes ── */}
        <Section title='Sizes' subtitle='Three height presets for different layout contexts.'>
          <Select
            label='Small (sm)'
            options={cityOptions}
            value={sizeSm}
            onChange={setSizeSm}
            placeholder='Compact'
            size='sm'
          />
          <Select
            label='Medium (md — default)'
            options={cityOptions}
            value={sizeMd}
            onChange={setSizeMd}
            placeholder='Standard'
            size='md'
          />
          <Select
            label='Large (lg)'
            options={cityOptions}
            value={sizeLg}
            onChange={setSizeLg}
            placeholder='Spacious'
            size='lg'
          />
        </Section>

        {/* ── 8. Multi-Select ── */}
        <Section title='Multi-Select' subtitle='Select multiple items via checkboxes, tap Done to confirm.'>
          <Select
            label='Skills'
            options={skillOptions}
            value={skills}
            onChange={(v) => setSkills(v as (string | number)[])}
            placeholder='Choose skills'
            multiple
            searchable
            hint='Select all that apply'
          />
          {selectedSkillLabels.length > 0 && (
            <View style={styles.badgeRow}>
              {selectedSkillLabels.map((l) => <SelectedBadge key={l} label={l} />)}
            </View>
          )}
        </Section>

        {/* ── 9. Multi with max ── */}
        <Section title='Multi-Select (Max 3)' subtitle='Limit how many items can be selected.'>
          <Select
            label='Countries'
            options={countryOptions}
            value={countries}
            onChange={(v) => setCountries(v as (string | number)[])}
            placeholder='Pick up to 3 countries'
            multiple
            maxSelect={3}
            hint='Maximum 3 selections allowed'
          />
          {selectedCountryLabels.length > 0 && (
            <View style={styles.badgeRow}>
              {selectedCountryLabels.map((l) => <SelectedBadge key={l} label={l} />)}
            </View>
          )}
        </Section>

        {/* ── 10. Disabled / Error ── */}
        <Section title='States' subtitle='Error and disabled trigger states.'>
          <Select
            label='Error State'
            options={cityOptions}
            value={undefined}
            placeholder='Required field'
            error='Please select a city'
          />
          <Select
            label='Disabled State'
            options={cityOptions}
            value='hn'
            disabled
            placeholder='Cannot change'
          />
        </Section>
      </ScrollView>
    </ThemedView>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.lg, paddingBottom: 100 },

  header: { alignItems: 'center', marginBottom: Spacing.xl, marginTop: Spacing.sm },
  headerIcon: {
    width: 64, height: 64, borderRadius: 32,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerDesc: {
    textAlign: 'center',
    fontSize: Typography.size.sm,
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    lineHeight: 20,
  },

  section: { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: Typography.size.md, marginBottom: 4 },
  sectionSubtitle: { fontSize: Typography.size.sm, marginBottom: Spacing.md, lineHeight: 18 },

  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: Spacing.sm },
  badge: {
    backgroundColor: Brand.primary + '18',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  badgeText: { color: Brand.primary, fontSize: Typography.size.xs, fontWeight: '600' },
})
