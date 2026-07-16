<script setup lang="ts">
import type { FoodItem } from '../types/food'

defineProps<{
  food: FoodItem
  showAdd?: boolean
}>()

const emit = defineEmits<{
  add: [food: FoodItem]
  detail: [food: FoodItem]
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
        style="color: var(--clr-primary); opacity: 0.6"
      />
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <h3 class="font-semibold truncate" style="color: var(--clr-text)">
          {{ food.name }}
        </h3>
        <img
          v-if="food.nutriScore"
          :src="`/nutri-${food.nutriScore}.png`"
          :alt="`Nutri-Score ${food.nutriScore.toUpperCase()}`"
          class="h-5 shrink-0"
        />
      </div>
      <p v-if="food.brand" class="text-xs truncate" style="color: var(--clr-text-faint)">
        {{ food.brand }}
      </p>
      <div class="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs" style="color: var(--clr-text-muted)">
        <span class="font-semibold" style="color: var(--clr-primary)">
          {{ Math.round(food.calories) }} kcal
        </span>
        <span>Proteínas: {{ food.protein.toFixed(1) }}g</span>
        <span>Carbos: {{ food.carbs.toFixed(1) }}g</span>
        <span>Grasas: {{ food.fat.toFixed(1) }}g</span>
      </div>
    </div>

    <div class="flex flex-col gap-2 shrink-0">
      <button
        class="btn w-8 h-8 p-0 shrink-0"
        style="background: var(--clr-secondary-light); color: var(--clr-secondary)"
        :aria-label="`Ver detalles de ${food.name}`"
        @click="emit('detail', food)"
      >
        <i class="fa-solid fa-eye" aria-hidden="true" />
      </button>
      <button
        v-if="showAdd"
        class="btn btn-primary w-8 h-8 p-0 text-sm"
        :aria-label="`Añadir ${food.name}`"
        @click="emit('add', food)"
      >
        <i class="fa-solid fa-plus" aria-hidden="true" />
      </button>
    </div>
  </article>
</template>
