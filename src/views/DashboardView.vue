<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useFoodStore } from '../stores/foodStore'
import CalorieRing from '../components/CalorieRing.vue'
import NutrientCard from '../components/NutrientCard.vue'
import type { MealEntry } from '../types/food'

const userStore = useUserStore()
const foodStore = useFoodStore()

const todayDate = computed(() => {
  return new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const mealTypeLabels: Record<string, string> = {
  breakfast: 'Desayuno',
  lunch: 'Comida',
  dinner: 'Cena',
  snack: 'Snack',
}

const mealTypeIcons: Record<string, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍪',
}

const groupedEntries = computed(() => {
  const groups: Record<string, MealEntry[]> = {}
  for (const entry of foodStore.todayEntries) {
    if (!groups[entry.mealType]) {
      groups[entry.mealType] = []
    }
    groups[entry.mealType].push(entry)
  }
  return groups
})
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8 space-y-8">
    <header class="text-center">
      <h1 class="text-2xl font-bold text-emerald-900">
        {{ userStore.isProfileComplete
          ? `¡Bienvenido${userStore.profile.sex === 'female' ? 'a' : ''}, ${userStore.profile.name}!`
          : '¡Bienvenido a Avocato!' }}
      </h1>
      <p class="text-sm text-slate-500 capitalize mt-1">{{ todayDate }}</p>
    </header>

    <section
      v-if="!userStore.isProfileComplete"
      class="p-6 rounded-3xl bg-amber-50 border border-amber-200 text-center space-y-3"
    >
      <p class="text-slate-700">
        Cuéntanos sobre ti para calcular tus metas calóricas personalizadas.
      </p>
      <router-link
        to="/profile"
        class="inline-block px-6 py-3 rounded-2xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors shadow-sm"
      >
        Completar perfil
      </router-link>
    </section>

    <section v-else class="space-y-6">
      <CalorieRing
        :consumed="foodStore.todaySummary.calories"
        :target="userStore.goals.targetCalories"
      />

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <NutrientCard
          label="Proteínas"
          :value="foodStore.todaySummary.protein"
          :target="userStore.goals.proteinGrams"
          unit="g"
          color="emerald"
        />
        <NutrientCard
          label="Carbohidratos"
          :value="foodStore.todaySummary.carbs"
          :target="userStore.goals.carbGrams"
          unit="g"
          color="lime"
        />
        <NutrientCard
          label="Grasas"
          :value="foodStore.todaySummary.fat"
          :target="userStore.goals.fatGrams"
          unit="g"
          color="amber"
        />
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-slate-800">Comidas de hoy</h2>
        <button
          v-if="foodStore.todayEntries.length > 0"
          class="text-xs text-slate-400 hover:text-red-500 transition-colors"
          @click="foodStore.clearToday()"
        >
          Limpiar día
        </button>
      </div>

      <div v-if="foodStore.todayEntries.length === 0" class="text-center py-12">
        <span class="text-5xl">🍽️</span>
        <p class="text-slate-400 mt-4">Aún no has registrado comidas</p>
        <router-link
          to="/search"
          class="inline-block mt-4 px-6 py-3 rounded-2xl bg-lime-500 text-white font-medium hover:bg-lime-600 transition-colors shadow-sm"
        >
          Buscar alimentos
        </router-link>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="(entries, type) in groupedEntries"
          :key="type"
          class="space-y-2"
        >
          <h3 class="flex items-center gap-2 text-sm font-medium text-slate-500 px-1">
            <span>{{ mealTypeIcons[type] }}</span>
            <span>{{ mealTypeLabels[type] }}</span>
            <span class="text-xs text-slate-300">
              ({{ entries.reduce((s, e) => s + e.servings, 0).toFixed(1) }} porc.)
            </span>
          </h3>

          <div
            v-for="entry in entries"
            :key="entry.id"
            class="flex items-center justify-between p-3 rounded-2xl bg-white border border-amber-100 shadow-sm"
          >
            <div class="flex items-center gap-3 min-w-0">
              <img
                v-if="entry.food.imageUrl"
                :src="entry.food.imageUrl"
                :alt="entry.food.name"
                class="w-10 h-10 rounded-xl object-cover shrink-0"
                loading="lazy"
              />
              <div class="min-w-0">
                <p class="text-sm font-medium text-slate-800 truncate">
                  {{ entry.food.name }}
                </p>
                <p class="text-xs text-slate-400">
                  {{ entry.food.calories.toFixed(0) }} kcal × {{ entry.servings.toFixed(1) }}
                  = {{ Math.round(entry.food.calories * entry.servings) }} kcal
                </p>
              </div>
            </div>
            <button
              class="shrink-0 w-8 h-8 rounded-xl text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors flex items-center justify-center"
              @click="foodStore.removeEntry(entry.id)"
              title="Eliminar"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
