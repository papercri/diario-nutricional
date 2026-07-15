<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '../stores/userStore'
import type { ActivityLevel, GoalType, Sex } from '../types/user'

const userStore = useUserStore()

const activityOptions: { value: ActivityLevel; label: string; icon: string }[] = [
  { value: 'sedentary', label: 'Sedentario', icon: 'fa-solid fa-couch' },
  { value: 'light', label: 'Ligero', icon: 'fa-solid fa-person-walking' },
  { value: 'moderate', label: 'Moderado', icon: 'fa-solid fa-person-running' },
  { value: 'active', label: 'Activo', icon: 'fa-solid fa-person-biking' },
  { value: 'very_active', label: 'Muy activo', icon: 'fa-solid fa-fire' },
]

const goalOptions: { value: GoalType; label: string; desc: string; icon: string }[] = [
  { value: 'lose', label: 'Perder peso', desc: 'Déficit calórico', icon: 'fa-solid fa-arrow-down' },
  { value: 'maintain', label: 'Mantener', desc: 'Balance calórico', icon: 'fa-solid fa-equals' },
  { value: 'gain', label: 'Ganar masa', desc: 'Superávit calórico', icon: 'fa-solid fa-arrow-up' },
]

const bmr = computed(() => userStore.goals.bmr)
const tdee = computed(() => userStore.goals.tdee)
const target = computed(() => userStore.goals.targetCalories)
</script>

<template>
  <main class="max-w-2xl mx-auto px-4 py-8 space-y-8">
    <header class="text-center">
      <h1 class="text-2xl font-bold text-emerald-900 font-display">Tu perfil</h1>
      <p class="text-sm text-slate-500 mt-1">
        Tus datos se guardan localmente y nunca se comparten.
      </p>
    </header>

    <form class="space-y-6" @submit.prevent aria-label="Formulario de perfil">
      <fieldset class="space-y-4 p-6 rounded-3xl border-0 m-0 card-elevated">
        <legend class="text-sm font-semibold text-slate-500 uppercase tracking-wide">
          Datos personales
        </legend>

        <div class="space-y-2">
          <label for="profile-name" class="block text-sm font-medium text-slate-700">Nombre</label>
          <input
            id="profile-name"
            v-model="userStore.profile.name"
            type="text"
            placeholder="Tu nombre"
            class="input-field"
            @input="userStore.updateProfile({ name: ($event.target as HTMLInputElement).value })"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label for="profile-age" class="block text-sm font-medium text-slate-700">Edad</label>
            <input
              id="profile-age"
              :value="userStore.profile.age"
              type="number"
              min="10"
              max="120"
              class="input-field"
              @input="
                userStore.updateProfile({ age: Number(($event.target as HTMLInputElement).value) })
              "
            />
          </div>

          <div class="space-y-2">
            <span class="block text-sm font-medium text-slate-700" id="profile-sex-label"
              >Sexo</span
            >
            <div class="flex gap-2" role="radiogroup" aria-labelledby="profile-sex-label">
              <button
                type="button"
                class="btn flex-1"
                :class="
                  userStore.profile.sex === 'female'
                    ? 'btn-primary'
                    : 'btn-secondary border border-amber-200'
                "
                role="radio"
                :aria-checked="userStore.profile.sex === 'female'"
                @click="userStore.updateProfile({ sex: 'female' as Sex })"
              >
                Mujer
              </button>
              <button
                type="button"
                class="btn flex-1"
                :class="
                  userStore.profile.sex === 'male'
                    ? 'btn-primary'
                    : 'btn-secondary border border-amber-200'
                "
                role="radio"
                :aria-checked="userStore.profile.sex === 'male'"
                @click="userStore.updateProfile({ sex: 'male' as Sex })"
              >
                Hombre
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label for="profile-weight" class="block text-sm font-medium text-slate-700"
              >Peso (kg)</label
            >
            <input
              id="profile-weight"
              :value="userStore.profile.weight"
              type="number"
              min="20"
              max="300"
              step="0.1"
              class="input-field"
              @input="
                userStore.updateProfile({
                  weight: Number(($event.target as HTMLInputElement).value),
                })
              "
            />
          </div>

          <div class="space-y-2">
            <label for="profile-height" class="block text-sm font-medium text-slate-700"
              >Altura (cm)</label
            >
            <input
              id="profile-height"
              :value="userStore.profile.height"
              type="number"
              min="50"
              max="250"
              class="input-field"
              @input="
                userStore.updateProfile({
                  height: Number(($event.target as HTMLInputElement).value),
                })
              "
            />
          </div>
        </div>
      </fieldset>

      <fieldset class="space-y-4 p-6 rounded-3xl border-0 m-0 card-elevated">
        <legend class="text-sm font-semibold text-slate-500 uppercase tracking-wide">
          Estilo de vida
        </legend>

        <div class="space-y-2">
          <span class="block text-sm font-medium text-slate-700" id="activity-label"
            >Actividad física</span
          >
          <div
            class="grid grid-cols-1 sm:grid-cols-2 gap-2"
            role="radiogroup"
            aria-labelledby="activity-label"
          >
            <button
              v-for="opt in activityOptions"
              :key="opt.value"
              type="button"
              class="btn text-sm text-left"
              :class="
                userStore.profile.activityLevel === opt.value
                  ? 'btn-primary'
                  : 'btn-secondary border border-amber-200'
              "
              role="radio"
              :aria-checked="userStore.profile.activityLevel === opt.value"
              @click="userStore.updateProfile({ activityLevel: opt.value as ActivityLevel })"
            >
              <i :class="opt.icon" aria-hidden="true" />
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <span class="block text-sm font-medium text-slate-700" id="goal-label">Objetivo</span>
          <div
            class="grid grid-cols-1 sm:grid-cols-3 gap-2"
            role="radiogroup"
            aria-labelledby="goal-label"
          >
            <button
              v-for="opt in goalOptions"
              :key="opt.value"
              type="button"
              class="btn text-sm flex-col"
              :class="
                userStore.profile.goal === opt.value
                  ? 'btn-primary'
                  : 'btn-secondary border border-amber-200'
              "
              role="radio"
              :aria-checked="userStore.profile.goal === opt.value"
              @click="userStore.updateProfile({ goal: opt.value as GoalType })"
            >
              <i :class="opt.icon" aria-hidden="true" />
              <span>{{ opt.label }}</span>
              <span class="text-xs opacity-70">{{ opt.desc }}</span>
            </button>
          </div>
        </div>
      </fieldset>

      <section
        v-if="userStore.isProfileComplete"
        class="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-lime-50 border border-emerald-200 shadow-sm space-y-3"
        aria-label="Tus metas calculadas"
      >
        <h2 class="text-sm font-semibold text-emerald-800 uppercase tracking-wide">
          Tus metas calculadas
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div>
            <p class="text-2xl font-bold text-emerald-700">{{ bmr }}</p>
            <p class="text-xs text-slate-500">TMB (kcal)</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-lime-600">{{ tdee }}</p>
            <p class="text-xs text-slate-500">Gasto total (kcal)</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-amber-600">{{ target }}</p>
            <p class="text-xs text-slate-500">Meta diaria (kcal)</p>
          </div>
        </div>
      </section>

      <div class="flex justify-center">
        <button
          type="button"
          class="btn btn-secondary"
          aria-label="Restablecer todos los valores del perfil"
          @click="userStore.resetProfile()"
        >
          Restablecer valores
        </button>
      </div>
    </form>
  </main>
</template>
