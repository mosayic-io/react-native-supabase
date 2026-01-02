-- Seed file for development data
-- This file is run after migrations when using `supabase db reset`

-- Create a test user for development
-- Email: john@example.com
-- Password: password123
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
  '00000000-0000-0000-0000-000000000000',
  'john@example.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"display_name": "John K"}',
  'authenticated',
  'authenticated'
);

-- The handle_new_user trigger automatically creates the public.users entry
-- Update it with the display name
UPDATE public.users
SET display_name = 'John K'
WHERE id = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';

-- Seed posts
INSERT INTO public.posts (title, content, excerpt, slug, published, published_at, user_id)
VALUES
  (
    'Getting Started with React Native',
    'React Native is a powerful framework for building mobile applications using JavaScript and React.

## Prerequisites

Before you begin, make sure you have Node.js installed. You''ll also need Xcode for iOS or Android Studio for Android development.

## Creating Your First App

The easiest way to get started is with Expo:

```bash
npx create-expo-app my-app
cd my-app
npx expo start
```

This will launch the Expo development server and you can preview your app on a physical device or emulator.',
    'Learn how to set up your React Native development environment and create your first mobile app.',
    'getting-started-react-native',
    true,
    NOW() - INTERVAL '1 week',
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'
  ),
  (
    'Understanding Supabase Authentication',
    'Supabase provides a complete authentication solution out of the box.

## Supported Auth Methods

- Email and password
- Magic links
- OAuth providers (Google, GitHub, Apple)
- Phone/SMS authentication

## Basic Setup

```typescript
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Sign up
await supabase.auth.signUp({ email, password })

// Sign in
await supabase.auth.signInWithPassword({ email, password })
```',
    'A guide to implementing authentication with Supabase in your mobile app.',
    'supabase-authentication',
    true,
    NOW() - INTERVAL '3 days',
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'
  ),
  (
    'Building Offline-First Mobile Apps',
    'Offline support is crucial for mobile apps. Users expect apps to work regardless of network conditions.

## Strategies

1. **Optimistic Updates** - Update UI immediately, sync later
2. **Local Caching** - Store data locally with AsyncStorage or SQLite
3. **Background Sync** - Queue operations and sync when online

## React Query for Caching

React Query provides excellent caching out of the box and pairs well with Supabase.',
    'Best practices for building mobile apps that work without an internet connection.',
    'offline-first-mobile-apps',
    true,
    NOW() - INTERVAL '5 days',
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'
  ),
  (
    'Draft: Advanced State Management',
    'Exploring different state management approaches in React Native.

## Topics to Cover

- Zustand vs Redux
- Server state vs client state
- When to use React Context',
    NULL,
    'advanced-state-management',
    false,
    NULL,
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'
  ),
  (
    'React Native Performance Tips',
    'Performance matters for user experience. Here are key optimizations for React Native apps.

## Key Optimizations

1. **Use FlatList** for long lists instead of ScrollView
2. **Memoize components** with React.memo() for expensive renders
3. **Optimize images** - use proper sizing and caching
4. **Avoid anonymous functions** in render methods
5. **Use Hermes** JavaScript engine for faster startup

## Profiling

Use React DevTools and Flipper to identify performance bottlenecks.',
    'Essential performance optimizations for React Native applications.',
    'react-native-performance',
    true,
    NOW(),
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'
  );
