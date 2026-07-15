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
  if (percentage.value >= 90) return '#d4a843'
  if (percentage.value >= 70) return '#a8b89a'
  return '#5b7a3d'
})
</script>

<template>
  <div class="flex flex-col items-center gap-2 animate-fade-in-up">
    <div class="relative w-48 h-48">
      <svg class="w-full h-full -rotate-90" viewBox="0 0 200 200">
        <defs>
          <filter id="ring-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          :stroke="'var(--clr-surface-alt)'"
          stroke-width="12"
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
        <span
          class="font-display"
          style="font-size: 2rem; font-weight: 700; color: var(--clr-text)"
        >
          {{ Math.round(consumed) }}
        </span>
        <span style="font-size: 0.875rem; color: var(--clr-text-muted)">
          / {{ Math.round(target) }} kcal
        </span>
        <span
          v-if="remaining > 0"
          style="font-size: 0.75rem; color: var(--clr-text-faint); margin-top: 4px"
        >
          {{ Math.round(remaining) }} restantes
        </span>
        <span
          v-else
          class="font-semibold"
          style="font-size: 0.75rem; color: var(--clr-secondary); margin-top: 4px"
        >
          ¡Meta cumplida!
        </span>
      </div>
    </div>
  </div>
</template>
