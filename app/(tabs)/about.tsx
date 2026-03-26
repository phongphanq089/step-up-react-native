import { Button as UIButton, ScreenContainer } from '@/components/ui'
import Button from '@/components/button'
import CircleButton from '@/components/circle-button'
import IconButton from '@/components/icon-button'
import ImageViewer from '@/components/ImageViewer'
import { Colors } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

export default function AboutScreen() {
  const { theme } = useTheme()
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined,
  )

  const [showAppOptions, setShowAppOptions] = useState<boolean>(false)

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
      setShowAppOptions(true)
    } else {
      alert('You did not select any image.')
    }
  }

  const onReset = () => {
    setShowAppOptions(false)
  }

  const onAddSticker = () => {
    // we will implement this later
  }

  const onSaveImageAsync = async () => {
    // we will implement this later
  }

  return (
    <ScreenContainer scrollable={false}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <ImageViewer
            placeholderImageSource={
              selectedImage
                ? { uri: selectedImage }
                : require('@/assets/images/background-image.jpg')
            }
            aspectRatio={16 / 9}
            frameStyle={{ width: '100%' }}
          />
        </View>

        {showAppOptions ? (
          <View style={styles.optionsContainer}>
            <View style={styles.optionsRow}>
              <IconButton icon='refresh' label='Reset' onPress={onReset} />
              <CircleButton onPress={onAddSticker} />
              <IconButton
                icon='save-alt'
                label='Save'
                onPress={onSaveImageAsync}
              />
            </View>
          </View>
        ) : (
          <View style={styles.footerContainer}>
            <Button
              label='Choose a photo'
              theme='primary'
              onPress={pickImageAsync}
            />
            <Button label='Use this photo' />
          </View>
        )}
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
  },
  text: {
    color: '#fff',
  },
  footerContainer: {
    marginTop: 10,
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
})
