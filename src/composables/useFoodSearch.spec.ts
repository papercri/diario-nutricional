import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFoodSearch } from './useFoodSearch'
import * as foodService from '@/services/openFoodFacts'
import type { FoodItem } from '@/types/food'

vi.mock('@/services/openFoodFacts', () => ({
  searchFood: vi.fn(),
}))

const mockSearchFood = vi.mocked(foodService.searchFood)

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

describe('useFoodSearch', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
    mockSearchFood.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('initial state', () => {
    it('starts with empty query and results', () => {
      const { query, results, isSearching, error, hasSearched } = useFoodSearch()
      expect(query.value).toBe('')
      expect(results.value).toHaveLength(0)
      expect(isSearching.value).toBe(false)
      expect(error.value).toBeNull()
      expect(hasSearched.value).toBe(false)
    })
  })

  describe('onSearchInput', () => {
    it('updates query value', () => {
      const { query, onSearchInput } = useFoodSearch()
      onSearchInput('chicken')
      expect(query.value).toBe('chicken')
    })

    it('clears results for queries shorter than 2 chars', () => {
      const { results, hasSearched, onSearchInput } = useFoodSearch()
      onSearchInput('a')
      expect(results.value).toHaveLength(0)
      expect(hasSearched.value).toBe(false)
    })

    it('does not call search for short queries', () => {
      const { onSearchInput } = useFoodSearch()
      onSearchInput('a')
      vi.advanceTimersByTime(500)
      expect(mockSearchFood).not.toHaveBeenCalled()
    })

    it('debounces search by 400ms', async () => {
      mockSearchFood.mockResolvedValue([makeFood()])
      const { onSearchInput } = useFoodSearch()

      onSearchInput('chicken')
      vi.advanceTimersByTime(300)
      expect(mockSearchFood).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)
      expect(mockSearchFood).toHaveBeenCalledWith('chicken')
    })

    it('resets previous debounce timer', async () => {
      mockSearchFood.mockResolvedValue([makeFood()])
      const { onSearchInput } = useFoodSearch()

      onSearchInput('chic')
      vi.advanceTimersByTime(300)
      onSearchInput('chicken')
      vi.advanceTimersByTime(400)

      expect(mockSearchFood).toHaveBeenCalledTimes(1)
      expect(mockSearchFood).toHaveBeenCalledWith('chicken')
    })
  })

  describe('performSearch', () => {
    it('sets results on successful search', async () => {
      mockSearchFood.mockResolvedValue([makeFood({ id: '1' }), makeFood({ id: '2' })])
      const { query, performSearch, results, hasSearched } = useFoodSearch()

      query.value = 'chicken'
      await performSearch()
      expect(results.value).toHaveLength(2)
      expect(hasSearched.value).toBe(true)
    })

    it('sets error on failed search', async () => {
      mockSearchFood.mockRejectedValue(new Error('Network error'))
      const { query, performSearch, error, results } = useFoodSearch()

      query.value = 'chicken'
      await performSearch()
      expect(error.value).toBe('Network error')
      expect(results.value).toHaveLength(0)
    })

    it('sets generic error for non-Error throws', async () => {
      mockSearchFood.mockRejectedValue('unknown')
      const { query, performSearch, error } = useFoodSearch()

      query.value = 'chicken'
      await performSearch()
      expect(error.value).toBe('Error al buscar')
    })

    it('does not search with empty query', async () => {
      const { performSearch } = useFoodSearch()
      await performSearch()
      expect(mockSearchFood).not.toHaveBeenCalled()
    })

    it('sets isSearching during search', async () => {
      let resolveSearch!: (value: FoodItem[]) => void
      mockSearchFood.mockImplementation(
        () => new Promise(resolve => { resolveSearch = resolve }),
      )
      const { query, performSearch, isSearching } = useFoodSearch()

      query.value = 'chicken'
      const searchPromise = performSearch()
      expect(isSearching.value).toBe(true)

      resolveSearch([])
      await searchPromise
      expect(isSearching.value).toBe(false)
    })
  })
})
