<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import DsCard from '@/components/ui/Card.vue'
import DsInput from '@/components/ui/Input.vue'
import DsButton from '@/components/ui/Button.vue'
import DsBadge from '@/components/ui/Badge.vue'
import DsTypography from '@/components/ui/Typography.vue'
import { ACTIVITY_OPTIONS, GOAL_OPTIONS } from '@/utils/constants'
import { calculateBMI, calculateIdealWeight } from '@/utils/bmi'
import { classifyBMI, getBmiBadgeVariant } from '@/utils/bmiClassification'
import type { ActivityLevel, GoalType, Sex } from '@/types/user'

const userStore = useUserStore()

const bmi = computed(() => calculateBMI(userStore.profile.weight, userStore.profile.height))
const bmiLabel = computed(() => classifyBMI(bmi.value))
const bmiBadge = computed(() => getBmiBadgeVariant(bmi.value))
const idealWeight = computed(() => calculateIdealWeight(userStore.profile.height))
const weightDiff = computed(
  () => Math.round((userStore.profile.weight - userStore.profile.desiredWeight) * 10) / 10,
)
const bmr = computed(() => userStore.goals.bmr)
const tdee = computed(() => userStore.goals.tdee)
const target = computed(() => userStore.goals.targetCalories)
const timeToGoalMonths = computed(() => userStore.goals.timeToGoalMonths)

const BMI_MIN = 15
const BMI_MAX = 40
const bmiPercent = computed(() => {
  const clamped = Math.min(BMI_MAX, Math.max(BMI_MIN, bmi.value))
  return ((clamped - BMI_MIN) / (BMI_MAX - BMI_MIN)) * 100
})

function onNumberInput(field: 'age' | 'weight' | 'height' | 'desiredWeight', value: string | number) {
  const num = Number(value)
  if (!isNaN(num)) {
    userStore.updateProfile({ [field]: num })
  }
}
</script>

