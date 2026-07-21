<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useFoodStore } from '@/stores/foodStore'
import { useSavedPlatesStore } from '@/stores/savedPlatesStore'
import { useSavedRecipesStore } from '@/stores/savedRecipesStore'
import { useAuth } from '@/composables/useAuth'
import CalorieRing from '@/components/CalorieRing.vue'
import NutrientCard from '@/components/NutrientCard.vue'
import Modal from '@/components/ui/Modal.vue'
import { useToast } from '@/composables/useToast'
import { useAddFood } from '@/composables/useAddFood'
import { groupEntriesByMealType } from '@/utils/nutrition'
import { formatDateEs } from '@/utils/formatting'
import { MEAL_TYPE_LABELS, MEAL_TYPE_ICONS, MEAL_TYPE_OPTIONS } from '@/utils/constants'
import type { MealType } from '@/types/user'
import type { SavedPlate } from '@/stores/savedPlatesStore'
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

const userStore = useUserStore()
const foodStore = useFoodStore()
const savedPlatesStore = useSavedPlatesStore()
const savedRecipesStore = useSavedRecipesStore()
const { user } = useAuth()
const toast = useToast()
const { showAddModal, selectedFood, servings, mealType, openAddModal, confirmAdd, closeModal } = useAddFood()

type Tab = 'day' | 'plates' | 'recipes' | 'profile'
const activeTab = ref<Tab>('day')

const showLoginPrompt = ref(false)

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
  if (user.value) {
    await savedPlatesStore.loadPlates()
    await savedRecipesStore.loadRecipes()
  }
})

function switchTab(tab: Tab) {
  if (tab === 'plates' || tab === 'recipes' || tab === 'profile') {
    if (!user.value) {
      showLoginPrompt.value = true
      return
    }
  }
  activeTab.value = tab
}

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

