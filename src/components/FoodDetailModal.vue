<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import type { FoodItem } from '@/types/food'
import type { MealType } from '@/types/food'
import { MEAL_TYPE_LABELS, MEAL_TYPE_ICONS } from '@/utils/constants'

const props = defineProps<{
  food: FoodItem
  servings?: number
  mealType?: MealType
}>()

const emit = defineEmits<{
  close: []
}>()

const modalRef = ref<HTMLElement | null>(null)
const previousFocus = ref<HTMLElement | null>(null)

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

function getFocusableElements(): HTMLElement[] {
  if (!modalRef.value) return []
  return Array.from(
    modalRef.value.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  )
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
    return
  }

  if (e.key !== 'Tab') return

  const focusable = getFocusableElements()
  if (focusable.length === 0) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault()
      last.focus()
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

const totalCalories = props.servings
  ? Math.round(props.food.calories * props.servings)
  : Math.round(props.food.calories)

const totalProtein = props.servings
  ? (props.food.protein * props.servings).toFixed(1)
  : props.food.protein.toFixed(1)

const totalCarbs = props.servings
  ? (props.food.carbs * props.servings).toFixed(1)
  : props.food.carbs.toFixed(1)

const totalFat = props.servings
  ? (props.food.fat * props.servings).toFixed(1)
  : props.food.fat.toFixed(1)

onMounted(async () => {
  previousFocus.value = document.activeElement as HTMLElement
  document.body.style.overflow = 'hidden'
  await nextTick()
  const focusable = getFocusableElements()
  if (focusable.length > 0) {
    focusable[0].focus()
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
  previousFocus.value?.focus()
})
</script>

<template>
  <div
    ref="modalRef"
    class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    :aria-label="`Detalles de ${food.name}`"
    @click.self="emit('close')"
    @keydown="handleKeydown"
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
          <font-awesome-icon :icon="['fas', 'xmark']" class="text-sm" aria-hidden="true" />
        </button>
      </div>

      <div class="px-5 pb-5 space-y-4">
        <!-- Header -->
        <div class="flex gap-4">
          <div class="flex-1 min-w-0">
            <h2 class="text-display-lg">{{ food.name }}</h2>
            <p v-if="food.brand" class="text-body mt-1">{{ food.brand }}</p>
            <div class="flex flex-wrap items-center gap-2 mt-2">
              <span v-if="mealType" class="detail-badge detail-badge--meal">
                <font-awesome-icon :icon="MEAL_TYPE_ICONS[mealType]" aria-hidden="true" />
                {{ MEAL_TYPE_LABELS[mealType] }}
              </span>
              <span v-if="servings" class="detail-badge detail-badge--servings">
                <font-awesome-icon :icon="['fas', 'scale-balanced']" aria-hidden="true" />
                {{ servings }}x · {{ food.servingSize ?? '100g' }}
              </span>
              <span v-if="food.barcode" class="detail-badge detail-badge--barcode">
                {{ food.barcode }}
              </span>
            </div>
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
        </div>

        <!-- Nutrition facts -->
        <div class="grid grid-cols-4 gap-2">
          <div class="text-center p-2 rounded-xl" style="background: var(--clr-primary-light)">
            <p class="text-lg font-bold" style="color: var(--clr-primary)">
              {{ totalCalories }}
            </p>
            <p class="text-body-sm">kcal</p>
          </div>
          <div class="text-center p-2 rounded-xl" style="background: var(--clr-primary-faint)">
            <p class="text-lg font-bold" style="color: var(--clr-text)">
              {{ totalProtein }}
            </p>
            <p class="text-body-sm">proteínas</p>
          </div>
          <div class="text-center p-2 rounded-xl" style="background: var(--clr-secondary-light)">
            <p class="text-lg font-bold" style="color: var(--clr-secondary)">
              {{ totalCarbs }}
            </p>
            <p class="text-body-sm">carbos</p>
          </div>
          <div class="text-center p-2 rounded-xl" style="background: var(--clr-accent-light)">
            <p class="text-lg font-bold" style="color: var(--clr-accent)">
              {{ totalFat }}
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

        <!-- Macro bar -->
        <div class="space-y-1">
          <div class="flex h-2 rounded-full overflow-hidden gap-0.5">
            <div
              class="rounded-full"
              style="background: var(--clr-primary)"
              :style="{ flex: food.protein || 0.1 }"
            />
            <div
              class="rounded-full"
              style="background: var(--clr-accent)"
              :style="{ flex: food.carbs || 0.1 }"
            />
            <div
              class="rounded-full"
              style="background: var(--clr-secondary)"
              :style="{ flex: food.fat || 0.1 }"
            />
          </div>
          <div class="flex justify-between text-[10px]" style="color: var(--clr-text-faint)">
            <span>Pro {{ Math.round((food.protein ?? 0) * 4) }} kcal</span>
            <span>Carb {{ Math.round((food.carbs ?? 0) * 4) }} kcal</span>
            <span>Grasa {{ Math.round((food.fat ?? 0) * 9) }} kcal</span>
          </div>
        </div>

        <!-- Close button -->
        <button class="btn btn-secondary w-full" @click="emit('close')">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-full);
  font-size: 0.675rem;
  font-weight: var(--weight-medium);
}

.detail-badge--meal {
  background: var(--clr-primary-light);
  color: var(--clr-primary);
}

.detail-badge--servings {
  background: var(--clr-surface-alt);
  color: var(--clr-text-muted);
}

.detail-badge--barcode {
  background: var(--clr-surface-alt);
  color: var(--clr-text-faint);
  font-family: var(--font-mono);
  font-size: 0.6rem;
}
</style>
