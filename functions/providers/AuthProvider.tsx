import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';
import { DocumentReference, Query, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import React, { useContext } from 'react';
import { createGlobalState } from 'react-native-global-state-hooks';

import { Auth, Firestore } from '../firebase/connection';
// import { eventArrayUnion, groupArrayUnion, notificationArrayUnion, profileArrayUnion } from '../../Helpers/arrayModifiers';
import { getChatsRef, getEventsCollectionRef, getMessagesRef, getPrivateUserRef, getPublicDataRef, getTripsCollectionRef, getUsersCollectionRef } from '../helpers/getReferences';
import { parseUsers, PrivateUser, User, userConverter, userInitialState } from '../types/UserTypes';
import { router, usePathname } from 'expo-router';
import { parseTrips, Trip, tripConverter } from '../types/TripTypes';
import { Alert, AppState } from 'react-native';
import { Schedule } from '../types/ScheduleTypes';
import { Chat, chatConverter } from '../types/ChatTypes';
import { parseMessages, Message } from '../types/MessageTypes';
import { Event, eventConverter } from '../types/EventTypes';

export const useUser = createGlobalState<User | undefined>(undefined);
export const usePrivateUser = createGlobalState<PrivateUser | undefined>(undefined);

export const useTrips = createGlobalState<Record<string, Trip>>({});
export const useProfiles = createGlobalState<Record<string, User>>({});
export const useSchedules = createGlobalState<Record<string, Record<string, Schedule>>>({});
export const useChats = createGlobalState<Record<string, Chat>>({});
export const useMessages = createGlobalState<Record<string, Record<string, Message>>>({});
export const useEvents = createGlobalState<Record<string, Event>>({});
// export const useRatings = createGlobalState<Record<string, Rating>>({});

export const useRequests = createGlobalState<Request[]>([]);
export const usePublic = createGlobalState<any>(null);
export const useNotifications = createGlobalState<Notification[]>([]);
export const usePath = createGlobalState<string>('');

interface ContextInterface {
  user: User | undefined;
  signIn: React.Dispatch<React.SetStateAction<User | undefined>>;
  signOut: () => void;
}

const contextInitialState: ContextInterface = {
  user: userInitialState,
  signIn: () => {
    console.log('Sign in function not initialized');
  },
  signOut: () => {
    Auth.signOut();
  },
};

export const randomShift = () => {
  const min = -10;
  const max = 10;
  const value = Math.floor(Math.random() * (max - min + 1)) + min;
  return value / 100000;
};

const AuthContext = React.createContext<ContextInterface>(contextInitialState);

export function useAuth(): ContextInterface {
  const context = React.useContext<ContextInterface>(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: React.PropsWithChildren<object>): JSX.Element {
  const [userData, setUserData] = useUser(); // State for user data fetched from Firestore

  const [trips, setTrips] = useTrips();
  const [profiles, setProfiles] = useProfiles();
  const [messages, setMessages] = useMessages();
  const [events, setEvents] = useEvents();

  const [publicData, setPublicData] = usePublic(); // State for user data fetched from Firestor
  const [requests, setRequests] = useRequests();
  const [notifications, setNotifications] = useNotifications(); // State for event data fetched from Firestore
  const [, setUserRef] = React.useState<DocumentReference<User> | undefined>(undefined); // State for user document reference in Firestore
  const [privateUser, setPrivateUser] = usePrivateUser(); // State for private user data fetched from Firestore
  const [chats, setChats] = useChats(); // State for private user data fetched from Firestore
  const [hasNavigated, setHasNavigated] = React.useState(false);
  const [isAppFirstLaunched, setIsAppFirstLaunched] = React.useState<null | boolean>(null);
  const [queryRequests, setQueryRequests] = React.useState<Query<Request>>();
  const currentPath = usePathname();

  // Check if the app has been launched before
  React.useEffect(() => {
    async function checkLaunch() {
      // await AsyncStorage.removeItem('isAppFirstLaunched');
      getAsyncData();
      const appData = await AsyncStorage.getItem('isAppFirstLaunched');

      if (appData == null) {
        setIsAppFirstLaunched(true);
        AsyncStorage.setItem('isAppFirstLaunched', 'false');
        // router.replace('/index');
      } else setIsAppFirstLaunched(false);
    }
    checkLaunch();
  }, [Auth.currentUser?.uid]);

  async function getAsyncData() {
    const asyncTrips = await AsyncStorage.getItem('trips');
    const asyncProfiles = await AsyncStorage.getItem('profiles');
    const asyncMessages = await AsyncStorage.getItem('messages');
    const asyncEvents = await AsyncStorage.getItem('events');
    const asyncChats = await AsyncStorage.getItem('chats');

    let cachedTrips: Record<string, Trip> = {}
    let cachedProfiles: Record<string, User> = {}
    let cachedMessages: Record<string, Record<string, Message>> = {}
    let cachedEvents: Record<string, Event> = {}
    let cachedChats: Record<string, Chat> = {}

    if (asyncTrips) cachedTrips = parseTrips(asyncTrips);
    if (asyncProfiles) cachedProfiles = parseUsers(asyncProfiles);
    if (asyncMessages) cachedMessages = parseMessages(asyncMessages);
    if (asyncEvents) cachedEvents = JSON.parse(asyncEvents);
    if (asyncChats) cachedChats = JSON.parse(asyncChats);

    console.log('Number of chats in cache:: ', Object.keys(cachedMessages).length);

    queryTrips(cachedTrips);
    queryProfiles(cachedProfiles);
    queryEvents(cachedEvents);
    setChats(cachedChats);
    setMessages(cachedMessages);
  }

  // React.useEffect(() => {
  //   const handleAppStateChange = async (nextAppState: string) => {
  //     if (nextAppState === 'background' || nextAppState === 'inactive') {
  //       await AsyncStorage.setItem('trips', JSON.stringify(trips));
  //       await AsyncStorage.setItem('profiles', JSON.stringify(profiles));
  //       await AsyncStorage.setItem('messages', JSON.stringify(messages));
  //       console.log('App State: ', nextAppState);
  //       console.log('Saved Items');
  //     }
  //   };
  //   const subscription = AppState.addEventListener('change', handleAppStateChange);
  //   return () => { subscription.remove() };
  // }, []);

  // Check the Auth status, Fetch user data from Firestore and navigate to the correct screen
  React.useEffect(() => {
    const unsubscribeAuth = Auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userRef = doc(Firestore, 'users', userAuth.uid).withConverter(userConverter);
        setUserRef(userRef);
        const unsubscribeFirestore = onSnapshot(userRef, async (doc) => { if (doc.exists()) { setUserData(doc.data()) } });
        router.replace('/(tabs)/home');
        setHasNavigated(true);
        return unsubscribeFirestore;
      } else {
        setUserData(userInitialState);
        if (isAppFirstLaunched) {
          router.replace('/(login)/one');
          setHasNavigated(true);
        } else {
          router.replace('/auth');
          setHasNavigated(true);
        }
      }
    });
    return unsubscribeAuth;
  }, [hasNavigated]);


  React.useEffect(() => {
    if (!userData || userData?.uid === '' || !Auth.currentUser) return;
    console.log('Completed Info from Current User: ', userData.completedInfo);
    switch (userData.completedInfo) {
      case '':
        router.push('/profile/setWelcome');
        break;
      case 'welcome':
        router.push('/profile/setZone');
        break
      case 'zone':
        router.push('/profile/setNotifications');
        break;
      case 'notifications':
        router.push('/profile/setAvatar');
        break;
      case 'avatar':
        // router.push('/profile');
        setHasNavigated(true);
        break;
      case 'friends':
        setHasNavigated(true);
        // setHasNavigated(true);
        break;
    }
  }, [userData?.completedInfo, Auth.currentUser]);


  React.useEffect(() => {
    const fetchPrivateData = async () => {
      if (!Auth.currentUser?.uid) return;

      const asyncNotifications = await AsyncStorage.getItem('notifications');
      const privateUserRef = getPrivateUserRef(Auth.currentUser?.uid!);
      // const asyncPrivateUser = await AsyncStorage.getItem('privateUser');

      // if (asyncNotifications) {
      //   const cachedNotifications = JSON.parse(asyncNotifications);
      //   setNotifications(cachedNotifications);
      //   queryNotifications(cachedNotifications);
      // } else queryNotifications([]);

      const unsubscribeFirestore = onSnapshot(privateUserRef, (doc) => {
        if (doc.exists()) {
          // console.log('Private user data: ', doc.data());
          setPrivateUser(doc.data());
          // const chatsRef = getChatsRef(doc.data().chats);

        }
      });
      return unsubscribeFirestore;
    };
    fetchPrivateData();
  }, [userData]);




  const queryTrips = async (cachedTrips: Record<string, Trip>) => {
    setTrips(cachedTrips);
    const ref = getTripsCollectionRef();
    const cachedTripsKeys = Object.keys(cachedTrips);
    // TO DO: Do something with the deleted Trips that are still in cache
    let lastUpdated = new Date(0);
    if (cachedTripsKeys.length > 0) {
      lastUpdated = Object.values(cachedTrips).reduce((prev, current) => (prev.updatedAt! > current.updatedAt! ? prev : current)).updatedAt || new Date(0);
    }
    const q = query(ref, where('updatedAt', '>', lastUpdated)).withConverter(tripConverter);
    const querySnapshot = await getDocs(q);
    console.log('Trips lastUpdated: ', lastUpdated, " || Number of trips fetched: ", querySnapshot.size, " || Number of trips in cache: ", cachedTripsKeys.length);

    setTrips((prevTrips) => {
      let updatedTrips = { ...prevTrips };
      querySnapshot.forEach((doc) => {
        updatedTrips[doc.id] = doc.data();
      });
      AsyncStorage.setItem('trips', JSON.stringify(updatedTrips));
      return updatedTrips;
    });
  }

  const queryProfiles = async (cachedProfiles: Record<string, User>) => {
    setProfiles(cachedProfiles);
    const ref = getUsersCollectionRef();

    let lastUpdated = new Date(0);
    const cachedProfilesKeys = Object.keys(cachedProfiles);
    if (cachedProfilesKeys.length > 0) {
      lastUpdated = Object.values(cachedProfiles).reduce((prev, current) => (prev.updatedAt! > current.updatedAt! ? prev : current)).updatedAt || new Date(0);
    }
    const q = query(ref, where('updatedAt', '>', lastUpdated)).withConverter(userConverter);
    const querySnapshot = await getDocs(q);
    console.log('Users lastUpdated: ', lastUpdated, " || Number of users fetched: ", querySnapshot.size, " || Number of users in cache: ", cachedProfilesKeys.length);

    setProfiles((prevProfiles) => {
      let updatedProfiles = { ...prevProfiles };
      querySnapshot.forEach((doc) => {
        updatedProfiles[doc.id] = doc.data();
      });
      AsyncStorage.setItem('profiles', JSON.stringify(updatedProfiles));
      return updatedProfiles;
    });
  }

  const queryEvents = async (cachedEvents: Record<string, Event>) => {
    setEvents(cachedEvents);
    const ref = getEventsCollectionRef();

    let lastUpdated = new Date(0);
    const cachedEventsKeys = Object.keys(cachedEvents);
    if (cachedEventsKeys.length > 0) {
      lastUpdated = Object.values(cachedEvents).reduce((prev, current) => (prev.updatedAt! > current.updatedAt! ? prev : current)).updatedAt || new Date(0);
    }
    const q = query(ref, where('updatedAt', '>', lastUpdated)).withConverter(eventConverter);
    const querySnapshot = await getDocs(q);
    console.log('Events lastUpdated: ', lastUpdated, " || Number of events fetched: ", querySnapshot.size, " || Number of events in cache: ", cachedEventsKeys.length);

    setEvents((prevEvents) => {
      let updatedEvents = { ...prevEvents };
      querySnapshot.forEach((doc) => {
        updatedEvents[doc.id] = doc.data();
      });
      AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
      return updatedEvents;
    });
  }

  const queryChats = async (userChats: string[], cachedChats: Record<string, Chat>) => {
    if (!userData || userData.uid === '' || !Auth.currentUser) return;
    const ref = getChatsRef(userChats);
    let chats: Record<string, Chat> = {};

    let lastUpdated = new Date(0);
    const cachedChatsKeys = Object.keys(cachedChats);
    if (cachedChatsKeys.length > 0) {
      lastUpdated = Object.values(cachedChats).reduce((prev, current) => (prev.updatedAt! > current.updatedAt! ? prev : current)).updatedAt || new Date(0);
    }
    const q = query(ref, where('updatedAt', '>', lastUpdated)).withConverter(chatConverter);
    const querySnapshot = await getDocs(q);
    console.log('Chats lastUpdated: ', lastUpdated, " || Number of chats fetched: ", querySnapshot.size, " || Number of chats in cache: ", cachedChatsKeys.length);

    querySnapshot.forEach((doc) => {
      chats[doc.id] = doc.data();
    });
    setChats(chats);
  }

  return (
    <AuthContext.Provider
      value={{
        user: userData,
        signIn: setUserData,
        signOut: () => {
          Auth.signOut();
          setUserData(userInitialState);
          AsyncStorage.clear();
        },
      }
      }>
      {children}
    </AuthContext.Provider>
  );


}

export default AuthProvider;
