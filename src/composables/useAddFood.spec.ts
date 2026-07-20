import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAddFood } from './useAddFood'
import { useFoodStore } from '@/stores/foodStore'
import type { FoodItem } from '@/types/food'

vi.mock('@/services/openFoodFacts', () => ({
  searchFood: vi.fn(),
}))

const mockStorage = new Map<string, string>()
vi.spyOn(Storage.prototype, 'getItem').mockImplementation(key => mockStorage.get(key) ?? null)
vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
  mockStorage.set(key, value)
})
vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(key => {
  mockStorage.delete(key)
})

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
    mockStorage.clear()
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
    it('adds entry to food store', () => {
      const addFood = useAddFood()
      const foodStore = useFoodStore()

      addFood.openAddModal(mockFood)
      addFood.confirmAdd()

      expect(foodStore.todayEntries).toHaveLength(1)
      expect(foodStore.todayEntries[0].food.id).toBe('test-1')
    })

    it('closes modal after adding', () => {
      const addFood = useAddFood()

      addFood.openAddModal(mockFood)
      addFood.confirmAdd()

      expect(addFood.showAddModal.value).toBe(false)
    })

    it('clears selectedFood after adding', () => {
      const addFood = useAddFood()

      addFood.openAddModal(mockFood)
      addFood.confirmAdd()

      expect(addFood.selectedFood.value).toBeNull()
    })

    it('does nothing when no food selected', () => {
      const addFood = useAddFood()
      const foodStore = useFoodStore()

      addFood.confirmAdd()

      expect(foodStore.todayEntries).toHaveLength(0)
    })

    it('uses selected servings and meal type', () => {
      const addFood = useAddFood()
      const foodStore = useFoodStore()

      addFood.openAddModal(mockFood)
      addFood.servings.value = 3
      addFood.mealType.value = 'lunch'
      addFood.confirmAdd()

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
