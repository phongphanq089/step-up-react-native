import {
  Image,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

interface Props {
  placeholderImageSource: ImageSourcePropType
  selectedImage?: string | null
  imageStyle?: StyleProp<ImageStyle>
  frameStyle?: StyleProp<ViewStyle>
  aspectRatio?: number
}

export default function ImageViewer({
  placeholderImageSource,
  selectedImage,
  imageStyle,
  frameStyle,
  aspectRatio = 1,
}: Props) {
  const imageSource = selectedImage
    ? { uri: selectedImage }
    : placeholderImageSource

  return (
    <View style={[styles.frame, { aspectRatio }, frameStyle]}>
      <Image source={imageSource} style={[styles.image, imageStyle]} />
    </View>
  )
}

const styles = StyleSheet.create({
  frame: {
    borderWidth: 1,
    borderColor: '#ffd33d',
    borderRadius: 18,
    padding: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
})
