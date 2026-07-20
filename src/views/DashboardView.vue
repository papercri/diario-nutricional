<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useFoodStore } from '@/stores/foodStore'
import { useSavedPlatesStore } from '@/stores/savedPlatesStore'
import { useSavedRecipesStore } from '@/stores/savedRecipesStore'
import CalorieRing from '@/components/CalorieRing.vue'
import NutrientCard from '@/components/NutrientCard.vue'
import Modal from '@/components/ui/Modal.vue'
import { useToast } from '@/composables/useToast'
import { groupEntriesByMealType } from '@/utils/nutrition'
import { formatDateEs } from '@/utils/formatting'
import { MEAL_TYPE_LABELS, MEAL_TYPE_ICONS } from '@/utils/constants'
import type { MealType } from '@/types/user'
import type { SavedPlate } from '@/stores/savedPlatesStore'
import type { SavedRecipe } from '@/stores/savedRecipesStore'

const userStore = useUserStore()
const foodStore = useFoodStore()
const savedPlatesStore = useSavedPlatesStore()
const savedRecipesStore = useSavedRecipesStore()
const toast = useToast()

type Tab = 'day' | 'plates' | 'recipes' | 'profile'
const activeTab = ref<Tab>('day')

const todayDate = computed(() => formatDateEs(new Date()))
const groupedEntries = computed(() => groupEntriesByMealType(foodStore.todayEntries))

const mealsOpen = ref(true)
const openMealTypes = ref<Set<MealType>>(new Set(['breakfast', 'lunch', 'dinner', 'snack']))

const deleteEntryId = ref<string | null>(null)
const deleteEntryName = ref('')
const showClearModal = ref(false)

const selectedPlate = ref<SavedPlate | null>(null)
const showPlateModal = ref(false)

const selectedRecipe = ref<SavedRecipe | null>(null)
const showRecipeModal = ref(false)

onMounted(async () => {
  await savedPlatesStore.loadPlates()
  await savedRecipesStore.loadRecipes()
})

function confirmDeleteEntry(id: string, name: string) {
  deleteEntryId.value = id
  deleteEntryName.value = name
}

function executeDeleteEntry() {
  if (deleteEntryId.value) {
    foodStore.removeEntry(deleteEntryId.value)
    toast.show('Elemento eliminado')
    deleteEntryId.value = null
    deleteEntryName.value = ''
  }
}

function cancelDeleteEntry() {
  deleteEntryId.value = null
  deleteEntryName.value = ''
}

function executeClearToday() {
  foodStore.clearToday()
  toast.show('Elemento eliminado')
  showClearModal.value = false
}

function toggleMealType(type: MealType) {
  if (openMealTypes.value.has(type)) {
    openMealTypes.value.delete(type)
  } else {
    openMealTypes.value.add(type)
  }
}

function mealTypeTotalCalories(entries: { food: { calories: number }; servings: number }[]) {
  return Math.round(entries.reduce((sum, e) => sum + e.food.calories * e.servings, 0))
}

function entryMacros(entry: {
  food: { calories: number; protein: number; carbs: number; fat: number }
  servings: number
}) {
  return {
    cal: Math.round(entry.food.calories * entry.servings),
    p: Math.round(entry.food.protein * entry.servings),
    c: Math.round(entry.food.carbs * entry.servings),
    f: Math.round(entry.food.fat * entry.servings),
  }
}

function openPlateModal(plate: SavedPlate) {
  selectedPlate.value = plate
  showPlateModal.value = true
}

function openRecipeModal(recipe: SavedRecipe) {
  selectedRecipe.value = recipe
  showRecipeModal.value = true
}

async function deletePlate(id: string) {
  await savedPlatesStore.deletePlate(id)
  showPlateModal.value = false
  selectedPlate.value = null
  toast.show('Plato eliminado')
}

async function deleteRecipe(id: string) {
  await savedRecipesStore.deleteRecipe(id)
  showRecipeModal.value = false
  selectedRecipe.value = null
  toast.show('Receta eliminada')
}
</script>

