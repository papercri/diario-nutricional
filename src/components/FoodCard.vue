<script setup lang="ts">
import type { FoodItem } from '../types/food'

defineProps<{
  food: FoodItem
  showAdd?: boolean
}>()

const emit = defineEmits<{
  add: [food: FoodItem]
}>()
</script>

<template>
  <article
    class="card-elevated flex items-start gap-4 p-4 hover:scale-[1.01] transition-all duration-200"
  >
    <img
      v-if="food.imageUrl"
      :src="food.imageUrl"
      :alt="food.name"
      class="w-16 h-16 rounded-xl object-cover shrink-0"
      loading="lazy"
    />
    <div
      v-else
      class="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-100 to-lime-100 flex items-center justify-center shrink-0"
    >
      <i class="fa-solid fa-utensils text-2xl text-emerald-400" aria-hidden="true" />
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
      class="btn btn-primary shrink-0 text-sm"
      :aria-label="`Añadir ${food.name}`"
      @click="emit('add', food)"
    >
      <i class="fa-solid fa-plus" aria-hidden="true" />
      Añadir
    </button>
  </article>
</template>
