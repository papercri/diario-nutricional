<script setup lang="ts">
import { computed } from 'vue'
import { calcPercentage, calcRemaining } from '../utils/nutrition'

const props = defineProps<{
  consumed: number
  target: number
}>()

const percentage = computed(() => calcPercentage(props.consumed, props.target))
const remaining = computed(() => calcRemaining(props.consumed, props.target))

const circumference = 2 * Math.PI * 90
const strokeDashoffset = computed(() => {
  return circumference - (percentage.value / 100) * circumference
})

const ringColor = computed(() => {
  if (percentage.value >= 90) return 'var(--clr-secondary)'
  if (percentage.value >= 70) return 'var(--clr-accent)'
  return 'var(--clr-primary)'
})
</script>

<template>
  <div
    class="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-4 animate-fade-in-up"
  >
    <div class="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0">
      <svg class="w-full h-full -rotate-90" viewBox="0 0 200 200">
        <defs>
          <filter id="ring-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="var(--clr-surface-alt)"
          stroke-width="12"
          opacity="0.8"
        />
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          :stroke="ringColor"
          stroke-width="12"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeDashoffset"
          filter="url(#ring-glow)"
          class="transition-all duration-700 ease-out"
        />
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-xl sm:text-2xl font-bold font-display" style="color: var(--clr-text)">
          {{ Math.round(consumed) }}
        </span>
        <span class="text-[10px] sm:text-xs" style="color: var(--clr-text-muted)">
          / {{ Math.round(target) }} kcal
        </span>
      </div>
    </div>
    <div class="flex flex-col items-center gap-1 min-w-0 sm:items-start">
      <span
        v-if="remaining > 0"
        class="text-xs sm:text-sm font-medium"
        style="color: var(--clr-text-muted)"
      >
        {{ Math.round(remaining) }} restantes
      </span>
      <span v-else class="text-xs sm:text-sm font-semibold" style="color: var(--clr-secondary)">
        ¡Meta cumplida!
      </span>
      <div
        class="w-32 sm:w-full h-1.5 rounded-full overflow-hidden"
        style="background: var(--clr-surface-alt)"
      >
        <div
          class="h-full rounded-full transition-all duration-500 ease-out"
          :style="{ background: ringColor, width: percentage + '%' }"
        />
      </div>
      <span class="text-[10px] sm:text-xs" style="color: var(--clr-text-faint)">
        {{ Math.round(percentage) }}%
      </span>
    </div>
  </div>
</template>
