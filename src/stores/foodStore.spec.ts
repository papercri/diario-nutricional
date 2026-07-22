import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFoodStore } from './foodStore'
import type { FoodItem } from '@/types/food'

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
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      delete: vi.fn().mockResolvedValue({ error: null }),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}))

function makeFood(overrides: Partial<FoodItem> = {}): FoodItem {
  return {
    id: '1',
    name: 'Test Food',
    calories: 200,
    protein: 10,
    carbs: 30,
    fat: 5,
    ...overrides,
  }
}

function today(): string {
  return new Date().toISOString().split('T')[0]
}

describe('useFoodStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('starts with empty todayEntries', () => {
      const store = useFoodStore()
      expect(store.todayEntries).toHaveLength(0)
    })

    it('starts with zero summary', () => {
      const store = useFoodStore()
      expect(store.todaySummary.calories).toBe(0)
      expect(store.todaySummary.protein).toBe(0)
      expect(store.todaySummary.carbs).toBe(0)
      expect(store.todaySummary.fat).toBe(0)
    })
  })

  describe('addEntry', () => {
    it('adds an entry to today', async () => {
      const store = useFoodStore()
      const food = makeFood()
      await store.addEntry(food, 2, 'lunch')
      expect(store.todayEntries).toHaveLength(1)
      expect(store.todayEntries[0].food.name).toBe('Test Food')
      expect(store.todayEntries[0].servings).toBe(2)
      expect(store.todayEntries[0].mealType).toBe('lunch')
    })

    it('generates unique ids for entries', async () => {
      const store = useFoodStore()
      await store.addEntry(makeFood({ id: '1' }), 1, 'breakfast')
      await store.addEntry(makeFood({ id: '2' }), 1, 'lunch')
      expect(store.todayEntries[0].id).not.toBe(store.todayEntries[1].id)
    })

    it('persists to localStorage', async () => {
      const store = useFoodStore()
      await store.addEntry(makeFood(), 1, 'snack')
      const stored = JSON.parse(localStorage.getItem('avocato-food-log') ?? '{}')
      expect(stored[today()]).toHaveLength(1)
    })

    it('accumulates multiple entries', async () => {
      const store = useFoodStore()
      await store.addEntry(makeFood({ id: '1' }), 1, 'breakfast')
      await store.addEntry(makeFood({ id: '2' }), 2, 'lunch')
      await store.addEntry(makeFood({ id: '3' }), 1, 'dinner')
      expect(store.todayEntries).toHaveLength(3)
    })
  })

  describe('removeEntry', () => {
    it('removes an entry by id', async () => {
      const store = useFoodStore()
      await store.addEntry(makeFood(), 1, 'lunch')
      const entryId = store.todayEntries[0].id
      await store.removeEntry(entryId)
      expect(store.todayEntries).toHaveLength(0)
    })

    it('only removes the matching entry', async () => {
      const store = useFoodStore()
      await store.addEntry(makeFood({ id: '1' }), 1, 'breakfast')
      await store.addEntry(makeFood({ id: '2' }), 1, 'lunch')
      const firstId = store.todayEntries[0].id
      await store.removeEntry(firstId)
      expect(store.todayEntries).toHaveLength(1)
      expect(store.todayEntries[0].food.id).toBe('2')
    })
  })

  describe('clearToday', () => {
    it('removes all today entries', async () => {
      const store = useFoodStore()
      await store.addEntry(makeFood({ id: '1' }), 1, 'breakfast')
      await store.addEntry(makeFood({ id: '2' }), 2, 'lunch')
      await store.clearToday()
      expect(store.todayEntries).toHaveLength(0)
    })
  })

  describe('todaySummary', () => {
    it('calculates nutrition totals across entries', async () => {
      const store = useFoodStore()
      await store.addEntry(makeFood({ calories: 200, protein: 10, carbs: 30, fat: 5 }), 2, 'lunch')
      await store.addEntry(makeFood({ calories: 100, protein: 5, carbs: 15, fat: 2 }), 1, 'snack')
      expect(store.todaySummary.calories).toBe(500)
      expect(store.todaySummary.protein).toBe(25)
      expect(store.todaySummary.carbs).toBe(75)
      expect(store.todaySummary.fat).toBe(12)
    })
  })

  describe('getEntriesForDate', () => {
    it('returns entries for a specific date', async () => {
      const store = useFoodStore()
      await store.addEntry(makeFood(), 1, 'lunch')
      const entries = store.getEntriesForDate(today())
      expect(entries).toHaveLength(1)
    })

    it('returns empty array for date with no entries', () => {
      const store = useFoodStore()
      const entries = store.getEntriesForDate('2020-01-01')
      expect(entries).toHaveLength(0)
    })
  })

  describe('localStorage persistence', () => {
    it('loads entries from localStorage on init', () => {
      const existingData = {
        [today()]: [
          {
            id: 'existing-1',
            food: makeFood({ id: '10' }),
            servings: 1,
            mealType: 'breakfast',
            date: today(),
            timestamp: Date.now(),
          },
        ],
      }
      localStorage.setItem('avocato-food-log', JSON.stringify(existingData))
      const store = useFoodStore()
      expect(store.todayEntries).toHaveLength(1)
      expect(store.todayEntries[0].food.id).toBe('10')
    })

    it('handles corrupted localStorage gracefully', () => {
      localStorage.setItem('avocato-food-log', 'NOT-JSON')
      const store = useFoodStore()
      expect(store.todayEntries).toHaveLength(0)
    })
  })
})
