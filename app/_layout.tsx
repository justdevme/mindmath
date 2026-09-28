import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AssignmentsProvider } from '@/store/AssignmentsContext';
import { AuthProvider, useAuth } from '@/store/AuthContext';
import { NotificationsProvider } from '@/store/NotificationsContext';
import { colors } from '@/theme';

function RootLayoutNav() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, loading, segments, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(auth)" />
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
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <AssignmentsProvider>
            <NotificationsProvider>
              <StatusBar style="dark" />
              <RootLayoutNav />
            </NotificationsProvider>
          </AssignmentsProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
