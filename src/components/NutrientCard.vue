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

const colorStyles = computed(() => {
  if (props.color === 'lime') {
    return {
      bg: 'background: #f4f8ec; border-color: #d1e0be',
      bar: 'background: #a8b89a',
    }
  }
  if (props.color === 'amber') {
    return {
      bg: 'background: #fdf4dc; border-color: #e8d9b0',
      bar: 'background: #d4a843',
    }
  }
  return {
    bg: 'background: #e8f0e0; border-color: #c0d4a8',
    bar: 'background: #5b7a3d',
  }
})

const ariaLabel = computed(
  () => `${props.label}: ${Math.round(props.value)} de ${Math.round(props.target)} ${props.unit}`,
)
</script>

<template>
  <div
    class="flex flex-col gap-2 p-4 rounded-xl border shadow-sm transition-shadow hover:shadow-md"
    :style="colorStyles.bg"
    role="group"
    :aria-label="ariaLabel"
  >
    <span class="text-xs font-medium uppercase tracking-wide" style="color: var(--clr-text-muted)">
      {{ label }}
    </span>
    <div class="flex items-baseline gap-1">
      <span
        class="font-display"
        style="font-size: 1.5rem; font-weight: 700; color: var(--clr-text)"
      >
        {{ Math.round(value) }}
      </span>
      <span style="font-size: 0.875rem; color: var(--clr-text-faint)">
        / {{ Math.round(target) }} {{ unit }}
      </span>
    </div>
    <div
      class="w-full h-2 rounded-full overflow-hidden"
      style="background: rgba(255, 255, 255, 0.6)"
      role="progressbar"
      :aria-valuenow="Math.round(value)"
      :aria-valuemin="0"
      :aria-valuemax="Math.round(target)"
      :aria-label="label"
    >
      <div
        class="h-full rounded-full transition-all duration-500 ease-out"
        :style="colorStyles.bar + '; width: ' + percentage + '%'"
      />
    </div>
  </div>
</template>
