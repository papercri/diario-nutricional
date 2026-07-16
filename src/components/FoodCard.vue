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
  <article class="card-elevated flex items-start gap-3 p-4 transition-all duration-200">
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

    <div class="flex items-center gap-1.5 shrink-0 self-start mt-0.5">
      <img
        v-if="food.nutriScore"
        :src="`/nutri-${food.nutriScore}.png`"
        :alt="`Nutri-Score ${food.nutriScore.toUpperCase()}`"
        class="h-7"
      />
      <span
        v-if="food.nutriScore"
        class="text-body-sm font-semibold"
        style="color: var(--clr-text-muted)"
      >
        Nutri-Score:
      </span>
    </div>

    <div class="btn-col shrink-0">
      <button
        class="btn-slide btn-eye"
        :aria-label="`Ver detalles de ${food.name}`"
        @click="emit('detail', food)"
      >
        <span class="btn-slide__text">Ver más</span>
        <span class="btn-slide__icon"><i class="fa-solid fa-eye" aria-hidden="true" /></span>
      </button>
      <button
        v-if="showAdd"
        class="btn-slide btn-primary-slide"
        :aria-label="`Añadir ${food.name}`"
        @click="emit('add', food)"
      >
        <span class="btn-slide__text">Añadir</span>
        <span class="btn-slide__icon"><i class="fa-solid fa-plus" aria-hidden="true" /></span>
      </button>
    </div>
  </article>
</template>

<style scoped>
.btn-col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-shrink: 0;
}

.btn-slide {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  overflow: visible;
  z-index: 1;
  transition: background 0.15s ease;
}
.btn-slide::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-md);
  transition: left 0.25s ease;
  z-index: -1;
}
.btn-slide__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
}
.btn-slide__text {
  font-size: 0.7rem;
  font-weight: 700;
  white-space: nowrap;
  max-width: 0;
  opacity: 0;
  overflow: hidden;
  transition:
    max-width 0.25s ease,
    opacity 0.15s ease 0.1s,
    margin 0.25s ease;
}
.btn-slide:hover .btn-slide__text {
  max-width: 4rem;
  opacity: 1;
  margin-right: 0.25rem;
}

.btn-eye {
  color: #fff;
  box-shadow: var(--shadow-sm);
}
.btn-eye::before {
  background: var(--clr-secondary);
}
.btn-eye:hover::before {
  left: -3.5rem;
}
.btn-eye:hover {
  background: var(--clr-secondary-hover);
}

.btn-primary-slide {
  color: #fff;
  box-shadow: var(--shadow-sm);
}
.btn-primary-slide::before {
  background: var(--clr-primary);
}
.btn-primary-slide:hover::before {
  left: -3.5rem;
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
