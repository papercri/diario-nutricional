<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  consumed: number
  target: number
}>()

const percentage = computed(() => {
  if (props.target <= 0) return 0
  return Math.min((props.consumed / props.target) * 100, 100)
})

const remaining = computed(() => Math.max(props.target - props.consumed, 0))

const circumference = 2 * Math.PI * 90
const strokeDashoffset = computed(() => {
  return circumference - (percentage.value / 100) * circumference
})

const ringColor = computed(() => {
  if (percentage.value >= 90) return '#f59e0b'
  if (percentage.value >= 70) return '#84cc16'
  return '#10b981'
})
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <div class="relative w-48 h-48">
      <svg class="w-full h-full -rotate-90" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="#e5e7eb"
          stroke-width="14"
        />
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          :stroke="ringColor"
          stroke-width="14"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeDashoffset"
          class="transition-all duration-700 ease-out"
        />
      </svg>
      <div
        class="absolute inset-0 flex flex-col items-center justify-center"
      >
        <span class="text-3xl font-bold text-emerald-900">
          {{ Math.round(consumed) }}
        </span>
        <span class="text-sm text-slate-500">/ {{ Math.round(target) }} kcal</span>
        <span
          v-if="remaining > 0"
          class="text-xs text-slate-400 mt-1"
        >
          {{ Math.round(remaining) }} restantes
        </span>
        <span
          v-else
          class="text-xs text-amber-500 font-medium mt-1"
        >
          ¡Meta cumplida!
        </span>
      </div>
    </div>
  </div>
</template>
