import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function FormScreen() {
  return (
    <View style={styles.container}>
      <Text>Formulario</Text>
      <Button title="Volver" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