<template>
  <main class="dash">
    <!-- Tab bar -->
    <nav class="tabs" role="tablist" aria-label="Secciones del panel">
      <button
        role="tab"
        :aria-selected="activeTab === 'day'"
        class="tabs__item"
        :class="{ 'tabs__item--active': activeTab === 'day' }"
        @click="activeTab = 'day'"
      >
        <font-awesome-icon :icon="['fas', 'sun']" aria-hidden="true" />
        Mi día
      </button>
      <button
        role="tab"
        :aria-selected="activeTab === 'plates'"
        class="tabs__item"
        :class="{ 'tabs__item--active': activeTab === 'plates' }"
        @click="activeTab = 'plates'"
      >
        <font-awesome-icon :icon="['fas', 'bowl-food']" aria-hidden="true" />
        Mis platos
      </button>
      <button
        role="tab"
        :aria-selected="activeTab === 'recipes'"
        class="tabs__item"
        :class="{ 'tabs__item--active': activeTab === 'recipes' }"
        @click="activeTab = 'recipes'"
      >
        <font-awesome-icon :icon="['fas', 'cookie']" aria-hidden="true" />
        Mis recetas
      </button>
      <button
        role="tab"
        :aria-selected="activeTab === 'profile'"
        class="tabs__item"
        :class="{ 'tabs__item--active': activeTab === 'profile' }"
        @click="activeTab = 'profile'"
      >
        <font-awesome-icon :icon="['fas', 'user']" aria-hidden="true" />
        Perfil
      </button>
    </nav>

    <!-- Tab: Mi día -->
    <div v-if="activeTab === 'day'" role="tabpanel">
      <header class="dash__header">
        <h1 class="text-display-lg">
          {{
            userStore.isProfileComplete
              ? `¡Bienvenid${userStore.profile.sex === 'female' ? 'a' : 'o'}, ${userStore.profile.name}!`
              : '¡Bienvenid@ a Avocato!'
          }}
        </h1>
        <p class="text-body-sm capitalize">{{ todayDate }}</p>
      </header>

      <section
        v-if="!userStore.isProfileComplete"
        class="card-surface p-6 text-center"
        aria-label="Completa tu perfil"
      >
        <p class="text-body mb-3">
          Cuéntanos sobre ti para calcular tus metas calóricas personalizadas.
        </p>
        <router-link to="/profile" class="btn btn-primary" role="button">
          Completa tu perfil
        </router-link>
      </section>

      <section v-else aria-label="Resumen nutricional del día" class="dash__summary">
        <CalorieRing
          :consumed="foodStore.todaySummary.calories"
          :target="userStore.goals.targetCalories"
        />

        <div class="dash__nutrients">
          <NutrientCard
            label="Proteínas"
            :value="foodStore.todaySummary.protein"
            :target="userStore.goals.proteinGrams"
            unit="g"
            color="emerald"
          />
          <NutrientCard
            label="Carbos"
            :value="foodStore.todaySummary.carbs"
            :target="userStore.goals.carbGrams"
            unit="g"
            color="brown"
          />
          <NutrientCard
            label="Grasas"
            :value="foodStore.todaySummary.fat"
            :target="userStore.goals.fatGrams"
            unit="g"
            color="amber"
          />
        </div>
      </section>

      <section aria-label="Comidas registradas hoy">
        <button
          class="dash__meals-toggle"
          :aria-expanded="mealsOpen"
          @click="mealsOpen = !mealsOpen"
        >
          <div class="flex items-center gap-1 min-w-0">
            <h2 class="text-xs font-semibold truncate uppercase" style="color: var(--clr-text)">
              Comidas de hoy
            </h2>
            <span
              v-if="foodStore.todayEntries.length > 0"
              class="text-[12px] font-bold shrink-0 px-1 py-1 rounded"
              style="color: var(--clr-text-muted); background: var(--clr-surface-alt)"
            >
              {{ foodStore.todayEntries.length }}
            </span>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <font-awesome-icon
              :icon="['fas', 'chevron-down']"
              class="text-[13px] transition-transform duration-200"
              :class="{ 'rotate-180': mealsOpen }"
              aria-hidden="true"
              style="color: var(--clr-text-faint)"
            />
          </div>
        </button>

        <div v-if="mealsOpen">
          <div
            v-if="foodStore.todayEntries.length === 0"
            class="card-warm text-center py-6 px-4 mt-1.5"
            role="status"
          >
            <font-awesome-icon
              :icon="['fas', 'utensils']"
              class="text-2xl block mb-1.5"
              aria-hidden="true"
              style="color: var(--clr-primary); opacity: 0.4"
            />
            <p class="text-xs font-medium" style="color: var(--clr-text-muted)">
              Tu día está vacío
            </p>
            <p class="text-[10px] mt-0.5" style="color: var(--clr-text-faint)">
              Registra tu primera comida para comenzar
            </p>
          </div>

          <div v-else class="mt-1.5 flex flex-col gap-1.5">
            <article
              v-for="(entries, type) in groupedEntries"
              :key="type"
              class="card overflow-hidden"
              :aria-label="MEAL_TYPE_LABELS[type]"
            >
              <button
                class="dash__meal-header"
                :aria-expanded="openMealTypes.has(type as MealType)"
                @click="toggleMealType(type as MealType)"
              >
                <div class="flex items-center gap-1 min-w-0">
                  <font-awesome-icon
                    :icon="MEAL_TYPE_ICONS[type]"
                    aria-hidden="true"
                    class="text-[10px]"
                    style="color: var(--clr-primary)"
                  />
                  <span class="text-sm font-semibold" style="color: var(--clr-text)">{{
                    MEAL_TYPE_LABELS[type]
                  }}</span>
                  <span class="text-[13px] font-medium" style="color: var(--clr-text-faint)">
                    {{ entries.length }} · {{ mealTypeTotalCalories(entries) }} kcal
                  </span>
                </div>
                <font-awesome-icon
                  :icon="['fas', 'chevron-down']"
                  class="text-[13px] transition-transform duration-200"
                  :class="{ 'rotate-180': openMealTypes.has(type as MealType) }"
                  aria-hidden="true"
                  style="color: var(--clr-text-faint)"
                />
              </button>

              <ul v-if="openMealTypes.has(type as MealType)" class="dash__food-list">
                <li v-for="entry in entries" :key="entry.id" class="dash__food-item">
                  <div class="flex items-center gap-1.5 min-w-0 flex-1">
                    <img
                      v-if="entry.food.imageUrl"
                      :src="entry.food.imageUrl"
                      :alt="entry.food.name"
                      class="w-7 h-7 rounded object-cover shrink-0"
                      loading="lazy"
                    />
                    <div
                      v-else
                      class="w-7 h-7 rounded flex items-center justify-center shrink-0"
                      style="background: var(--clr-primary-light)"
                    >
                      <font-awesome-icon
                        :icon="['fas', 'utensils']"
                        class="text-[10px]"
                        aria-hidden="true"
                        style="color: var(--clr-primary); opacity: 0.5"
                      />
                    </div>
                    <p class="text-[14px] font-medium truncate" style="color: var(--clr-text)">
                      {{ entry.food.name }}
                    </p>
                  </div>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <div class="dash__macros">
                      <span class="dash__macro-value">{{ entryMacros(entry).cal }}</span>
                      <span class="dash__macro-label">kcal</span>
                      <span class="dash__macro-sep">·</span>
                      <span class="dash__macro-value">{{ entryMacros(entry).p }}g</span>
                      <span class="dash__macro-label">P</span>
                      <span class="dash__macro-sep">·</span>
                      <span class="dash__macro-value">{{ entryMacros(entry).c }}g</span>
                      <span class="dash__macro-label">C</span>
                      <span class="dash__macro-sep">·</span>
                      <span class="dash__macro-value">{{ entryMacros(entry).f }}g</span>
                      <span class="dash__macro-label">G</span>
                    </div>
                    <button
                      class="w-5 h-5 flex items-center justify-center rounded shrink-0 transition-colors"
                      style="color: var(--clr-text-faint)"
                      :aria-label="`Eliminar ${entry.food.name}`"
                      @click="confirmDeleteEntry(entry.id, entry.food.name)"
                      @mouseenter="($event.target as HTMLElement).style.color = 'var(--clr-accent)'"
                      @mouseleave="
                        ($event.target as HTMLElement).style.color = 'var(--clr-text-faint)'
                      "
                    >
                      <font-awesome-icon
                        :icon="['fas', 'xmark']"
                        class="text-[13px]"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </li>
              </ul>
            </article>
          </div>
        </div>

        <div class="dash__actions">
          <div class="dash__actions-row">
            <router-link
              to="/search"
              class="btn btn-primary text-[10px] py-1 px-2 whitespace-nowrap"
              role="button"
            >
              <font-awesome-icon :icon="['fas', 'magnifying-glass']" aria-hidden="true" />
              Buscar
            </router-link>
            <router-link
              to="/nutrition-ai"
              class="btn btn-accent text-[10px] py-1 px-2 whitespace-nowrap"
              role="button"
            >
              <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" aria-hidden="true" />
              Mis platos
            </router-link>
          </div>
          <button
            v-if="foodStore.todayEntries.length > 0"
            class="btn btn-secondary py-1 px-2 text-[10px] whitespace-nowrap dash__btn-clear"
            aria-label="Eliminar todas las comidas de hoy"
            @click.stop="showClearModal = true"
          >
            <font-awesome-icon :icon="['fas', 'broom']" aria-hidden="true" />
            Limpiar
          </button>
        </div>
      </section>
    </div>

    <!-- Tab: Mis platos -->
    <div v-if="activeTab === 'plates'" role="tabpanel">
      <header class="dash__header">
        <h1 class="text-display-lg">
          <font-awesome-icon
            :icon="['fas', 'bowl-food']"
            aria-hidden="true"
            style="color: var(--clr-accent)"
          />
          Mis platos
        </h1>
        <p class="text-body-sm">Platos que has analizado y guardado</p>
      </header>

      <div v-if="savedPlatesStore.plates.length === 0" class="card-warm text-center py-8 px-4">
        <font-awesome-icon
          :icon="['fas', 'bowl-food']"
          class="text-3xl block mb-2"
          aria-hidden="true"
          style="color: var(--clr-primary); opacity: 0.3"
        />
        <p class="text-sm font-medium" style="color: var(--clr-text-muted)">
          No hay platos guardados
        </p>
        <p class="text-xs mt-1 mb-3" style="color: var(--clr-text-faint)">
          Analiza un plato en "Mis platos" y guárdalo aquí
        </p>
        <router-link to="/nutrition-ai" class="btn btn-primary btn-sm">
          <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" aria-hidden="true" />
          Analizar plato
        </router-link>
      </div>

      <div v-else class="saved-grid">
        <article
          v-for="plate in savedPlatesStore.plates"
          :key="plate.id"
          class="saved-card"
          tabindex="0"
          role="button"
          :aria-label="`Ver detalles de ${plate.name}`"
          @click="openPlateModal(plate)"
          @keydown.enter="openPlateModal(plate)"
        >
          <div v-if="plate.imageUrl" class="saved-card__img">
            <img :src="plate.imageUrl" :alt="plate.name" loading="lazy" />
          </div>
          <div v-else class="saved-card__icon">
            <font-awesome-icon :icon="['fas', 'bowl-food']" aria-hidden="true" />
          </div>
          <div class="saved-card__body">
            <h3 class="saved-card__title">{{ plate.name }}</h3>
            <p class="saved-card__cal">{{ plate.calories }} kcal</p>
            <div class="saved-card__macros">
              <span>P {{ plate.protein }}g</span>
              <span>C {{ plate.carbs }}g</span>
              <span>G {{ plate.fat }}g</span>
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- Tab: Mis recetas -->
    <div v-if="activeTab === 'recipes'" role="tabpanel">
      <header class="dash__header">
        <h1 class="text-display-lg">
          <font-awesome-icon
            :icon="['fas', 'cookie']"
            aria-hidden="true"
            style="color: var(--clr-primary)"
          />
          Mis recetas
        </h1>
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
          Genera una receta en "Mis recetas" y guárdala aquí
        </p>
        <router-link to="/recipes" class="btn btn-primary btn-sm">
          <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" aria-hidden="true" />
          Generar receta
        </router-link>
      </div>

      <div v-else class="saved-grid">
        <article
          v-for="recipe in savedRecipesStore.recipes"
          :key="recipe.id"
          class="saved-card"
          tabindex="0"
          role="button"
          :aria-label="`Ver detalles de ${recipe.name}`"
          @click="openRecipeModal(recipe)"
          @keydown.enter="openRecipeModal(recipe)"
        >
          <div class="saved-card__icon saved-card__icon--recipe">
            <font-awesome-icon :icon="['fas', 'cookie']" aria-hidden="true" />
          </div>
          <div class="saved-card__body">
            <h3 class="saved-card__title">{{ recipe.name }}</h3>
            <p v-if="recipe.calories" class="saved-card__cal">{{ recipe.calories }} kcal</p>
            <p v-if="recipe.prepTime" class="saved-card__time">
              <font-awesome-icon :icon="['fas', 'clock']" aria-hidden="true" />
              {{ recipe.prepTime }}
            </p>
            <div class="saved-card__macros">
              <span v-if="recipe.protein">P {{ recipe.protein }}g</span>
              <span v-if="recipe.carbs">C {{ recipe.carbs }}g</span>
              <span v-if="recipe.fat">G {{ recipe.fat }}g</span>
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- Tab: Perfil -->
    <div v-if="activeTab === 'profile'" role="tabpanel">
      <header class="dash__header">
        <h1 class="text-display-lg">
          <font-awesome-icon
            :icon="['fas', 'user']"
            aria-hidden="true"
            style="color: var(--clr-primary)"
          />
          Mi perfil
        </h1>
        <p class="text-body-sm">Tus datos y preferencias</p>
      </header>

      <div class="profile-summary">
        <div class="profile-summary__avatar">
          <font-awesome-icon :icon="['fas', 'user']" aria-hidden="true" />
        </div>
        <div class="profile-summary__info">
          <h2 class="profile-summary__name">{{ userStore.profile.name || 'Sin nombre' }}</h2>
          <p class="profile-summary__meta">
            {{ userStore.profile.age }} años · {{ userStore.profile.weight }} kg ·
            {{ userStore.profile.height }} cm
          </p>
        </div>
      </div>

      <div class="profile-stats">
        <div class="profile-stat">
          <span class="profile-stat__value">{{ userStore.goals.targetCalories }}</span>
          <span class="profile-stat__label">kcal/día</span>
        </div>
        <div class="profile-stat">
          <span class="profile-stat__value">{{ userStore.goals.proteinGrams }}g</span>
          <span class="profile-stat__label">Proteínas</span>
        </div>
        <div class="profile-stat">
          <span class="profile-stat__value">{{ userStore.goals.carbGrams }}g</span>
          <span class="profile-stat__label">Carbos</span>
        </div>
        <div class="profile-stat">
          <span class="profile-stat__value">{{ userStore.goals.fatGrams }}g</span>
          <span class="profile-stat__label">Grasas</span>
        </div>
      </div>

      <div v-if="userStore.profile.allergens?.length" class="profile-section">
        <h3 class="profile-section__title">
          <font-awesome-icon :icon="['fas', 'tag']" aria-hidden="true" />
          Alergias
        </h3>
        <div class="profile-tags">
          <span v-for="allergen in userStore.profile.allergens" :key="allergen" class="profile-tag">
            {{ allergen }}
          </span>
        </div>
      </div>

      <div v-if="userStore.profile.dietaryPreferences?.length" class="profile-section">
        <h3 class="profile-section__title">
          <font-awesome-icon :icon="['fas', 'leaf']" aria-hidden="true" />
          Preferencias alimentarias
        </h3>
        <div class="profile-tags">
          <span
            v-for="pref in userStore.profile.dietaryPreferences"
            :key="pref"
            class="profile-tag"
          >
            {{ pref }}
          </span>
        </div>
      </div>

      <div class="profile-actions">
        <router-link to="/profile" class="btn btn-primary">
          <font-awesome-icon :icon="['fas', 'id-card']" aria-hidden="true" />
          Editar perfil
        </router-link>
      </div>
    </div>

    <!-- Delete entry modal -->
    <Modal
      :open="deleteEntryId !== null"
      size="sm"
      title="Eliminar plato"
      @close="cancelDeleteEntry"
    >
      <p class="text-sm" style="color: var(--clr-text-muted)">
        ¿Eliminar <strong style="color: var(--clr-text)">{{ deleteEntryName }}</strong> de tus
        comidas de hoy?
      </p>
      <template #footer>
        <button class="btn btn-secondary" @click="cancelDeleteEntry">Cancelar</button>
        <button class="btn btn-primary" @click="executeDeleteEntry">Eliminar</button>
      </template>
    </Modal>

    <!-- Clear all modal -->
    <Modal :open="showClearModal" size="sm" title="Limpiar día" @close="showClearModal = false">
      <p class="text-sm" style="color: var(--clr-text-muted)">
        ¿Eliminar todas las comidas registradas hoy? Esta acción no se puede deshacer.
      </p>
      <template #footer>
        <button class="btn btn-secondary" @click="showClearModal = false">Cancelar</button>
        <button class="btn btn-primary" @click="executeClearToday">Eliminar todo</button>
      </template>
    </Modal>

    <!-- Plate detail modal -->
    <Modal
      :open="showPlateModal"
      size="md"
      title="Detalles del plato"
      @close="showPlateModal = false"
    >
      <template v-if="selectedPlate">
        <div class="modal-plate">
          <div v-if="selectedPlate.imageUrl" class="modal-plate__img">
            <img :src="selectedPlate.imageUrl" :alt="selectedPlate.name" />
          </div>
          <h3 class="modal-plate__name">{{ selectedPlate.name }}</h3>
          <p v-if="selectedPlate.description" class="modal-plate__desc">
            {{ selectedPlate.description }}
          </p>
          <div class="modal-plate__macros">
            <div class="modal-macro">
              <span class="modal-macro__value">{{ selectedPlate.calories }}</span>
              <span class="modal-macro__label">kcal</span>
            </div>
            <div class="modal-macro">
              <span class="modal-macro__value">{{ selectedPlate.protein }}g</span>
              <span class="modal-macro__label">Proteínas</span>
            </div>
            <div class="modal-macro">
              <span class="modal-macro__value">{{ selectedPlate.carbs }}g</span>
              <span class="modal-macro__label">Carbos</span>
            </div>
            <div class="modal-macro">
              <span class="modal-macro__value">{{ selectedPlate.fat }}g</span>
              <span class="modal-macro__label">Grasas</span>
            </div>
          </div>
          <p v-if="selectedPlate.servingSize" class="modal-plate__serving">
            Porción: {{ selectedPlate.servingSize }}
          </p>
        </div>
      </template>
      <template #footer>
        <button class="btn btn-secondary" @click="showPlateModal = false">Cerrar</button>
        <button class="btn btn-danger" @click="selectedPlate && deletePlate(selectedPlate.id)">
          <font-awesome-icon :icon="['fas', 'xmark']" aria-hidden="true" />
          Eliminar
        </button>
      </template>
    </Modal>

    <!-- Recipe detail modal -->
    <Modal
      :open="showRecipeModal"
      size="md"
      title="Detalles de la receta"
      @close="showRecipeModal = false"
    >
      <template v-if="selectedRecipe">
        <div class="modal-recipe">
          <h3 class="modal-recipe__name">{{ selectedRecipe.name }}</h3>

          <div class="modal-recipe__stats">
            <div v-if="selectedRecipe.calories" class="modal-macro">
              <span class="modal-macro__value">{{ selectedRecipe.calories }}</span>
              <span class="modal-macro__label">kcal</span>
            </div>
            <div v-if="selectedRecipe.protein" class="modal-macro">
              <span class="modal-macro__value">{{ selectedRecipe.protein }}g</span>
              <span class="modal-macro__label">Proteínas</span>
            </div>
            <div v-if="selectedRecipe.carbs" class="modal-macro">
              <span class="modal-macro__value">{{ selectedRecipe.carbs }}g</span>
              <span class="modal-macro__label">Carbos</span>
            </div>
            <div v-if="selectedRecipe.fat" class="modal-macro">
              <span class="modal-macro__value">{{ selectedRecipe.fat }}g</span>
              <span class="modal-macro__label">Grasas</span>
            </div>
            <div v-if="selectedRecipe.prepTime" class="modal-macro">
              <font-awesome-icon :icon="['fas', 'clock']" aria-hidden="true" />
              <span class="modal-macro__value">{{ selectedRecipe.prepTime }}</span>
            </div>
          </div>

          <div v-if="selectedRecipe.ingredients.length > 0" class="modal-recipe__section">
            <h4>Ingredientes</h4>
            <ul>
              <li v-for="(ing, idx) in selectedRecipe.ingredients" :key="idx">
                {{ ing.quantity }} de {{ ing.name }}
              </li>
            </ul>
          </div>

          <div class="modal-recipe__section">
            <h4>Preparación</h4>
            <p class="modal-recipe__instructions">{{ selectedRecipe.instructions }}</p>
          </div>
        </div>
      </template>
      <template #footer>
        <button class="btn btn-secondary" @click="showRecipeModal = false">Cerrar</button>
        <button class="btn btn-danger" @click="selectedRecipe && deleteRecipe(selectedRecipe.id)">
          <font-awesome-icon :icon="['fas', 'xmark']" aria-hidden="true" />
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

