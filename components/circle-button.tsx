import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Pressable, StyleSheet, View } from 'react-native'
import { useTheme } from '@/context/theme-context'
import { Colors } from '@/constants/theme'

type Props = {
  onPress: () => void
}

export default function CircleButton({ onPress }: Props) {
  const { theme } = useTheme()

  return (
    <View
      style={[
        styles.circleButtonContainer,
        { borderColor: Colors[theme].tabIconSelected },
      ]}
    >
      <Pressable
        style={[
          styles.circleButton,
          { backgroundColor: Colors[theme].background },
        ]}
        onPress={onPress}
      >
        <MaterialIcons name='add' size={38} color={Colors[theme].text} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  circleButtonContainer: {
    width: 84,
    height: 84,
    marginHorizontal: 60,
    borderWidth: 4,
    borderColor: '#ffd33d',
    borderRadius: 42,
    padding: 3,
  },
  circleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 42,
    backgroundColor: '#fff',
  },
})
