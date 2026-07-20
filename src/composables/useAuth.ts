import { ref, onMounted } from 'vue'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/stores/userStore'
import { useFoodStore } from '@/stores/foodStore'

const user = ref<User | null>(null)
const session = ref<Session | null>(null)
const loading = ref(true)

export function useAuth() {
  const userStore = useUserStore()
  const foodStore = useFoodStore()

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
  }

  async function migrateLocalData() {
    const userId = user.value?.id
    if (!userId) return

    userStore.setUserId(userId)
    foodStore.setUserId(userId)

    await userStore.migrateToSupabase()
    await foodStore.migrateToSupabase()

    await userStore.loadProfile()
    await foodStore.loadEntries()
  }

  onMounted(() => {
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      session.value = s
      user.value = s?.user ?? null
      if (s?.user) {
        await migrateLocalData()
      }
      loading.value = false
    })

    supabase.auth.onAuthStateChange(async (_event, s) => {
      session.value = s
      user.value = s?.user ?? null
      if (s?.user) {
        await migrateLocalData()
      } else {
        userStore.setUserId('')
        foodStore.setUserId('')
        await userStore.loadProfile()
        await foodStore.loadEntries()
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
