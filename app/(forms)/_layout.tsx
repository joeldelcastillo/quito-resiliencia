import React from "react";
import { Stack } from "expo-router";

export default function FormLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="form"
        options={{
          title: "Reporte de Incidente",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