/* Tabs */
.tabs {
  display: flex;
  gap: 0.25rem;
  background: var(--clr-surface);
  border: 1px solid var(--clr-border-subtle);
  border-radius: var(--radius-lg);
  padding: 0.25rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.tabs::-webkit-scrollbar {
  display: none;
}

.tabs__item {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.5rem 0.5rem;
  border-radius: var(--radius-md);
  border: none;
  background: transparent;
  color: var(--clr-text-muted);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-default);
  white-space: nowrap;
}

.tabs__item:hover {
  background: var(--clr-surface-alt);
  color: var(--clr-text);
}

.tabs__item--active {
  background: var(--clr-primary);
  color: var(--clr-text-inverse);
}

.tabs__item--active:hover {
  background: var(--clr-primary-hover);
}

/* Header */
.dash__header {
  text-align: center;
  margin-bottom: 0.125rem;
}

/* Summary */
.dash__summary {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dash__nutrients {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .dash__summary {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }

  .dash__nutrients {
    flex: 1;
    min-width: 0;
  }
}

/* Meals */
.dash__meals-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.6rem;
  border-radius: var(--radius-md);
  background: var(--clr-surface);
  border: 1px solid var(--clr-border-subtle);
  cursor: pointer;
  transition: background 0.15s ease;
}

