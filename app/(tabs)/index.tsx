import CustomImagePicker from '../../components/ImagePicker';
import { ThemedView } from '../../components/ThemedView';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <CustomImagePicker/>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
