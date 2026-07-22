<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSavedRecipesStore } from '@/stores/savedRecipesStore'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { useAddFood } from '@/composables/useAddFood'
import { MEAL_TYPE_OPTIONS } from '@/utils/constants'
import Modal from '@/components/ui/Modal.vue'
import type { SavedRecipe } from '@/stores/savedRecipesStore'
import type { AllergenType } from '@/types/nutrition'

const ALLERGEN_ICONS: Record<AllergenType, [string, string]> = {
  gluten: ['fas', 'bread-slice'],
  milk: ['fas', 'glass-water'],
  eggs: ['fas', 'egg'],
  peanuts: ['fas', 'bowl-food'],
  tree_nuts: ['fas', 'bowl-food'],
  soy: ['fas', 'leaf'],
  fish: ['fas', 'fish'],
  shellfish: ['fas', 'shrimp'],
  sesame: ['fas', 'droplet'],
  mustard: ['fas', 'droplet'],
  celery: ['fas', 'carrot'],
  lupin: ['fas', 'seedling'],
}

const ALLERGEN_LABELS: Record<AllergenType, string> = {
  gluten: 'Gluten',
  milk: 'Lácteos',
  eggs: 'Huevo',
  peanuts: 'Cacahuetes',
  tree_nuts: 'Frutos secos',
  soy: 'Soja',
  fish: 'Pescado',
  shellfish: 'Marisco',
  sesame: 'Sésamo',
  mustard: 'Mostaza',
  celery: 'Apio',
  lupin: 'Altramuces',
}

const savedRecipesStore = useSavedRecipesStore()
const { user } = useAuth()
const toast = useToast()
const { showAddModal, selectedFood, servings, mealType, openAddModal, confirmAdd, closeModal } = useAddFood()

const selectedRecipe = ref<SavedRecipe | null>(null)
const showRecipeModal = ref(false)
const showDeleteConfirm = ref(false)
const recipeToDelete = ref<SavedRecipe | null>(null)

onMounted(async () => {
  if (user.value) {
    await savedRecipesStore.loadRecipes()
  }
})

function openRecipeModal(recipe: SavedRecipe) {
  selectedRecipe.value = recipe
  showRecipeModal.value = true
}

function confirmDeleteRecipe(recipe: SavedRecipe) {
  recipeToDelete.value = recipe
  showDeleteConfirm.value = true
}

async function deleteRecipe(id: string) {
  await savedRecipesStore.deleteRecipe(id)
  showRecipeModal.value = false
  selectedRecipe.value = null
  showDeleteConfirm.value = false
  recipeToDelete.value = null
  toast.show('Receta eliminada')
}

function cancelDelete() {
  showDeleteConfirm.value = false
  recipeToDelete.value = null
}

function openAddRecipeToDay(recipe: SavedRecipe) {
  showRecipeModal.value = false
  openAddModal({
    id: recipe.id,
    name: recipe.name,
    calories: recipe.calories ?? 0,
    protein: recipe.protein ?? 0,
    carbs: recipe.carbs ?? 0,
    fat: recipe.fat ?? 0,
  })
}
</script>