<template>
  <main class="dash">
    <header class="dash__header">
      <div class="dash__title-row">
        <h1 class="text-display-lg">
          <font-awesome-icon
            :icon="['fas', 'user']"
            aria-hidden="true"
            style="color: var(--clr-primary)"
          />
          Mi perfil
        </h1>
        <router-link to="/" class="btn btn-primary btn-sm">
          <font-awesome-icon :icon="['fas', 'house']" aria-hidden="true" />
          Mi día
        </router-link>
      </div>
      <p class="text-body-sm">Rellena tus datos y marca tu objetivo nutricional.</p>
    </header>

    <div class="form-row">
      <DsCard variant="elevated" padding="md" class="form-row__card">
        <h2 class="section-title">
          <font-awesome-icon :icon="['fas', 'id-card']" aria-hidden="true" />
          Datos personales
        </h2>
        <div class="section-fields">
          <DsInput :model-value="userStore.profile.name" label="Nombre" placeholder="Tu nombre" size="sm" @update:model-value="userStore.updateProfile({ name: $event as string })" />
          <div class="field-row">
            <DsInput :model-value="userStore.profile.age" label="Edad" type="number" size="sm" @update:model-value="onNumberInput('age', $event)" />
            <div class="field-group">
              <span class="field-label">Sexo biológico</span>
              <div class="btn-group" role="radiogroup" aria-label="Sexo biológico">
                <button type="button" class="btn-toggle btn-toggle--sm" :class="{ 'btn-toggle--active': userStore.profile.sex === 'female' }" role="radio" :aria-checked="userStore.profile.sex === 'female'" @click="userStore.updateProfile({ sex: 'female' as Sex })">Mujer</button>
                <button type="button" class="btn-toggle btn-toggle--sm" :class="{ 'btn-toggle--active': userStore.profile.sex === 'male' }" role="radio" :aria-checked="userStore.profile.sex === 'male'" @click="userStore.updateProfile({ sex: 'male' as Sex })">Hombre</button>
              </div>
            </div>
          </div>
          <div class="field-row">
            <DsInput :model-value="userStore.profile.weight" label="Peso (kg)" type="number" size="sm" @update:model-value="onNumberInput('weight', $event)" />
            <DsInput :model-value="userStore.profile.height" label="Altura (cm)" type="number" size="sm" @update:model-value="onNumberInput('height', $event)" />
            <DsInput :model-value="userStore.profile.desiredWeight" label="Peso deseado (kg)" type="number" size="sm" @update:model-value="onNumberInput('desiredWeight', $event)" />
          </div>
        </div>
      </DsCard>

      <DsCard variant="elevated" padding="md" class="form-row__card">
        <h2 class="section-title">
          <font-awesome-icon :icon="['fas', 'heart-pulse']" aria-hidden="true" />
          Estilo de vida
        </h2>
        <div class="section-fields">
          <div class="field-group">
            <span class="field-label">Actividad física</span>
            <div class="btn-grid btn-grid--2" role="radiogroup" aria-label="Nivel de actividad física">
              <button v-for="opt in ACTIVITY_OPTIONS" :key="opt.value" type="button" class="btn-toggle btn-toggle--sm" :class="{ 'btn-toggle--active': userStore.profile.activityLevel === opt.value }" role="radio" :aria-checked="userStore.profile.activityLevel === opt.value" @click="userStore.updateProfile({ activityLevel: opt.value as ActivityLevel })">
                <font-awesome-icon :icon="opt.icon" aria-hidden="true" />
                {{ opt.label }}
              </button>
            </div>
          </div>
          <div class="field-group">
            <span class="field-label">Objetivo</span>
            <div class="btn-grid btn-grid--3" role="radiogroup" aria-label="Objetivo nutricional">
              <button v-for="opt in GOAL_OPTIONS" :key="opt.value" type="button" class="btn-toggle btn-toggle--sm" :class="{ 'btn-toggle--active': userStore.profile.goal === opt.value }" role="radio" :aria-checked="userStore.profile.goal === opt.value" @click="userStore.updateProfile({ goal: opt.value as GoalType })">
                <font-awesome-icon :icon="opt.icon" aria-hidden="true" />
                <span>{{ opt.label }}</span>
              </button>
            </div>
          </div>
        </div>
      </DsCard>
    </div>

    <DsCard variant="warm" padding="md" aria-label="Resultados calculados">
      <h2 class="section-title section-title--primary">
        <font-awesome-icon :icon="['fas', 'chart-simple']" aria-hidden="true" />
        Mis resultados
      </h2>

      <div class="metrics-grid">
        <div class="metric-card"><p class="metric-card__value metric-card__value--primary">{{ bmr }}</p><p class="metric-card__label">Metabolismo basal (kcal)</p></div>
        <div class="metric-card"><p class="metric-card__value metric-card__value--accent">{{ tdee }}</p><p class="metric-card__label">Gasto total (kcal)</p></div>
        <div class="metric-card"><p class="metric-card__value metric-card__value--secondary">{{ target }}</p><p class="metric-card__label">Meta diaria (kcal)</p></div>
      </div>

      <div class="bmi-card">
        <div class="bmi-card__header">
          <DsTypography variant="label-sm" color="muted">IMC</DsTypography>
          <DsBadge :variant="bmiBadge" size="sm" dot>{{ bmiLabel }}</DsBadge>
        </div>
        <div class="bmi-gauge">
          <div class="bmi-gauge__bar">
            <div class="bmi-gauge__track" />
            <div class="bmi-gauge__indicator" :style="{ left: `${bmiPercent}%` }">
              <span class="bmi-gauge__pill">{{ bmi }}</span>
            </div>
          </div>
          <div class="bmi-gauge__labels">
            <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
          </div>
        </div>
        <div class="bmi-card__details">
          <div class="bmi-detail"><span class="bmi-detail__label">Peso actual</span><span class="bmi-detail__value">{{ userStore.profile.weight }} kg</span></div>
          <div class="bmi-detail"><span class="bmi-detail__label">Peso ideal</span><span class="bmi-detail__value">{{ idealWeight }} kg</span></div>
          <div class="bmi-detail"><span class="bmi-detail__label">Peso deseado</span><span class="bmi-detail__value">{{ userStore.profile.desiredWeight }} kg</span></div>
          <div class="bmi-detail">
            <span class="bmi-detail__label">Kg de sobrepeso</span>
            <span class="bmi-detail__value" :class="weightDiff > 0 ? 'text-accent' : weightDiff < 0 ? 'text-secondary' : 'text-primary'">
              {{ weightDiff > 0 ? '+' : '' }}{{ weightDiff }} kg
            </span>
          </div>
          <div v-if="timeToGoalMonths > 0" class="bmi-detail"><span class="bmi-detail__label">Tiempo estimado</span><span class="bmi-detail__value">{{ timeToGoalMonths }} meses</span></div>
        </div>
      </div>
    </DsCard>

    <div class="profile-page__reset">
      <DsButton variant="danger" size="sm" :icon="['fas', 'rotate-left']" @click="userStore.resetProfile()">Restablecer valores</DsButton>
    </div>
  </main>
