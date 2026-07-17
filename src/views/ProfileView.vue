<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '../stores/userStore'
import { ACTIVITY_OPTIONS, GOAL_OPTIONS } from '../utils/constants'
import { calculateBMI, calculateIdealWeight } from '../utils/bmi'
import { classifyBMI, getBmiBadgeVariant } from '../utils/bmiClassification'
import DsCard from '../components/ui/Card.vue'
import DsInput from '../components/ui/Input.vue'
import DsButton from '../components/ui/Button.vue'
import DsBadge from '../components/ui/Badge.vue'
import DsTypography from '../components/ui/Typography.vue'
import type { ActivityLevel, GoalType, Sex } from '../types/user'

const userStore = useUserStore()

const bmi = computed(() => calculateBMI(userStore.profile.weight, userStore.profile.height))
const bmiLabel = computed(() => classifyBMI(bmi.value))
const bmiBadge = computed(() => getBmiBadgeVariant(bmi.value))
const idealWeight = computed(() => calculateIdealWeight(userStore.profile.height))
const weightDiff = computed(
  () => Math.round((userStore.profile.weight - idealWeight.value) * 10) / 10,
)
const bmr = computed(() => userStore.goals.bmr)
const tdee = computed(() => userStore.goals.tdee)
const target = computed(() => userStore.goals.targetCalories)

const BMI_MIN = 15
const BMI_MAX = 40
const bmiPercent = computed(() => {
  const clamped = Math.min(BMI_MAX, Math.max(BMI_MIN, bmi.value))
  return ((clamped - BMI_MIN) / (BMI_MAX - BMI_MIN)) * 100
})

function onNumberInput(field: 'age' | 'weight' | 'height', value: string | number) {
  const num = Number(value)
  if (!isNaN(num)) {
    userStore.updateProfile({ [field]: num })
  }
}
</script>

