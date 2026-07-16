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
      <h3 class="font-semibold truncate" style="color: var(--clr-text)">
        {{ food.name }}
      </h3>
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

    <div class="flex flex-col items-end gap-2 shrink-0">
      <img
        v-if="food.nutriScore"
        :src="`/nutri-${food.nutriScore}.png`"
        :alt="`Nutri-Score ${food.nutriScore.toUpperCase()}`"
        class="h-6"
      />
      <button
        class="btn-slide btn-eye"
        :aria-label="`Ver detalles de ${food.name}`"
        @click="emit('detail', food)"
      >
        <span class="btn-slide__icon"><i class="fa-solid fa-eye" aria-hidden="true" /></span>
        <span class="btn-slide__text">Ver más</span>
      </button>
      <button
        v-if="showAdd"
        class="btn-slide btn-primary-slide"
        :aria-label="`Añadir ${food.name}`"
        @click="emit('add', food)"
      >
        <span class="btn-slide__icon"><i class="fa-solid fa-plus" aria-hidden="true" /></span>
        <span class="btn-slide__text">Añadir</span>
      </button>
    </div>
  </article>
</template>

<style scoped>
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
  transition: background 0.15s ease;
}
.btn-slide__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  transition: transform 0.25s ease;
  position: relative;
  z-index: 1;
}
.btn-slide__text {
  position: absolute;
  right: 0;
  font-size: 0.7rem;
  font-weight: 700;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(8px);
  transition:
    opacity 0.2s ease 0.1s,
    transform 0.2s ease 0.1s;
  pointer-events: none;
}
.btn-slide:hover .btn-slide__icon {
  transform: translateX(-0.25rem);
}
.btn-slide:hover .btn-slide__text {
  opacity: 1;
  transform: translateX(0);
}
.btn-eye {
  background: var(--clr-secondary);
  color: #fff;
  box-shadow: var(--shadow-sm);
}
.btn-eye:hover {
  background: var(--clr-secondary-hover);
}
.btn-primary-slide {
  background: var(--clr-primary);
  color: #fff;
  box-shadow: var(--shadow-sm);
}
.btn-primary-slide:hover {
  background: var(--clr-primary-hover);
}

@media (hover: none) {
  .btn-slide__text {
    display: none;
  }
}
</style>
