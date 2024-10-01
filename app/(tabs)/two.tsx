import { Button, StyleSheet, TextInput } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import React from "react";

export default function TabTwoScreen() {
  const [edad, setEdad] = React.useState<number>(0);

  React.useEffect(() => {
    console.log("hola josh");
  }, []);

  const handleTextEdad = (text: string) => {
    setEdad(parseInt(text));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{edad}</Text>
      <Button title="Sumar" onPress={() => setEdad(edad + 1)} />
      <TextInput value={String(edad)} onChangeText={handleTextEdad} />

      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
