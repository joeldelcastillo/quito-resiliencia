import * as Device from 'expo-device';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { doc, updateDoc } from 'firebase/firestore';
import { useState, useEffect, useRef } from 'react';
import { Platform, KeyboardAvoidingView, SafeAreaView, Image, Text, TouchableOpacity, StyleSheet, View, Alert } from 'react-native';

import StepsHeader from '@/components/StepsHeader';
import { Auth, Firestore } from '@/functions/firebase/connection';
import { getPrivateUserRef, getUserRef } from '@/functions/helpers/getReferences';
import { userConverter } from '@/functions/types/UserTypes';

import FONTS from '@/constants/Fonts';
import COLORS from '@/constants/Palette';
import MyButton from '@/components/ui/Button';
import Constants from 'expo-constants';
import { useUser } from '@/functions/providers/AuthProvider';
import { router } from 'expo-router';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


const SetWelcomeScreen: React.FC = () => {
  const [currentUser, setCurrentUser] = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const onNextPressed = async () => {
    setIsLoading(true);
    if (!Auth.currentUser) return;
    const userRef = getUserRef(Auth.currentUser?.uid!);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentUser?.completedInfo !== 'welcome') await updateDoc(userRef, { completedInfo: 'welcome' }).catch((error) => Alert.alert('Error updating document: ', error));
    if (currentUser?.completedInfo === 'welcome') router.push('/profile/setZone');
    setIsLoading(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <KeyboardAvoidingView style={{ flex: 1, paddingHorizontal: 20, alignItems: 'center', width: '100%' }}
        behavior="padding">
        <StepsHeader slides={5} currentIndex={0} />
        <View style={styles.container}>
          <Text style={styles.header}>Bienvenid@ {Auth.currentUser?.displayName?.split(" ")[0]} 🤩🤩🤩</Text>
          <Text style={styles.subHeader}>Vamos a completar tu perfil para que empieces a viajar con nosotros.</Text>
        </View>
        <MyButton title='Siguiente' onPress={onNextPressed} disabled={false} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SetWelcomeScreen;

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    color: COLORS.title,
    fontFamily: FONTS.bold,
    fontSize: 24,
    marginBottom: 10,
  },
  subHeader: {
    color: COLORS.title,
    fontFamily: FONTS.regular,
    fontSize: 16,
    marginBottom: 20,
  },
  routeContainer: {
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  routeText: {
    color: COLORS.blue,
    fontFamily: FONTS.mediumItalic,
    fontSize: 15,
  },
  addButton: {
    marginRight: 10,
  },
  timeInput: {
    width: 80,
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 5,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  containerTime: {
    backgroundColor: COLORS.title,
    marginLeft: 'auto',
    borderRadius: 5,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: 180,
  },
  textTime: {
    marginTop: 0,
    textAlign: 'left',
    fontFamily: FONTS.regular,
    color: COLORS.background,
    fontSize: 18,
  },
  textTitle: {
    marginTop: 0,
    textAlign: 'left',
    color: COLORS.title,
    fontSize: 18,
  },
});

// async function registerForPushNotificationsAsync() {
//   let token;

//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     // Learn more about projectId:
//     // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
//     token = (
//       await Notifications.getExpoPushTokenAsync({
//         projectId: '33fcc4f2-be16-42e5-b2f4-c5c783dc4029',
//       })
//     ).data;
//     console.log(token);
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }

//   return token;
// }
