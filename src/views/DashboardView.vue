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
  breakfast: 'fa-solid fa-sun',
  lunch: 'fa-solid fa-cloud-sun',
  dinner: 'fa-solid fa-moon',
  snack: 'fa-solid fa-cookie',
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
  <main class="max-w-2xl mx-auto px-4 py-8 space-y-8">
    <header class="text-center">
      <h1 class="text-2xl font-bold text-emerald-900 font-display">
        {{
          userStore.isProfileComplete
            ? `¡Bienvenido${userStore.profile.sex === 'female' ? 'a' : ''}, ${userStore.profile.name}!`
            : '¡Bienvenido a Avocato!'
        }}
      </h1>
      <p class="text-sm text-slate-500 capitalize mt-1">{{ todayDate }}</p>
    </header>

    <section
      v-if="!userStore.isProfileComplete"
      class="p-6 rounded-3xl text-center space-y-3"
      style="background: var(--clr-surface-alt); border: 1px solid var(--clr-border)"
      aria-label="Completa tu perfil"
    >
      <p class="text-slate-700">
        Cuéntanos sobre ti para calcular tus metas calóricas personalizadas.
      </p>
      <router-link to="/profile" class="btn btn-primary" role="button">
        Completar perfil
      </router-link>
    </section>

    <section v-else class="space-y-6" aria-label="Resumen nutricional del día">
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

    <section class="space-y-4" aria-label="Comidas registradas hoy">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-slate-800 font-display">Comidas de hoy</h2>
        <button
          v-if="foodStore.todayEntries.length > 0"
          class="btn btn-danger text-xs"
          aria-label="Eliminar todas las comidas de hoy"
          @click="foodStore.clearToday()"
        >
          Limpiar día
        </button>
      </div>

      <div
        v-if="foodStore.todayEntries.length === 0"
        class="text-center py-12 p-8 rounded-3xl bg-gradient-to-br from-lime-50 to-amber-50 border border-lime-200/50"
        role="status"
      >
        <i class="fa-solid fa-utensils text-5xl text-lime-400 block mb-3" aria-hidden="true" />
        <p class="text-slate-600 font-medium">Tu día está vacío</p>
        <p class="text-sm text-slate-400 mt-1">Registra tu primera comida para comenzar</p>
        <router-link to="/search" class="btn btn-primary mt-5" role="button">
          Buscar alimentos
        </router-link>
      </div>

      <div v-else class="space-y-4">
        <article
          v-for="(entries, type) in groupedEntries"
          :key="type"
          class="space-y-2"
          :aria-label="mealTypeLabels[type]"
        >
          <h3 class="flex items-center gap-2 text-sm font-medium text-slate-500 px-1">
            <i :class="mealTypeIcons[type]" aria-hidden="true" />
            <span>{{ mealTypeLabels[type] }}</span>
            <span class="text-xs text-slate-300">
              ({{ entries.reduce((s, e) => s + e.servings, 0).toFixed(1) }} porc.)
            </span>
          </h3>

          <ul class="space-y-2 list-none p-0 m-0">
            <li
              v-for="entry in entries"
              :key="entry.id"
              class="card flex items-center justify-between p-3"
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
                    {{ entry.food.calories.toFixed(0) }} kcal × {{ entry.servings.toFixed(1) }} =
                    {{ Math.round(entry.food.calories * entry.servings) }} kcal
                  </p>
                </div>
              </div>
              <button
                class="btn btn-danger w-8 h-8 p-0 shrink-0"
                :aria-label="`Eliminar ${entry.food.name}`"
                @click="foodStore.removeEntry(entry.id)"
              >
                <i class="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            </li>
          </ul>
        </article>
      </div>
    </section>
  </main>
</template>