function openAddPlateToDay(plate: SavedPlate) {
  showPlateModal.value = false
  openAddModal({
    id: plate.id,
    name: plate.name,
    calories: plate.calories,
    protein: plate.protein,
    carbs: plate.carbs,
    fat: plate.fat,
    imageUrl: plate.imageUrl ?? undefined,
  })
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
    <!-- Tab bar -->
    <nav class="tabs" role="tablist" aria-label="Secciones del panel">
      <button
        v-if="user"
        role="tab"
        :aria-selected="activeTab === 'plates'"
        class="tabs__item"
        :class="{ 'tabs__item--active': activeTab === 'plates' }"
        @click="switchTab('plates')"
      >
        <font-awesome-icon :icon="['fas', 'bowl-food']" aria-hidden="true" />
        Mis platos
      </button>
      <button
        v-if="user"
        role="tab"
        :aria-selected="activeTab === 'recipes'"
        class="tabs__item"
        :class="{ 'tabs__item--active': activeTab === 'recipes' }"
        @click="switchTab('recipes')"
      >
        <font-awesome-icon :icon="['fas', 'cookie']" aria-hidden="true" />
        Mis recetas
      </button>
      <button
        v-if="user"
        role="tab"
        :aria-selected="activeTab === 'profile'"
        class="tabs__item"
        :class="{ 'tabs__item--active': activeTab === 'profile' }"
        @click="switchTab('profile')"
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

      <div v-else class="saved-list">
        <article
          v-for="plate in savedPlatesStore.plates"
          :key="plate.id"
          class="saved-card"
          tabindex="0"
          :aria-label="`Ver detalles de ${plate.name}`"
        >
          <div
            class="saved-card__accent"
            :class="plate.isVegan || plate.isVegetarian ? 'saved-card__accent--vegan' : plate.allergens?.includes('gluten') ? 'saved-card__accent--other' : 'saved-card__accent--gluten-free'"
          />
          <div class="saved-card__body" role="button" @click="openPlateModal(plate)" @keydown.enter="openPlateModal(plate)">
            <h3 class="saved-card__title">{{ plate.name }}</h3>
            <div class="saved-card__macros">
              <span class="saved-card__macro"><strong>{{ plate.calories }}</strong> kcal</span>
              <span class="saved-card__macro">P {{ plate.protein }}g</span>
              <span class="saved-card__macro">C {{ plate.carbs }}g</span>
              <span class="saved-card__macro">G {{ plate.fat }}g</span>
            </div>
            <div v-if="plate.allergens?.length || plate.isVegan || plate.isVegetarian" class="saved-card__tags">
              <span v-for="a in plate.allergens?.slice(0, 3)" :key="a" class="saved-card__tag">
                <font-awesome-icon :icon="ALLERGEN_ICONS[a]" aria-hidden="true" />
                {{ ALLERGEN_LABELS[a] }}
              </span>
              <span v-if="plate.isVegan" class="saved-card__badge saved-card__badge--vegan">
                <font-awesome-icon :icon="['fas', 'leaf']" aria-hidden="true" />
                Vegano
              </span>
              <span v-else-if="plate.isVegetarian" class="saved-card__badge saved-card__badge--vegetarian">
                <font-awesome-icon :icon="['fas', 'seedling']" aria-hidden="true" />
                Vegetariano
              </span>
            </div>
          </div>
          <div class="saved-card__actions">
            <button class="btn-slide btn-slide--primary" :aria-label="`Añadir ${plate.name} al día`" @click.stop="openAddPlateToDay(plate)">
              <span class="btn-slide__label">Añadir</span>
              <font-awesome-icon :icon="['fas', 'plus']" class="btn-slide__icon" aria-hidden="true" />
            </button>
            <button class="btn-slide btn-slide--danger" :aria-label="`Eliminar ${plate.name}`" @click.stop="deletePlate(plate.id)">
              <span class="btn-slide__label">Eliminar</span>
              <font-awesome-icon :icon="['fas', 'xmark']" class="btn-slide__icon" aria-hidden="true" />
            </button>
          </div>
        </article>
      </div>
      <div class="text-center mt-4">
        <router-link to="/nutrition-ai" class="btn btn-accent btn-sm">
          <font-awesome-icon :icon="['fas', 'plus']" aria-hidden="true" />
          Analizar otro plato
        </router-link>
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
        <router-link to="/recetas" class="btn btn-primary btn-sm">
          <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" aria-hidden="true" />
          Generar receta
        </router-link>
      </div>

      <div v-else class="saved-list">
        <article
          v-for="recipe in savedRecipesStore.recipes"
          :key="recipe.id"
          class="saved-card saved-card--recipe"
          tabindex="0"
          :aria-label="`Ver detalles de ${recipe.name}`"
        >
          <div class="saved-card__accent saved-card__accent--recipe" />
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
          </div>
          <div class="saved-card__actions">
            <button class="btn-slide btn-slide--primary" :aria-label="`Añadir ${recipe.name} al día`" @click.stop="openAddRecipeToDay(recipe)">
              <span class="btn-slide__label">Añadir</span>
              <font-awesome-icon :icon="['fas', 'plus']" class="btn-slide__icon" aria-hidden="true" />
            </button>
            <button class="btn-slide btn-slide--danger" :aria-label="`Eliminar ${recipe.name}`" @click.stop="deleteRecipe(recipe.id)">
              <span class="btn-slide__label">Eliminar</span>
              <font-awesome-icon :icon="['fas', 'xmark']" class="btn-slide__icon" aria-hidden="true" />
            </button>
          </div>
        </article>
      </div>
      <div class="text-center mt-4">
        <router-link to="/recetas" class="btn btn-primary btn-sm">
          <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" aria-hidden="true" />
          Generar otra receta
        </router-link>
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
      size="lg"
      @close="showPlateModal = false"
    >
      <template v-if="selectedPlate">
        <div class="modal-detail">
          <div v-if="selectedPlate.imageUrl" class="modal-detail__img">
            <img :src="selectedPlate.imageUrl" :alt="selectedPlate.name" />
          </div>
          <h3 class="modal-detail__name">{{ selectedPlate.name }}</h3>
          <p v-if="selectedPlate.description" class="modal-detail__desc">{{ selectedPlate.description }}</p>

          <div v-if="selectedPlate.servingSize" class="modal-detail__serving">
            <font-awesome-icon :icon="['fas', 'scale-balanced']" aria-hidden="true" />
            Porción: {{ selectedPlate.servingSize }}
          </div>

          <div class="modal-detail__score" v-if="selectedPlate.nutritionScore">
            <div class="score-ring">
              <svg viewBox="0 0 80 80" class="score-ring__svg">
                <circle cx="40" cy="40" r="34" fill="none" stroke="var(--clr-surface-alt)" stroke-width="6" />
                <circle
                  cx="40" cy="40" r="34" fill="none"
                  :stroke="selectedPlate.nutritionScore.value >= 70 ? 'var(--clr-success)' : selectedPlate.nutritionScore.value >= 40 ? 'var(--clr-accent)' : 'var(--clr-danger)'"
                  stroke-width="6"
                  stroke-linecap="round"
                  :stroke-dasharray="213.6"
                  :stroke-dashoffset="213.6 - (213.6 * selectedPlate.nutritionScore.value / 100)"
                  transform="rotate(-90 40 40)"
                  class="score-ring__fill"
                />
              </svg>
              <span class="score-ring__value">{{ selectedPlate.nutritionScore.value }}</span>
            </div>
            <div class="score-ring__info">
              <span class="score-ring__label">Score nutricional</span>
              <span v-if="selectedPlate.nutritionScore.reason" class="score-ring__reason">{{ selectedPlate.nutritionScore.reason }}</span>
            </div>
          </div>

          <div class="modal-detail__macros">
            <div class="modal-macro">
              <span class="modal-macro__value">{{ selectedPlate.calories }}</span>
              <span class="modal-macro__label">kcal</span>
            </div>
            <div class="modal-macro modal-macro--protein">
              <span class="modal-macro__value">{{ selectedPlate.protein }}g</span>
              <span class="modal-macro__label">Proteínas</span>
            </div>
            <div class="modal-macro modal-macro--carbs">
              <span class="modal-macro__value">{{ selectedPlate.carbs }}g</span>
              <span class="modal-macro__label">Carbos</span>
            </div>
            <div class="modal-macro modal-macro--fat">
              <span class="modal-macro__value">{{ selectedPlate.fat }}g</span>
              <span class="modal-macro__label">Grasas</span>
            </div>
          </div>

          <div class="modal-detail__macro-bar">
            <div
              class="modal-detail__macro-bar-seg modal-detail__macro-bar-seg--protein"
              :style="{ flex: selectedPlate.protein || 0.1 }"
            />
            <div
              class="modal-detail__macro-bar-seg modal-detail__macro-bar-seg--carbs"
              :style="{ flex: selectedPlate.carbs || 0.1 }"
            />
            <div
              class="modal-detail__macro-bar-seg modal-detail__macro-bar-seg--fat"
              :style="{ flex: selectedPlate.fat || 0.1 }"
            />
          </div>
          <div class="modal-detail__macro-legend">
            <span class="modal-detail__legend-item">
              <span class="modal-detail__legend-dot modal-detail__legend-dot--protein" />
              Proteínas {{ Math.round(selectedPlate.protein * 4) }} kcal
            </span>
            <span class="modal-detail__legend-item">
              <span class="modal-detail__legend-dot modal-detail__legend-dot--carbs" />
              Carbos {{ Math.round(selectedPlate.carbs * 4) }} kcal
            </span>
            <span class="modal-detail__legend-item">
              <span class="modal-detail__legend-dot modal-detail__legend-dot--fat" />
              Grasas {{ Math.round(selectedPlate.fat * 9) }} kcal
            </span>
          </div>

          <div class="modal-detail__dietary">
            <span v-if="selectedPlate.isVegan" class="modal-detail__badge modal-detail__badge--vegan">
              <font-awesome-icon :icon="['fas', 'leaf']" aria-hidden="true" />
              Vegano
            </span>
            <span v-if="selectedPlate.isVegetarian" class="modal-detail__badge modal-detail__badge--vegetarian">
              <font-awesome-icon :icon="['fas', 'carrot']" aria-hidden="true" />
              Vegetariano
            </span>
          </div>

          <div v-if="selectedPlate.allergens?.length" class="modal-detail__section">
            <h4 class="modal-detail__section-title">
              <font-awesome-icon :icon="['fas', 'triangle-exclamation']" aria-hidden="true" />
              Alérgenos
            </h4>
            <div class="modal-detail__tags">
              <span v-for="a in selectedPlate.allergens" :key="a" class="modal-detail__tag modal-detail__tag--allergen">
                {{ a }}
              </span>
            </div>
          </div>

          <div v-if="selectedPlate.ingredients?.length" class="modal-detail__section">
            <h4 class="modal-detail__section-title">
              <font-awesome-icon :icon="['fas', 'list-check']" aria-hidden="true" />
              Ingredientes
            </h4>
            <ul class="modal-detail__list">
              <li v-for="(ing, idx) in selectedPlate.ingredients" :key="idx" class="modal-detail__ing">
                <span class="modal-detail__ing-name">{{ ing.name }}</span>
                <span class="modal-detail__ing-right">
                  <span class="modal-detail__ing-qty">{{ ing.quantity }}</span>
                  <span v-if="ing.calories" class="modal-detail__ing-cal">{{ ing.calories }} kcal</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </template>
      <template #footer>
        <button class="btn btn-secondary" @click="showPlateModal = false">Cerrar</button>
        <button class="btn btn-primary" @click="selectedPlate && openAddPlateToDay(selectedPlate)">
          <font-awesome-icon :icon="['fas', 'plus']" aria-hidden="true" />
          Añadir
        </button>
        <button class="btn btn-danger" @click="selectedPlate && deletePlate(selectedPlate.id)">
          <font-awesome-icon :icon="['fas', 'xmark']" aria-hidden="true" />
          Eliminar
        </button>
      </template>
    </Modal>

    <!-- Recipe detail modal -->
    <Modal
      :open="showRecipeModal"
      size="lg"
      @close="showRecipeModal = false"
    >
      <template v-if="selectedRecipe">
        <div class="modal-detail">
          <h3 class="modal-detail__name">{{ selectedRecipe.name }}</h3>

          <div v-if="selectedRecipe.prepTime" class="modal-detail__serving">
            <font-awesome-icon :icon="['fas', 'clock']" aria-hidden="true" />
            {{ selectedRecipe.prepTime }}
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

    <!-- Add food modal (reuses SearchView pattern) -->
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
            for="servings-input-dash"
            class="block text-sm font-medium"
            style="color: var(--clr-text-muted)"
          >
            Porciones (100g c/u)
          </label>
          <input
            id="servings-input-dash"
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
  color: var(--clr-text-inverse);
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

/* Saved cards */
.saved-card {
  display: flex;
  align-items: stretch;
  background: var(--clr-surface);
  border: 1px solid var(--clr-border-subtle);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}

.saved-card:hover {
  box-shadow: var(--shadow-lg);
}

.saved-card:focus-visible {
  outline: 2px solid var(--clr-primary);
  outline-offset: 2px;
}

/* ── Accent bar ── */
.saved-card__accent {
  width: 4px;
  flex-shrink: 0;
  background: var(--clr-primary);
}
.saved-card__accent--vegan,
.saved-card__accent--vegetarian { background: var(--clr-success); }
.saved-card__accent--gluten-free { background: var(--clr-warning); }
.saved-card__accent--other { background: var(--clr-accent); }
.saved-card__accent--recipe { background: var(--clr-accent); }

/* ── Body ── */
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

/* ── Tags & badges ── */
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

/* ── Action buttons (match FoodCard) ── */
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

.btn-slide--success { background: var(--clr-success); }
.btn-slide--success::before { background: var(--clr-success); }
.btn-slide--success:hover::before { left: -3.5rem; }
.btn-slide--success:hover { background: var(--clr-success); }

.btn-slide--primary { background: var(--clr-primary); }
.btn-slide--primary::before { background: var(--clr-primary); }
.btn-slide--primary:hover::before { left: -3.5rem; }
.btn-slide--primary:hover { background: var(--clr-primary-hover); }

.btn-slide--danger { background: var(--clr-danger); }
.btn-slide--danger::before { background: var(--clr-danger); }
.btn-slide--danger:hover::before { left: -3.5rem; }
.btn-slide--danger:hover { background: var(--clr-danger); }

.btn-slide--accent { background: var(--clr-accent); }
.btn-slide--accent::before { background: var(--clr-accent); }
.btn-slide--accent:hover::before { left: -3.5rem; }
.btn-slide--accent:hover { background: var(--clr-accent-hover); }

@media (hover: none) {
  .btn-slide__label { display: none; }
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

/* Modal macro colored variants */
.modal-macro--protein .modal-macro__value { color: var(--clr-primary); }
.modal-macro--carbs .modal-macro__value { color: var(--clr-accent); }
.modal-macro--fat .modal-macro__value { color: var(--clr-secondary); }

/* Macro bar */
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

/* Score ring */
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

/* Dietary badges */
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

/* Section titles in modal */
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

/* Ingredients list */
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

.modal-detail__ing-cal {
  font-size: 0.675rem;
  font-weight: var(--weight-semibold);
  color: var(--clr-primary);
}
</style>
