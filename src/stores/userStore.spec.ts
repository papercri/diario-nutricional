import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from './userStore'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: null },
      }),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null }),
      upsert: vi.fn().mockResolvedValue({ error: null }),
    })),
  },
}))

describe('useUserStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('loads default profile when no data exists', () => {
      const store = useUserStore()
      expect(store.profile.name).toBe('')
      expect(store.profile.age).toBe(30)
      expect(store.profile.weight).toBe(70)
      expect(store.profile.height).toBe(170)
      expect(store.profile.sex).toBe('female')
      expect(store.profile.activityLevel).toBe('moderate')
      expect(store.profile.goal).toBe('maintain')
      expect(store.profile.allergens).toEqual([])
      expect(store.profile.dietaryPreferences).toEqual([])
    })

    it('isProfileComplete is false with default profile', () => {
      const store = useUserStore()
      expect(store.isProfileComplete).toBe(false)
    })
  })

  describe('updateProfile', () => {
    it('updates profile fields', () => {
      const store = useUserStore()
      store.updateProfile({ name: 'Ana', age: 25 })
      expect(store.profile.name).toBe('Ana')
      expect(store.profile.age).toBe(25)
    })

    it('persists to localStorage', () => {
      const store = useUserStore()
      store.updateProfile({ name: 'Ana' })
      const stored = JSON.parse(localStorage.getItem('avocato-user-profile') ?? '{}')
      expect(stored.name).toBe('Ana')
    })

    it('preserves other fields when updating partial', () => {
      const store = useUserStore()
      store.updateProfile({ name: 'Ana' })
      expect(store.profile.weight).toBe(70)
      expect(store.profile.height).toBe(170)
    })
  })

  describe('resetProfile', () => {
    it('resets to default values', () => {
      const store = useUserStore()
      store.updateProfile({ name: 'Ana', age: 25 })
      store.resetProfile()
      expect(store.profile.name).toBe('')
      expect(store.profile.age).toBe(30)
    })
  })

  describe('isProfileComplete', () => {
    it('returns true when all required fields are filled', () => {
      const store = useUserStore()
      store.updateProfile({
        name: 'Ana',
        age: 25,
        weight: 60,
        height: 165,
        desiredWeight: 55,
      })
      expect(store.isProfileComplete).toBe(true)
    })

    it('returns false when name is empty', () => {
      const store = useUserStore()
      store.updateProfile({ age: 25, weight: 60, height: 165, desiredWeight: 55 })
      expect(store.isProfileComplete).toBe(false)
    })

    it('returns false when age is 0', () => {
      const store = useUserStore()
      store.updateProfile({ name: 'Ana', age: 0, weight: 60, height: 165, desiredWeight: 55 })
      expect(store.isProfileComplete).toBe(false)
    })
  })

  describe('goals', () => {
    it('returns zero goals when profile has no name', () => {
      const store = useUserStore()
      expect(store.goals.bmr).toBe(0)
      expect(store.goals.tdee).toBe(0)
      expect(store.goals.targetCalories).toBe(0)
    })

    it('calculates goals when profile is complete', () => {
      const store = useUserStore()
      store.updateProfile({
        name: 'Ana',
        age: 25,
        weight: 60,
        height: 165,
        desiredWeight: 55,
        sex: 'female',
        activityLevel: 'moderate',
        goal: 'lose',
      })
      expect(store.goals.bmr).toBeGreaterThan(0)
      expect(store.goals.tdee).toBeGreaterThan(0)
      expect(store.goals.targetCalories).toBeGreaterThan(0)
    })
  })

  describe('localStorage persistence', () => {
    it('loads profile from localStorage on init', () => {
      localStorage.setItem(
        'avocato-user-profile',
        JSON.stringify({ name: 'Ana', age: 25, weight: 55 }),
      )
      const store = useUserStore()
      expect(store.profile.name).toBe('Ana')
      expect(store.profile.age).toBe(25)
      expect(store.profile.weight).toBe(55)
      expect(store.profile.height).toBe(170)
    })

    it('handles corrupted localStorage gracefully', () => {
      localStorage.setItem('avocato-user-profile', 'NOT-JSON')
      const store = useUserStore()
      expect(store.profile.name).toBe('')
      expect(store.profile.age).toBe(30)
    })
  })
})
