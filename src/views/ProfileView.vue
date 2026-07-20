<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useFoodStore } from '@/stores/foodStore'
import { useSavedPlatesStore } from '@/stores/savedPlatesStore'
import { useSavedRecipesStore } from '@/stores/savedRecipesStore'
import { useToast } from '@/composables/useToast'
import { ACTIVITY_OPTIONS, GOAL_OPTIONS, MEAL_TYPE_LABELS, MEAL_TYPE_ICONS } from '@/utils/constants'
import { calculateBMI, calculateIdealWeight } from '@/utils/bmi'
import { classifyBMI, getBmiBadgeVariant } from '@/utils/bmiClassification'
import { groupEntriesByMealType } from '@/utils/nutrition'
import { formatDateEs } from '@/utils/formatting'
import CalorieRing from '@/components/CalorieRing.vue'
import NutrientCard from '@/components/NutrientCard.vue'
import DsCard from '@/components/ui/Card.vue'
import DsInput from '@/components/ui/Input.vue'
import DsButton from '@/components/ui/Button.vue'
import DsBadge from '@/components/ui/Badge.vue'
import DsTypography from '@/components/ui/Typography.vue'
import Modal from '@/components/ui/Modal.vue'
import type { ActivityLevel, GoalType, Sex, MealType } from '@/types/user'
import type { SavedPlate } from '@/stores/savedPlatesStore'
import type { SavedRecipe } from '@/stores/savedRecipesStore'

const userStore = useUserStore()
const foodStore = useFoodStore()
const savedPlatesStore = useSavedPlatesStore()
const savedRecipesStore = useSavedRecipesStore()
const toast = useToast()

type Tab = 'day' | 'plates' | 'recipes' | 'profile'
const activeTab = ref<Tab>('profile')

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

const deleteId = ref<string | null>(null)
const deleteType = ref<'plate' | 'recipe'>('plate')
const deleteName = ref('')
const showDeleteModal = ref(false)

const bmi = computed(() => calculateBMI(userStore.profile.weight, userStore.profile.height))
const bmiLabel = computed(() => classifyBMI(bmi.value))
const bmiBadge = computed(() => getBmiBadgeVariant(bmi.value))
const idealWeight = computed(() => calculateIdealWeight(userStore.profile.height))
const weightDiff = computed(
  () => Math.round((userStore.profile.weight - userStore.profile.desiredWeight) * 10) / 10,
)
const bmr = computed(() => userStore.goals.bmr)
const tdee = computed(() => userStore.goals.tdee)
const target = computed(() => userStore.goals.targetCalories)
const timeToGoalMonths = computed(() => userStore.goals.timeToGoalMonths)

const BMI_MIN = 15
const BMI_MAX = 40
const bmiPercent = computed(() => {
  const clamped = Math.min(BMI_MAX, Math.max(BMI_MIN, bmi.value))
  return ((clamped - BMI_MIN) / (BMI_MAX - BMI_MIN)) * 100
})

function onNumberInput(field: 'age' | 'weight' | 'height' | 'desiredWeight', value: string | number) {
  const num = Number(value)
  if (!isNaN(num)) {
    userStore.updateProfile({ [field]: num })
  }
}

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

function confirmDelete(id: string, type: 'plate' | 'recipe', name: string) {
  deleteId.value = id
  deleteType.value = type
  deleteName.value = name
  showDeleteModal.value = true
}

async function executeDelete() {
  if (!deleteId.value) return
  if (deleteType.value === 'plate') {
    await savedPlatesStore.deletePlate(deleteId.value)
    toast.show('Plato eliminado')
  } else {
    await savedRecipesStore.deleteRecipe(deleteId.value)
    toast.show('Receta eliminada')
  }
  showDeleteModal.value = false
  deleteId.value = null
  deleteName.value = ''
}
</script>

