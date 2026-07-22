<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useAuth } from '@/composables/useAuth'
import { useAddFood } from '@/composables/useAddFood'
import { generateRecipe, RecipeAIError } from '@/services/recipeAI'
import { useSavedRecipesStore } from '@/stores/savedRecipesStore'
import { useToast } from '@/composables/useToast'
import { DIETARY_PREFERENCE_OPTIONS, ALLERGEN_OPTIONS, MEAL_TYPE_OPTIONS } from '@/utils/constants'
import type { GeneratedRecipe } from '@/types/recipe'
import type { DietaryPreference, Allergen } from '@/types/recipe'
import type { FoodItem } from '@/types/food'
import DsCard from '@/components/ui/Card.vue'
import DsButton from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'

const userStore = useUserStore()
const savedRecipesStore = useSavedRecipesStore()
const toast = useToast()
const { user } = useAuth()
const { showAddModal, selectedFood, servings, mealType, openAddModal, confirmAdd, closeModal } = useAddFood()

const isLoading = ref(false)
const error = ref('')
const result = ref<GeneratedRecipe | null>(null)
const saved = ref(false)
const added = ref(false)

const selectedPreferences = ref<DietaryPreference[]>([])
const selectedAllergens = ref<Allergen[]>([])
const preferredIngredients = ref('')
const additionalInstructions = ref('')

const hasInput = computed(() => {
  return preferredIngredients.value.trim().length > 0 || selectedPreferences.value.length > 0
})

function togglePreference(value: DietaryPreference) {
  const idx = selectedPreferences.value.indexOf(value)
  if (idx !== -1) {
    selectedPreferences.value.splice(idx, 1)
  } else {
    selectedPreferences.value.push(value)
  }
}

function isPreferenceSelected(value: DietaryPreference): boolean {
  return selectedPreferences.value.includes(value)
}

function toggleAllergen(value: Allergen) {
  const idx = selectedAllergens.value.indexOf(value)
  if (idx !== -1) {
    selectedAllergens.value.splice(idx, 1)
  } else {
    selectedAllergens.value.push(value)
  }
}

function isAllergenSelected(value: Allergen): boolean {
  return selectedAllergens.value.includes(value)
}

async function handleGenerate() {
  isLoading.value = true
  error.value = ''
  result.value = null
  saved.value = false

  try {
    result.value = await generateRecipe({
      dietaryPreferences: selectedPreferences.value,
      allergens: selectedAllergens.value,
      preferredIngredients: preferredIngredients.value,
      additionalInstructions: additionalInstructions.value,
      goal: userStore.profile.goal,
      goals: userStore.goals,
    })
  } catch (err: unknown) {
    if (err instanceof RecipeAIError) {
      error.value = err.message
    } else {
      error.value = 'Ocurrió un error inesperado. Intenta de nuevo.'
    }
  } finally {
    isLoading.value = false
  }
}

async function saveRecipe() {
  if (!result.value) return
  const ok = await savedRecipesStore.saveRecipe({
    name: result.value.recipeName,
    description: result.value.description,
    instructions: result.value.steps.join('\n\n'),
    ingredients: result.value.ingredients.map(ing => ({
      name: ing.name,
      quantity: ing.quantity,
    })),
    calories: result.value.estimatedCalories,
    protein: result.value.macros.protein,
    carbs: result.value.macros.carbohydrates,
    fat: result.value.macros.fat,
    servingSize: `${result.value.servings} porciones`,
    imageUrl: null,
    allergens: [],
    isVegan: selectedPreferences.value.includes('vegan'),
    isVegetarian: selectedPreferences.value.includes('vegetarian'),
    nutritionScore: null,
    prepTime: result.value.preparationTime,
  })
  if (ok) {
    saved.value = true
    toast.show('Receta guardada en favoritos')
  } else {
    toast.show('No se pudo guardar la receta', 'error')
  }
}

function handleAddToDay() {
  if (!result.value) return
  const food: FoodItem = {
    id: `recipe-${Date.now()}`,
    name: result.value.recipeName,
    calories: result.value.estimatedCalories,
    protein: result.value.macros.protein,
    carbs: result.value.macros.carbohydrates,
    fat: result.value.macros.fat,
  }
  openAddModal(food)
  added.value = false
}
</script>

