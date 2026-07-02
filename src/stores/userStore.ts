import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserProfile, CalorieGoals } from '../types/user'
import { calculateCalorieGoals } from '../utils/mifflinStJeor'

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  age: 30,
  weight: 70,
  height: 170,
  sex: 'female',
  activityLevel: 'moderate',
  goal: 'maintain',
}

function loadProfile(): UserProfile {
  try {
    const stored = localStorage.getItem('avocato-user-profile')
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<UserProfile>
      return { ...DEFAULT_PROFILE, ...parsed }
    }
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_PROFILE }
}

function persistProfile(profile: UserProfile) {
  localStorage.setItem('avocato-user-profile', JSON.stringify(profile))
}

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile>(loadProfile())

  function updateProfile(partial: Partial<UserProfile>) {
    Object.assign(profile.value, partial)
    persistProfile(profile.value)
  }

  function resetProfile() {
    profile.value = { ...DEFAULT_PROFILE }
    persistProfile(profile.value)
  }

  const goals = computed<CalorieGoals>(() => {
    if (!profile.value.name) {
      return { bmr: 0, tdee: 0, targetCalories: 0, proteinGrams: 0, fatGrams: 0, carbGrams: 0 }
    }
    return calculateCalorieGoals(profile.value)
  })

  const isProfileComplete = computed(() => {
    return (
      profile.value.name.length > 0 &&
      profile.value.age > 0 &&
      profile.value.weight > 0 &&
      profile.value.height > 0
    )
  })

  return { profile, goals, isProfileComplete, updateProfile, resetProfile }
})
