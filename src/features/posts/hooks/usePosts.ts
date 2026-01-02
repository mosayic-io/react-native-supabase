import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { supabase } from '@/src/lib/supabase'
import type { Post, PostInsert, PostUpdate } from '@/src/types/database'

export const postKeys = {
  all: ['posts'] as const,
  list: (userId: string) => [...postKeys.all, 'list', userId] as const,
  detail: (id: string) => [...postKeys.all, 'detail', id] as const,
}

export function usePosts(userId: string | undefined) {
  return useQuery({
    queryKey: postKeys.list(userId ?? ''),
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required')

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw new Error(error.message)
      return data
    },
    enabled: !!userId,
  })
}

export function usePost(id: string | undefined) {
  return useQuery({
    queryKey: postKeys.detail(id ?? ''),
    queryFn: async () => {
      if (!id) throw new Error('Post ID is required')

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw new Error(error.message)
      return data
    },
    enabled: !!id,
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (post: PostInsert) => {
      const { data, error } = await supabase
        .from('posts')
        .insert(post)
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all })
    },
  })
}

export function useUpdatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: PostUpdate }) => {
      const { data, error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(postKeys.detail(variables.id), data)
      queryClient.invalidateQueries({ queryKey: postKeys.all })
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('posts').delete().eq('id', id)
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all })
    },
  })
}

export function usePublishPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('posts')
        .update({ published: true, published_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: (data, id) => {
      queryClient.setQueryData(postKeys.detail(id), data)
      queryClient.invalidateQueries({ queryKey: postKeys.all })
    },
  })
}

export function useUnpublishPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('posts')
        .update({ published: false, published_at: null })
        .eq('id', id)
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: (data, id) => {
      queryClient.setQueryData(postKeys.detail(id), data)
      queryClient.invalidateQueries({ queryKey: postKeys.all })
    },
  })
}

// Re-export types for convenience
export type { Post, PostInsert, PostUpdate }