.dash__meals-toggle:hover {
  background: var(--clr-surface-alt);
}

.dash__meal-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.45rem 0.6rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease;
}

.dash__meal-header:hover {
  background: var(--clr-surface-alt);
}

.dash__food-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid var(--clr-border-subtle);
}

.dash__food-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.3rem 0.5rem;
  gap: 0.25rem;
  transition: background 0.1s ease;
}

.dash__food-item:not(:last-child) {
  border-bottom: 1px solid var(--clr-border-subtle);
}

.dash__food-item:hover {
  background: var(--clr-surface-alt);
}

.dash__macros {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.8rem;
  white-space: nowrap;
}

.dash__macro-value {
  font-weight: 600;
  color: var(--clr-text-muted);
}

.dash__macro-label {
  color: var(--clr-text-faint);
}

.dash__macro-sep {
  color: var(--clr-border);
  margin: 0 0.07rem;
}

@media (max-width: 380px) {
  .dash__macros {
    display: none;
  }
}

/* Actions */
.dash__actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem;
  margin-top: 1rem;
}

.dash__actions-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.dash__btn-clear {
  width: 100%;
}

@media (min-width: 400px) {
  .dash__actions {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.375rem;
    align-items: center;
  }

  .dash__actions-row {
    gap: 0.375rem;
  }

  .dash__btn-clear {
    width: auto;
  }
}

