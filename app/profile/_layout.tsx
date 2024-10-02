
import { router, Stack } from 'expo-router';
import 'react-native-reanimated';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/Palette';
import React from 'react';
import { Button } from 'react-native';


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function ProfilesLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackButtonMenuEnabled: true, headerBackVisible: true, headerShown: false }}>
      <Stack.Screen name='setWelcome' options={{}} />
      <Stack.Screen name="setZone" options={{ headerShown: false, animation: 'slide_from_right' }} />
      <Stack.Screen name="setNotifications" options={{ headerShadowVisible: false, title: 'Permítenos enviar notificaciones', headerShown: true, headerBackTitleVisible: false, }} />
      <Stack.Screen name="setAvatar" options={{ headerShadowVisible: false, title: 'Actualiza tu foto de Perfil', headerBackTitleVisible: false }} />
      {/* <Stack.Screen name="setFriends" options={{ headerShadowVisible: false, title: 'Agrega a tus amigos', headerBackTitleVisible: false }} /> */}
    </Stack>
  );
}

const backIcon = <Ionicons name="chevron-back-outline" size={30} color={COLORS.blue} onPress={() => { router.replace('/home') }} />;
// const done = <TouchableOpacity onPress={() => { router.replace('/home') }}><Text style={{ color: COLORS.blue, fontFamily: FONTS.medium, fontSize: 18, marginRight: 10 }}>Listo</Text></TouchableOpacity>;