<template>
  <main class="ds-page">
    <header class="ds-page-header">
      <h1 class="font-display" style="font-size: 1.5rem; color: var(--clr-text)">
        <font-awesome-icon
          :icon="['fas', 'utensils']"
          aria-hidden="true"
          style="color: var(--clr-accent)"
        />
        Generador de recetas
      </h1>
      <p style="font-size: 0.8125rem; color: var(--clr-text-muted)">
        Crea recetas personalizadas adaptadas a tu dieta
      </p>
    </header>

    <div class="ds-page-content">
      <!-- Config: two equal columns -->
      <div class="recipe-config">
        <!-- Left col: preferences + allergens -->
        <div class="recipe-config__col">
          <DsCard variant="elevated" padding="sm">
            <h2 class="section-title">
              <font-awesome-icon
                :icon="['fas', 'leaf']"
                aria-hidden="true"
                style="color: var(--clr-primary)"
              />
              Preferencias dietéticas
            </h2>
            <div class="toggle-group" role="group" aria-label="Preferencias dietéticas">
              <button
                v-for="opt in DIETARY_PREFERENCE_OPTIONS"
                :key="opt.value"
                type="button"
                class="btn-toggle btn-toggle--sm"
                :class="{ 'btn-toggle--active': isPreferenceSelected(opt.value) }"
                :aria-pressed="isPreferenceSelected(opt.value)"
                @click="togglePreference(opt.value)"
              >
                <font-awesome-icon :icon="opt.icon" aria-hidden="true" />
                {{ opt.label }}
              </button>
            </div>
          </DsCard>

          <DsCard variant="elevated" padding="sm">
            <h2 class="section-title">
              <font-awesome-icon
                :icon="['fas', 'triangle-exclamation']"
                aria-hidden="true"
                style="color: var(--clr-danger)"
              />
              Excluir alérgenos
            </h2>
            <div
              class="toggle-group toggle-group--wrap"
              role="group"
              aria-label="Alérgenos a excluir"
            >
              <button
                v-for="opt in ALLERGEN_OPTIONS"
                :key="opt.value"
                type="button"
                class="btn-toggle btn-toggle--sm"
                :class="{ 'btn-toggle--active': isAllergenSelected(opt.value) }"
                :aria-pressed="isAllergenSelected(opt.value)"
                @click="toggleAllergen(opt.value)"
              >
                <font-awesome-icon :icon="opt.icon" aria-hidden="true" />
                {{ opt.label }}
              </button>
            </div>
          </DsCard>
        </div>

        <!-- Right col: ingredients + instructions + button -->
        <div class="recipe-config__col">
          <DsCard variant="elevated" padding="sm">
            <h2 class="section-title">
              <font-awesome-icon
                :icon="['fas', 'carrot']"
                aria-hidden="true"
                style="color: var(--clr-secondary)"
              />
              Ingredientes preferidos
            </h2>
            <textarea
              v-model="preferredIngredients"
              class="recipe-textarea"
              placeholder="Ej: pollo, arroz, pimientos..."
              rows="3"
              aria-label="Ingredientes preferidos"
            />
          </DsCard>

          <DsCard variant="elevated" padding="sm">
            <h2 class="section-title">
              <font-awesome-icon
                :icon="['fas', 'info-circle']"
                aria-hidden="true"
                style="color: var(--clr-info)"
              />
              Instrucciones adicionales
            </h2>
            <textarea
              v-model="additionalInstructions"
              class="recipe-textarea"
              placeholder="Ej: rápido de preparar, para dos personas..."
              rows="3"
              aria-label="Instrucciones adicionales"
            />
          </DsCard>

          <DsButton
            variant="primary"
            size="md"
            :loading="isLoading"
            :disabled="!hasInput"
            class="generate-btn"
            @click="handleGenerate"
          >
            <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" aria-hidden="true" />
            Generar receta
          </DsButton>
        </div>
      </div>

      <!-- Result below config -->
      <div class="recipe-result">
        <div v-if="isLoading" class="recipe-loading" role="status" aria-label="Generando receta">
          <font-awesome-icon
            :icon="['fas', 'spinner']"
            spin
            pulse
            aria-hidden="true"
            style="color: var(--clr-primary); font-size: 1.5rem"
          />
          <p style="font-size: 0.8125rem; color: var(--clr-text-muted)">Generando tu receta...</p>
        </div>

        <div v-else-if="error" class="recipe-error" role="alert">
          <font-awesome-icon
            :icon="['fas', 'triangle-exclamation']"
            aria-hidden="true"
            style="color: var(--clr-danger)"
          />
          <p style="font-size: 0.8125rem; color: var(--clr-text)">{{ error }}</p>
          <DsButton variant="secondary" size="xs" @click="handleGenerate">
            <font-awesome-icon :icon="['fas', 'rotate-left']" aria-hidden="true" />
            Reintentar
          </DsButton>
        </div>

        <div v-else-if="!result" class="recipe-empty">
          <font-awesome-icon
            :icon="['fas', 'utensils']"
            aria-hidden="true"
            style="color: var(--clr-border-strong); font-size: 2rem"
          />
          <p style="font-size: 0.8125rem; color: var(--clr-text-muted)">
            Configura tus preferencias y pulsa generar.
          </p>
        </div>

        <template v-else>
          <DsCard variant="elevated" padding="md" class="recipe-card">
            <div class="recipe-card__header">
              <h2 class="font-display recipe-card__title">{{ result.recipeName }}</h2>
              <p class="recipe-card__desc">{{ result.description }}</p>
            </div>

            <div class="recipe-meta">
              <span class="recipe-meta__item">
                <font-awesome-icon
                  :icon="['fas', 'clock']"
                  aria-hidden="true"
                  style="color: var(--clr-primary)"
                />
                Prep: {{ result.preparationTime }}
              </span>
              <span class="recipe-meta__item">
                <font-awesome-icon
                  :icon="['fas', 'fire']"
                  aria-hidden="true"
                  style="color: var(--clr-accent)"
                />
                Cocción: {{ result.cookingTime }}
              </span>
              <span class="recipe-meta__item">
                <font-awesome-icon
                  :icon="['fas', 'users']"
                  aria-hidden="true"
                  style="color: var(--clr-secondary)"
                />
                {{ result.servings }} porcion{{ result.servings > 1 ? 'es' : '' }}
              </span>
            </div>

            <div class="recipe-nutrition">
              <div class="recipe-nutrition__grid">
                <div class="recipe-nutrition__item">
                  <span class="recipe-nutrition__value">{{ result.estimatedCalories }}</span>
                  <span class="recipe-nutrition__label">kcal</span>
                </div>
                <div class="recipe-nutrition__item">
                  <span class="recipe-nutrition__value">{{ result.macros.protein }}g</span>
                  <span class="recipe-nutrition__label">Proteínas</span>
                </div>
                <div class="recipe-nutrition__item">
                  <span class="recipe-nutrition__value">{{ result.macros.carbohydrates }}g</span>
                  <span class="recipe-nutrition__label">Carbohidratos</span>
                </div>
                <div class="recipe-nutrition__item">
                  <span class="recipe-nutrition__value">{{ result.macros.fat }}g</span>
                  <span class="recipe-nutrition__label">Grasas</span>
                </div>
              </div>
            </div>

            <div class="recipe-columns">
              <div class="recipe-section">
                <h3 class="recipe-subtitle">
                  <font-awesome-icon :icon="['fas', 'list-check']" aria-hidden="true" />
                  Ingredientes
                </h3>
                <ul class="recipe-ingredients">
                  <li
                    v-for="(ing, i) in result.ingredients"
                    :key="i"
                    class="recipe-ingredients__item"
                  >
                    <span class="recipe-ingredients__qty">{{ ing.quantity }}</span>
                    <span>{{ ing.name }}</span>
                  </li>
                </ul>
              </div>

              <div class="recipe-section">
                <h3 class="recipe-subtitle">
                  <font-awesome-icon :icon="['fas', 'list-ol']" aria-hidden="true" />
                  Preparación
                </h3>
                <ol class="recipe-steps">
                  <li v-for="(step, i) in result.steps" :key="i" class="recipe-steps__item">
                    <span class="recipe-steps__num">{{ i + 1 }}</span>
                    <span>{{ step }}</span>
                  </li>
                </ol>
              </div>
            </div>

            <div v-if="result.tips.length > 0" class="recipe-section">
              <h3 class="recipe-subtitle">
                <font-awesome-icon
                  :icon="['fas', 'lightbulb']"
                  aria-hidden="true"
                  style="color: var(--clr-secondary)"
                />
                Consejos
              </h3>
              <ul class="recipe-tips">
                <li v-for="(tip, i) in result.tips" :key="i" class="recipe-tips__item">
                  {{ tip }}
                </li>
              </ul>
            </div>

            <div class="recipe-save">
              <button class="btn btn-primary" @click="handleAddToDay">
                <font-awesome-icon :icon="['fas', 'plus']" aria-hidden="true" />
                Añadir
              </button>
              <button v-if="user && !saved" class="btn btn-secondary" @click="saveRecipe">
                <font-awesome-icon :icon="['fas', 'star']" aria-hidden="true" />
                Guardar receta
              </button>
              <p v-else-if="saved" class="recipe-saved" role="status">
                <font-awesome-icon :icon="['fas', 'star']" aria-hidden="true" />
                Guardada en favoritos
              </p>
            </div>

            <p v-if="added" class="recipe-added" role="status">
              <font-awesome-icon :icon="['fas', 'check-circle']" aria-hidden="true" />
              Añadido a tu registro diario
            </p>
          </DsCard>
        </template>
      </div>
    </div>

    <!-- Add to day modal -->
    <Modal :open="showAddModal" size="sm" title="Añadir a mi día" @close="closeModal">
      <p class="text-sm font-medium" style="color: var(--clr-text)">
        {{ selectedFood?.name }}
      </p>

      <fieldset class="space-y-2 border-0 p-0 m-0 mt-3">
        <legend class="block text-sm font-medium" style="color: var(--clr-text-muted)">
          Tipo de comida
        </legend>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="opt in MEAL_TYPE_OPTIONS"
            :key="opt.value"
            type="button"
            class="btn text-sm"
            :class="mealType === opt.value ? 'btn-primary' : 'btn-secondary'"
            :aria-pressed="mealType === opt.value"
            @click="mealType = opt.value"
          >
            <font-awesome-icon :icon="opt.icon" aria-hidden="true" />
            {{ opt.label }}
          </button>
        </div>
      </fieldset>

      <div class="space-y-2 mt-3">
        <label
          for="servings-input-recipes"
          class="block text-sm font-medium"
          style="color: var(--clr-text-muted)"
        >
          Porciones (100g c/u)
        </label>
        <input
          id="servings-input-recipes"
          v-model.number="servings"
          type="number"
          min="0.25"
          max="20"
          step="0.25"
          class="input-field"
        />
        <p style="font-size: 0.75rem; color: var(--clr-text-faint)" aria-live="polite">
          Total: ~{{ Math.round((selectedFood?.calories ?? 0) * servings) }} kcal
        </p>
      </div>

      <template #footer>
        <button class="btn btn-secondary" @click="closeModal">Cancelar</button>
        <button class="btn btn-primary" @click="confirmAdd">Añadir</button>
      </template>
    </Modal>
  </main>