<template>
  <main class="dash">
    <!-- Tab bar -->
    <nav class="tabs" role="tablist" aria-label="Secciones del perfil">
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
        Datos
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

      <section v-if="!userStore.isProfileComplete" class="card-surface p-6 text-center" aria-label="Completa tu perfil">
        <p class="text-body mb-3">Cuéntanos sobre ti para calcular tus metas calóricas personalizadas.</p>
        <button class="btn btn-primary" @click="activeTab = 'profile'">Completa tu perfil</button>
      </section>

      <section v-else aria-label="Resumen nutricional del día" class="dash__summary">
        <CalorieRing :consumed="foodStore.todaySummary.calories" :target="userStore.goals.targetCalories" />
        <div class="dash__nutrients">
          <NutrientCard label="Proteínas" :value="foodStore.todaySummary.protein" :target="userStore.goals.proteinGrams" unit="g" color="emerald" />
          <NutrientCard label="Carbos" :value="foodStore.todaySummary.carbs" :target="userStore.goals.carbGrams" unit="g" color="brown" />
          <NutrientCard label="Grasas" :value="foodStore.todaySummary.fat" :target="userStore.goals.fatGrams" unit="g" color="amber" />
        </div>
      </section>

      <section aria-label="Comidas registradas hoy">
        <button class="dash__meals-toggle" :aria-expanded="mealsOpen" @click="mealsOpen = !mealsOpen">
          <div class="flex items-center gap-1 min-w-0">
            <h2 class="text-xs font-semibold truncate uppercase" style="color: var(--clr-text)">Comidas de hoy</h2>
            <span v-if="foodStore.todayEntries.length > 0" class="text-[12px] font-bold shrink-0 px-1 py-1 rounded" style="color: var(--clr-text-muted); background: var(--clr-surface-alt)">
              {{ foodStore.todayEntries.length }}
            </span>
          </div>
          <font-awesome-icon :icon="['fas', 'chevron-down']" class="text-[13px] transition-transform duration-200" :class="{ 'rotate-180': mealsOpen }" aria-hidden="true" style="color: var(--clr-text-faint)" />
        </button>

        <div v-if="mealsOpen">
          <div v-if="foodStore.todayEntries.length === 0" class="card-warm text-center py-6 px-4 mt-1.5" role="status">
            <font-awesome-icon :icon="['fas', 'utensils']" class="text-2xl block mb-1.5" aria-hidden="true" style="color: var(--clr-primary); opacity: 0.4" />
            <p class="text-xs font-medium" style="color: var(--clr-text-muted)">Tu día está vacío</p>
            <p class="text-[10px] mt-0.5" style="color: var(--clr-text-faint)">Registra tu primera comida para comenzar</p>
          </div>

          <div v-else class="mt-1.5 flex flex-col gap-1.5">
            <article v-for="(entries, type) in groupedEntries" :key="type" class="card overflow-hidden" :aria-label="MEAL_TYPE_LABELS[type]">
              <button class="dash__meal-header" :aria-expanded="openMealTypes.has(type as MealType)" @click="toggleMealType(type as MealType)">
                <div class="flex items-center gap-1 min-w-0">
                  <font-awesome-icon :icon="MEAL_TYPE_ICONS[type]" aria-hidden="true" class="text-[10px]" style="color: var(--clr-primary)" />
                  <span class="text-sm font-semibold" style="color: var(--clr-text)">{{ MEAL_TYPE_LABELS[type] }}</span>
                  <span class="text-[13px] font-medium" style="color: var(--clr-text-faint)">{{ entries.length }} · {{ mealTypeTotalCalories(entries) }} kcal</span>
                </div>
                <font-awesome-icon :icon="['fas', 'chevron-down']" class="text-[13px] transition-transform duration-200" :class="{ 'rotate-180': openMealTypes.has(type as MealType) }" aria-hidden="true" style="color: var(--clr-text-faint)" />
              </button>

              <ul v-if="openMealTypes.has(type as MealType)" class="dash__food-list">
                <li v-for="entry in entries" :key="entry.id" class="dash__food-item">
                  <div class="flex items-center gap-1.5 min-w-0 flex-1">
                    <img v-if="entry.food.imageUrl" :src="entry.food.imageUrl" :alt="entry.food.name" class="w-7 h-7 rounded object-cover shrink-0" loading="lazy" />
                    <div v-else class="w-7 h-7 rounded flex items-center justify-center shrink-0" style="background: var(--clr-primary-light)">
                      <font-awesome-icon :icon="['fas', 'utensils']" class="text-[10px]" aria-hidden="true" style="color: var(--clr-primary); opacity: 0.5" />
                    </div>
                    <p class="text-[14px] font-medium truncate" style="color: var(--clr-text)">{{ entry.food.name }}</p>
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
                    <button class="w-5 h-5 flex items-center justify-center rounded shrink-0 transition-colors" style="color: var(--clr-text-faint)" :aria-label="`Eliminar ${entry.food.name}`" @click="confirmDeleteEntry(entry.id, entry.food.name)">
                      <font-awesome-icon :icon="['fas', 'xmark']" class="text-[13px]" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              </ul>
            </article>
          </div>
        </div>

        <div class="dash__actions">
          <button v-if="foodStore.todayEntries.length > 0" class="btn btn-secondary py-1 px-2 text-[10px] whitespace-nowrap dash__btn-clear" aria-label="Eliminar todas las comidas de hoy" @click="showClearModal = true">
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
          <font-awesome-icon :icon="['fas', 'bowl-food']" aria-hidden="true" style="color: var(--clr-accent)" />
          Mis platos
        </h1>
        <p class="text-body-sm">Platos que has analizado y guardado</p>
      </header>

      <div v-if="savedPlatesStore.plates.length === 0" class="card-warm text-center py-8 px-4">
        <font-awesome-icon :icon="['fas', 'bowl-food']" class="text-3xl block mb-2" aria-hidden="true" style="color: var(--clr-primary); opacity: 0.3" />
        <p class="text-sm font-medium" style="color: var(--clr-text-muted)">No hay platos guardados</p>
        <p class="text-xs mt-1 mb-3" style="color: var(--clr-text-faint)">Analiza un plato en "Mis platos" y guárdalo aquí</p>
        <router-link to="/nutrition-ai" class="btn btn-primary btn-sm">
          <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" aria-hidden="true" />
          Analizar plato
        </router-link>
      </div>

      <div v-else class="saved-list">
        <article v-for="plate in savedPlatesStore.plates" :key="plate.id" class="saved-card" tabindex="0" :aria-label="`Ver detalles de ${plate.name}`">
          <div class="saved-card__accent" />
          <div class="saved-card__body" role="button" @click="openPlateModal(plate)" @keydown.enter="openPlateModal(plate)">
            <h3 class="saved-card__title">{{ plate.name }}</h3>
            <div class="saved-card__macros">
              <span class="saved-card__macro"><strong>{{ plate.calories }}</strong> kcal</span>
              <span class="saved-card__macro">P {{ plate.protein }}g</span>
              <span class="saved-card__macro">C {{ plate.carbs }}g</span>
              <span class="saved-card__macro">G {{ plate.fat }}g</span>
            </div>
          </div>
          <button class="saved-card__delete" :aria-label="`Eliminar ${plate.name}`" @click.stop="confirmDelete(plate.id, 'plate', plate.name)">
            <font-awesome-icon :icon="['fas', 'xmark']" aria-hidden="true" />
          </button>
        </article>
      </div>
      <router-link to="/nutrition-ai" class="btn btn-accent btn-sm saved-list__add">
        <font-awesome-icon :icon="['fas', 'plus']" aria-hidden="true" />
        Analizar otro plato
      </router-link>
    </div>

    <!-- Tab: Mis recetas -->
    <div v-if="activeTab === 'recipes'" role="tabpanel">
      <header class="dash__header">
        <h1 class="text-display-lg">
          <font-awesome-icon :icon="['fas', 'cookie']" aria-hidden="true" style="color: var(--clr-primary)" />
          Mis recetas
        </h1>
        <p class="text-body-sm">Recetas que has generado y guardado</p>
      </header>

      <div v-if="savedRecipesStore.recipes.length === 0" class="card-warm text-center py-8 px-4">
        <font-awesome-icon :icon="['fas', 'cookie']" class="text-3xl block mb-2" aria-hidden="true" style="color: var(--clr-primary); opacity: 0.3" />
        <p class="text-sm font-medium" style="color: var(--clr-text-muted)">No hay recetas guardadas</p>
        <p class="text-xs mt-1 mb-3" style="color: var(--clr-text-faint)">Genera una receta y guárdala aquí</p>
        <router-link to="/recipes" class="btn btn-primary btn-sm">
          <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" aria-hidden="true" />
          Generar receta
        </router-link>
      </div>

      <div v-else class="saved-list">
        <article v-for="recipe in savedRecipesStore.recipes" :key="recipe.id" class="saved-card saved-card--recipe" tabindex="0" :aria-label="`Ver detalles de ${recipe.name}`">
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
          <button class="saved-card__delete" :aria-label="`Eliminar ${recipe.name}`" @click.stop="confirmDelete(recipe.id, 'recipe', recipe.name)">
            <font-awesome-icon :icon="['fas', 'xmark']" aria-hidden="true" />
          </button>
        </article>
      </div>
    </div>

    <!-- Tab: Datos -->
    <div v-if="activeTab === 'profile'" role="tabpanel">
      <header class="dash__header">
        <h1 class="text-display-lg">
          <font-awesome-icon :icon="['fas', 'user']" aria-hidden="true" style="color: var(--clr-primary)" />
          Mi perfil
        </h1>
        <p class="text-body-sm">Tus datos se guardan localmente y nunca se comparten.</p>
      </header>

      <div class="form-row">
        <DsCard variant="elevated" padding="md" class="form-row__card">
          <h2 class="section-title">
            <font-awesome-icon :icon="['fas', 'id-card']" aria-hidden="true" />
            Datos personales
          </h2>
          <div class="section-fields">
            <DsInput :model-value="userStore.profile.name" label="Nombre" placeholder="Tu nombre" size="sm" @update:model-value="userStore.updateProfile({ name: $event as string })" />
            <div class="field-row">
              <DsInput :model-value="userStore.profile.age" label="Edad" type="number" size="sm" @update:model-value="onNumberInput('age', $event)" />
              <div class="field-group">
                <span class="field-label">Sexo biológico</span>
                <div class="btn-group" role="radiogroup" aria-label="Sexo biológico">
                  <button type="button" class="btn-toggle btn-toggle--sm" :class="{ 'btn-toggle--active': userStore.profile.sex === 'female' }" role="radio" :aria-checked="userStore.profile.sex === 'female'" @click="userStore.updateProfile({ sex: 'female' as Sex })">Mujer</button>
                  <button type="button" class="btn-toggle btn-toggle--sm" :class="{ 'btn-toggle--active': userStore.profile.sex === 'male' }" role="radio" :aria-checked="userStore.profile.sex === 'male'" @click="userStore.updateProfile({ sex: 'male' as Sex })">Hombre</button>
                </div>
              </div>
            </div>
            <div class="field-row">
              <DsInput :model-value="userStore.profile.weight" label="Peso (kg)" type="number" size="sm" @update:model-value="onNumberInput('weight', $event)" />
              <DsInput :model-value="userStore.profile.height" label="Altura (cm)" type="number" size="sm" @update:model-value="onNumberInput('height', $event)" />
              <DsInput :model-value="userStore.profile.desiredWeight" label="Peso deseado (kg)" type="number" size="sm" @update:model-value="onNumberInput('desiredWeight', $event)" />
            </div>
          </div>
        </DsCard>

        <DsCard variant="elevated" padding="md" class="form-row__card">
          <h2 class="section-title">
            <font-awesome-icon :icon="['fas', 'heart-pulse']" aria-hidden="true" />
            Estilo de vida
          </h2>
          <div class="section-fields">
            <div class="field-group">
              <span class="field-label">Actividad física</span>
              <div class="btn-grid btn-grid--2" role="radiogroup" aria-label="Nivel de actividad física">
                <button v-for="opt in ACTIVITY_OPTIONS" :key="opt.value" type="button" class="btn-toggle btn-toggle--sm" :class="{ 'btn-toggle--active': userStore.profile.activityLevel === opt.value }" role="radio" :aria-checked="userStore.profile.activityLevel === opt.value" @click="userStore.updateProfile({ activityLevel: opt.value as ActivityLevel })">
                  <font-awesome-icon :icon="opt.icon" aria-hidden="true" />
                  {{ opt.label }}
                </button>
              </div>
            </div>
            <div class="field-group">
              <span class="field-label">Objetivo</span>
              <div class="btn-grid btn-grid--3" role="radiogroup" aria-label="Objetivo nutricional">
                <button v-for="opt in GOAL_OPTIONS" :key="opt.value" type="button" class="btn-toggle btn-toggle--sm" :class="{ 'btn-toggle--active': userStore.profile.goal === opt.value }" role="radio" :aria-checked="userStore.profile.goal === opt.value" @click="userStore.updateProfile({ goal: opt.value as GoalType })">
                  <font-awesome-icon :icon="opt.icon" aria-hidden="true" />
                  <span>{{ opt.label }}</span>
                </button>
              </div>
            </div>
          </div>
        </DsCard>
      </div>

      <DsCard variant="warm" padding="md" aria-label="Resultados calculados">
        <h2 class="section-title section-title--primary">
          <font-awesome-icon :icon="['fas', 'chart-simple']" aria-hidden="true" />
          Mis resultados
        </h2>

        <div class="bmi-card">
          <div class="bmi-card__header">
            <DsTypography variant="label-sm" color="muted">IMC</DsTypography>
            <DsBadge :variant="bmiBadge" size="sm" dot>{{ bmiLabel }}</DsBadge>
          </div>
          <div class="bmi-gauge">
            <div class="bmi-gauge__bar">
              <div class="bmi-gauge__track" />
              <div class="bmi-gauge__indicator" :style="{ left: `${bmiPercent}%` }">
                <span class="bmi-gauge__pill">{{ bmi }}</span>
              </div>
            </div>
            <div class="bmi-gauge__labels">
              <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
            </div>
          </div>
          <div class="bmi-card__details">
            <div class="bmi-detail"><span class="bmi-detail__label">Peso actual</span><span class="bmi-detail__value">{{ userStore.profile.weight }} kg</span></div>
            <div class="bmi-detail"><span class="bmi-detail__label">Peso ideal</span><span class="bmi-detail__value">{{ idealWeight }} kg</span></div>
            <div class="bmi-detail"><span class="bmi-detail__label">Peso deseado</span><span class="bmi-detail__value">{{ userStore.profile.desiredWeight }} kg</span></div>
            <div class="bmi-detail">
              <span class="bmi-detail__label">Kg de sobrepeso</span>
              <span class="bmi-detail__value" :class="weightDiff > 0 ? 'text-accent' : weightDiff < 0 ? 'text-secondary' : 'text-primary'">
                {{ weightDiff > 0 ? '+' : '' }}{{ weightDiff }} kg
              </span>
            </div>
            <div v-if="timeToGoalMonths > 0" class="bmi-detail"><span class="bmi-detail__label">Tiempo estimado</span><span class="bmi-detail__value">{{ timeToGoalMonths }} meses</span></div>
          </div>
        </div>

        <div class="metrics-grid">
          <div class="metric-card"><p class="metric-card__value metric-card__value--primary">{{ bmr }}</p><p class="metric-card__label">Metabolismo basal (kcal)</p></div>
          <div class="metric-card"><p class="metric-card__value metric-card__value--accent">{{ tdee }}</p><p class="metric-card__label">Gasto total (kcal)</p></div>
          <div class="metric-card"><p class="metric-card__value metric-card__value--secondary">{{ target }}</p><p class="metric-card__label">Meta diaria (kcal)</p></div>
        </div>
      </DsCard>

      <div class="profile-page__reset">
        <DsButton variant="danger" size="sm" :icon="['fas', 'rotate-left']" @click="userStore.resetProfile()">Restablecer valores</DsButton>
      </div>
    </div>

    <!-- Modals -->
    <Modal :open="deleteEntryId !== null" size="sm" title="Eliminar plato" @close="cancelDeleteEntry">
      <p class="text-sm" style="color: var(--clr-text-muted)">
        ¿Eliminar <strong style="color: var(--clr-text)">{{ deleteEntryName }}</strong> de tus comidas de hoy?
      </p>
      <template #footer>
        <button class="btn btn-secondary" @click="cancelDeleteEntry">Cancelar</button>
        <button class="btn btn-primary" @click="executeDeleteEntry">Eliminar</button>
      </template>
    </Modal>

    <Modal :open="showClearModal" size="sm" title="Limpiar día" @close="showClearModal = false">
      <p class="text-sm" style="color: var(--clr-text-muted)">¿Eliminar todas las comidas registradas hoy? Esta acción no se puede deshacer.</p>
      <template #footer>
        <button class="btn btn-secondary" @click="showClearModal = false">Cancelar</button>
        <button class="btn btn-primary" @click="executeClearToday">Eliminar todo</button>
      </template>
    </Modal>

    <Modal :open="showDeleteModal" size="sm" title="Eliminar" @close="showDeleteModal = false">
      <p class="text-sm" style="color: var(--clr-text-muted)">
        ¿Eliminar <strong style="color: var(--clr-text)">{{ deleteName }}</strong> de favoritos?
      </p>
      <template #footer>
        <button class="btn btn-secondary" @click="showDeleteModal = false">Cancelar</button>
        <button class="btn btn-primary" @click="executeDelete">Eliminar</button>
      </template>
    </Modal>

    <Modal :open="showPlateModal" size="md" title="Detalles del plato" @close="showPlateModal = false">
      <template v-if="selectedPlate">
        <div class="modal-detail">
          <div v-if="selectedPlate.imageUrl" class="modal-detail__img"><img :src="selectedPlate.imageUrl" :alt="selectedPlate.name" /></div>
          <h3 class="modal-detail__name">{{ selectedPlate.name }}</h3>
          <p v-if="selectedPlate.description" class="modal-detail__desc">{{ selectedPlate.description }}</p>
          <div class="modal-detail__macros">
            <div class="modal-macro"><span class="modal-macro__value">{{ selectedPlate.calories }}</span><span class="modal-macro__label">kcal</span></div>
            <div class="modal-macro"><span class="modal-macro__value">{{ selectedPlate.protein }}g</span><span class="modal-macro__label">Proteínas</span></div>
            <div class="modal-macro"><span class="modal-macro__value">{{ selectedPlate.carbs }}g</span><span class="modal-macro__label">Carbos</span></div>
            <div class="modal-macro"><span class="modal-macro__value">{{ selectedPlate.fat }}g</span><span class="modal-macro__label">Grasas</span></div>
          </div>
          <p v-if="selectedPlate.servingSize" class="modal-detail__serving">Porción: {{ selectedPlate.servingSize }}</p>
        </div>
      </template>
      <template #footer>
        <button class="btn btn-secondary" @click="showPlateModal = false">Cerrar</button>
        <button class="btn btn-danger" @click="selectedPlate && deletePlate(selectedPlate.id)">
          <font-awesome-icon :icon="['fas', 'xmark']" aria-hidden="true" /> Eliminar
        </button>
      </template>
    </Modal>

    <Modal :open="showRecipeModal" size="md" title="Detalles de la receta" @close="showRecipeModal = false">
      <template v-if="selectedRecipe">
        <div class="modal-detail">
          <h3 class="modal-detail__name">{{ selectedRecipe.name }}</h3>
          <div class="modal-detail__macros">
            <div v-if="selectedRecipe.calories" class="modal-macro"><span class="modal-macro__value">{{ selectedRecipe.calories }}</span><span class="modal-macro__label">kcal</span></div>
            <div v-if="selectedRecipe.protein" class="modal-macro"><span class="modal-macro__value">{{ selectedRecipe.protein }}g</span><span class="modal-macro__label">Proteínas</span></div>
            <div v-if="selectedRecipe.carbs" class="modal-macro"><span class="modal-macro__value">{{ selectedRecipe.carbs }}g</span><span class="modal-macro__label">Carbos</span></div>
            <div v-if="selectedRecipe.fat" class="modal-macro"><span class="modal-macro__value">{{ selectedRecipe.fat }}g</span><span class="modal-macro__label">Grasas</span></div>
            <div v-if="selectedRecipe.prepTime" class="modal-macro"><font-awesome-icon :icon="['fas', 'clock']" aria-hidden="true" /><span class="modal-macro__value">{{ selectedRecipe.prepTime }}</span></div>
          </div>
          <div v-if="selectedRecipe.ingredients.length > 0" class="modal-detail__section">
            <h4>Ingredientes</h4>
            <ul><li v-for="(ing, idx) in selectedRecipe.ingredients" :key="idx">{{ ing.quantity }} de {{ ing.name }}</li></ul>
          </div>
          <div class="modal-detail__section">
            <h4>Preparación</h4>
            <p class="modal-detail__instructions">{{ selectedRecipe.instructions }}</p>
          </div>
        </div>
      </template>
      <template #footer>
        <button class="btn btn-secondary" @click="showRecipeModal = false">Cerrar</button>
        <button class="btn btn-danger" @click="selectedRecipe && deleteRecipe(selectedRecipe.id)">
          <font-awesome-icon :icon="['fas', 'xmark']" aria-hidden="true" /> Eliminar
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

