import * as Device from 'expo-device';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { doc, updateDoc } from 'firebase/firestore';
import { useState, useEffect, useRef } from 'react';
import { Platform, KeyboardAvoidingView, SafeAreaView, Image, Text, TouchableOpacity, StyleSheet, View, Alert, ActivityIndicator } from 'react-native';

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
import ReactNativeModal from 'react-native-modal';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


const SetNotificationsScreen: React.FC = () => {
  const userRef = getUserRef(Auth.currentUser?.uid!);
  const [currentUser, setCurrentUser] = useUser();
  const privateUserRef = getPrivateUserRef(Auth.currentUser?.uid!);
  const [expoPushToken, setExpoPushToken] = useState<string>('');

  // I think this may have to be at the index, so the app can always listen to notifications
  const [notification, setNotification] = useState<Notifications.Notification>();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const onSkipPressed = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log(currentUser?.completedInfo);
    if (currentUser?.completedInfo !== 'notifications') await updateDoc(userRef, { completedInfo: 'notifications' }).catch((error) => Alert.alert('Error updating document: ', error));
    if (currentUser?.completedInfo === 'notifications') router.push('/profile/setAvatar');

    // router.push('/profile/setZone');
  };


  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((notification: any) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response: any) => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current!);
      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  const onPressPermissions = async () => {
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Failed to get push token for push notification!');
        setIsLoading(false);
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        })
      ).data;
      // navigation is handled by AuthProvided
      try {
        await updateDoc(privateUserRef, { pushToken: token });
        if (currentUser?.completedInfo !== 'notifications') await updateDoc(userRef, { completedInfo: 'notifications' });
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
      // It just runs if the user has come back to the same screen
      if (currentUser?.completedInfo === 'notifications') router.push('/profile/setAvatar');
      console.log(token);
    } else {
      Alert.alert('Must use physical device for Push Notifications');
    }
    setExpoPushToken(token!);
    return token;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <KeyboardAvoidingView style={{ flex: 1, paddingHorizontal: 20, alignItems: 'center', width: '100%' }}
        behavior="padding">
        <StepsHeader slides={5} currentIndex={2} />
        <Image source={require('@/assets/images/notifications.png')} style={pinStyles.image} />
        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 30 }}>
          <MyButton onPress={onPressPermissions} title='Claro que si! 🔔' disabled={false} />
          <TouchableOpacity onPress={onSkipPressed} style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
            <Text style={{ color: COLORS.ternary, textAlign: 'center', fontSize: 15 }}>No quiero ser notificado 😔</Text>
          </TouchableOpacity>
        </View>
        <ReactNativeModal isVisible={isLoading}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size='small' />
          </View>
        </ReactNativeModal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SetNotificationsScreen;

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

const pinStyles = StyleSheet.create({
  btn: {
    marginVertical: 20,
    paddingVertical: 15,
  },
  textButton: {
    color: COLORS.background,
    fontFamily: FONTS.regular,
    fontSize: 16,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.subtitle,
    fontFamily: FONTS.regular,
    fontSize: 16,
    textAlign: 'center',
  },
  image: {
    width: '90%',
    height: 300,
    marginTop: 'auto',
    marginBottom: 'auto',
    resizeMode: 'contain',
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