</template>

<style scoped>
/* Config: two equal-height columns */
.recipe-config {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
  align-items: stretch;
}

@media (max-width: 640px) {
  .recipe-config {
    grid-template-columns: 1fr;
  }
}

.recipe-config__col {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

/* Section title */
.section-title {
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--clr-text);
  margin: 0 0 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

/* Toggle group */
.toggle-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.toggle-group--wrap {
  flex-wrap: wrap;
}

/* Toggle buttons */
.btn-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.625rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--clr-border);
  background: var(--clr-surface);
  color: var(--clr-text-muted);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background var(--duration-fast) var(--ease-default),
    color var(--duration-fast) var(--ease-default),
    border-color var(--duration-fast) var(--ease-default);
}

.btn-toggle:hover {
  border-color: var(--clr-border-strong);
  background: var(--clr-surface-alt);
}

.btn-toggle:focus-visible {
  outline: 2px solid var(--clr-focus-ring);
  outline-offset: 2px;
}

.btn-toggle--sm {
  padding: 0.375rem 0.625rem;
  font-size: 0.75rem;
}

.btn-toggle--active {
  background: var(--clr-primary);
  color: var(--clr-text-inverse);
  border-color: var(--clr-primary);
}

.btn-toggle--active:hover {
  background: var(--clr-primary-hover);
  border-color: var(--clr-primary-hover);
  color: var(--clr-text-inverse);
}