<template>
  <main class="dash">
    <header class="dash__header">
      <div class="dash__title-row">
        <h1 class="text-display-lg">
          <font-awesome-icon
            :icon="['fas', 'cookie']"
            aria-hidden="true"
            style="color: var(--clr-primary)"
          />
          Mis recetas
        </h1>
        <router-link to="/recetas" class="btn btn-primary btn-sm">
          <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" aria-hidden="true" />
          Nueva receta
        </router-link>
      </div>
      <p class="text-body-sm">Recetas que has generado y guardado</p>
    </header>

    <div v-if="savedRecipesStore.recipes.length === 0" class="card-warm text-center py-8 px-4">
      <font-awesome-icon
        :icon="['fas', 'cookie']"
        class="text-3xl block mb-2"
        aria-hidden="true"
        style="color: var(--clr-primary); opacity: 0.3"
      />
      <p class="text-sm font-medium" style="color: var(--clr-text-muted)">
        No hay recetas guardadas
      </p>
      <p class="text-xs mt-1 mb-3" style="color: var(--clr-text-faint)">
        Genera una receta y guárdala aquí
      </p>
      <router-link to="/recetas" class="btn btn-primary btn-sm">
        <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" aria-hidden="true" />
        Generar receta
      </router-link>
    </div>

    <div v-else class="saved-list">
      <article
        v-for="recipe in savedRecipesStore.recipes"
        :key="recipe.id"
        class="saved-card"
        tabindex="0"
        :aria-label="`Ver detalles de ${recipe.name}`"
      >
        <div
          class="saved-card__accent"
          :class="recipe.isVegan || recipe.isVegetarian ? 'saved-card__accent--vegan' : recipe.allergens?.includes('gluten') ? 'saved-card__accent--other' : 'saved-card__accent--gluten-free'"
        />
        <div class="saved-card__body" role="button" @click="openRecipeModal(recipe)" @keydown.enter="openRecipeModal(recipe)">
          <h3 class="saved-card__title">{{ recipe.name }}</h3>
          <div class="saved-card__macros">
            <span v-if="recipe.calories" class="saved-card__macro"><strong>{{ recipe.calories }}</strong> kcal</span>
            <span v-if="recipe.protein" class="saved-card__macro">P {{ recipe.protein }}g</span>
            <span v-if="recipe.carbs" class="saved-card__macro">C {{ recipe.carbs }}g</span>
            <span v-if="recipe.fat" class="saved-card__macro">G {{ recipe.fat }}g</span>
            <span v-if="recipe.prepTime" class="saved-card__macro">
              <font-awesome-icon :icon="['fas', 'clock']" aria-hidden="true" />
              {{ recipe.prepTime }}
            </span>
          </div>
          <div v-if="recipe.allergens?.length || recipe.isVegan || recipe.isVegetarian" class="saved-card__tags">
            <span v-for="a in recipe.allergens?.slice(0, 3)" :key="a" class="saved-card__tag">
              <font-awesome-icon :icon="ALLERGEN_ICONS[a]" aria-hidden="true" />
              {{ ALLERGEN_LABELS[a] }}
            </span>
            <span v-if="recipe.isVegan" class="saved-card__badge saved-card__badge--vegan">
              <font-awesome-icon :icon="['fas', 'leaf']" aria-hidden="true" />
              Vegano
            </span>
            <span v-else-if="recipe.isVegetarian" class="saved-card__badge saved-card__badge--vegetarian">
              <font-awesome-icon :icon="['fas', 'seedling']" aria-hidden="true" />
              Vegetariano
            </span>
          </div>
        </div>
        <div class="saved-card__actions">
          <button class="btn-slide btn-slide--primary" :aria-label="`Añadir ${recipe.name} al día`" @click.stop="openAddRecipeToDay(recipe)">
            <span class="btn-slide__label">Añadir</span>
            <font-awesome-icon :icon="['fas', 'plus']" class="btn-slide__icon" aria-hidden="true" />
          </button>
          <button class="btn-slide btn-slide--danger" :aria-label="`Eliminar ${recipe.name}`" @click.stop="confirmDeleteRecipe(recipe)">
            <span class="btn-slide__label">Eliminar</span>
            <font-awesome-icon :icon="['fas', 'xmark']" class="btn-slide__icon" aria-hidden="true" />
          </button>
        </div>
      </article>
    </div>

    <!-- Recipe detail modal -->
    <Modal
      :open="showRecipeModal"
      size="lg"
      @close="showRecipeModal = false"
    >
      <template v-if="selectedRecipe">
        <div class="modal-detail">
          <div v-if="selectedRecipe.imageUrl" class="modal-detail__img">
            <img :src="selectedRecipe.imageUrl" :alt="selectedRecipe.name" />
          </div>
          <h3 class="modal-detail__name">{{ selectedRecipe.name }}</h3>
          <p v-if="selectedRecipe.description" class="modal-detail__desc">{{ selectedRecipe.description }}</p>

          <div v-if="selectedRecipe.servingSize || selectedRecipe.prepTime" class="modal-detail__serving">
            <font-awesome-icon v-if="selectedRecipe.servingSize" :icon="['fas', 'scale-balanced']" aria-hidden="true" />
            <font-awesome-icon v-else :icon="['fas', 'clock']" aria-hidden="true" />
            {{ selectedRecipe.servingSize || selectedRecipe.prepTime }}
          </div>

          <div class="modal-detail__score" v-if="selectedRecipe.nutritionScore">
            <div class="score-ring">
              <svg viewBox="0 0 80 80" class="score-ring__svg">
                <circle cx="40" cy="40" r="34" fill="none" stroke="var(--clr-surface-alt)" stroke-width="6" />
                <circle
                  cx="40" cy="40" r="34" fill="none"
                  :stroke="selectedRecipe.nutritionScore.value >= 70 ? 'var(--clr-success)' : selectedRecipe.nutritionScore.value >= 40 ? 'var(--clr-accent)' : 'var(--clr-danger)'"
                  stroke-width="6"
                  stroke-linecap="round"
                  :stroke-dasharray="213.6"
                  :stroke-dashoffset="213.6 - (213.6 * selectedRecipe.nutritionScore.value / 100)"
                  transform="rotate(-90 40 40)"
                  class="score-ring__fill"
                />
              </svg>
              <span class="score-ring__value">{{ selectedRecipe.nutritionScore.value }}</span>
            </div>
            <div class="score-ring__info">
              <span class="score-ring__label">Score nutricional</span>
              <span v-if="selectedRecipe.nutritionScore.reason" class="score-ring__reason">{{ selectedRecipe.nutritionScore.reason }}</span>
            </div>
          </div>

          <div class="modal-detail__macros">
            <div v-if="selectedRecipe.calories" class="modal-macro">
              <span class="modal-macro__value">{{ selectedRecipe.calories }}</span>
              <span class="modal-macro__label">kcal</span>
            </div>
            <div v-if="selectedRecipe.protein" class="modal-macro modal-macro--protein">
              <span class="modal-macro__value">{{ selectedRecipe.protein }}g</span>
              <span class="modal-macro__label">Proteínas</span>
            </div>
            <div v-if="selectedRecipe.carbs" class="modal-macro modal-macro--carbs">
              <span class="modal-macro__value">{{ selectedRecipe.carbs }}g</span>
              <span class="modal-macro__label">Carbos</span>
            </div>
            <div v-if="selectedRecipe.fat" class="modal-macro modal-macro--fat">
              <span class="modal-macro__value">{{ selectedRecipe.fat }}g</span>
              <span class="modal-macro__label">Grasas</span>
            </div>
          </div>

          <div v-if="selectedRecipe.calories" class="modal-detail__macro-bar">
            <div
              class="modal-detail__macro-bar-seg modal-detail__macro-bar-seg--protein"
              :style="{ flex: selectedRecipe.protein || 0.1 }"
            />
            <div
              class="modal-detail__macro-bar-seg modal-detail__macro-bar-seg--carbs"
              :style="{ flex: selectedRecipe.carbs || 0.1 }"
            />
            <div
              class="modal-detail__macro-bar-seg modal-detail__macro-bar-seg--fat"
              :style="{ flex: selectedRecipe.fat || 0.1 }"
            />
          </div>
          <div v-if="selectedRecipe.calories" class="modal-detail__macro-legend">
            <span class="modal-detail__legend-item">
              <span class="modal-detail__legend-dot modal-detail__legend-dot--protein" />
              Proteínas {{ Math.round((selectedRecipe.protein || 0) * 4) }} kcal
            </span>
            <span class="modal-detail__legend-item">
              <span class="modal-detail__legend-dot modal-detail__legend-dot--carbs" />
              Carbos {{ Math.round((selectedRecipe.carbs || 0) * 4) }} kcal
            </span>
            <span class="modal-detail__legend-item">
              <span class="modal-detail__legend-dot modal-detail__legend-dot--fat" />
              Grasas {{ Math.round((selectedRecipe.fat || 0) * 9) }} kcal
            </span>
          </div>

          <div class="modal-detail__dietary">
            <span v-if="selectedRecipe.isVegan" class="modal-detail__badge modal-detail__badge--vegan">
              <font-awesome-icon :icon="['fas', 'leaf']" aria-hidden="true" />
              Vegano
            </span>
            <span v-if="selectedRecipe.isVegetarian" class="modal-detail__badge modal-detail__badge--vegetarian">
              <font-awesome-icon :icon="['fas', 'carrot']" aria-hidden="true" />
              Vegetariano
            </span>
          </div>

          <div v-if="selectedRecipe.allergens?.length" class="modal-detail__section">
            <h4 class="modal-detail__section-title">
              <font-awesome-icon :icon="['fas', 'triangle-exclamation']" aria-hidden="true" />
              Alérgenos
            </h4>
            <div class="modal-detail__tags">
              <span v-for="a in selectedRecipe.allergens" :key="a" class="modal-detail__tag modal-detail__tag--allergen">
                {{ ALLERGEN_LABELS[a] || a }}
              </span>
            </div>
          </div>

          <div v-if="selectedRecipe.ingredients.length > 0" class="modal-detail__section">
            <h4 class="modal-detail__section-title">
              <font-awesome-icon :icon="['fas', 'list-check']" aria-hidden="true" />
              Ingredientes
            </h4>
            <ul class="modal-detail__list">
              <li v-for="(ing, idx) in selectedRecipe.ingredients" :key="idx" class="modal-detail__ing">
                <span class="modal-detail__ing-name">{{ ing.name }}</span>
                <span class="modal-detail__ing-right">
                  <span class="modal-detail__ing-qty">{{ ing.quantity }}</span>
                </span>
              </li>
            </ul>
          </div>

          <div class="modal-detail__section">
            <h4 class="modal-detail__section-title">
              <font-awesome-icon :icon="['fas', 'utensils']" aria-hidden="true" />
              Preparación
            </h4>
            <p class="modal-detail__instructions">{{ selectedRecipe.instructions }}</p>
          </div>
        </div>
      </template>
      <template #footer>
        <button class="btn btn-secondary" @click="showRecipeModal = false">Cerrar</button>
        <button class="btn btn-primary" @click="selectedRecipe && openAddRecipeToDay(selectedRecipe)">
          <font-awesome-icon :icon="['fas', 'plus']" aria-hidden="true" />
          Agregar a mi día
        </button>
        <button class="btn btn-danger" @click="selectedRecipe && deleteRecipe(selectedRecipe.id)">
          <font-awesome-icon :icon="['fas', 'xmark']" aria-hidden="true" />
          Eliminar
        </button>
      </template>
    </Modal>

    <!-- Add food modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      :aria-label="`Añadir ${selectedFood?.name}`"
      @click.self="closeModal"
      @keydown.escape="closeModal"
    >
      <div
        class="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-xl space-y-5 animate-slide-up"
        style="background: var(--clr-surface)"
      >
        <h2 class="font-display" style="font-size: 1.25rem; color: var(--clr-text)">
          Añadir alimento
        </h2>

        <p class="font-medium" style="font-size: 0.875rem; color: var(--clr-text)">
          {{ selectedFood?.name }}
        </p>

        <fieldset class="space-y-2 border-0 p-0 m-0">
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

        <div class="space-y-2">
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

        <div class="flex gap-3 pt-2">
          <button class="btn btn-secondary flex-1" @click="closeModal">Cancelar</button>
          <button class="btn btn-primary flex-1" @click="confirmAdd">Añadir</button>
        </div>
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <Modal :open="showDeleteConfirm" size="sm" title="Eliminar receta" @close="cancelDelete">
      <p class="text-sm" style="color: var(--clr-text-muted)">
        ¿Seguro que quieres eliminar <strong>{{ recipeToDelete?.name }}</strong>?
      </p>
      <template #footer>
        <button class="btn btn-secondary" @click="cancelDelete">Cancelar</button>
        <button class="btn btn-danger" @click="recipeToDelete && deleteRecipe(recipeToDelete.id)">
          Eliminar
        </button>
      </template>
    </Modal>
  </main>
