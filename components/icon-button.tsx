import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Pressable, StyleSheet, Text } from 'react-native'
import { useTheme } from '@/context/theme-context'
import { Colors } from '@/constants/theme'

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap
  label: string
  onPress: () => void
}

export default function IconButton({ icon, label, onPress }: Props) {
  const { theme } = useTheme()

  return (
    <Pressable style={styles.iconButton} onPress={onPress}>
      <MaterialIcons name={icon} size={24} color={Colors[theme].text} />
      <Text style={[styles.iconButtonLabel, { color: Colors[theme].text }]}>
        {label}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonLabel: {
    marginTop: 12,
  },
})
