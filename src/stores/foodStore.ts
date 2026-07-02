import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { FoodItem, MealEntry, NutritionSummary, MealType } from '../types/food'

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

function loadLogs(): Record<string, MealEntry[]> {
  try {
    const stored = localStorage.getItem('avocato-food-log')
    if (stored) return JSON.parse(stored) as Record<string, MealEntry[]>
  } catch {
    /* ignore */
  }
  return {}
}

function persistLogs(logs: Record<string, MealEntry[]>) {
  localStorage.setItem('avocato-food-log', JSON.stringify(logs))
}

export const useFoodStore = defineStore('food', () => {
  const dailyLogs = ref<Record<string, MealEntry[]>>(loadLogs())
  const searchResults = ref<FoodItem[]>([])
  const isSearching = ref(false)
  const searchError = ref<string | null>(null)

  const todayEntries = computed(() => {
    return dailyLogs.value[getToday()] ?? []
  })

  const todaySummary = computed<NutritionSummary>(() => {
    const entries = dailyLogs.value[getToday()] ?? []
    return entries.reduce(
      (acc, entry) => ({
        calories: acc.calories + entry.food.calories * entry.servings,
        protein: acc.protein + entry.food.protein * entry.servings,
        carbs: acc.carbs + entry.food.carbs * entry.servings,
        fat: acc.fat + entry.food.fat * entry.servings,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    )
  })

  function addEntry(food: FoodItem, servings: number, mealType: MealType) {
    const today = getToday()
    if (!dailyLogs.value[today]) {
      dailyLogs.value[today] = []
    }

    const entry: MealEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      food,
      servings,
      mealType,
      date: today,
      timestamp: Date.now(),
    }

    dailyLogs.value[today] = [...dailyLogs.value[today], entry]
    persistLogs(dailyLogs.value)
  }

  function removeEntry(entryId: string) {
    const today = getToday()
    if (!dailyLogs.value[today]) return
    dailyLogs.value[today] = dailyLogs.value[today].filter(e => e.id !== entryId)
    persistLogs(dailyLogs.value)
  }

  function clearToday() {
    const today = getToday()
    delete dailyLogs.value[today]
    persistLogs(dailyLogs.value)
  }

  function getEntriesForDate(date: string): MealEntry[] {
    return dailyLogs.value[date] ?? []
  }

  return {
    dailyLogs,
    searchResults,
    isSearching,
    searchError,
    todayEntries,
    todaySummary,
    addEntry,
    removeEntry,
    clearToday,
    getEntriesForDate,
  }
})