</template>

<style scoped>
.dash {
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
  padding-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.dash__header { text-align: center; margin-bottom: 0.125rem; }

.dash__title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.saved-card {
  display: flex;
  align-items: stretch;
  background: var(--clr-surface);
  border: 1px solid var(--clr-border-subtle);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: box-shadow 0.2s ease;
  margin-bottom: 8px;
}

.saved-card:hover { box-shadow: var(--shadow-lg); }
.saved-card:focus-visible { outline: 2px solid var(--clr-primary); outline-offset: 2px; }

.saved-card__accent {
  width: 4px;
  flex-shrink: 0;
  background: var(--clr-primary);
}
.saved-card__accent--vegan,
.saved-card__accent--vegetarian { background: var(--clr-success); }
.saved-card__accent--gluten-free { background: var(--clr-warning); }
.saved-card__accent--other { background: var(--clr-accent); }

.saved-card__body {
  flex: 1;
  min-width: 0;
  padding: 0.75rem 1rem;
}

.saved-card__title {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--clr-text);
  margin: 0 0 0.25rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.saved-card__macros {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem 0.625rem;
  font-size: 0.675rem;
  color: var(--clr-text-muted);
}
.saved-card__macro { white-space: nowrap; }

.saved-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.375rem;
}
.saved-card__tag {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-full);
  font-size: 0.6rem;
  font-weight: var(--weight-medium);
  background: var(--clr-accent-light);
  color: var(--clr-accent);
}
.saved-card__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-full);
  font-size: 0.6rem;
  font-weight: var(--weight-semibold);
}
.saved-card__badge--vegan {
  background: var(--clr-success-light);
  color: var(--clr-success);
}
.saved-card__badge--vegetarian {
  background: var(--clr-success-light);
  color: var(--clr-success);
}

