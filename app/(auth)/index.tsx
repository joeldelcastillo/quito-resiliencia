import { ImageBackground, SafeAreaView, StyleSheet } from 'react-native';

const Splash = { uri: "https://i.sstatic.net/RHzvO.png" };

export default function InitScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={Splash} style={styles.container} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
