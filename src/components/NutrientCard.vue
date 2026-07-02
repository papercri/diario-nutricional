<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  value: number
  target: number
  unit: string
  color?: 'emerald' | 'lime' | 'amber'
}>()

const percentage = computed(() => {
  if (props.target <= 0) return 0
  return Math.min((props.value / props.target) * 100, 100)
})

const bgColor = computed(() => {
  if (props.color === 'lime') return 'bg-lime-50 border-lime-200'
  if (props.color === 'amber') return 'bg-amber-50 border-amber-200'
  return 'bg-emerald-50 border-emerald-200'
})

const barColor = computed(() => {
  if (props.color === 'lime') return 'bg-lime-400'
  if (props.color === 'amber') return 'bg-amber-400'
  return 'bg-emerald-400'
})
</script>

<template>
  <div
    class="flex flex-col gap-2 p-4 rounded-2xl border shadow-sm transition-shadow hover:shadow-md"
    :class="bgColor"
  >
    <span class="text-xs font-medium text-slate-500 uppercase tracking-wide">
      {{ label }}
    </span>
    <div class="flex items-baseline gap-1">
      <span class="text-2xl font-bold text-slate-800">
        {{ Math.round(value) }}
      </span>
      <span class="text-sm text-slate-400">/ {{ Math.round(target) }} {{ unit }}</span>
    </div>
    <div class="w-full h-2 bg-white/70 rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-500 ease-out"
        :class="barColor"
        :style="{ width: percentage + '%' }"
      />
    </div>
  </div>
</template>
