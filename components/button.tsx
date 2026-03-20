import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useTheme } from '@/context/theme-context'
import { Colors } from '@/constants/theme'

type Props = {
  label: string
  theme?: 'primary'
  onPress?: () => void
}

export default function Button({ label, theme, onPress }: Props) {
  const { theme: activeTheme } = useTheme()

  if (theme === 'primary') {
    return (
      <View
        style={[
          styles.buttonContainer,
          {
            borderWidth: 4,
            borderColor: Colors[activeTheme].tabIconSelected, // Dùng màu secondary/tint
            borderRadius: 18,
          },
        ]}
      >
        <Pressable
          style={[
            styles.button,
            { backgroundColor: Colors[activeTheme].background },
          ]}
          onPress={onPress}
        >
          <FontAwesome
            name='picture-o'
            size={18}
            color={Colors[activeTheme].text}
            style={styles.buttonIcon}
          />
          <Text style={[styles.buttonLabel, { color: Colors[activeTheme].text }]}>
            {label}
          </Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={styles.button}
        onPress={() => alert('You pressed a button.')}
      >
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
})