.saved-card__actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-shrink: 0;
  padding: 0.75rem 0.75rem 0.75rem 0;
}

.btn-slide {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  overflow: visible;
  z-index: 1;
  color: #fff;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.15s ease;
}
.btn-slide::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-md);
  z-index: -1;
  transition: left 0.25s ease;
}

.btn-slide__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  font-size: 0.875rem;
}

.btn-slide__label {
  position: absolute;
  right: 2rem;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.7rem;
  font-weight: 700;
  white-space: nowrap;
  color: #fff;
  opacity: 0;
  transform: translateX(6px);
  transition: opacity 0.25s ease, transform 0.25s ease;
  pointer-events: none;
}
.btn-slide:hover .btn-slide__label {
  opacity: 1;
  transform: translateX(0);
}

.btn-slide--primary { background: var(--clr-primary); }
.btn-slide--primary::before { background: var(--clr-primary); }
.btn-slide--primary:hover::before { left: -3.5rem; }
.btn-slide--primary:hover { background: var(--clr-primary-hover); }

.btn-slide--danger { background: var(--clr-danger); }
.btn-slide--danger::before { background: var(--clr-danger); }
.btn-slide--danger:hover::before { left: -3.5rem; }
.btn-slide--danger:hover { background: var(--clr-danger); }

