import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";
import COLORS from "@/constants/Palette";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FONTS from "@/constants/Fonts";

//const window = Dimensions.get("window");
export default function FormScreen() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.backButton}>
        <Ionicons
          name="arrow-back"
          size={25}
          color={COLORS.white}
          onPress={() => router.back()}
        />
      </View>
      <View style={styles.container}>
        <Text style={styles.text}>Pantalla de Reportes</Text>
        {/* Aquí puedes agregar el contenido para la tercera pestaña */}
      </View>
    </GestureHandlerRootView>
  );
}

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
  backButton: {
    position: "absolute",
    top: 10,
    left: 20,
    zIndex: 1,
    backgroundColor: "#344",
    padding: 10,
    borderRadius: 25,
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
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
