import * as Haptics from "expo-haptics";
import React, { useEffect, useLayoutEffect } from "react";
import { Text, View, Button, StyleSheet, Dimensions } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import MapView, { Marker, Circle } from "react-native-maps";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetView,
  TouchableOpacity,
} from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { checkCompleteTrip, TripType, tripInitialState } from '@/functions/types/TripTypes';
// import AddressSearch from '@/components/AddressSearch';
import COLORS from "@/constants/Palette";
import FONTS from "@/constants/Fonts";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
// import { Auth } from '@/functions/firebase/connection';

const window = Dimensions.get("window");

const TabOneScreen: React.FC = () => {
  // const { trip } = useLocalSearchParams<{ trip: Trip }>();
  // const [trip, setTrip] = React.useState<TripType>(tripInitialState);
  const mapRef = React.useRef<MapView | null>(null);
  const [radius, setRadius] = React.useState(1000); // initial radius in meters
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const [indexSearch, setIndexSearch] = React.useState<number | null>(null);

  const navigation = useNavigation();
  const stringIndex = ["Punto de Partida", "Punto de Destino"];

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    mapRef.current?.fitToCoordinates([
      {
        latitude: 60.78825,
        longitude: -122.4324,
      },
      {
        latitude: 67.7749,
        longitude: -122.4194,
      },
    ]);
  }, [radius]);

  // callbacks
  const handleSheetChanges = React.useCallback((index: number) => {
    if (index === 0) {
      setIndexSearch(null);
    }
  }, []);

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.backButton}>
        <Ionicons
          name="arrow-back"
          size={25}
          color={COLORS.title}
          onPress={() => router.back()}
        />
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        userInterfaceStyle="light"
        initialRegion={initialRegion}
      ></MapView>
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

      <TouchableOpacity
        style={styles.openSheetButton}
        onPress={openBottomSheet}
      >
        <Text style={styles.openSheetButtonText}>Reportar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.fireButton}
        onPress={() => {
          console.log("Botón de fuego presionado");
        }}
      >
        <FontAwesome5 name="fire-alt" size={24} color="white" />
        <Text style={styles.fireButtonText}>Reportar Incendio</Text>
      </TouchableOpacity>

      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        snapPoints={["40%", "90%"]} // 50% is the initial snap point
        backgroundStyle={{ backgroundColor: COLORS.background }}
        handleIndicatorStyle={{ backgroundColor: COLORS.blue }}
        enablePanDownToClose
      >
        <BottomSheetView style={styles.bottomSheet}>
          <Text style={[styles.title, { textAlign: "center" }]}>
            {indexSearch === null
              ? "Reportar un prolema"
              : stringIndex[indexSearch]}
          </Text>
          <TouchableOpacity style={styles.fireButton}>
            <Text style={styles.fireButtonText}>Incendio </Text>
            <View style={{ marginRight: 10 }} />
            <FontAwesome5 name="fire-alt" size={20} color="darkred" />
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
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
    width: "100%",
    height: "auto",
    // paddingHorizontal: 15,
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },
  day: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "grey",
    padding: 10,
  },
  infoContainer: {
    padding: 10,
  },
  subtitle: {
    color: "grey",
    fontSize: 14,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    color: "white",
  },
  time: {
    color: "white",
  },
  passengers: {
    color: "white",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: "absolute",
    top: 10,
    right: 10,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },

  // Slider

  sliderContainer: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  slider: {
    width: "100%",
  },

  // Create Routes

  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 25,
  },
  openSheetButton: {
    position: "absolute",
    bottom: 120,
    right: 20,
    backgroundColor: "#344",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
  },
  openSheetButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  bottomSheet: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    color: COLORS.title,
    fontSize: 20,
    fontFamily: FONTS.bold,
    marginBottom: 20,
  },
  fireButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 45,
  },
  fireButtonText: {
    marginLeft: 10,
    fontSize: 18,
    color: "black",
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  stopContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  stopTextContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: "#555",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});