.tabs::-webkit-scrollbar { display: none; }

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

.tabs__item:hover { background: var(--clr-surface-alt); color: var(--clr-text); }
.tabs__item--active { background: var(--clr-primary); color: var(--clr-text-inverse); }
.tabs__item--active:hover { background: var(--clr-primary-hover); }

.dash__header { text-align: center; margin-bottom: 0.125rem; }

.dash__summary { display: flex; flex-direction: column; gap: 0.5rem; }
.dash__nutrients { display: flex; flex-direction: column; gap: 0.75rem; }

@media (min-width: 640px) {
  .dash__summary { flex-direction: row; align-items: center; gap: 1rem; }
  .dash__nutrients { flex: 1; min-width: 0; }
}

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

.dash__meals-toggle:hover { background: var(--clr-surface-alt); }

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

.dash__meal-header:hover { background: var(--clr-surface-alt); }

.dash__food-list { list-style: none; padding: 0; margin: 0; border-top: 1px solid var(--clr-border-subtle); }

.dash__food-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.3rem 0.5rem;
  gap: 0.25rem;
  transition: background 0.1s ease;
}

.dash__food-item:not(:last-child) { border-bottom: 1px solid var(--clr-border-subtle); }
.dash__food-item:hover { background: var(--clr-surface-alt); }

