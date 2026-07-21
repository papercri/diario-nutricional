import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Ingredient, AllergenType, NutritionScore } from '@/types/nutrition'

const STORAGE_KEY = 'avocato-saved-plates'

export interface SavedPlate {
  id: string
  name: string
  description: string | null
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize: string | null
  imageUrl: string | null
  ingredients: Ingredient[]
  allergens: AllergenType[]
  isVegan: boolean
  isVegetarian: boolean
  nutritionScore: NutritionScore | null
  createdAt: string
}

function loadLocal(): SavedPlate[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as SavedPlate[]
  } catch {
    /* ignore */
  }
  return []
}

function saveLocal(plates: SavedPlate[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plates))
}

export const useSavedPlatesStore = defineStore('savedPlates', () => {
  const plates = ref<SavedPlate[]>(loadLocal())
  const loaded = ref(true)
  const userId = ref('')

  function setUserId(id: string) {
    userId.value = id
  }

  watch(userId, async (id) => {
    if (id) {
      await loadPlates()
    } else {
      plates.value = loadLocal()
      loaded.value = true
    }
  })

  async function loadPlates() {
    if (userId.value) {
      const { data } = await supabase
        .from('saved_plates')
        .select('*')
        .eq('user_id', userId.value)
        .order('created_at', { ascending: false })

      if (data) {
        plates.value = data.map(row => ({
          id: row.id,
          name: row.name,
          description: row.description,
          calories: row.calories,
          protein: row.protein,
          carbs: row.carbs,
          fat: row.fat,
          servingSize: row.serving_size,
          imageUrl: row.image_url,
          ingredients: (row.ingredients as Ingredient[]) ?? [],
          allergens: (row.allergens as AllergenType[]) ?? [],
          isVegan: (row.is_vegan as boolean) ?? false,
          isVegetarian: (row.is_vegetarian as boolean) ?? false,
          nutritionScore: (row.nutrition_score as NutritionScore) ?? null,
          createdAt: row.created_at,
        }))
      }
    } else {
      plates.value = loadLocal()
    }
    loaded.value = true
  }

  async function savePlate(plate: Omit<SavedPlate, 'id' | 'createdAt'>) {
    if (userId.value) {
      const { data, error } = await supabase
        .from('saved_plates')
        .insert({
          user_id: userId.value,
          name: plate.name,
          description: plate.description,
          calories: plate.calories,
          protein: plate.protein,
          carbs: plate.carbs,
          fat: plate.fat,
          serving_size: plate.servingSize,
          image_url: plate.imageUrl,
          ingredients: plate.ingredients,
          allergens: plate.allergens,
          is_vegan: plate.isVegan,
          is_vegetarian: plate.isVegetarian,
          nutrition_score: plate.nutritionScore,
        })
        .select()
        .single()

      if (error) {
        console.error('Error guardando plato en Supabase:', error.message)
        return false
      }

      if (data) {
        plates.value = [
          {
            id: data.id,
            name: data.name,
            description: data.description,
            calories: data.calories,
            protein: data.protein,
            carbs: data.carbs,
            fat: data.fat,
            servingSize: data.serving_size,
            imageUrl: data.image_url,
            ingredients: (data.ingredients as Ingredient[]) ?? [],
            allergens: (data.allergens as AllergenType[]) ?? [],
            isVegan: (data.is_vegan as boolean) ?? false,
            isVegetarian: (data.is_vegetarian as boolean) ?? false,
            nutritionScore: (data.nutrition_score as NutritionScore) ?? null,
            createdAt: data.created_at,
          },
          ...plates.value,
        ]
      }
      return true
    } else {
      const newPlate: SavedPlate = {
        ...plate,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: new Date().toISOString(),
      }
      plates.value = [newPlate, ...plates.value]
      saveLocal(plates.value)
      return true
    }
  }

  async function deletePlate(plateId: string) {
    if (userId.value) {
      await supabase.from('saved_plates').delete().eq('id', plateId).eq('user_id', userId.value)
    }
    plates.value = plates.value.filter(p => p.id !== plateId)
    if (!userId.value) {
      saveLocal(plates.value)
    }
  }

  async function migrateToSupabase() {
    if (!userId.value) return
    const local = loadLocal()
    if (local.length === 0) return

    for (const plate of local) {
      await supabase.from('saved_plates').insert({
        user_id: userId.value,
        name: plate.name,
        description: plate.description,
        calories: plate.calories,
        protein: plate.protein,
        carbs: plate.carbs,
        fat: plate.fat,
        serving_size: plate.servingSize,
        image_url: plate.imageUrl,
        ingredients: plate.ingredients,
        allergens: plate.allergens,
        is_vegan: plate.isVegan,
        is_vegetarian: plate.isVegetarian,
        nutrition_score: plate.nutritionScore,
      })
    }
    localStorage.removeItem(STORAGE_KEY)
    await loadPlates()
  }

  return {
    plates,
    loaded,
    userId,
    setUserId,
    loadPlates,
    savePlate,
    deletePlate,
    migrateToSupabase,
  }
})