/* Saved grid */
.saved-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.75rem;
}

.saved-card {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-default);
}

.saved-card:hover {
  border-color: var(--clr-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.saved-card:focus-visible {
  outline: 2px solid var(--clr-primary);
  outline-offset: 2px;
}

.saved-card__img {
  width: 100%;
  height: 100px;
  overflow: hidden;
}

.saved-card__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.saved-card__icon {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--clr-primary-light);
  color: var(--clr-primary);
  font-size: 1.75rem;
  opacity: 0.6;
}

.saved-card__icon--recipe {
  background: var(--clr-surface-alt);
  color: var(--clr-accent);
}

.saved-card__body {
  padding: 0.625rem;
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

.saved-card__cal {
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  color: var(--clr-primary);
  margin: 0 0 0.25rem 0;
}

.saved-card__time {
  font-size: 0.675rem;
  color: var(--clr-text-faint);
  margin: 0 0 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.saved-card__macros {
  display: flex;
  gap: 0.5rem;
  font-size: 0.675rem;
  color: var(--clr-text-muted);
}

/* Profile summary */
.profile-summary {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--clr-surface);
  border: 1px solid var(--clr-border-subtle);
  border-radius: var(--radius-lg);
}

.profile-summary__avatar {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: var(--clr-primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--clr-primary);
  font-size: 1.5rem;
  flex-shrink: 0;
}

.profile-summary__name {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: var(--weight-bold);
  color: var(--clr-text);
  margin: 0 0 0.125rem 0;
}

.profile-summary__meta {
  font-size: var(--text-xs);
  color: var(--clr-text-muted);
  margin: 0;
}

/* Profile stats */
.profile-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.profile-stat {
  text-align: center;
  padding: 0.625rem 0.25rem;
  background: var(--clr-surface);
  border: 1px solid var(--clr-border-subtle);
  border-radius: var(--radius-lg);
}

.profile-stat__value {
  display: block;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: var(--weight-bold);
  color: var(--clr-primary);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.profile-stat__label {
  font-size: 0.625rem;
  color: var(--clr-text-faint);
}

/* Profile sections */
.profile-section {
  padding: 0.75rem;
  background: var(--clr-surface);
  border: 1px solid var(--clr-border-subtle);
  border-radius: var(--radius-lg);
}

.profile-section__title {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--clr-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.profile-section__title i {
  color: var(--clr-accent);
}

.profile-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.profile-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  background: var(--clr-primary-light);
  color: var(--clr-primary);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  border-radius: var(--radius-full);
}

/* Profile actions */
.profile-actions {
  display: flex;
  justify-content: center;
  padding-top: 0.5rem;
}

/* Modal plate */
.modal-plate {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.modal-plate__img {
  width: 100%;
  height: 150px;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.modal-plate__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-plate__name {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: var(--weight-bold);
  color: var(--clr-text);
  margin: 0;
}

.modal-plate__desc {
  font-size: var(--text-xs);
  color: var(--clr-text-muted);
  margin: 0;
}

.modal-plate__macros {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.modal-plate__serving {
  font-size: var(--text-xs);
  color: var(--clr-text-faint);
  margin: 0;
}

/* Modal recipe */
.modal-recipe {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.modal-recipe__name {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: var(--weight-bold);
  color: var(--clr-text);
  margin: 0;
}

.modal-recipe__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.modal-recipe__section h4 {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--clr-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0 0 0.375rem 0;
}

.modal-recipe__section ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.modal-recipe__section li {
  font-size: var(--text-xs);
  color: var(--clr-text);
  padding: 0.25rem 0.5rem;
  background: var(--clr-surface-alt);
  border-radius: var(--radius-md);
}

.modal-recipe__instructions {
  font-size: var(--text-xs);
  color: var(--clr-text);
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
}

/* Macro badge in modals */
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
</style>
