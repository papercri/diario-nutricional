<script setup lang="ts">
import { ref } from 'vue'
import { useFoodStore } from '../stores/foodStore'
import { searchFood } from '../services/openFoodFacts'
import FoodCard from '../components/FoodCard.vue'
import type { FoodItem, MealType } from '../types/food'

const foodStore = useFoodStore()

const query = ref('')
const results = ref<FoodItem[]>([])
const isSearching = ref(false)
const error = ref<string | null>(null)
const hasSearched = ref(false)

let debounceTimer: ReturnType<typeof window.setTimeout> | null = null

function onSearchInput(value: string) {
  query.value = value
  if (debounceTimer) window.clearTimeout(debounceTimer)
  if (value.trim().length < 2) {
    results.value = []
    hasSearched.value = false
    return
  }
  debounceTimer = window.setTimeout(() => performSearch(), 400)
}

async function performSearch() {
  if (!query.value.trim()) return
  isSearching.value = true
  error.value = null
  hasSearched.value = true
  try {
    results.value = await searchFood(query.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error al buscar'
    results.value = []
  } finally {
    isSearching.value = false
  }
}

const showAddModal = ref(false)
const selectedFood = ref<FoodItem | null>(null)
const servings = ref(1)
const mealType = ref<MealType>('snack')

function openAddModal(food: FoodItem) {
  selectedFood.value = food
  servings.value = 1
  mealType.value = 'snack'
  showAddModal.value = true
}

function confirmAdd() {
  if (!selectedFood.value) return
  foodStore.addEntry(selectedFood.value, servings.value, mealType.value)
  showAddModal.value = false
  selectedFood.value = null
}

const mealTypeOptions: { value: MealType; label: string; icon: string }[] = [
  { value: 'breakfast', label: 'Desayuno', icon: 'fa-solid fa-sun' },
  { value: 'lunch', label: 'Comida', icon: 'fa-solid fa-cloud-sun' },
  { value: 'dinner', label: 'Cena', icon: 'fa-solid fa-moon' },
  { value: 'snack', label: 'Snack', icon: 'fa-solid fa-cookie' },
]
</script>

<template>
  <main class="max-w-2xl mx-auto px-4 py-8 space-y-6">
    <header class="text-center">
      <h1 class="text-2xl font-bold text-emerald-900 font-display">Buscar alimentos</h1>
      <p class="text-sm text-slate-500 mt-1">Encuentra alimentos en Open Food Facts</p>
    </header>

    <div class="relative">
      <label for="food-search" class="sr-only">Buscar alimentos</label>
      <i
        class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none"
        aria-hidden="true"
      />
      <input
        id="food-search"
        :value="query"
        type="search"
        placeholder="Ej: pollo, arroz, manzana..."
        class="input-field !pl-11"
        aria-describedby="search-hint"
        @input="onSearchInput(($event.target as HTMLInputElement).value)"
      />
      <span id="search-hint" class="sr-only">Escribe al menos 2 caracteres para buscar</span>
    </div>

    <div v-if="isSearching" class="text-center py-12" role="status" aria-label="Buscando alimentos">
      <i class="fa-solid fa-spinner fa-spin-pulse text-3xl text-emerald-400" aria-hidden="true" />
      <p class="text-slate-400 mt-4">Buscando...</p>
    </div>

    <div
      v-else-if="error"
      class="p-6 rounded-3xl text-center"
      style="background: var(--clr-surface-alt); border: 1px solid var(--clr-border)"
      role="alert"
    >
      <p class="text-slate-700">{{ error }}</p>
      <button class="btn btn-primary mt-3" @click="performSearch()">Reintentar</button>
    </div>

    <div v-else-if="hasSearched && results.length === 0" class="text-center py-12" role="status">
      <i
        class="fa-solid fa-magnifying-glass text-5xl text-slate-300 block mb-3"
        aria-hidden="true"
      />
      <p class="text-slate-600 font-medium">Sin resultados para "{{ query }}"</p>
      <p class="text-sm text-slate-400 mt-1">Prueba con otro término</p>
    </div>

    <div v-else class="space-y-3">
      <p v-if="hasSearched" class="text-xs text-slate-400">{{ results.length }} resultados</p>
      <FoodCard
        v-for="food in results"
        :key="food.id"
        :food="food"
        :show-add="true"
        @add="openAddModal"
      />
    </div>

    <!-- Add food modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      :aria-label="`Añadir ${selectedFood?.name}`"
      @click.self="showAddModal = false"
      @keydown.escape="showAddModal = false"
    >
      <div
        class="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-xl space-y-5 animate-slide-up"
      >
        <h2 class="text-lg font-semibold text-slate-800">Añadir alimento</h2>

        <p class="text-sm text-slate-700 font-medium">
          {{ selectedFood?.name }}
        </p>

        <fieldset class="space-y-2 border-0 p-0 m-0">
          <legend class="block text-sm font-medium text-slate-600">Tipo de comida</legend>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="opt in mealTypeOptions"
              :key="opt.value"
              type="button"
              class="btn text-sm"
              :class="
                mealType === opt.value ? 'btn-primary' : 'btn-secondary border border-amber-200'
              "
              :aria-pressed="mealType === opt.value"
              @click="mealType = opt.value"
            >
              <i :class="opt.icon" aria-hidden="true" />
              {{ opt.label }}
            </button>
          </div>
        </fieldset>

        <div class="space-y-2">
          <label for="servings-input" class="block text-sm font-medium text-slate-600">
            Porciones (100g c/u)
          </label>
          <input
            id="servings-input"
            v-model.number="servings"
            type="number"
            min="0.25"
            max="20"
            step="0.25"
            class="input-field"
          />
          <p class="text-xs text-slate-400" aria-live="polite">
            Total: ~{{ Math.round((selectedFood?.calories ?? 0) * servings) }} kcal
          </p>
        </div>

        <div class="flex gap-3 pt-2">
          <button class="btn btn-secondary flex-1" @click="showAddModal = false">Cancelar</button>
          <button class="btn btn-primary flex-1" @click="confirmAdd">Añadir</button>
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
</style>
