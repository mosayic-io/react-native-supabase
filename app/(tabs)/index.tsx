import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { Text } from '@/src/components/ui'
import { useColors } from '@/src/hooks/useColors'
import { useAuthStore } from '@/src/features/auth'
import { spacing, type Colors } from '@/src/lib/theme'
import { ScreenErrorBoundary } from '@/src/components/error'

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
      backgroundColor: colors.background,
    },
    title: {
      marginBottom: spacing.sm,
    },
    subtitle: {
      textAlign: 'center',
    },
  })

function HomeScreen() {
  const colors = useColors()
  const styles = useMemo(() => createStyles(colors), [colors])
  const user = useAuthStore((state) => state.user)

  return (
    <View style={styles.container}>
      <Text variant="h1" style={styles.title}>
        Welcome!
      </Text>
      <Text variant="body" color="secondary" style={styles.subtitle}>
        Logged in as {user?.email}
      </Text>
    </View>
  )
}

export default function Home() {
  return (
    <ScreenErrorBoundary screenName="Home">
      <HomeScreen />
    </ScreenErrorBoundary>
  )
}
