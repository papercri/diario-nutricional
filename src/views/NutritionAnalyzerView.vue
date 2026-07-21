<script setup lang="ts">
import { ref } from 'vue'
import type { NutritionAnalysis } from '@/types/nutrition'
import type { FoodItem, MealType } from '@/types/food'
import { analyzeMeal, NutritionAIError } from '@/services/nutritionAI'
import { useFoodStore } from '@/stores/foodStore'
import { useSavedPlatesStore } from '@/stores/savedPlatesStore'
import { useToast } from '@/composables/useToast'
import { MEAL_TYPE_OPTIONS } from '@/utils/constants'
import Modal from '@/components/ui/Modal.vue'
import MealAnalyzerForm from '@/components/nutrition/MealAnalyzerForm.vue'
import NutritionResultCard from '@/components/nutrition/NutritionResultCard.vue'
import MacroDistribution from '@/components/nutrition/MacroDistribution.vue'
import IngredientBreakdown from '@/components/nutrition/IngredientBreakdown.vue'
import NutritionTips from '@/components/nutrition/NutritionTips.vue'
import AllergenInfoCard from '@/components/nutrition/AllergenInfoCard.vue'

const foodStore = useFoodStore()
const savedPlatesStore = useSavedPlatesStore()
const toast = useToast()

const isLoading = ref(false)
const error = ref('')
const result = ref<NutritionAnalysis | null>(null)

const showAddModal = ref(false)
const mealType = ref<MealType>('lunch')
const added = ref(false)
const saved = ref(false)

async function handleAnalyze(description: string) {
  isLoading.value = true
  error.value = ''
  result.value = null
  added.value = false

  try {
    result.value = await analyzeMeal(description)
  } catch (err: unknown) {
    if (err instanceof NutritionAIError) {
      error.value = err.message
    } else {
      error.value = 'Ocurrió un error inesperado. Intenta de nuevo.'
    }
  } finally {
    isLoading.value = false
  }
}

function openAddModal() {
  added.value = false
  showAddModal.value = true
}

function confirmAdd() {
  if (!result.value) return

  const food: FoodItem = {
    id: `ai-${Date.now()}`,
    name: result.value.mealName,
    calories: result.value.estimatedCalories,
    protein: result.value.macros.protein.grams,
    carbs: result.value.macros.carbohydrates.grams,
    fat: result.value.macros.fat.grams,
  }

  foodStore.addEntry(food, 1, mealType.value)
  showAddModal.value = false
  added.value = true
}

function closeModal() {
  showAddModal.value = false
}

async function savePlate() {
  if (!result.value) return
  const ok = await savedPlatesStore.savePlate({
    name: result.value.mealName,
    description: null,
    calories: result.value.estimatedCalories,
    protein: result.value.macros.protein.grams,
    carbs: result.value.macros.carbohydrates.grams,
    fat: result.value.macros.fat.grams,
    servingSize: null,
    imageUrl: null,
    ingredients: result.value.ingredients,
    allergens: result.value.allergens ?? [],
    isVegan: result.value.isVegan ?? false,
    isVegetarian: result.value.isVegetarian ?? false,
    nutritionScore: result.value.nutritionScore,
  })
  if (ok) {
    saved.value = true
    toast.show('Plato guardado en favoritos')
  } else {
    toast.show('No se pudo guardar el plato')
  }
}
</script>

