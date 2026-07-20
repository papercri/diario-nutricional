import { ref } from 'vue'
import { searchFood } from '@/services/openFoodFacts'
import type { FoodItem } from '@/types/food'

const DEBOUNCE_MS = 400
const MIN_QUERY_LENGTH = 2

export function useFoodSearch() {
  const query = ref('')
  const results = ref<FoodItem[]>([])
  const isSearching = ref(false)
  const error = ref<string | null>(null)
  const hasSearched = ref(false)

  let debounceTimer: number | null = null

  async function performSearch() {
    if (!query.value.trim()) return
    isSearching.value = true
    error.value = null
    hasSearched.value = true
    try {
      results.value = await searchFood(query.value)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al buscar'
      results.value = []
    } finally {
      isSearching.value = false
    }
  }

  function onSearchInput(value: string) {
    query.value = value
    if (debounceTimer) window.clearTimeout(debounceTimer)
    if (value.trim().length < MIN_QUERY_LENGTH) {
      results.value = []
      hasSearched.value = false
      return
    }
    debounceTimer = window.setTimeout(() => performSearch(), DEBOUNCE_MS)
  }

  return { query, results, isSearching, error, hasSearched, onSearchInput, performSearch }
}