.dash__macros { display: flex; align-items: center; gap: 0.2rem; font-size: 0.8rem; white-space: nowrap; }
.dash__macro-value { font-weight: 600; color: var(--clr-text-muted); }
.dash__macro-label { color: var(--clr-text-faint); }
.dash__macro-sep { color: var(--clr-border); margin: 0 0.07rem; }

@media (max-width: 380px) { .dash__macros { display: none; } }

.dash__actions { display: flex; flex-direction: column; align-items: stretch; gap: 0.5rem; margin-top: 1rem; }
.dash__btn-clear { width: 100%; }

@media (min-width: 400px) {
  .dash__actions { flex-direction: row; justify-content: center; flex-wrap: wrap; gap: 0.375rem; align-items: center; }
  .dash__btn-clear { width: auto; }
}

.saved-card {
  display: flex;
  align-items: center;
  background: var(--clr-surface);
  border: 1px solid var(--clr-border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-default);
}

.saved-card:hover { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); }
.saved-card:focus-visible { outline: 2px solid var(--clr-primary); outline-offset: 2px; }

.saved-card__accent {
  width: 4px;
  align-self: stretch;
  background: var(--clr-primary);
  flex-shrink: 0;
}

.saved-card__accent--recipe { background: var(--clr-accent); }

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
  margin: 0 0 0.375rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.saved-card__macros {
  display: flex;
  gap: 0.625rem;
  font-size: 0.675rem;
  color: var(--clr-text-muted);
}

