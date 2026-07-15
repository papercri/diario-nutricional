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
  <article class="card-elevated flex items-start gap-4 p-4 transition-all duration-200">
    <img
      v-if="food.imageUrl"
      :src="food.imageUrl"
      :alt="food.name"
      class="w-16 h-16 rounded-lg object-cover shrink-0"
      loading="lazy"
    />
    <div
      v-else
      class="w-16 h-16 rounded-lg flex items-center justify-center shrink-0"
      style="background: var(--clr-primary-light)"
    >
      <i
        class="fa-solid fa-utensils text-2xl"
        aria-hidden="true"
        style="color: var(--clr-primary)"
      />
    </div>

    <div class="flex-1 min-w-0">
      <h3 class="font-semibold truncate" style="color: var(--clr-text)">
        {{ food.name }}
      </h3>
      <p v-if="food.brand" class="text-xs truncate" style="color: var(--clr-text-faint)">
        {{ food.brand }}
      </p>
      <div class="flex gap-3 mt-2 text-xs" style="color: var(--clr-text-muted)">
        <span class="font-semibold" style="color: var(--clr-primary)">
          {{ Math.round(food.calories) }} kcal
        </span>
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