</template>

<style scoped>
.dash {
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
  padding-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.dash__header { text-align: center; margin-bottom: 0.125rem; }

.dash__title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .form-row {
    flex-direction: row;
    align-items: stretch;
  }
  .form-row__card {
    flex: 1;
  }
}

.section-title {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--clr-text);
  margin: 0 0 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.section-title--primary {
  color: var(--clr-primary);
}

.section-fields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.field-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.field-row > * {
  flex: 1;
  min-width: 0;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.field-label {
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  color: var(--clr-text-muted);
}

.btn-group {
  display: flex;
  gap: 0.375rem;
}

.btn-grid {
  display: grid;
  gap: 0.375rem;
}

.btn-grid--2 {
  grid-template-columns: 1fr 1fr;
}

.btn-grid--3 {
  grid-template-columns: 1fr 1fr 1fr;
}

.btn-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.625rem 0.875rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--clr-border);
  background: var(--clr-surface);
  color: var(--clr-text-muted);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 11.5px;
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-default), color var(--duration-fast) var(--ease-default), border-color var(--duration-fast) var(--ease-default);
}

.btn-toggle:hover {
  border-color: var(--clr-border-strong);
  background: var(--clr-surface-alt);
}

.btn-toggle:focus-visible {
  outline: 2px solid var(--clr-focus-ring);
  outline-offset: 2px;
}

.btn-toggle--sm {
  padding: 0.625rem 0.875rem;
  font-size: 0.75rem;
  line-height: 11.5px;
}

.btn-toggle--active {
  background: var(--clr-primary);
  color: var(--clr-text-inverse);
  border-color: var(--clr-primary);
}

.btn-toggle--active:hover {
  background: var(--clr-primary-hover);
  border-color: var(--clr-primary-hover);
  color: var(--clr-text-inverse);
}

/* BMI card */
.bmi-card {
  margin-bottom: 1rem;
}

.bmi-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.bmi-gauge {
  margin-bottom: 0.75rem;
}

.bmi-gauge__bar {
  position: relative;
  height: 0.5rem;
  border-radius: var(--radius-full);
  overflow: visible;
}

.bmi-gauge__track {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-full);
  background: linear-gradient(to right, var(--clr-bmi-underweight), var(--clr-bmi-normal), var(--clr-bmi-overweight), var(--clr-bmi-obese), var(--clr-bmi-extreme));
}

.bmi-gauge__indicator {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.bmi-gauge__pill {
  display: block;
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-full);
  background: var(--clr-text);
  color: var(--clr-text-inverse);
  font-size: 0.625rem;
  font-weight: var(--weight-bold);
  white-space: nowrap;
  text-align: center;
}

.bmi-gauge__labels {
  display: flex;
  justify-content: space-between;
  margin-top: 0.25rem;
  font-size: 0.5625rem;
  color: var(--clr-text-faint);
}

.bmi-card__details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.375rem;
}

.bmi-detail {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0.5rem;
  background: var(--clr-surface-alt);
  border-radius: var(--radius-md);
}

.bmi-detail__label {
  font-size: var(--text-xs);
  color: var(--clr-text-muted);
}

.bmi-detail__value {
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--clr-text);
}

.text-accent { color: var(--clr-accent); }
.text-secondary { color: var(--clr-secondary); }
.text-primary { color: var(--clr-primary); }

/* Metrics grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.metric-card {
  text-align: center;
  padding: 0.625rem 0.25rem;
  background: var(--clr-surface);
  border: 1px solid var(--clr-border-subtle);
  border-radius: var(--radius-lg);
}

.metric-card__value {
  display: block;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: var(--weight-bold);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.metric-card__value--primary { color: var(--clr-primary); }
.metric-card__value--accent { color: var(--clr-accent); }
.metric-card__value--secondary { color: var(--clr-secondary); }

.metric-card__label {
  font-size: 0.625rem;
  color: var(--clr-text-faint);
}

.profile-page__reset {
  display: flex;
  justify-content: center;
  padding-top: 0.5rem;
}
</style>
