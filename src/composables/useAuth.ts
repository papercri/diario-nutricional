import { ref, readonly } from 'vue'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/stores/userStore'
import { useFoodStore } from '@/stores/foodStore'
import { useSavedPlatesStore } from '@/stores/savedPlatesStore'
import { useSavedRecipesStore } from '@/stores/savedRecipesStore'

const user = ref<User | null>(null)
const session = ref<Session | null>(null)
const loading = ref(true)
const authResolved = ref(false)

let initialized = false

const LOCAL_STORAGE_KEYS = [
  'avocato-user-profile',
  'avocato-food-log',
  'avocato-saved-plates',
  'avocato-saved-recipes',
]

let lastSyncedUserId = ''

function syncStoresWithUser(userId: string) {
  if (userId === lastSyncedUserId) return
  lastSyncedUserId = userId

  const userStore = useUserStore()
  const foodStore = useFoodStore()
  const savedPlatesStore = useSavedPlatesStore()
  const savedRecipesStore = useSavedRecipesStore()

  userStore.setUserId(userId)
  foodStore.setUserId(userId)
  savedPlatesStore.setUserId(userId)
  savedRecipesStore.setUserId(userId)
}

function clearAllLocalStorage() {
  for (const key of LOCAL_STORAGE_KEYS) {
    localStorage.removeItem(key)
  }
}

export function initAuth() {
  if (initialized) return
  initialized = true

  supabase.auth.getSession().then(async ({ data: { session: s } }) => {
    session.value = s
    user.value = s?.user ?? null
    if (s?.user) {
      syncStoresWithUser(s.user.id)
    } else {
      const foodStore = useFoodStore()
      foodStore.init()
    }
    loading.value = false
    authResolved.value = true
  })

  supabase.auth.onAuthStateChange(async (event, s) => {
    session.value = s
    user.value = s?.user ?? null

    if (s?.user) {
      if (event === 'SIGNED_IN') {
        clearAllLocalStorage()
      }
      syncStoresWithUser(s.user.id)
    } else {
      syncStoresWithUser('')
    }

    if (!authResolved.value) {
      loading.value = false
      authResolved.value = true
    }
  })
}

export function useAuth() {
  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    user.value = null
    session.value = null
    syncStoresWithUser('')
  }

  return {
    user: readonly(user),
    session: readonly(session),
    loading: readonly(loading),
    authResolved: readonly(authResolved),
    signIn,
    signUp,
    signOut,
  }
}