<template>
  <main class="ds-page">
    <header class="ds-page-header">
      <h1 class="font-display" style="font-size: 1.5rem; color: var(--clr-text)">
        <font-awesome-icon
          :icon="['fas', 'wand-magic-sparkles']"
          aria-hidden="true"
          style="color: var(--clr-accent)"
        />
        Mis platos
      </h1>
      <p style="font-size: 0.8125rem; color: var(--clr-text-muted)">
        Describe tu comida y obtén un análisis nutricional estimado
      </p>
    </header>

    <div class="ds-page-content">
      <MealAnalyzerForm :loading="isLoading" @submit="handleAnalyze" />

      <div v-if="isLoading" class="nutrition-loading" role="status" aria-label="Analizando comida">
        <font-awesome-icon
          :icon="['fas', 'spinner']"
          spin
          pulse
          aria-hidden="true"
          style="color: var(--clr-primary)"
        />
        <p style="font-size: 0.8125rem; color: var(--clr-text-muted)">Analizando tu comida...</p>
      </div>

      <div v-else-if="error" class="nutrition-error" role="alert">
        <font-awesome-icon
          :icon="['fas', 'triangle-exclamation']"
          aria-hidden="true"
          style="color: var(--clr-danger)"
        />
        <p style="font-size: 0.8125rem; color: var(--clr-text)">{{ error }}</p>
      </div>

      <template v-else-if="result">
        <NutritionResultCard
          :meal-name="result.mealName"
          :estimated-calories="result.estimatedCalories"
          :is-vegan="result.isVegan"
          :is-vegetarian="result.isVegetarian"
          @add-to-daily="openAddModal"
        />

        <AllergenInfoCard :allergens="result.allergens ?? []" />

        <p v-if="added" class="nutrition-added" role="status">
          <font-awesome-icon :icon="['fas', 'check-circle']" aria-hidden="true" />
          Añadido a tu registro diario
        </p>

        <button v-if="!saved" class="btn btn-secondary btn-sm save-plate-btn" @click="savePlate">
          <font-awesome-icon :icon="['fas', 'star']" aria-hidden="true" />
          Guardar plato
        </button>
        <p v-else class="nutrition-saved" role="status">
          <font-awesome-icon :icon="['fas', 'star']" aria-hidden="true" />
          Guardado en favoritos
        </p>

        <div class="nutrition-grid">
          <MacroDistribution
            :protein="result.macros.protein"
            :carbohydrates="result.macros.carbohydrates"
            :fat="result.macros.fat"
          />
          <IngredientBreakdown :ingredients="result.ingredients" />
        </div>

        <NutritionTips :tips="result.healthTips" />
      </template>
    </div>

    <!-- Add to daily modal -->
    <Modal :open="showAddModal" size="sm" title="Añadir al día" @close="closeModal">
      <p class="text-sm" style="color: var(--clr-text)">
        {{ result?.mealName }} · {{ result?.estimatedCalories }} kcal
      </p>

      <fieldset class="border-0 p-0 m-0 mt-3">
        <legend class="block text-xs font-medium" style="color: var(--clr-text-muted)">
          Tipo de comida
        </legend>
        <div class="grid grid-cols-2 gap-1.5 mt-1.5">
          <button
            v-for="opt in MEAL_TYPE_OPTIONS"
            :key="opt.value"
            type="button"
            class="btn text-xs"
            :class="mealType === opt.value ? 'btn-primary' : 'btn-secondary'"
            :aria-pressed="mealType === opt.value"
            @click="mealType = opt.value"
          >
            <font-awesome-icon :icon="opt.icon" aria-hidden="true" />
            {{ opt.label }}
          </button>
        </div>
      </fieldset>

      <template #footer>
        <button class="btn btn-secondary" @click="closeModal">Cancelar</button>
        <button class="btn btn-primary" @click="confirmAdd">Añadir</button>
      </template>
    </Modal>
  </main>
</template>

<style scoped>
.nutrition-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

@media (max-width: 640px) {
  .nutrition-grid {
    grid-template-columns: 1fr;
  }
}

.nutrition-loading {
  text-align: center;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.nutrition-error {
  text-align: center;
  padding: 1rem;
  border-radius: var(--radius-xl);
  background: var(--clr-danger-light);
  border: 1px solid rgba(230, 62, 17, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
}

.nutrition-added {
  font-size: 0.75rem;
  color: var(--clr-success);
  text-align: center;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
}

.save-plate-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  margin: 0 auto;
}

.nutrition-saved {
  font-size: 0.75rem;
  color: var(--clr-accent);
  text-align: center;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
}
</style>
