import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserProfile, CalorieGoals } from '@/types/user'
import type { Allergen, DietaryPreference } from '@/types/recipe'
import { calculateCalorieGoals } from '@/utils/mifflinStJeor'
import { supabase } from '@/lib/supabase'

const STORAGE_KEY = 'avocato-user-profile'

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  age: 30,
  weight: 70,
  height: 170,
  desiredWeight: 65,
  sex: 'female',
  activityLevel: 'moderate',
  goal: 'maintain',
  allergens: [],
  dietaryPreferences: [],
}

function rowToProfile(row: Record<string, unknown>): UserProfile {
  return {
    name: (row.name as string) ?? '',
    age: (row.age as number) ?? 30,
    weight: (row.weight as number) ?? 70,
    height: (row.height as number) ?? 170,
    desiredWeight: (row.desired_weight as number) ?? 65,
    sex: (row.sex as UserProfile['sex']) ?? 'female',
    activityLevel: (row.activity_level as UserProfile['activityLevel']) ?? 'moderate',
    goal: (row.goal as UserProfile['goal']) ?? 'maintain',
    allergens: (row.allergens as Allergen[]) ?? [],
    dietaryPreferences: (row.dietary_preferences as DietaryPreference[]) ?? [],
  }
}

function profileToRow(profile: UserProfile) {
  return {
    name: profile.name,
    age: profile.age,
    weight: profile.weight,
    height: profile.height,
    desired_weight: profile.desiredWeight,
    sex: profile.sex,
    activity_level: profile.activityLevel,
    goal: profile.goal,
    allergens: profile.allergens,
    dietary_preferences: profile.dietaryPreferences,
  }
}

function loadLocal(): UserProfile {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<UserProfile>
      return { ...DEFAULT_PROFILE, ...parsed }
    }
  } catch { /* ignore */ }
  return { ...DEFAULT_PROFILE }
}

function saveLocal(profile: UserProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile>(loadLocal())
  const loaded = ref(true)
  const userId = ref('')

  function setUserId(id: string) {
    userId.value = id
  }

  async function loadProfile() {
    if (userId.value) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId.value)
        .single()
      if (data) {
        profile.value = rowToProfile(data)
        saveLocal(profile.value)
      }
    } else {
      profile.value = loadLocal()
    }
    loaded.value = true
  }

  async function updateProfile(partial: Partial<UserProfile>) {
    Object.assign(profile.value, partial)
    saveLocal(profile.value)
    if (userId.value) {
      const row = profileToRow(profile.value)
      await supabase
        .from('profiles')
        .upsert({ id: userId.value, ...row }, { onConflict: 'id' })
    }
  }

  async function resetProfile() {
    profile.value = { ...DEFAULT_PROFILE }
    saveLocal(profile.value)
    if (userId.value) {
      const row = profileToRow(profile.value)
      await supabase
        .from('profiles')
        .upsert({ id: userId.value, ...row }, { onConflict: 'id' })
    }
  }

  async function migrateToSupabase() {
    if (!userId.value) return
    const local = loadLocal()
    if (local.name || local.age !== 30 || local.weight !== 70) {
      const row = profileToRow(local)
      await supabase
        .from('profiles')
        .upsert({ id: userId.value, ...row }, { onConflict: 'id' })
    }
    localStorage.removeItem(STORAGE_KEY)
  }

  const goals = computed<CalorieGoals>(() => {
    if (!profile.value.name) {
      return {
        bmr: 0,
        tdee: 0,
        targetCalories: 0,
        proteinGrams: 0,
        fatGrams: 0,
        carbGrams: 0,
        timeToGoalMonths: 0,
      }
    }
    return calculateCalorieGoals(profile.value)
  })

  const isProfileComplete = computed(() => {
    return (
      profile.value.name.length > 0 &&
      profile.value.age > 0 &&
      profile.value.weight > 0 &&
      profile.value.height > 0 &&
      profile.value.desiredWeight > 0
    )
  })

  return {
    profile,
    loaded,
    userId,
    goals,
    isProfileComplete,
    setUserId,
    loadProfile,
    updateProfile,
    resetProfile,
    migrateToSupabase,
  }
})