.saved-card__macro { white-space: nowrap; }

.saved-card__delete {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 100%;
  min-height: 2.5rem;
  background: none;
  border: none;
  color: var(--clr-text-faint);
  cursor: pointer;
  transition: color 0.15s ease;
  flex-shrink: 0;
}

.saved-card__delete:hover { color: var(--clr-danger); }

.saved-list { display: flex; flex-direction: column; gap: 1rem; }

.saved-list__add { align-self: center; }

.form-row { display: flex; flex-direction: column; gap: 0.75rem; }

@media (min-width: 768px) {
  .form-row { flex-direction: row; gap: 0.75rem; }
  .form-row__card { flex: 1; min-width: 0; }
}

.section-title {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--clr-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.section-title i { color: var(--clr-accent); }
.section-title--primary { color: var(--clr-primary); }
.section-title--primary i { color: var(--clr-primary); }

.section-fields { display: flex; flex-direction: column; gap: 0.625rem; }

.field-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem; }

@media (max-width: 480px) { .field-row { grid-template-columns: 1fr 1fr; } }

.field-group { display: flex; flex-direction: column; gap: 0.375rem; }
.field-label { font-size: var(--text-xs); font-weight: var(--weight-medium); color: var(--clr-text-muted); }

.btn-group { display: flex; gap: 0.25rem; }
.btn-group .btn-toggle { flex: 1; }