/* Textarea */
.recipe-textarea {
  width: 100%;
  height: 3.6rem;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--clr-border);
  background: var(--clr-surface);
  color: var(--clr-text);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  resize: vertical;
  transition: border-color var(--duration-fast) var(--ease-default);
  flex: 1;
}

.recipe-textarea::placeholder {
  color: var(--clr-text-faint);
}

.recipe-textarea:focus {
  outline: none;
  border-color: var(--clr-primary);
  box-shadow: 0 0 0 3px var(--clr-focus-ring);
}

.generate-btn {
  width: 100%;
}

/* Result */
.recipe-result {
  min-height: 4rem;
}

.recipe-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem 1rem;
  text-align: center;
}

.recipe-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem;
  text-align: center;
  border-radius: var(--radius-lg);
  background: var(--clr-danger-light);
  border: 1px solid rgba(230, 62, 17, 0.2);
}

.recipe-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem 1rem;
  text-align: center;
}

/* Recipe card */
.recipe-card {
  animation: fade-in-up 0.4s var(--ease-out);
}

.recipe-card__header {
  margin-bottom: 0.75rem;
}

.recipe-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--clr-text);
  margin: 0 0 0.25rem;
}

.recipe-card__desc {
  font-size: 0.8125rem;
  color: var(--clr-text-muted);
  margin: 0;
  line-height: 1.4;
}

