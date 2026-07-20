<script setup lang="ts">
import { computed } from 'vue'
import { calcPercentage } from '@/utils/nutrition'

const props = defineProps<{
  label: string
  value: number
  target: number
  unit: string
  color?: 'emerald' | 'lime' | 'amber' | 'brown'
}>()

const percentage = computed(() => calcPercentage(props.value, props.target))

const colorStyles = computed(() => {
  if (props.color === 'lime') {
    return {
      bg: 'background: var(--clr-nutrient-lime-bg); border-color: var(--clr-nutrient-lime-border)',
      bar: 'background: var(--clr-accent)',
      text: 'color: var(--clr-accent)',
      justify: 'justify-between',
    }
  }
  if (props.color === 'amber') {
    return {
      bg: 'background: var(--clr-secondary-light); border-color: var(--clr-nutrient-amber-border)',
      bar: 'background: var(--clr-secondary)',
      text: 'color: var(--clr-secondary)',
    }
  }
  if (props.color === 'brown') {
    return {
      bg: 'background: var(--clr-nutrient-brown-bg); border-color: var(--clr-nutrient-brown-border)',
      bar: 'background: var(--clr-nutrient-brown-bar)',
      text: 'color: var(--clr-nutrient-brown-text)',
    }
  }
  return {
    bg: 'background: var(--clr-primary-light); border-color: var(--clr-nutrient-emerald-border)',
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
    class="flex items-center justify-between gap-2 px-2.5 py-1 rounded-md border shadow-xs transition-all duration-200 hover:shadow-md w-full"
    :style="colorStyles.bg"
    role="group"
    :aria-label="ariaLabel"
  >
    <span
      class="text-[10px] sm:text-xs font-semibold uppercase tracking-wide shrink-0 w-14 text-left"
      style="color: var(--clr-text)"
    >
      {{ label }}
    </span>
    <div class="flex-1 mx-2">
      <div
        class="w-full h-1 rounded-full overflow-hidden"
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
    <span class="text-xs sm:text-sm font-bold" :style="colorStyles.text">
      {{ Math.round(value)
      }}<span class="font-bold text-[12px] sm:text-[13px]" style="color: var(--clr-text-faint)"
        >/{{ Math.round(target) }}{{ unit }}</span
      >
    </span>
  </div>
</template>
