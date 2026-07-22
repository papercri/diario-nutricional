import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { FoodItem, MealEntry, NutritionSummary, MealType } from '@/types/food'
import { supabase } from '@/lib/supabase'

const STORAGE_KEY = 'avocato-food-log'

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

function rowToMealEntry(row: Record<string, unknown>): MealEntry {
  return {
    id: row.id as string,
    food: {
      id: row.id as string,
      name: row.food_name as string,
      brand: (row.food_brand as string) ?? undefined,
      calories: row.food_calories as number,
      protein: row.food_protein as number,
      carbs: row.food_carbs as number,
      fat: row.food_fat as number,
      servingSize: (row.food_serving_size as string) ?? undefined,
      barcode: (row.food_barcode as string) ?? undefined,
      imageUrl: (row.food_image_url as string) ?? undefined,
      nutriScore: (row.food_nutri_score as FoodItem['nutriScore']) ?? undefined,
    },
    servings: row.servings as number,
    mealType: row.meal_type as MealType,
    date: row.date as string,
    timestamp: new Date(row.created_at as string).getTime(),
  }
}

function loadLocal(): Record<string, MealEntry[]> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as Record<string, MealEntry[]>
  } catch {
    /* ignore */
  }
  return {}
}

function saveLocal(logs: Record<string, MealEntry[]>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
}

export const useFoodStore = defineStore('food', () => {
  const dailyLogs = ref<Record<string, MealEntry[]>>({})
  const searchResults = ref<FoodItem[]>([])
  const isSearching = ref(false)
  const searchError = ref<string | null>(null)
  const loaded = ref(false)
  const userId = ref('')

  function setUserId(id: string) {
    userId.value = id
  }

  watch(userId, async (id) => {
    if (id) {
      await loadEntries()
    } else {
      dailyLogs.value = loadLocal()
      loaded.value = true
    }
  })

  function init() {
    if (!userId.value) {
      dailyLogs.value = loadLocal()
      loaded.value = true
    }
  }

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

  async function loadEntries() {
    if (userId.value) {
      try {
        const { data, error } = await supabase
          .from('daily_meal')
          .select('*')
          .eq('user_id', userId.value)
          .order('created_at', { ascending: true })

        if (error) throw error

        const logs: Record<string, MealEntry[]> = {}
        if (data) {
          for (const row of data) {
            const entry = rowToMealEntry(row)
            if (!logs[entry.date]) logs[entry.date] = []
            logs[entry.date].push(entry)
          }
        }
        dailyLogs.value = logs
      } catch (err) {
        console.error('Error loading entries from Supabase:', err)
      }
    } else {
      dailyLogs.value = loadLocal()
    }
    loaded.value = true
  }

  async function addEntry(food: FoodItem, servings: number, mealType: MealType) {
    const today = getToday()

    if (userId.value) {
      try {
        const { data, error } = await supabase
          .from('daily_meal')
          .insert({
            user_id: userId.value,
            food_name: food.name,
            food_brand: food.brand ?? null,
            food_calories: food.calories,
            food_protein: food.protein,
            food_carbs: food.carbs,
            food_fat: food.fat,
            food_serving_size: food.servingSize ?? null,
            food_barcode: food.barcode ?? null,
            food_image_url: food.imageUrl ?? null,
            food_nutri_score: food.nutriScore ?? null,
            servings,
            meal_type: mealType,
            date: today,
          })
          .select()
          .single()

        if (error) throw error

        if (data) {
          const entry = rowToMealEntry(data)
          if (!dailyLogs.value[today]) dailyLogs.value[today] = []
          dailyLogs.value[today] = [...dailyLogs.value[today], entry]
        }
      } catch (err) {
        console.error('Error adding entry to Supabase:', err)
        throw err
      }
    } else {
      const entry: MealEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        food,
        servings,
        mealType,
        date: today,
        timestamp: Date.now(),
      }
      if (!dailyLogs.value[today]) dailyLogs.value[today] = []
      dailyLogs.value[today] = [...dailyLogs.value[today], entry]
      saveLocal(dailyLogs.value)
    }
  }

  async function removeEntry(entryId: string) {
    if (userId.value) {
      try {
        const { error } = await supabase
          .from('daily_meal')
          .delete()
          .eq('id', entryId)
          .eq('user_id', userId.value)

        if (error) throw error
      } catch (err) {
        console.error('Error removing entry from Supabase:', err)
        throw err
      }
    }

    for (const date of Object.keys(dailyLogs.value)) {
      const idx = dailyLogs.value[date].findIndex(e => e.id === entryId)
      if (idx !== -1) {
        dailyLogs.value[date] = dailyLogs.value[date].filter(e => e.id !== entryId)
        break
      }
    }
    if (!userId.value) saveLocal(dailyLogs.value)
  }

  async function clearToday() {
    const today = getToday()
    if (userId.value) {
      try {
        const { error } = await supabase
          .from('daily_meal')
          .delete()
          .eq('user_id', userId.value)
          .eq('date', today)

        if (error) throw error
      } catch (err) {
        console.error('Error clearing today from Supabase:', err)
        throw err
      }
    }
    dailyLogs.value[today] = []
    if (!userId.value) saveLocal(dailyLogs.value)
  }

  function getEntriesForDate(date: string): MealEntry[] {
    return dailyLogs.value[date] ?? []
  }

  async function migrateToSupabase() {
    if (!userId.value) return
    const local = loadLocal()
    const entries = Object.values(local).flat()
    if (entries.length === 0) return

    for (const entry of entries) {
      await supabase.from('daily_meal').insert({
        user_id: userId.value,
        food_name: entry.food.name,
        food_brand: entry.food.brand ?? null,
        food_calories: entry.food.calories,
        food_protein: entry.food.protein,
        food_carbs: entry.food.carbs,
        food_fat: entry.food.fat,
        food_serving_size: entry.food.servingSize ?? null,
        food_barcode: entry.food.barcode ?? null,
        food_image_url: entry.food.imageUrl ?? null,
        food_nutri_score: entry.food.nutriScore ?? null,
        servings: entry.servings,
        meal_type: entry.mealType,
        date: entry.date,
      })
    }
    localStorage.removeItem(STORAGE_KEY)
    await loadEntries()
  }

  return {
    dailyLogs,
    searchResults,
    isSearching,
    searchError,
    loaded,
    userId,
    todayEntries,
    todaySummary,
    setUserId,
    init,
    loadEntries,
    addEntry,
    removeEntry,
    clearToday,
    getEntriesForDate,
    migrateToSupabase,
  }
})