/* Meta */
.recipe-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0.5rem 0;
  margin-bottom: 0.75rem;
  border-top: 1px solid var(--clr-border-subtle);
  border-bottom: 1px solid var(--clr-border-subtle);
}

.recipe-meta__item {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--clr-text-muted);
}

/* Nutrition */
.recipe-nutrition {
  margin-bottom: 0.75rem;
}

.recipe-nutrition__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.recipe-nutrition__item {
  text-align: center;
  padding: 0.5rem 0.375rem;
  border-radius: var(--radius-md);
  background: var(--clr-primary-faint);
}

.recipe-nutrition__value {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  color: var(--clr-text);
}

.recipe-nutrition__label {
  display: block;
  font-size: 0.625rem;
  color: var(--clr-text-muted);
  margin-top: 0.0625rem;
}

/* Two-column ingredients + steps */
.recipe-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

@media (max-width: 640px) {
  .recipe-columns {
    grid-template-columns: 1fr;
  }
}

/* Subtitle */
.recipe-subtitle {
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--clr-text);
  margin: 0 0 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

/* Section */
.recipe-section {
  margin-bottom: 0.75rem;
}

/* Ingredients */
.recipe-ingredients {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.recipe-ingredients__item {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-size: 0.8125rem;
  padding: 0.25rem 0;
  border-bottom: 1px solid var(--clr-border-subtle);
}

.recipe-ingredients__qty {
  font-weight: 600;
  color: var(--clr-primary);
  min-width: 3.5rem;
  flex-shrink: 0;
  font-size: 0.75rem;
}

/* Steps */
.recipe-steps {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.recipe-steps__item {
  display: flex;
  gap: 0.5rem;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--clr-text);
}

.recipe-steps__num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: var(--radius-full);
  background: var(--clr-primary);
  color: var(--clr-text-inverse);
  font-size: 0.625rem;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

/* Tips */
.recipe-tips {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.recipe-tips__item {
  font-size: 0.75rem;
  color: var(--clr-text-muted);
  padding: 0.5rem 0.625rem;
  border-radius: var(--radius-md);
  background: var(--clr-secondary-light);
  border-left: 3px solid var(--clr-secondary);
  line-height: 1.4;
}

@media (prefers-reduced-motion: reduce) {
  .recipe-card {
    animation: none;
  }
}

/* Save recipe */
.recipe-save {
  display: flex;
  justify-content: center;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--clr-border-subtle);
}

.recipe-saved {
  font-size: 0.75rem;
  color: var(--clr-accent);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.recipe-added {
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
