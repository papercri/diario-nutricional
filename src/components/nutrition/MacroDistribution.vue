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
    icon: 'fa-solid fa-drumstick-bite',
    color: 'var(--clr-primary)',
  },
  {
    key: 'carbohydrates',
    label: 'Carbohidratos',
    icon: 'fa-solid fa-bread-slice',
    color: 'var(--clr-accent)',
  },
  { key: 'fat', label: 'Grasas', icon: 'fa-solid fa-droplet', color: 'var(--clr-secondary)' },
] as const
</script>

<template>
  <Card variant="surface" padding="lg">
    <h3 class="macro-title">
      <i class="fa-solid fa-chart-pie" aria-hidden="true" />
      Distribución de macronutrientes
    </h3>

    <div class="macro-grid">
      <div v-for="macro in macros" :key="macro.key" class="macro-item">
        <div class="macro-item__header">
          <i
            :class="macro.icon"
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
.macro-title {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--clr-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.macro-title i {
  color: var(--clr-accent);
}

.macro-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.macro-item__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
}

.macro-item__icon {
  font-size: var(--text-sm);
  width: 1rem;
  text-align: center;
}

.macro-item__label {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--clr-text);
}

.macro-item__bar-track {
  width: 100%;
  height: 0.5rem;
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
  margin-top: 0.25rem;
}

.macro-item__grams {
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--clr-text);
}

.macro-item__detail {
  font-size: var(--text-xs);
  color: var(--clr-text-faint);
}
</style>
