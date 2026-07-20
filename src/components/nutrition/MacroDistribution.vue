<script setup lang="ts">
import type { MacroValue } from '@/types/nutrition'
import Card from '@/components/ui/Card.vue'

defineProps<{
  protein: MacroValue
  carbohydrates: MacroValue
  fat: MacroValue
}>()

const macros = [
  {
    key: 'protein',
    label: 'Proteínas',
    icon: ['fas', 'drumstick-bite'] as [string, string],
    color: 'var(--clr-primary)',
  },
  {
    key: 'carbohydrates',
    label: 'Carbohidratos',
    icon: ['fas', 'bread-slice'] as [string, string],
    color: 'var(--clr-accent)',
  },
  { key: 'fat', label: 'Grasas', icon: ['fas', 'droplet'] as [string, string], color: 'var(--clr-secondary)' },
] as const
</script>

<template>
  <Card variant="surface" padding="md">
    <h3 class="ds-section-title">
      <font-awesome-icon :icon="['fas', 'chart-pie']" class="ds-section-title--accent" aria-hidden="true" />
      Macros
    </h3>

    <div class="macro-grid">
      <div v-for="macro in macros" :key="macro.key" class="macro-item">
        <div class="macro-item__header">
          <font-awesome-icon
            :icon="macro.icon"
            class="macro-item__icon"
            :style="{ color: macro.color }"
            aria-hidden="true"
          />
          <span class="macro-item__label">{{ macro.label }}</span>
        </div>

        <div class="macro-item__bar-track">
          <div
            class="macro-item__bar-fill"
            :style="{
              width: `${macro.key === 'protein' ? protein.percentage : macro.key === 'carbohydrates' ? carbohydrates.percentage : fat.percentage}%`,
              background: macro.color,
            }"
          />
        </div>

        <div class="macro-item__values">
          <span class="macro-item__grams">
            {{
              macro.key === 'protein'
                ? protein.grams
                : macro.key === 'carbohydrates'
                  ? carbohydrates.grams
                  : fat.grams
            }}g
          </span>
          <span class="macro-item__detail">
            {{
              macro.key === 'protein'
                ? protein.calories
                : macro.key === 'carbohydrates'
                  ? carbohydrates.calories
                  : fat.calories
            }}
            kcal ·
            {{
              macro.key === 'protein'
                ? protein.percentage
                : macro.key === 'carbohydrates'
                  ? carbohydrates.percentage
                  : fat.percentage
            }}%
          </span>
        </div>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.macro-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.macro-item__header {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.25rem;
}

.macro-item__icon {
  font-size: var(--text-xs);
  width: 0.875rem;
  text-align: center;
}

.macro-item__label {
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  color: var(--clr-text);
}

.macro-item__bar-track {
  width: 100%;
  height: 0.375rem;
  border-radius: var(--radius-full);
  background: var(--clr-surface-alt);
  overflow: hidden;
}

.macro-item__bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.6s var(--ease-default);
}

.macro-item__values {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 0.125rem;
}

.macro-item__grams {
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  color: var(--clr-text);
}

.macro-item__detail {
  font-size: 0.675rem;
  color: var(--clr-text-faint);
}
</style>
