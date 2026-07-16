<script setup lang="ts">
import { ref } from 'vue'
import { useFoodSearch } from '../composables/useFoodSearch'
import { useAddFood } from '../composables/useAddFood'
import FoodCard from '../components/FoodCard.vue'
import FoodDetailModal from '../components/FoodDetailModal.vue'
import { MEAL_TYPE_OPTIONS } from '../utils/constants'
import type { FoodItem } from '../types/food'

const { query, results, isSearching, error, hasSearched, onSearchInput, performSearch } =
  useFoodSearch()
const { showAddModal, selectedFood, servings, mealType, openAddModal, confirmAdd, closeModal } =
  useAddFood()

const detailFood = ref<FoodItem | null>(null)

function openDetail(food: FoodItem) {
  detailFood.value = food
}

function closeDetail() {
  detailFood.value = null
}

function addFromDetail(food: FoodItem) {
  detailFood.value = null
  openAddModal(food)
}
</script>

<template>
  <main class="max-w-2xl mx-auto px-4 py-8 space-y-6">
    <header class="text-center">
      <h1 class="font-display" style="font-size: 1.75rem; color: var(--clr-text)">
        Buscar alimentos
      </h1>
      <p style="font-size: 0.875rem; color: var(--clr-text-muted); margin-top: 4px">
        Encuentra alimentos en Open Food Facts
      </p>
    </header>

    <div class="relative">
      <label for="food-search" class="sr-only">Buscar alimentos</label>
      <i
        class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
        aria-hidden="true"
        style="color: var(--clr-text-faint)"
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
      <i
        class="fa-solid fa-spinner fa-spin-pulse text-3xl block mb-2"
        aria-hidden="true"
        style="color: var(--clr-primary)"
      />
      <p style="color: var(--clr-text-faint)">Buscando...</p>
    </div>

    <div
      v-else-if="error"
      class="p-6 rounded-2xl text-center"
      style="background: var(--clr-surface-alt); border: 1px solid var(--clr-border)"
      role="alert"
    >
      <p style="color: var(--clr-text-muted)">{{ error }}</p>
      <button class="btn btn-primary mt-3" @click="performSearch()">Reintentar</button>
    </div>

    <div v-else-if="hasSearched && results.length === 0" class="text-center py-12" role="status">
      <i
        class="fa-solid fa-magnifying-glass text-5xl block mb-3"
        aria-hidden="true"
        style="color: var(--clr-text-faint); opacity: 0.4"
      />
      <p class="font-medium" style="color: var(--clr-text-muted)">
        Sin resultados para "{{ query }}"
      </p>
      <p style="font-size: 0.875rem; color: var(--clr-text-faint); margin-top: 4px">
        Prueba con otro término
      </p>
    </div>

    <div v-else class="space-y-3">
      <p v-if="hasSearched" style="font-size: 0.75rem; color: var(--clr-text-faint)">
        {{ results.length }} resultados
      </p>
      <FoodCard
        v-for="food in results"
        :key="food.id"
        :food="food"
        :show-add="true"
        @add="openAddModal"
        @detail="openDetail"
      />
    </div>

    <!-- Detail modal -->
    <FoodDetailModal
      v-if="detailFood"
      :food="detailFood"
      @close="closeDetail"
      @add="addFromDetail"
    />

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
              <i :class="opt.icon" aria-hidden="true" />
              {{ opt.label }}
            </button>
          </div>
        </fieldset>

        <div class="space-y-2">
          <label
            for="servings-input"
            class="block text-sm font-medium"
            style="color: var(--clr-text-muted)"
          >
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