.btn-grid { display: grid; gap: 0.25rem; }
.btn-grid--2 { grid-template-columns: 1fr 1fr; }
.btn-grid--3 { grid-template-columns: 1fr 1fr 1fr; }

@media (max-width: 480px) { .btn-grid--3 { grid-template-columns: 1fr; } }

.btn-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--clr-border);
  background: var(--clr-surface);
  color: var(--clr-text-muted);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  line-height: 1.2;
  cursor: pointer;
  transition: background var(--duration-normal) var(--ease-default), color var(--duration-normal) var(--ease-default), border-color var(--duration-normal) var(--ease-default);
}

.btn-toggle:hover { background: var(--clr-surface-alt); }
.btn-toggle--active { background: var(--clr-primary); color: var(--clr-text-inverse); border-color: var(--clr-primary); }
.btn-toggle--active:hover { background: var(--clr-primary-hover); }
.btn-toggle--sm { padding: 0.375rem 0.625rem; font-size: var(--text-xs); }

.bmi-card { background: var(--clr-surface); border: 1px solid var(--clr-border-subtle); border-radius: var(--radius-lg); padding: 0.875rem; margin-bottom: 0.75rem; }
.bmi-card__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.625rem; }

.bmi-gauge { margin-bottom: 0.75rem; }
.bmi-gauge__bar { position: relative; height: 1.5rem; margin-bottom: 0.375rem; }
.bmi-gauge__track { position: absolute; inset: 0; border-radius: var(--radius-full); background: linear-gradient(to right, var(--clr-bmi-underweight) 0%, var(--clr-bmi-underweight) 14%, var(--clr-bmi-normal) 14%, var(--clr-bmi-normal) 28%, var(--clr-bmi-overweight) 28%, var(--clr-bmi-overweight) 42%, var(--clr-bmi-obese) 42%, var(--clr-bmi-obese) 56%, var(--clr-bmi-extreme) 56%, var(--clr-bmi-extreme) 100%); }
.bmi-gauge__indicator { position: absolute; top: 50%; transform: translate(-50%, -50%); z-index: 2; }
.bmi-gauge__pill { display: flex; align-items: center; justify-content: center; min-width: 2.25rem; height: 1.5rem; padding: 0 0.375rem; border-radius: var(--radius-full); background: var(--clr-surface); color: var(--clr-text); font-family: var(--font-display); font-size: var(--text-xs); font-weight: var(--weight-bold); box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15), 0 0 0 2px var(--clr-surface); white-space: nowrap; }
.bmi-gauge__labels { display: flex; justify-content: space-between; font-size: 0.5625rem; color: var(--clr-text-faint); padding: 0 0.125rem; }

