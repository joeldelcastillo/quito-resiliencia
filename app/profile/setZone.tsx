
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Text, View, StyleSheet, Dimensions, ActivityIndicator, Alert } from 'react-native';
import COLORS from '@/constants/Palette';
import { checkCompleteTrip, tripInitialState, Trip, checkCompleteLocation } from '@/functions/types/TripTypes';
import { router } from 'expo-router';
import MapView, { Circle } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import FONTS from '@/constants/Fonts';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import AddressSearch from '@/components/AddressSearch';
import MyButton from '@/components/ui/Button';
import { Auth } from '@/functions/firebase/connection';
import { useUser } from '@/functions/providers/AuthProvider';
import { getUserRef } from '@/functions/helpers/getReferences';
import { updateDoc } from 'firebase/firestore';
import ReactNativeModal from 'react-native-modal';
import StepsHeader from '@/components/StepsHeader';
import { useIsFocused } from '@react-navigation/native';


const window = Dimensions.get('window');

const SetZoneScreen: React.FC = () => {
  const [currentUser, setCurrentUser] = useUser();
  const [currentTrip, setCurrentTrip] = React.useState<Trip>(tripInitialState);
  const [loaded, setLoaded] = React.useState(false);
  const [radius, setRadius] = React.useState(1000); // initial radius in meters
  const [indexSearch, setIndexSearch] = React.useState<number | null>(null);

  const mapRef = React.useRef<MapView | null>(null);
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const isFocused = useIsFocused();

  const handleSheetChanges = React.useCallback((index: number) => {
    if (index === 0) {
      setIndexSearch(null);
    }
  }, []);

  React.useEffect(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, [isFocused]);


  const onFocusAddressSearch = () => {
    bottomSheetRef.current?.snapToIndex(1)
  }

  const onPressAddressSearch = () => {
    bottomSheetRef.current?.snapToIndex(0)
  }

  const handleGoBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }

  const onNextPressed = async () => {
    setLoaded(true);
    if (!checkCompleteLocation(currentTrip.startLocation)) return;
    if (!Auth.currentUser || !currentUser) return;
    const userRef = getUserRef(Auth.currentUser.uid);
    if (currentUser?.completedInfo !== 'zone') await updateDoc(userRef, { interestedZone: { location: currentTrip.startLocation, radius, address: currentTrip.startAddress }, completedInfo: 'zone' })
      .catch((error) => Alert.alert('Error updating document: ', error));
    // It just runs if the user has come back to the same screen
    if (currentUser?.completedInfo === 'zone') router.push('/profile/setNotifications');
    setLoaded(false);
    bottomSheetRef.current?.forceClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.backButton}>
        <Ionicons name="arrow-back" size={25} color={COLORS.title} onPress={handleGoBack} />
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        userInterfaceStyle="light"
        initialRegion={initialRegion}
      >
        <Circle
          center={currentTrip.startLocation}
          onTouchStart={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          radius={radius}
          strokeColor="rgba(0, 122, 255, 0.5)"
          fillColor="rgba(0, 122, 255, 0.2)"
        />
      </MapView>
      {currentTrip.startAddress &&
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumTrackTintColor={'rgba(0, 122, 255, 1)'}
            // thumbTintColor='rgba(0, 122, 255, 1)'
            minimumValue={100}
            maximumValue={2000}
            step={100}
            value={radius}
            onValueChange={(value) => { setRadius(value) }}
          />
        </View>
      }


      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        enablePanDownToClose={false}
        snapPoints={['50%', '90%']} // 40% is the initial snap point
        backgroundStyle={{ backgroundColor: COLORS.background }}
        handleIndicatorStyle={{ backgroundColor: COLORS.title }}
      >
        <BottomSheetView style={styles.bottomSheet}>
          <StepsHeader slides={5} currentIndex={1} />
          <Text style={[styles.title]}>Te enviaremos notificaciones de rutas en esta zona 🔔 🚗</Text>
          <Text style={{ color: COLORS.title, fontSize: 16, marginBottom: 30 }}>Selecciona el lugar y el radio de distancia que te gustaría recibir notificaciones de futuras rutas que se creen en este lugar.</Text>
          <View style={{ flexDirection: 'row' }}>
            <AddressSearch trip={currentTrip} setTrip={setCurrentTrip} indexSearch={0} mapRef={mapRef} containerStyle={{ flex: 1 }}
              onFocus={onFocusAddressSearch}
              onPress={onPressAddressSearch}
            />
          </View>

          <View style={{ height: 40 }} />
          <MyButton title="Siguiente" onPress={onNextPressed} disabled={!checkCompleteLocation(currentTrip.startLocation)} />
        </BottomSheetView>
      </BottomSheet>

      <ReactNativeModal isVisible={loaded}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size='small' />
        </View>
      </ReactNativeModal>
    </View>
  );
};

export default SetZoneScreen;

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

  // ScrollView

  scrollView: {
    position: 'absolute',
    // Customize for ios and android
    bottom: 50,
    left: 5,
    right: 0,
    // paddingVertical: 10,
  },

  endPadding: {
    paddingRight: 30,
    marginLeft: 30,
  },

  // Slider

  sliderContainer: {
    position: 'absolute',
    top: 150,
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
    paddingTop: 0,
  },
  title: {
    color: COLORS.title,
    fontSize: 20,
    fontFamily: FONTS.bold,
    marginBottom: 10,
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