@media (hover: none) {
  .btn-slide__label { display: none; }
}

/* Modal detail */
.modal-detail {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.modal-detail__img {
  width: 100%;
  height: 150px;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.modal-detail__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-detail__name {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: var(--weight-bold);
  color: var(--clr-text);
  margin: 0;
}

.modal-detail__desc {
  font-size: var(--text-xs);
  color: var(--clr-text-muted);
  margin: 0;
}

.modal-detail__serving {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: var(--text-xs);
  color: var(--clr-text-faint);
}

.modal-detail__macros {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.modal-detail__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.modal-detail__tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  border-radius: var(--radius-full);
}

.modal-detail__tag--allergen {
  background: var(--clr-accent-light);
  color: var(--clr-accent);
}

.modal-detail__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.modal-macro {
  text-align: center;
  padding: 0.375rem;
  background: var(--clr-surface-alt);
  border-radius: var(--radius-md);
}

.modal-macro__value {
  display: block;
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--clr-primary);
  line-height: 1;
  margin-bottom: 0.125rem;
}

.modal-macro__label {
  font-size: 0.625rem;
  color: var(--clr-text-faint);
}

.modal-macro--protein .modal-macro__value { color: var(--clr-primary); }
.modal-macro--carbs .modal-macro__value { color: var(--clr-accent); }
.modal-macro--fat .modal-macro__value { color: var(--clr-secondary); }

.modal-detail__macro-bar {
  display: flex;
  height: 0.5rem;
  border-radius: var(--radius-full);
  overflow: hidden;
  gap: 2px;
}

.modal-detail__macro-bar-seg {
  border-radius: var(--radius-full);
  transition: flex 0.6s var(--ease-default);
}

.modal-detail__macro-bar-seg--protein { background: var(--clr-primary); }
.modal-detail__macro-bar-seg--carbs { background: var(--clr-accent); }
.modal-detail__macro-bar-seg--fat { background: var(--clr-secondary); }

.modal-detail__macro-legend {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.modal-detail__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.675rem;
  color: var(--clr-text-muted);
}

.modal-detail__legend-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.modal-detail__legend-dot--protein { background: var(--clr-primary); }
.modal-detail__legend-dot--carbs { background: var(--clr-accent); }
.modal-detail__legend-dot--fat { background: var(--clr-secondary); }

.modal-detail__score {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--clr-surface-alt);
  border-radius: var(--radius-lg);
}

