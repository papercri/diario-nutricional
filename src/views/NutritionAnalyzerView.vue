<script setup lang="ts">
import { ref } from 'vue'
import type { NutritionAnalysis } from '@/types/nutrition'
import type { FoodItem, MealType } from '@/types/food'
import { analyzeMeal, NutritionAIError } from '@/services/nutritionAI'
import { useFoodStore } from '@/stores/foodStore'
import { MEAL_TYPE_OPTIONS } from '@/utils/constants'
import MealAnalyzerForm from '@/components/nutrition/MealAnalyzerForm.vue'
import NutritionResultCard from '@/components/nutrition/NutritionResultCard.vue'
import MacroDistribution from '@/components/nutrition/MacroDistribution.vue'
import IngredientBreakdown from '@/components/nutrition/IngredientBreakdown.vue'
import NutritionTips from '@/components/nutrition/NutritionTips.vue'

const foodStore = useFoodStore()

const isLoading = ref(false)
const error = ref('')
const result = ref<NutritionAnalysis | null>(null)

const showAddModal = ref(false)
const mealType = ref<MealType>('lunch')
const added = ref(false)

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
</script>

<template>
  <main class="nutrition-page">
    <header class="nutrition-page__header">
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

    <div class="nutrition-page__content">
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
          @add-to-daily="openAddModal"
        />

        <p v-if="added" class="nutrition-added" role="status">
          <font-awesome-icon :icon="['fas', 'check-circle']" aria-hidden="true" />
          Añadido a tu registro diario
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
    <div
      v-if="showAddModal"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Añadir al registro diario"
      @click.self="closeModal"
      @keydown.escape="closeModal"
    >
      <div
        class="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-5 shadow-xl space-y-4 animate-slide-up"
        style="background: var(--clr-surface)"
      >
        <h2 class="font-display" style="font-size: 1.125rem; color: var(--clr-text)">
          Añadir al día
        </h2>

        <p class="font-medium" style="font-size: 0.8125rem; color: var(--clr-text)">
          {{ result?.mealName }} · {{ result?.estimatedCalories }} kcal
        </p>

        <fieldset class="border-0 p-0 m-0">
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

        <div class="flex gap-2 pt-1">
          <button class="btn btn-secondary flex-1 text-xs" @click="closeModal">Cancelar</button>
          <button class="btn btn-primary flex-1 text-xs" @click="confirmAdd">Añadir</button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.animate-slide-up {
  animation: slide-up 0.25s ease-out;
}

.nutrition-page {
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.nutrition-page__header {
  text-align: center;
  margin-bottom: 1rem;
}

.nutrition-page__content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

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
</style>