.bmi-card__details { display: flex; flex-wrap: wrap; gap: 0.75rem 1rem; padding-top: 0.5rem; border-top: 1px solid var(--clr-border-subtle); }
.bmi-detail { display: flex; flex-direction: column; gap: 0.125rem; }
.bmi-detail__label { font-size: 0.675rem; color: var(--clr-text-faint); }
.bmi-detail__value { font-size: var(--text-xs); font-weight: var(--weight-bold); color: var(--clr-text); }

.text-primary { color: var(--clr-primary); }
.text-accent { color: var(--clr-accent); }
.text-secondary { color: var(--clr-secondary); }

.metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }

@media (max-width: 480px) { .metrics-grid { grid-template-columns: 1fr; } }

.metric-card { background: var(--clr-surface); border: 1px solid var(--clr-border-subtle); border-radius: var(--radius-lg); padding: 0.75rem; text-align: center; }
.metric-card__value { font-family: var(--font-display); font-size: 1.25rem; font-weight: 700; line-height: 1; margin: 0 0 0.25rem 0; }
.metric-card__value--primary { color: var(--clr-primary); }
.metric-card__value--accent { color: var(--clr-accent); }
.metric-card__value--secondary { color: var(--clr-secondary); }
.metric-card__label { font-size: 0.675rem; color: var(--clr-text-muted); margin: 0; }