<template>
  <main class="profile-page">
    <header class="profile-page__header">
      <h1 class="font-display" style="font-size: 1.5rem; color: var(--clr-text)">
        <i class="fa-solid fa-user" aria-hidden="true" style="color: var(--clr-primary)" />
        Mi perfil
      </h1>
      <p style="font-size: 0.8125rem; color: var(--clr-text-muted)">
        Tus datos se guardan localmente y nunca se comparten.
      </p>
    </header>

    <div class="profile-page__content">
      <!-- Form row: personal data + lifestyle side by side on desktop -->
      <div class="form-row">
        <!-- Datos personales -->
        <DsCard variant="elevated" padding="md" class="form-row__card">
          <h2 class="section-title">
            <i class="fa-solid fa-id-card" aria-hidden="true" />
            Datos personales
          </h2>

          <div class="section-fields">
            <DsInput
              :model-value="userStore.profile.name"
              label="Nombre"
              placeholder="Tu nombre"
              size="sm"
              @update:model-value="userStore.updateProfile({ name: $event as string })"
            />

            <div class="field-row">
              <DsInput
                :model-value="userStore.profile.age"
                label="Edad"
                type="number"
                size="sm"
                @update:model-value="onNumberInput('age', $event)"
              />

              <div class="field-group">
                <span class="field-label">Sexo</span>
                <div class="btn-group" role="radiogroup" aria-label="Sexo biológico">
                  <button
                    type="button"
                    class="btn-toggle btn-toggle--sm"
                    :class="{ 'btn-toggle--active': userStore.profile.sex === 'female' }"
                    role="radio"
                    :aria-checked="userStore.profile.sex === 'female'"
                    @click="userStore.updateProfile({ sex: 'female' as Sex })"
                  >
                    Mujer
                  </button>
                  <button
                    type="button"
                    class="btn-toggle btn-toggle--sm"
                    :class="{ 'btn-toggle--active': userStore.profile.sex === 'male' }"
                    role="radio"
                    :aria-checked="userStore.profile.sex === 'male'"
                    @click="userStore.updateProfile({ sex: 'male' as Sex })"
                  >
                    Hombre
                  </button>
                </div>
              </div>
            </div>

            <div class="field-row">
              <DsInput
                :model-value="userStore.profile.weight"
                label="Peso (kg)"
                type="number"
                size="sm"
                @update:model-value="onNumberInput('weight', $event)"
              />
              <DsInput
                :model-value="userStore.profile.height"
                label="Altura (cm)"
                type="number"
                size="sm"
                @update:model-value="onNumberInput('height', $event)"
              />
            </div>
          </div>
        </DsCard>

        <!-- Estilo de vida -->
        <DsCard variant="elevated" padding="md" class="form-row__card">
          <h2 class="section-title">
            <i class="fa-solid fa-heart-pulse" aria-hidden="true" />
            Estilo de vida
          </h2>

          <div class="section-fields">
            <div class="field-group">
              <span class="field-label">Actividad física</span>
              <div
                class="btn-grid btn-grid--2"
                role="radiogroup"
                aria-label="Nivel de actividad física"
              >
                <button
                  v-for="opt in ACTIVITY_OPTIONS"
                  :key="opt.value"
                  type="button"
                  class="btn-toggle btn-toggle--sm"
                  :class="{ 'btn-toggle--active': userStore.profile.activityLevel === opt.value }"
                  role="radio"
                  :aria-checked="userStore.profile.activityLevel === opt.value"
                  @click="userStore.updateProfile({ activityLevel: opt.value as ActivityLevel })"
                >
                  <i :class="opt.icon" aria-hidden="true" />
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <div class="field-group">
              <span class="field-label">Objetivo</span>
              <div class="btn-grid btn-grid--3" role="radiogroup" aria-label="Objetivo nutricional">
                <button
                  v-for="opt in GOAL_OPTIONS"
                  :key="opt.value"
                  type="button"
                  class="btn-toggle btn-toggle--sm"
                  :class="{ 'btn-toggle--active': userStore.profile.goal === opt.value }"
                  role="radio"
                  :aria-checked="userStore.profile.goal === opt.value"
                  @click="userStore.updateProfile({ goal: opt.value as GoalType })"
                >
                  <i :class="opt.icon" aria-hidden="true" />
                  <span>{{ opt.label }}</span>
                </button>
              </div>
            </div>
          </div>
        </DsCard>
      </div>

      <!-- Resultados calculados -->
      <DsCard variant="warm" padding="md" aria-label="Resultados calculados">
        <h2 class="section-title section-title--primary">
          <i class="fa-solid fa-chart-simple" aria-hidden="true" />
          Tus resultados
        </h2>

        <!-- BMI Card with linear indicator -->
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
              <span>15</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>40</span>
            </div>
          </div>

          <div class="bmi-card__details">
            <div class="bmi-detail">
              <span class="bmi-detail__label">Peso actual</span>
              <span class="bmi-detail__value">{{ userStore.profile.weight }} kg</span>
            </div>
            <div class="bmi-detail">
              <span class="bmi-detail__label">Peso ideal</span>
              <span class="bmi-detail__value">{{ idealWeight }} kg</span>
            </div>
            <div class="bmi-detail">
              <span class="bmi-detail__label">Diferencia</span>
              <span
                class="bmi-detail__value"
                :class="
                  weightDiff > 0
                    ? 'text-accent'
                    : weightDiff < 0
                      ? 'text-secondary'
                      : 'text-primary'
                "
              >
                {{ weightDiff > 0 ? '+' : '' }}{{ weightDiff }} kg
              </span>
            </div>
          </div>
        </div>

        <!-- Calorie metrics grid -->
        <div class="metrics-grid">
          <div class="metric-card">
            <p class="metric-card__value metric-card__value--primary">{{ bmr }}</p>
            <p class="metric-card__label">TMB (kcal)</p>
          </div>
          <div class="metric-card">
            <p class="metric-card__value metric-card__value--accent">{{ tdee }}</p>
            <p class="metric-card__label">Gasto total (kcal)</p>
          </div>
          <div class="metric-card">
            <p class="metric-card__value metric-card__value--secondary">{{ target }}</p>
            <p class="metric-card__label">Meta diaria (kcal)</p>
          </div>
        </div>
      </DsCard>

      <div class="profile-page__reset">
        <DsButton
          variant="danger"
          size="sm"
          icon="fa-solid fa-rotate-left"
          @click="userStore.resetProfile()"
        >
          Restablecer valores
        </DsButton>
      </div>
    </div>
  </main>
</template>

