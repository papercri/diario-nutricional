<script setup lang="ts">
import { computed } from 'vue'
import { calcPercentage } from '../utils/nutrition'

const props = defineProps<{
  label: string
  value: number
  target: number
  unit: string
  color?: 'emerald' | 'lime' | 'amber'
}>()

const percentage = computed(() => calcPercentage(props.value, props.target))

const colorStyles = computed(() => {
  if (props.color === 'lime') {
    return {
      bg: 'background: #f4f8ec; border-color: #d1e0be',
      bar: 'background: var(--clr-accent)',
      text: 'color: var(--clr-accent)',
    }
  }
  if (props.color === 'amber') {
    return {
      bg: 'background: var(--clr-secondary-light); border-color: #e8d9b0',
      bar: 'background: var(--clr-secondary)',
      text: 'color: var(--clr-secondary)',
    }
  }
  return {
    bg: 'background: var(--clr-primary-light); border-color: #c0d4a8',
    bar: 'background: var(--clr-primary)',
    text: 'color: var(--clr-primary)',
  }
})

const ariaLabel = computed(
  () => `${props.label}: ${Math.round(props.value)} de ${Math.round(props.target)} ${props.unit}`,
)
</script>

<template>
  <div
    class="flex flex-col gap-2 p-4 rounded-xl border shadow-xs transition-all duration-200 hover:shadow-md"
    :style="colorStyles.bg"
    role="group"
    :aria-label="ariaLabel"
  >
    <span class="text-label-sm">
      {{ label }}
    </span>
    <div class="flex items-baseline gap-1">
      <span class="text-display-sm" :style="colorStyles.text">
        {{ Math.round(value) }}
      </span>
      <span class="text-body">
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
