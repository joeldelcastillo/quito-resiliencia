
import * as Haptics from 'expo-haptics';
import React, { useLayoutEffect } from 'react';
import { Text, View, Button, StyleSheet, Dimensions } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import MapView, { Marker, Circle } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { checkCompleteTrip, TripType, tripInitialState } from '@/functions/types/TripTypes';
// import AddressSearch from '@/components/AddressSearch';
import COLORS from '@/constants/Palette';
import FONTS from '@/constants/Fonts';
// import { Auth } from '@/functions/firebase/connection';

const window = Dimensions.get('window');

const TabOneScreen: React.FC = () => {
  // const { trip } = useLocalSearchParams<{ trip: Trip }>();
  // const [trip, setTrip] = React.useState<TripType>(tripInitialState);
  const mapRef = React.useRef<MapView | null>(null);
  const [radius, setRadius] = React.useState(1000); // initial radius in meters
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const [indexSearch, setIndexSearch] = React.useState<number | null>(null);
  const navigation = useNavigation();
  const stringIndex = ['Punto de Partida', 'Punto de Destino'];


  // callbacks
  const handleSheetChanges = React.useCallback((index: number) => {
    if (index === 0) {
      setIndexSearch(null);
    }
  }, []);


  return (
    <View style={styles.container}>
      <View style={styles.backButton}>
        <Ionicons name="arrow-back" size={25} color={COLORS.title} onPress={() => router.back()} />
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        userInterfaceStyle="light"
        initialRegion={initialRegion}
      >
      </MapView>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={100}
          maximumValue={5000}
          step={100}
          value={radius}
          onValueChange={(value) => setRadius(value)}
        />
      </View>
      {/* <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        snapPoints={['40%', '90%']} // 50% is the initial snap point
        backgroundStyle={{ backgroundColor: COLORS.background }}
        handleIndicatorStyle={{ backgroundColor: COLORS.blue }}
      >
        <BottomSheetView style={styles.bottomSheet}>
          <Text style={[styles.title, { textAlign: 'center' }]}>{indexSearch === null ? 'Planea tu Ruta' : stringIndex[indexSearch]}</Text>
          <AddressSearch trip={trip} setTrip={setTrip} indexSearch={0} mapRef={mapRef}
            onFocus={() => { bottomSheetRef.current?.snapToIndex(1) }}
            onPress={() => { bottomSheetRef.current?.snapToIndex(0) }}
          />
          <AddressSearch trip={trip} setTrip={setTrip} indexSearch={1} mapRef={mapRef}
            onFocus={() => { bottomSheetRef.current?.snapToIndex(1) }}
            onPress={() => { bottomSheetRef.current?.snapToIndex(0) }}
          />
          <View style={{ height: 40 }} />
          <MyButton title="Siguiente" onPress={onNextPressed} disabled={!checkCompleteTrip(trip)} />
        </BottomSheetView>
      </BottomSheet> */}

    </View>
  );
};

export default TabOneScreen;

const initialRegion = {
  latitude: -0.197273,
  longitude: -78.435566,
  latitudeDelta: 0.0069,
  longitudeDelta: 0.0069,
};





const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 'auto',
    // paddingHorizontal: 15,
  },
  map: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden'
  },
  day: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'grey',
    padding: 10,
  },
  infoContainer: {
    padding: 10,
  },
  subtitle: {
    color: 'grey',
    fontSize: 14,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    color: 'white',
  },
  time: {
    color: 'white',
  },
  passengers: {
    color: 'white',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },

  // Slider

  sliderContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  slider: {
    width: '100%',
  },


  // Create Routes

  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 25,
  },

  bottomSheet: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    backgroundColor: '#111',
    padding: 20,
  },
  title: {
    color: COLORS.title,
    fontSize: 20,
    fontFamily: FONTS.bold,
    marginBottom: 20,
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  stopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  stopTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stopText: {
    color: COLORS.blue,
    fontFamily: FONTS.mediumItalic,
    fontSize: 18,
    marginLeft: 10,
  },
  removeButton: {
    backgroundColor: COLORS.background,
    borderRadius: 5,
    padding: 5,
  },
  stopsList: {
    marginBottom: 20,
  },
  doneButton: {
    backgroundColor: '#555',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