<style scoped>
.profile-page {
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.profile-page__header {
  text-align: center;
  margin-bottom: 1rem;
}

.profile-page__content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.profile-page__reset {
  display: flex;
  justify-content: center;
  padding-top: 0.25rem;
}

/* Form row: side by side on desktop */
.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .form-row {
    flex-direction: row;
    gap: 0.75rem;
  }

  .form-row__card {
    flex: 1;
    min-width: 0;
  }
}

/* Section titles */
.section-title {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--clr-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.section-title i {
  color: var(--clr-accent);
}

.section-title--primary {
  color: var(--clr-primary);
}

.section-title--primary i {
  color: var(--clr-primary);
}

/* Fields */
.section-fields {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.field-label {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--clr-text-muted);
}

/* Button toggles */
.btn-group {
  display: flex;
  gap: 0.25rem;
}

.btn-grid {
  display: grid;
  gap: 0.25rem;
}

.btn-grid--2 {
  grid-template-columns: 1fr 1fr;
}

.btn-grid--3 {
  grid-template-columns: 1fr 1fr 1fr;
}

@media (max-width: 480px) {
  .btn-grid--3 {
    grid-template-columns: 1fr;
  }
}

.btn-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--clr-border);
  background: var(--clr-surface);
  color: var(--clr-text-muted);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  cursor: pointer;
  transition:
    background var(--duration-normal) var(--ease-default),
    color var(--duration-normal) var(--ease-default),
    border-color var(--duration-normal) var(--ease-default);
}

.btn-toggle:hover {
  background: var(--clr-surface-alt);
}

.btn-toggle--active {
  background: var(--clr-primary);
  color: var(--clr-text-inverse);
  border-color: var(--clr-primary);
}

.btn-toggle--active:hover {
  background: var(--clr-primary-hover);
}

.btn-toggle--sm {
  padding: 0.375rem 0.625rem;
  font-size: var(--text-xs);
}

.btn-toggle--col {
  flex-direction: column;
  padding: 0.5rem;
}

.btn-toggle__desc {
  font-size: 0.625rem;
  opacity: 0.7;
}

/* BMI Card */
.bmi-card {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border-subtle);
  border-radius: var(--radius-lg);
  padding: 0.875rem;
  margin-bottom: 0.75rem;
}

.bmi-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.625rem;
}

/* BMI Linear Gauge */
.bmi-gauge {
  margin-bottom: 0.75rem;
}

.bmi-gauge__bar {
  position: relative;
  height: 1.5rem;
  margin-bottom: 0.375rem;
}

.bmi-gauge__track {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-full);
  background: linear-gradient(
    to right,
    #22c55e 0%,
    #22c55e 14%,
    #84cc16 14%,
    #84cc16 28%,
    #eab308 28%,
    #eab308 42%,
    #f97316 42%,
    #f97316 56%,
    #ef4444 56%,
    #ef4444 100%
  );
}

.bmi-gauge__indicator {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.bmi-gauge__pill {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.25rem;
  height: 1.5rem;
  padding: 0 0.375rem;
  border-radius: var(--radius-full);
  background: var(--clr-surface);
  color: var(--clr-text);
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.15),
    0 0 0 2px var(--clr-surface);
  white-space: nowrap;
}

.bmi-gauge__labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.5625rem;
  color: var(--clr-text-faint);
  padding: 0 0.125rem;
}

.bmi-card__details {
  display: flex;
  gap: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--clr-border-subtle);
}

.bmi-detail {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.bmi-detail__label {
  font-size: 0.625rem;
  color: var(--clr-text-faint);
}

.bmi-detail__value {
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  color: var(--clr-text);
}

.text-primary {
  color: var(--clr-primary);
}

.text-accent {
  color: var(--clr-accent);
}

.text-secondary {
  color: var(--clr-secondary);
}

/* Metrics grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

@media (max-width: 480px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}

.metric-card {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border-subtle);
  border-radius: var(--radius-lg);
  padding: 0.75rem;
  text-align: center;
}

.metric-card__value {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1;
  margin: 0 0 0.25rem 0;
}

.metric-card__value--primary {
  color: var(--clr-primary);
}

.metric-card__value--accent {
  color: var(--clr-accent);
}

.metric-card__value--secondary {
  color: var(--clr-secondary);
}

.metric-card__label {
  font-size: 0.625rem;
  color: var(--clr-text-muted);
  margin: 0;
}
</style>