.score-ring {
  position: relative;
  width: 3.5rem;
  height: 3.5rem;
  flex-shrink: 0;
}

.score-ring__svg {
  width: 100%;
  height: 100%;
}

.score-ring__fill {
  transition: stroke-dashoffset 0.8s var(--ease-out);
}

.score-ring__value {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--clr-text);
}

.score-ring__info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.score-ring__label {
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--clr-text);
}

.score-ring__reason {
  font-size: 0.675rem;
  color: var(--clr-text-muted);
  line-height: 1.4;
}

.modal-detail__dietary {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.modal-detail__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
}

.modal-detail__badge--vegan {
  background: color-mix(in srgb, var(--clr-success) 15%, transparent);
  color: var(--clr-success);
}

.modal-detail__badge--vegetarian {
  background: color-mix(in srgb, var(--clr-primary) 15%, transparent);
  color: var(--clr-primary);
}

.modal-detail__section-title {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--clr-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0 0 0.375rem 0;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.modal-detail__section-title i {
  color: var(--clr-accent);
}

.modal-detail__ing {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.375rem 0.5rem;
  background: var(--clr-surface-alt);
  border-radius: var(--radius-md);
}

.modal-detail__ing + .modal-detail__ing {
  margin-top: 0.25rem;
}

.modal-detail__ing-name {
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  color: var(--clr-text);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.modal-detail__ing-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.modal-detail__ing-qty {
  font-size: 0.675rem;
  color: var(--clr-text-muted);
}

.modal-detail__instructions {
  font-size: var(--text-xs);
  color: var(--clr-text);
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
}
</style>
