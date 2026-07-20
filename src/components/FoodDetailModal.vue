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
    a: 'var(--clr-nutri-a)',
    b: 'var(--clr-nutri-b)',
    c: 'var(--clr-nutri-c)',
    d: 'var(--clr-nutri-d)',
    e: 'var(--clr-nutri-e)',
  }
  return colors[grade] ?? 'var(--clr-border)'
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
      class="w-full sm:max-w-xl max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-xl animate-slide-up"
      style="background: var(--clr-surface)"
    >
      <!-- Close button -->
      <div class="flex justify-end p-3 pb-0">
        <button
          class="w-7 h-7 rounded-full flex items-center justify-center"
          style="background: var(--clr-surface-alt); color: var(--clr-text-muted)"
          aria-label="Cerrar"
          @click="emit('close')"
        >
          <i class="fa-solid fa-xmark text-sm" aria-hidden="true" />
        </button>
      </div>

      <div class="px-5 pb-5 space-y-4">
        <!-- Header: image right + text left -->
        <div class="flex gap-4">
          <div class="flex-1 min-w-0">
            <h2 class="text-display-lg">{{ food.name }}</h2>
            <p v-if="food.brand" class="text-body mt-1">{{ food.brand }}</p>
            <p v-if="food.servingSize" class="text-body-sm mt-1">
              <i class="fa-solid fa-scale-balanced mr-1" aria-hidden="true" />
              Porción: {{ food.servingSize }}
            </p>
            <img
              v-if="food.nutriScore"
              :src="`/nutri-${food.nutriScore}.png`"
              :alt="`Nutri-Score ${food.nutriScore.toUpperCase()}`"
              class="h-8 mt-2"
            />
          </div>
          <img
            v-if="food.imageUrl"
            :src="food.imageUrl"
            :alt="food.name"
            class="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0"
          />
          <div
            v-else
            class="w-20 h-20 sm:w-24 sm:h-24 rounded-xl flex items-center justify-center shrink-0"
            style="background: var(--clr-primary-light)"
          >
            <i
              class="fa-solid fa-utensils text-3xl"
              aria-hidden="true"
              style="color: var(--clr-primary); opacity: 0.3"
            />
          </div>
        </div>

        <!-- Nutrition facts -->
        <div class="grid grid-cols-4 gap-2">
          <div class="text-center p-2 rounded-xl" style="background: var(--clr-primary-light)">
            <p class="text-lg font-bold" style="color: var(--clr-primary)">
              {{ Math.round(food.calories) }}
            </p>
            <p class="text-body-sm">kcal</p>
          </div>
          <div class="text-center p-2 rounded-xl" style="background: var(--clr-primary-faint)">
            <p class="text-lg font-bold" style="color: var(--clr-text)">
              {{ food.protein.toFixed(1) }}
            </p>
            <p class="text-body-sm">proteínas</p>
          </div>
          <div class="text-center p-2 rounded-xl" style="background: var(--clr-secondary-light)">
            <p class="text-lg font-bold" style="color: var(--clr-secondary)">
              {{ food.carbs.toFixed(1) }}
            </p>
            <p class="text-body-sm">carbos</p>
          </div>
          <div class="text-center p-2 rounded-xl" style="background: var(--clr-accent-light)">
            <p class="text-lg font-bold" style="color: var(--clr-accent)">
              {{ food.fat.toFixed(1) }}
            </p>
            <p class="text-body-sm">grasas</p>
          </div>
        </div>

        <!-- Nutri-Score scale -->
        <div v-if="food.nutriScore" class="card p-3">
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
            <span class="text-label-sm ml-1">
              {{ getGradeLabel(food.nutriScore) }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button class="btn btn-secondary flex-1" @click="emit('close')">Cerrar</button>
          <button class="btn btn-primary flex-1" @click="emit('add', food)">
            <i class="fa-solid fa-plus" aria-hidden="true" />
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
