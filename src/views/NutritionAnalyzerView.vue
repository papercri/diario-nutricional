<script setup lang="ts">
import { ref } from 'vue'
import type { NutritionAnalysis } from '@/types/nutrition'
import { analyzeMeal, NutritionAIError } from '@/services/nutritionAI'
import MealAnalyzerForm from '@/components/nutrition/MealAnalyzerForm.vue'
import NutritionResultCard from '@/components/nutrition/NutritionResultCard.vue'
import MacroDistribution from '@/components/nutrition/MacroDistribution.vue'
import IngredientBreakdown from '@/components/nutrition/IngredientBreakdown.vue'
import NutritionTips from '@/components/nutrition/NutritionTips.vue'

const isLoading = ref(false)
const error = ref('')
const result = ref<NutritionAnalysis | null>(null)

async function handleAnalyze(description: string) {
  isLoading.value = true
  error.value = ''
  result.value = null

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
</script>

<template>
  <main class="page-container">
    <header class="page-header">
      <h1 class="font-display text-display-xl">
        <i
          class="fa-solid fa-wand-magic-sparkles"
          aria-hidden="true"
          style="color: var(--clr-accent)"
        />
        Analizador de comidas
      </h1>
      <p class="text-body" style="margin-top: 0.5rem">
        Describe lo que comiste y obtén un análisis nutricional estimado
      </p>
    </header>

    <div class="section-gap">
      <MealAnalyzerForm :loading="isLoading" @submit="handleAnalyze" />

      <div v-if="isLoading" class="loading-state" role="status" aria-label="Analizando comida">
        <i class="fa-solid fa-spinner fa-spin-pulse loading-state__icon" aria-hidden="true" />
        <p class="loading-state__text">Analizando tu comida...</p>
        <p class="loading-state__subtext">Esto puede tomar unos segundos</p>
      </div>

      <div v-else-if="error" class="error-state" role="alert">
        <i class="fa-solid fa-triangle-exclamation error-state__icon" aria-hidden="true" />
        <p class="error-state__text">{{ error }}</p>
      </div>

      <template v-else-if="result">
        <NutritionResultCard
          :meal-name="result.mealName"
          :estimated-calories="result.estimatedCalories"
          :confidence="result.confidence"
        />

        <MacroDistribution
          :protein="result.macros.protein"
          :carbohydrates="result.macros.carbohydrates"
          :fat="result.macros.fat"
        />

        <IngredientBreakdown :ingredients="result.ingredients" />

        <NutritionTips :tips="result.healthTips" />
      </template>
    </div>
  </main>
</template>

<style scoped>
.loading-state {
  text-align: center;
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.loading-state__icon {
  font-size: 2rem;
  color: var(--clr-primary);
}

.loading-state__text {
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  color: var(--clr-text);
  margin: 0;
}

.loading-state__subtext {
  font-size: var(--text-xs);
  color: var(--clr-text-faint);
  margin: 0;
}

.error-state {
  text-align: center;
  padding: 2rem 1rem;
  border-radius: var(--radius-xl);
  background: var(--clr-danger-light);
  border: 1px solid rgba(230, 62, 17, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.error-state__icon {
  font-size: 1.5rem;
  color: var(--clr-danger);
}

.error-state__text {
  font-size: var(--text-sm);
  color: var(--clr-text);
  margin: 0;
}
</style>
