import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAddFood } from './useAddFood'
import { useFoodStore } from '@/stores/foodStore'
import type { FoodItem } from '@/types/food'

vi.mock('@/services/openFoodFacts', () => ({
  searchFood: vi.fn(),
}))

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

const mockFood: FoodItem = {
  id: 'test-1',
  name: 'Test Food',
  calories: 250,
  protein: 15,
  carbs: 25,
  fat: 10,
}

describe('useAddFood', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('starts with modal closed', () => {
      const addFood = useAddFood()
      expect(addFood.showAddModal.value).toBe(false)
      expect(addFood.selectedFood.value).toBeNull()
      expect(addFood.servings.value).toBe(1)
      expect(addFood.mealType.value).toBe('snack')
    })
  })

  describe('openAddModal', () => {
    it('opens modal with selected food', () => {
      const addFood = useAddFood()
      addFood.openAddModal(mockFood)
      expect(addFood.showAddModal.value).toBe(true)
      expect(addFood.selectedFood.value).toEqual(mockFood)
    })

    it('resets servings to 1', () => {
      const addFood = useAddFood()
      addFood.openAddModal(mockFood)
      expect(addFood.servings.value).toBe(1)
    })

    it('resets mealType to snack', () => {
      const addFood = useAddFood()
      addFood.openAddModal(mockFood)
      expect(addFood.mealType.value).toBe('snack')
    })
  })

  describe('confirmAdd', () => {
    it('adds entry to food store', async () => {
      const addFood = useAddFood()
      const foodStore = useFoodStore()

      addFood.openAddModal(mockFood)
      await addFood.confirmAdd()

      expect(foodStore.todayEntries).toHaveLength(1)
      expect(foodStore.todayEntries[0].food.id).toBe('test-1')
    })

    it('closes modal after adding', async () => {
      const addFood = useAddFood()

      addFood.openAddModal(mockFood)
      await addFood.confirmAdd()

      expect(addFood.showAddModal.value).toBe(false)
    })

    it('clears selectedFood after adding', async () => {
      const addFood = useAddFood()

      addFood.openAddModal(mockFood)
      await addFood.confirmAdd()

      expect(addFood.selectedFood.value).toBeNull()
    })

    it('does nothing when no food selected', () => {
      const addFood = useAddFood()
      const foodStore = useFoodStore()

      addFood.confirmAdd()

      expect(foodStore.todayEntries).toHaveLength(0)
    })

    it('uses selected servings and meal type', async () => {
      const addFood = useAddFood()
      const foodStore = useFoodStore()

      addFood.openAddModal(mockFood)
      addFood.servings.value = 3
      addFood.mealType.value = 'lunch'
      await addFood.confirmAdd()

      expect(foodStore.todayEntries).toHaveLength(1)
      expect(foodStore.todayEntries[0].servings).toBe(3)
      expect(foodStore.todayEntries[0].mealType).toBe('lunch')
    })
  })

  describe('closeModal', () => {
    it('closes modal without adding', () => {
      const addFood = useAddFood()
      const foodStore = useFoodStore()

      addFood.openAddModal(mockFood)
      addFood.closeModal()

      expect(addFood.showAddModal.value).toBe(false)
      expect(addFood.selectedFood.value).toEqual(mockFood)
      expect(foodStore.todayEntries).toHaveLength(0)
    })
  })
})
