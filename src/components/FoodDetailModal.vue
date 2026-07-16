<script setup lang="ts">
import type { FoodItem } from '../types/food'

defineProps<{
  food: FoodItem
}>()

const emit = defineEmits<{
  close: []
  add: [food: FoodItem]
}>()

function getGradeColor(grade: string): string {
  const colors: Record<string, string> = {
    a: '#038141',
    b: '#85bb2f',
    c: '#fecb02',
    d: '#ee8100',
    e: '#e63e11',
  }
  return colors[grade] ?? '#ccc'
}

function getGradeLabel(grade: string): string {
  const labels: Record<string, string> = {
    a: 'Excelente',
    b: 'Bueno',
    c: 'Regular',
    d: 'Malo',
    e: 'Muy malo',
  }
  return labels[grade] ?? ''
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    :aria-label="`Detalles de ${food.name}`"
    @click.self="emit('close')"
    @keydown.escape="emit('close')"
  >
    <div
      class="w-full sm:max-w-lg max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-xl animate-slide-up"
      style="background: var(--clr-surface)"
    >
      <!-- Image -->
      <div class="relative">
        <img
          v-if="food.imageUrl"
          :src="food.imageUrl"
          :alt="food.name"
          class="w-full h-52 sm:h-64 object-cover"
        />
        <div
          v-else
          class="w-full h-52 sm:h-64 flex items-center justify-center"
          style="background: var(--clr-primary-light)"
        >
          <i
            class="fa-solid fa-utensils text-6xl"
            aria-hidden="true"
            style="color: var(--clr-primary); opacity: 0.3"
          />
        </div>
        <button
          class="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm"
          style="background: rgba(0, 0, 0, 0.4); color: #fff"
          aria-label="Cerrar"
          @click="emit('close')"
        >
          <i class="fa-solid fa-xmark" aria-hidden="true" />
        </button>
      </div>

      <div class="p-5 space-y-5">
        <!-- Header -->
        <div>
          <div class="flex items-center gap-3">
            <h2 class="text-display-lg flex-1">{{ food.name }}</h2>
            <span
              v-if="food.nutriScore"
              class="nutri-score nutri-score--detail"
              :class="`nutri-score--${food.nutriScore}`"
              :aria-label="`Nutri-Score ${food.nutriScore.toUpperCase()}`"
            >
              <span class="nutri-score__letter">{{ food.nutriScore }}</span>
              Nutri-Score
            </span>
          </div>
          <p v-if="food.brand" class="text-body mt-1">{{ food.brand }}</p>
          <p v-if="food.servingSize" class="text-body-sm mt-1">
            <i class="fa-solid fa-scale-balanced mr-1" aria-hidden="true" />
            Porción: {{ food.servingSize }}
          </p>
        </div>

        <!-- Nutrition facts per 100g -->
        <div class="card p-4 space-y-3">
          <h3 class="text-label-sm">Valores nutricionales por 100g</h3>
          <div class="grid grid-cols-2 gap-3">
            <div class="text-center p-3 rounded-xl" style="background: var(--clr-primary-light)">
              <p class="text-2xl font-bold" style="color: var(--clr-primary)">
                {{ Math.round(food.calories) }}
              </p>
              <p class="text-body-sm">kcal</p>
            </div>
            <div class="text-center p-3 rounded-xl" style="background: var(--clr-primary-faint)">
              <p class="text-2xl font-bold" style="color: var(--clr-text)">
                {{ food.protein.toFixed(1) }}
              </p>
              <p class="text-body-sm">proteínas (g)</p>
            </div>
            <div class="text-center p-3 rounded-xl" style="background: var(--clr-secondary-light)">
              <p class="text-2xl font-bold" style="color: var(--clr-secondary)">
                {{ food.carbs.toFixed(1) }}
              </p>
              <p class="text-body-sm">carbos (g)</p>
            </div>
            <div class="text-center p-3 rounded-xl" style="background: var(--clr-accent-light)">
              <p class="text-2xl font-bold" style="color: var(--clr-accent)">
                {{ food.fat.toFixed(1) }}
              </p>
              <p class="text-body-sm">grasas (g)</p>
            </div>
          </div>
        </div>

        <!-- Nutri-Score explanation -->
        <div v-if="food.nutriScore" class="card p-4">
          <h3 class="text-label-sm mb-2">Nutri-Score</h3>
          <div class="flex items-center gap-2">
            <div class="flex gap-0.5 flex-1">
              <span
                v-for="grade in ['a', 'b', 'c', 'd', 'e']"
                :key="grade"
                class="flex-1 h-2 rounded-full transition-all duration-300"
                :class="
                  grade === food.nutriScore ? 'ring-2 ring-offset-1 scale-y-150' : 'opacity-40'
                "
                :style="{ background: getGradeColor(grade) }"
              />
            </div>
            <span class="text-label-sm ml-2">
              {{ getGradeLabel(food.nutriScore) }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-1">
          <button class="btn btn-secondary flex-1" @click="emit('close')">Cerrar</button>
          <button class="btn btn-primary flex-1" @click="emit('add', food)">
            <i class="fa-solid fa-plus" aria-hidden="true" />
            Añadir a mi día
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
.nutri-score--detail {
  padding: 0.3rem 0.625rem;
  font-size: 0.7rem;
}
.nutri-score--detail .nutri-score__letter {
  width: 1.25rem;
  height: 1.25rem;
  font-size: 0.75rem;
}
</style>
