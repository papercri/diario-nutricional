<script setup lang="ts">
import type { FoodItem } from '../types/food'

const props = defineProps<{
  food: FoodItem
  showAdd?: boolean
}>()

const emit = defineEmits<{
  add: [food: FoodItem]
}>()
</script>

<template>
  <div
    class="flex items-start gap-4 p-4 rounded-2xl border border-amber-100 bg-white shadow-sm hover:shadow-md transition-all duration-200"
  >
    <img
      v-if="food.imageUrl"
      :src="food.imageUrl"
      :alt="food.name"
      class="w-16 h-16 rounded-xl object-cover bg-amber-50 shrink-0"
      loading="lazy"
    />
    <div
      v-else
      class="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-100 to-lime-100 flex items-center justify-center text-2xl shrink-0"
    >
      🥗
    </div>

    <div class="flex-1 min-w-0">
      <h3 class="font-semibold text-slate-800 truncate">
        {{ food.name }}
      </h3>
      <p v-if="food.brand" class="text-xs text-slate-400 truncate">
        {{ food.brand }}
      </p>
      <div class="flex gap-3 mt-2 text-xs text-slate-500">
        <span class="font-medium text-emerald-700">{{ Math.round(food.calories) }} kcal</span>
        <span>P: {{ food.protein.toFixed(1) }}g</span>
        <span>C: {{ food.carbs.toFixed(1) }}g</span>
        <span>G: {{ food.fat.toFixed(1) }}g</span>
      </div>
    </div>

    <button
      v-if="showAdd"
      class="shrink-0 px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 active:bg-emerald-700 transition-colors shadow-sm"
      @click="emit('add', food)"
    >
      + Añadir
    </button>
  </div>
</template>
