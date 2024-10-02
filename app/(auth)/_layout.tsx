import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { Slot } from 'expo-router';


import { useColorScheme } from '@/components/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function StartLayoutNav() {
  const colorScheme = useColorScheme();
  return (
    <Stack>
      <Stack.Screen name="auth" />
    </Stack>
  );
}