.profile-page__reset { display: flex; justify-content: center; padding-top: 0.25rem; }

.modal-detail { display: flex; flex-direction: column; gap: 0.75rem; }
.modal-detail__img { width: 100%; height: 150px; border-radius: var(--radius-md); overflow: hidden; }
.modal-detail__img img { width: 100%; height: 100%; object-fit: cover; }
.modal-detail__name { font-family: var(--font-display); font-size: 1.125rem; font-weight: var(--weight-bold); color: var(--clr-text); margin: 0; }
.modal-detail__desc { font-size: var(--text-xs); color: var(--clr-text-muted); margin: 0; }
.modal-detail__macros { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; }
.modal-detail__serving { font-size: var(--text-xs); color: var(--clr-text-faint); margin: 0; }
.modal-detail__section h4 { font-family: var(--font-display); font-size: var(--text-xs); font-weight: var(--weight-semibold); color: var(--clr-text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin: 0 0 0.375rem 0; }
.modal-detail__section ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.25rem; }
.modal-detail__section li { font-size: var(--text-xs); color: var(--clr-text); padding: 0.25rem 0.5rem; background: var(--clr-surface-alt); border-radius: var(--radius-md); }
.modal-detail__instructions { font-size: var(--text-xs); color: var(--clr-text); line-height: 1.6; margin: 0; white-space: pre-wrap; }

.modal-macro { text-align: center; padding: 0.375rem; background: var(--clr-surface-alt); border-radius: var(--radius-md); }
.modal-macro__value { display: block; font-family: var(--font-display); font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--clr-primary); line-height: 1; margin-bottom: 0.125rem; }
.modal-macro__label { font-size: 0.625rem; color: var(--clr-text-faint); }
</style>
