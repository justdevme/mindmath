import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AssignmentsProvider } from '@/store/AssignmentsContext';
import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AssignmentsProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="homework/[id]/index" options={{ presentation: 'card' }} />
            <Stack.Screen name="homework/[id]/submit" options={{ presentation: 'card' }} />
            <Stack.Screen name="homework/[id]/result" options={{ presentation: 'card' }} />
            <Stack.Screen name="homework/[id]/solution" options={{ presentation: 'card' }} />
            <Stack.Screen name="homework/[id]/practice" options={{ presentation: 'card' }} />
            <Stack.Screen name="notifications" options={{ presentation: 'modal' }} />
            <Stack.Screen name="test-history" options={{ presentation: 'card' }} />
            <Stack.Screen name="personal-info" options={{ presentation: 'card' }} />
            <Stack.Screen name="linked-parents" options={{ presentation: 'card' }} />
            <Stack.Screen name="notification-settings" options={{ presentation: 'card' }} />
            <Stack.Screen name="change-password" options={{ presentation: 'card' }} />
            <Stack.Screen name="help" options={{ presentation: 'card' }} />
          </Stack>
        </AssignmentsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
