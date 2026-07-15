<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '../stores/userStore'
import type { ActivityLevel, GoalType, Sex } from '../types/user'

const userStore = useUserStore()

const activityOptions: { value: ActivityLevel; label: string }[] = [
  { value: 'sedentary', label: 'Sedentario' },
  { value: 'light', label: 'Ligero' },
  { value: 'moderate', label: 'Moderado' },
  { value: 'active', label: 'Activo' },
  { value: 'very_active', label: 'Muy activo' },
]

const goalOptions: { value: GoalType; label: string; desc: string }[] = [
  { value: 'lose', label: 'Perder peso', desc: 'Déficit calórico' },
  { value: 'maintain', label: 'Mantener', desc: 'Balance calórico' },
  { value: 'gain', label: 'Ganar masa', desc: 'Superávit calórico' },
]

const bmr = computed(() => userStore.goals.bmr)
const tdee = computed(() => userStore.goals.tdee)
const target = computed(() => userStore.goals.targetCalories)
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8 space-y-8">
    <header class="text-center">
      <h1 class="text-2xl font-bold text-emerald-900 font-display">Tu perfil</h1>
      <p class="text-sm text-slate-500 mt-1">
        Tus datos se guardan localmente y nunca se comparten.
      </p>
    </header>

    <form class="space-y-6" @submit.prevent>
      <section class="space-y-4 p-6 rounded-3xl bg-white border border-amber-100 shadow-sm">
        <h2 class="text-sm font-semibold text-slate-500 uppercase tracking-wide">
          Datos personales
        </h2>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">Nombre</label>
          <input
            v-model="userStore.profile.name"
            type="text"
            placeholder="Tu nombre"
            class="w-full px-4 py-3 rounded-2xl border border-amber-200 bg-amber-50/50 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            @input="userStore.updateProfile({ name: ($event.target as HTMLInputElement).value })"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">Edad</label>
            <input
              :value="userStore.profile.age"
              type="number"
              min="10"
              max="120"
              class="w-full px-4 py-3 rounded-2xl border border-amber-200 bg-amber-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
              @input="
                userStore.updateProfile({ age: Number(($event.target as HTMLInputElement).value) })
              "
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">Sexo</label>
            <div class="flex gap-2">
              <button
                type="button"
                class="flex-1 py-3 rounded-2xl text-sm font-medium transition-all"
                :class="
                  userStore.profile.sex === 'female'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-amber-50 text-slate-600 hover:bg-amber-100 border border-amber-200'
                "
                @click="userStore.updateProfile({ sex: 'female' as Sex })"
              >
                Mujer
              </button>
              <button
                type="button"
                class="flex-1 py-3 rounded-2xl text-sm font-medium transition-all"
                :class="
                  userStore.profile.sex === 'male'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-amber-50 text-slate-600 hover:bg-amber-100 border border-amber-200'
                "
                @click="userStore.updateProfile({ sex: 'male' as Sex })"
              >
                Hombre
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">Peso (kg)</label>
            <input
              :value="userStore.profile.weight"
              type="number"
              min="20"
              max="300"
              step="0.1"
              class="w-full px-4 py-3 rounded-2xl border border-amber-200 bg-amber-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
              @input="
                userStore.updateProfile({
                  weight: Number(($event.target as HTMLInputElement).value),
                })
              "
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">Altura (cm)</label>
            <input
              :value="userStore.profile.height"
              type="number"
              min="50"
              max="250"
              class="w-full px-4 py-3 rounded-2xl border border-amber-200 bg-amber-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
              @input="
                userStore.updateProfile({
                  height: Number(($event.target as HTMLInputElement).value),
                })
              "
            />
          </div>
        </div>
      </section>

      <section class="space-y-4 p-6 rounded-3xl bg-white border border-amber-100 shadow-sm">
        <h2 class="text-sm font-semibold text-slate-500 uppercase tracking-wide">Estilo de vida</h2>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">Actividad física</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              v-for="opt in activityOptions"
              :key="opt.value"
              type="button"
              class="py-3 px-4 rounded-2xl text-sm font-medium transition-all text-left"
              :class="
                userStore.profile.activityLevel === opt.value
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-amber-50 text-slate-600 hover:bg-amber-100 border border-amber-200'
              "
              @click="userStore.updateProfile({ activityLevel: opt.value as ActivityLevel })"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">Objetivo</label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              v-for="opt in goalOptions"
              :key="opt.value"
              type="button"
              class="py-3 px-4 rounded-2xl text-sm font-medium transition-all"
              :class="
                userStore.profile.goal === opt.value
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-amber-50 text-slate-600 hover:bg-amber-100 border border-amber-200'
              "
              @click="userStore.updateProfile({ goal: opt.value as GoalType })"
            >
              <span class="block">{{ opt.label }}</span>
              <span class="block text-xs opacity-70">{{ opt.desc }}</span>
            </button>
          </div>
        </div>
      </section>

      <section
        v-if="userStore.isProfileComplete"
        class="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-lime-50 border border-emerald-200 shadow-sm space-y-3"
      >
        <h2 class="text-sm font-semibold text-emerald-800 uppercase tracking-wide">
          Tus metas calculadas
        </h2>
        <div class="grid grid-cols-3 gap-4 text-center">
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
          class="px-6 py-3 rounded-2xl text-sm font-medium bg-amber-100 text-slate-600 hover:bg-amber-200 transition-colors"
          @click="userStore.resetProfile()"
        >
          Restablecer valores
        </button>
      </div>
    </form>
  </div>
</template>
