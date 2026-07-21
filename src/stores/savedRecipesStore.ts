import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { supabase } from '@/lib/supabase'
import type { RecipeIngredient } from '@/types/recipe'

const STORAGE_KEY = 'avocato-saved-recipes'

export interface SavedRecipe {
  id: string
  name: string
  instructions: string
  ingredients: RecipeIngredient[]
  calories: number | null
  protein: number | null
  carbs: number | null
  fat: number | null
  prepTime: string | null
  createdAt: string
}

function loadLocal(): SavedRecipe[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as SavedRecipe[]
  } catch {
    /* ignore */
  }
  return []
}

function saveLocal(recipes: SavedRecipe[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes))
}

export const useSavedRecipesStore = defineStore('savedRecipes', () => {
  const recipes = ref<SavedRecipe[]>(loadLocal())
  const loaded = ref(true)
  const userId = ref('')

  function setUserId(id: string) {
    userId.value = id
  }

  watch(userId, async (id) => {
    if (id) {
      await loadRecipes()
    } else {
      recipes.value = loadLocal()
      loaded.value = true
    }
  })

  async function loadRecipes() {
    if (userId.value) {
      const { data } = await supabase
        .from('saved_recipes')
        .select('*')
        .eq('user_id', userId.value)
        .order('created_at', { ascending: false })

      if (data) {
        recipes.value = data.map(row => ({
          id: row.id,
          name: row.name,
          instructions: row.instructions,
          ingredients: row.ingredients as RecipeIngredient[],
          calories: row.calories,
          protein: row.protein,
          carbs: row.carbs,
          fat: row.fat,
          prepTime: row.prep_time,
          createdAt: row.created_at,
        }))
      }
    } else {
      recipes.value = loadLocal()
    }
    loaded.value = true
  }

  async function saveRecipe(recipe: Omit<SavedRecipe, 'id' | 'createdAt'>) {
    if (userId.value) {
      const { data, error } = await supabase
        .from('saved_recipes')
        .insert({
          user_id: userId.value,
          name: recipe.name,
          instructions: recipe.instructions,
          ingredients: recipe.ingredients,
          calories: recipe.calories,
          protein: recipe.protein,
          carbs: recipe.carbs,
          fat: recipe.fat,
          prep_time: recipe.prepTime,
        })
        .select()
        .single()

      if (error) {
        console.error('Error guardando receta en Supabase:', error.message)
        return false
      }

      if (data) {
        recipes.value = [
          {
            id: data.id,
            name: data.name,
            instructions: data.instructions,
            ingredients: data.ingredients as RecipeIngredient[],
            calories: data.calories,
            protein: data.protein,
            carbs: data.carbs,
            fat: data.fat,
            prepTime: data.prep_time,
            createdAt: data.created_at,
          },
          ...recipes.value,
        ]
      }
      return true
    } else {
      const newRecipe: SavedRecipe = {
        ...recipe,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: new Date().toISOString(),
      }
      recipes.value = [newRecipe, ...recipes.value]
      saveLocal(recipes.value)
      return true
    }
  }

  async function deleteRecipe(recipeId: string) {
    if (userId.value) {
      await supabase.from('saved_recipes').delete().eq('id', recipeId).eq('user_id', userId.value)
    }
    recipes.value = recipes.value.filter(r => r.id !== recipeId)
    if (!userId.value) {
      saveLocal(recipes.value)
    }
  }

  async function migrateToSupabase() {
    if (!userId.value) return
    const local = loadLocal()
    if (local.length === 0) return

    for (const recipe of local) {
      await supabase.from('saved_recipes').insert({
        user_id: userId.value,
        name: recipe.name,
        instructions: recipe.instructions,
        ingredients: recipe.ingredients,
        calories: recipe.calories,
        protein: recipe.protein,
        carbs: recipe.carbs,
        fat: recipe.fat,
        prep_time: recipe.prepTime,
      })
    }
    localStorage.removeItem(STORAGE_KEY)
    await loadRecipes()
  }

  return {
    recipes,
    loaded,
    userId,
    setUserId,
    loadRecipes,
    saveRecipe,
    deleteRecipe,
    migrateToSupabase,
  }
})
