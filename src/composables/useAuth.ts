import { ref, onMounted } from 'vue'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/stores/userStore'
import { useFoodStore } from '@/stores/foodStore'
import { useSavedPlatesStore } from '@/stores/savedPlatesStore'
import { useSavedRecipesStore } from '@/stores/savedRecipesStore'

const user = ref<User | null>(null)
const session = ref<Session | null>(null)
const loading = ref(true)

export function useAuth() {
  const userStore = useUserStore()
  const foodStore = useFoodStore()
  const savedPlatesStore = useSavedPlatesStore()
  const savedRecipesStore = useSavedRecipesStore()

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
    userStore.setUserId('')
    foodStore.setUserId('')
    savedPlatesStore.setUserId('')
    savedRecipesStore.setUserId('')
  }

  onMounted(() => {
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      session.value = s
      user.value = s?.user ?? null
      if (s?.user) {
        userStore.setUserId(s.user.id)
        foodStore.setUserId(s.user.id)
        savedPlatesStore.setUserId(s.user.id)
        savedRecipesStore.setUserId(s.user.id)
      }
      loading.value = false
    })

    supabase.auth.onAuthStateChange(async (_event, s) => {
      session.value = s
      user.value = s?.user ?? null
      if (s?.user) {
        userStore.setUserId(s.user.id)
        foodStore.setUserId(s.user.id)
        savedPlatesStore.setUserId(s.user.id)
        savedRecipesStore.setUserId(s.user.id)

        Promise.all([
          userStore.migrateToSupabase(),
          foodStore.migrateToSupabase(),
          savedPlatesStore.migrateToSupabase(),
          savedRecipesStore.migrateToSupabase(),
        ]).catch(() => {})
      } else {
        userStore.setUserId('')
        foodStore.setUserId('')
        savedPlatesStore.setUserId('')
        savedRecipesStore.setUserId('')
      }
    })
  })

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  }
}
