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

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function onSearchInput(value: string) {
  query.value = value
  if (debounceTimer) clearTimeout(debounceTimer)
  if (value.trim().length < 2) {
    results.value = []
    hasSearched.value = false
    return
  }
  debounceTimer = setTimeout(() => performSearch(), 400)
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
  { value: 'breakfast', label: 'Desayuno', icon: '🌅' },
  { value: 'lunch', label: 'Comida', icon: '☀️' },
  { value: 'dinner', label: 'Cena', icon: '🌙' },
  { value: 'snack', label: 'Snack', icon: '🍪' },
]
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8 space-y-6">
    <header class="text-center">
      <h1 class="text-2xl font-bold text-emerald-900">Buscar alimentos</h1>
      <p class="text-sm text-slate-500 mt-1">
        Encuentra alimentos en Open Food Facts
      </p>
    </header>

    <div class="relative">
      <input
        :value="query"
        type="text"
        placeholder="Ej: pollo, arroz, manzana..."
        class="w-full px-5 py-4 pl-12 rounded-3xl border border-amber-200 bg-white text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all shadow-sm"
        @input="onSearchInput(($event.target as HTMLInputElement).value)"
      />
      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
    </div>

    <div v-if="isSearching" class="text-center py-12">
      <div class="inline-block w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
      <p class="text-slate-400 mt-4">Buscando...</p>
    </div>

    <div v-else-if="error" class="p-6 rounded-3xl bg-amber-50 border border-amber-200 text-center">
      <p class="text-slate-700">{{ error }}</p>
      <button
        class="mt-3 px-4 py-2 rounded-2xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
        @click="performSearch()"
      >
        Reintentar
      </button>
    </div>

    <div v-else-if="hasSearched && results.length === 0" class="text-center py-12">
      <span class="text-5xl">🔎</span>
      <p class="text-slate-400 mt-4">No encontramos alimentos para "{{ query }}"</p>
      <p class="text-xs text-slate-300 mt-1">Prueba con otro término</p>
    </div>

    <div v-else class="space-y-3">
      <p v-if="hasSearched" class="text-xs text-slate-400">
        {{ results.length }} resultados
      </p>
      <FoodCard
        v-for="food in results"
        :key="food.id"
        :food="food"
        :show-add="true"
        @add="openAddModal"
      />
    </div>

    <div
      v-if="showAddModal"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm"
      @click.self="showAddModal = false"
    >
      <div
        class="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-xl space-y-5 animate-slide-up"
      >
        <h2 class="text-lg font-semibold text-slate-800">
          Añadir alimento
        </h2>

        <p class="text-sm text-slate-700 font-medium">
          {{ selectedFood?.name }}
        </p>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-600">Tipo de comida</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="opt in mealTypeOptions"
              :key="opt.value"
              type="button"
              class="py-2.5 px-3 rounded-2xl text-sm font-medium transition-all"
              :class="mealType === opt.value
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-amber-50 text-slate-600 hover:bg-amber-100 border border-amber-200'"
              @click="mealType = opt.value"
            >
              {{ opt.icon }} {{ opt.label }}
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-600">
            Porciones (100g c/u)
          </label>
          <input
            v-model.number="servings"
            type="number"
            min="0.25"
            max="20"
            step="0.25"
            class="w-full px-4 py-3 rounded-2xl border border-amber-200 bg-amber-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
          />
          <p class="text-xs text-slate-400">
            Total: ~{{ Math.round((selectedFood?.calories ?? 0) * servings) }} kcal
          </p>
        </div>

        <div class="flex gap-3 pt-2">
          <button
            class="flex-1 py-3 rounded-2xl bg-amber-100 text-slate-600 font-medium hover:bg-amber-200 transition-colors"
            @click="showAddModal = false"
          >
            Cancelar
          </button>
          <button
            class="flex-1 py-3 rounded-2xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors shadow-sm"
            @click="confirmAdd"
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  </div>
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
