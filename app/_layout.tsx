import { Slot, useRouter, useSegments, type Href } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useMemo } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { QueryClientProvider } from '@tanstack/react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { queryClient } from '@/src/lib/queryClient'
import { useAuthStore } from '@/src/features/auth'
import { useColors } from '@/src/hooks/useColors'
import { ErrorBoundary } from '@/src/components/error'
import { Button, Text } from '@/src/components/ui'

function LoadingScreen() {
  const colors = useColors()

  return (
    <View
      style={[styles.loadingContainer, { backgroundColor: colors.background }]}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading application"
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  )
}

function InitializationError({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  const colors = useColors()
  const errorStyles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
          backgroundColor: colors.background,
        },
        message: {
          marginVertical: 16,
          textAlign: 'center',
        },
      }),
    [colors]
  )

  return (
    <View style={errorStyles.container} accessibilityRole="alert">
      <Text variant="h2">Unable to start the app</Text>
      <Text variant="body" color="secondary" style={errorStyles.message}>
        {message}
      </Text>
      <Button onPress={onRetry} variant="primary">
        Retry
      </Button>
    </View>
  )
}

function RootLayoutNav() {
  const session = useAuthStore((state) => state.session)
  const isInitialized = useAuthStore((state) => state.isInitialized)
  const initError = useAuthStore((state) => state.initError)
  const initialize = useAuthStore((state) => state.initialize)
  const setupAuthListener = useAuthStore((state) => state.setupAuthListener)
  const segments = useSegments()
  const router = useRouter()

  // Set up auth listener on mount
  useEffect(() => {
    const unsubscribe = setupAuthListener()
    return unsubscribe
  }, [setupAuthListener])

  // Initialize auth session
  useEffect(() => {
    initialize()
  }, [initialize])

  // Handle navigation based on auth state
  useEffect(() => {
    if (!isInitialized || initError) return

    const inAuthGroup = (segments[0] as string) === '(auth)'

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/sign-in' as Href)
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)' as Href)
    }
  }, [session, isInitialized, segments, router, initError])

  if (initError) {
    return (
      <InitializationError
        message={initError.message}
        onRetry={() => {
          void initialize()
        }}
      />
    )
  }

  if (!isInitialized) {
    return <LoadingScreen />
  }

  return <Slot />
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <RootLayoutNav />
            <StatusBar style="auto" />
          </QueryClientProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
