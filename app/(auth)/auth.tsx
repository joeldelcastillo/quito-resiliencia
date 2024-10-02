import { AuthSessionResult, Prompt, exchangeCodeAsync, makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import { signInWithCustomToken, updateEmail, updateProfile } from 'firebase/auth';
import { getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { jwtDecode } from "jwt-decode";
import React, { useEffect } from 'react';
import { Text, StyleSheet, View, ImageBackground, Image, ActivityIndicator, Button } from 'react-native';

import AuthProvider from '@/functions/providers/AuthProvider';
import { getPrivateUserRef, getUserRef } from '@/functions/helpers/getReferences';
import FONTS from '@/constants/Fonts';
import COLORS from '@/constants/Palette';
import { Token } from '@/functions/types/JWTTypes';
import { User, privateUserInitialState, userInitialState } from '@/functions/types/UserTypes';
import { Auth } from '@/functions/firebase/connection';
import MyButton from '@/components/ui/Button';
import { Stack } from 'expo-router';


const background = { uri: "../../assets/usfq-lake.jpg" };

WebBrowser.maybeCompleteAuthSession();

const SignUpScreen: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  // const [token, setToken] = React.useState<string | null>(null);
  const [msUser, setMsUser] = React.useState<string>('');
  const [timer, setTimer] = React.useState<NodeJS.Timeout | null>(null);

  const functions = getFunctions();
  // const clientId = 'c898c072-9524-4a34-a550-21d331a6b4a5';
  const clientId = '3e9810e7-625d-4bf8-906e-10a1a8af3093';
  const tenantId = '9f119962-8c62-431c-a8ef-e7e0a42d11fc';
  // const tenantId = '1d45966f-07d4-4523-abda-7b334399dfdf';
  const requestAuthToken = httpsCallable(functions, 'createCustomAzureToken');

  const discovery = useAutoDiscovery('https://login.microsoftonline.com/' + tenantId + '/v2.0');
  const redirectUri = makeRedirectUri({
    scheme: 'collider',
    path: 'auth',
  });

  // React.useEffect(() => {
  //   async function requestToken() {
  //     const requestObj = {
  //       uid: '7777e6ef-be73-4f48-b860-3508a0e647c6',
  //       name: 'Joel Benjamin',
  //       email: 'jdelcastillo@estud.usfq.edu.ec',
  //       lastName: 'Del Castillo Baquero',
  //       fullName: 'Joel Benjamin Del Castillo Baquero',
  //     };

  //     console.log(requestObj);

  //     const result = await requestAuthToken(requestObj);
  //     const tokenResponse = result.data as { customToken: string };
  //     console.log(tokenResponse);
  //   }
  //   requestToken();
  // }, []);
  // React.useEffect(() => {
  //   signInWithCustomToken(
  //     Auth,
  //     'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTcwNjI3MzY3OSwiZXhwIjoxNzA2Mjc3Mjc5LCJpc3MiOiIxMDE1ODcxMTIyMjUwLWNvbXB1dGVAZGV2ZWxvcGVyLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJzdWIiOiIxMDE1ODcxMTIyMjUwLWNvbXB1dGVAZGV2ZWxvcGVyLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJ1aWQiOiI3Nzc3ZTZlZi1iZTczLTRmNDgtYjg2MC0zNTA4YTBlNjQ3YzYiLCJjbGFpbXMiOnsiZW1haWwiOiJqZGVsY2FzdGlsbG9AZXN0dWQudXNmcS5lZHUuZWMiLCJuYW1lIjoiSm9lbCBCZW5qYW1pbiJ9fQ.RNGcHNs0rmP8nqcsN9AxpwvhHahF1I16h7aMCctfD1MPzdgdrT_PeV4ZUZCeZl5OQtGFPY2yp9yE-A0IxLKou5gNevdkDAGIutD80lnrqPU4TJCaXXbvqpPSnR1-SCXkN0DFSYdRtZmxlMBXUeQHEynU_IZCK2kwRA0OVmAqKmRDKW7oNG1R14Sqf6aLTFe9DoHJjbs2ivq3gGdvRo3W-QYZ-ur67ZKIYzldbWV02v-1cqdlcfRd_QyvUT-QyyhtLqXsdgBJUTadczPRagiC4xACSiwpq79X3oXyn5vfLLy9HXOT7Mmvts9HPjgWBYMUZRacZOdngKmUJxUSjF48cg'
  //   );
  // }, []);

  const setLoadingTimeOut = () => {
    setTimer(
      setTimeout(() => {
        // Alert.alert('Error', 'You took too long to click!');
        setIsLoading(false);
      }, 100000) // 100 seconds = 100000 milliseconds
    );
  };

  const startTimeOut = () => {
    setIsLoading(true);
    setLoadingTimeOut();
  };

  const cancelTimeOut = () => {
    clearTimeout(timer!);
    setTimer(null);
    setIsLoading(false);
  };

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  const [request, , promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ['openid', 'profile', 'email', 'offline_access'],
      redirectUri,
      prompt: Prompt.SelectAccount,
    },
    discovery
  );

  const performCodeExchange = async (codeResponse: AuthSessionResult) => {
    if (codeResponse.type === 'success' && codeResponse.params) {
      const res = await exchangeCodeAsync(
        {
          clientId,
          code: codeResponse.params.code,
          extraParams: request?.codeVerifier ? { code_verifier: request.codeVerifier } : undefined,
          redirectUri,
        },
        discovery!
      );
      return res.accessToken;
    }
  };

  // Should I decode the token here?
  const decodeToken = (accessToken: string) => {
    return jwtDecode(accessToken) as Token;
  };

  const updateUserInfo = async (token: string) => {
    const requestObj = {
      token,
    };

    // console.log(requestObj);

    const result = await requestAuthToken(requestObj);
    const tokenResponse = result.data as { customToken: string };
    return tokenResponse.customToken;
  };

  const signInUser = async (customToken: string) => {
    const userCredential = await signInWithCustomToken(Auth, customToken);
    return userCredential;
  };

  const updateProfileAndNavigate = async (decoded: Token) => {
    if (!decoded.oid) {
      console.error('User ID is undefined');
      return;
    }
    const userRef = getUserRef(decoded.oid.toString());
    const userPrivateRef = getPrivateUserRef(decoded.oid.toString());
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      console.log('User already exists in Firestore!');
    } else {
      await updateEmail(Auth.currentUser!, decoded.upn!).then(() => {
        updateProfile(Auth.currentUser!, {
          displayName: decoded.name,
        });
      });
      const updatedUserState: User = {
        ...userInitialState,
        uid: decoded.oid,
        name: decoded.given_name || '',
        email: decoded.upn || '',
        lastName: decoded.family_name || '',
        fullName: decoded.name || '',
      };
      console.log(updatedUserState);
      await setDoc(userRef, updatedUserState);
      await setDoc(userPrivateRef, privateUserInitialState);
      console.log('User Created in Firestore!');
    }

    cancelTimeOut();
  };

  const onLoginPressed = async () => {
    try {
      const codeResponse = await promptAsync().then();
      startTimeOut();

      if (request && codeResponse?.type === 'success' && discovery) {
        const accessToken = await performCodeExchange(codeResponse);
        const decoded = decodeToken(accessToken!);
        console.log(decoded);
        setMsUser(accessToken!);
        const customToken = await updateUserInfo(accessToken!);
        await signInUser(customToken);
        if (!Auth.currentUser) {
          console.error('User is not signed in');
          return;
        }
        await updateProfileAndNavigate(decoded);
      } else {
        cancelTimeOut();
      }
    } catch (error) {
      console.error(error);
      // Handle errors here
      // ...
    }
  };
  console.log(redirectUri);
  return (
    <View style={signUpStyles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground source={require('../../assets/images/usfq-lake.jpg')} style={signUpStyles.image}>
        <LinearGradient colors={['transparent', 'rgba(10,10,10,0.8)']} style={{ position: 'absolute', width: '100%', height: '100%' }} />
      </ImageBackground>

      <View style={signUpStyles.page}>
        <View style={{ flexDirection: 'row', height: 90, justifyContent: 'center', width: '100%', alignItems: 'center', alignContent: 'center' }}>
          {/* <Image source={require('../../../assets/collider_icon.png')} resizeMode="contain" style={{ width: 70, height: 70, alignSelf: 'center' }} /> */}
          <View style={{ flexDirection: 'column' }}>
            <Text style={signUpStyles.textLogo}>liebre</Text>
            <Text style={signUpStyles.text}>@usfqrushes</Text>
          </View>
        </View>

        {/* <Text style={signUpStyles.text}>
          Creemos en el poder de las historias y la <Text>conexión humana</Text>
        </Text> */}
        <View style={{ height: 30 }} />
        {/* <Button style={signUpStyles.btn} labelStyle={signUpStyles.label} onPress={onLoginPressed} title='Únete, dragón 🐉'/> */}
        <MyButton onPress={onLoginPressed} title='Únete, dragón 🐉' disabled={false} />
      </View>

      {isLoading && (
        <View style={signUpStyles.backdrop}>
          <ActivityIndicator size={50} animating={isLoading} color={COLORS.title} />
        </View>
      )}
    </View>
  );
};

const signUpStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS.background,
  },
  btn: {
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: COLORS.title,
  },
  label: {
    color: COLORS.background,
    fontFamily: FONTS.medium,
    fontSize: 15,
  },
  pressable: {
    borderRadius: 5,
    marginVertical: 10,
  },
  pressableText: {
    fontSize: 15,
    fontFamily: FONTS.medium,
    letterSpacing: 0.25,
    color: COLORS.title,
  },

  image: {
    flex: 1,
    height: '100%',
    opacity: 1,
    justifyContent: 'center',
  },
  page: {
    position: 'absolute',
    top: '70%',
    width: '100%',
    height: '60%',
    paddingHorizontal: '10%',
  },
  backdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: '10%',
  },
  text: {
    color: COLORS.title,
    fontSize: 18,
    fontFamily: FONTS.regular,
    textAlign: 'center',
  },

  textLogo: {
    color: COLORS.title,
    fontSize: 30,
    fontFamily: FONTS.bold,
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default SignUpScreen;
