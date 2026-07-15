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
  <div class="flex flex-col items-center gap-3 animate-fade-in-up">
    <div class="relative w-52 h-52 sm:w-56 sm:h-56">
      <svg class="w-full h-full -rotate-90" viewBox="0 0 200 200">
        <defs>
          <filter id="ring-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <!-- Track -->
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="var(--clr-surface-alt)"
          stroke-width="10"
          opacity="0.8"
        />
        <!-- Progress -->
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          :stroke="ringColor"
          stroke-width="10"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeDashoffset"
          filter="url(#ring-glow)"
          class="transition-all duration-700 ease-out"
        />
      </svg>
      <!-- Center content -->
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-display-xl">
          {{ Math.round(consumed) }}
        </span>
        <span class="text-body">/ {{ Math.round(target) }} kcal</span>
        <span v-if="remaining > 0" class="text-body-sm mt-1">
          {{ Math.round(remaining) }} restantes
        </span>
        <span v-else class="text-body-sm mt-1 font-semibold" style="color: var(--clr-secondary)">
          ¡Meta cumplida!
        </span>
      </div>
    </div>
  </div>
</template>
