<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useFoodStore } from '../stores/foodStore'
import CalorieRing from '../components/CalorieRing.vue'
import NutrientCard from '../components/NutrientCard.vue'
import { groupEntriesByMealType, sumServings } from '../utils/nutrition'
import { formatDateEs, formatCalorieEntry } from '../utils/formatting'
import { MEAL_TYPE_LABELS, MEAL_TYPE_ICONS } from '../utils/constants'

const userStore = useUserStore()
const foodStore = useFoodStore()

const todayDate = computed(() => formatDateEs(new Date()))

const groupedEntries = computed(() => groupEntriesByMealType(foodStore.todayEntries))
</script>

<template>
  <main class="max-w-2xl mx-auto px-4 py-8 space-y-8">
    <header class="text-center">
      <h1 class="font-display" style="font-size: 1.75rem; color: var(--clr-text)">
        {{
          userStore.isProfileComplete
            ? `¡Bienvenido${userStore.profile.sex === 'female' ? 'a' : ''}, ${userStore.profile.name}!`
            : '¡Bienvenido a Avocato!'
        }}
      </h1>
      <p class="capitalize mt-1" style="font-size: 0.875rem; color: var(--clr-text-muted)">
        {{ todayDate }}
      </p>
    </header>

    <section
      v-if="!userStore.isProfileComplete"
      class="p-6 rounded-2xl text-center space-y-3"
      style="background: var(--clr-surface-alt); border: 1px solid var(--clr-border)"
      aria-label="Completa tu perfil"
    >
      <p style="color: var(--clr-text-muted)">
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
        <h2 class="font-display" style="font-size: 1.25rem; color: var(--clr-text)">
          Comidas de hoy
        </h2>
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
        class="text-center py-12 p-8 rounded-2xl"
        style="background: var(--clr-primary-light); border: 1px solid var(--clr-border)"
        role="status"
      >
        <i
          class="fa-solid fa-utensils text-5xl block mb-3"
          aria-hidden="true"
          style="color: var(--clr-primary); opacity: 0.5"
        />
        <p class="font-medium" style="color: var(--clr-text-muted)">Tu día está vacío</p>
        <p style="font-size: 0.875rem; color: var(--clr-text-faint); margin-top: 4px">
          Registra tu primera comida para comenzar
        </p>
        <router-link to="/search" class="btn btn-primary mt-5" role="button">
          Buscar alimentos
        </router-link>
      </div>

      <div v-else class="space-y-4">
        <article
          v-for="(entries, type) in groupedEntries"
          :key="type"
          class="space-y-2"
          :aria-label="MEAL_TYPE_LABELS[type]"
        >
          <h3
            class="flex items-center gap-2 text-sm font-medium px-1"
            style="color: var(--clr-text-muted)"
          >
            <i :class="MEAL_TYPE_ICONS[type]" aria-hidden="true" />
            <span>{{ MEAL_TYPE_LABELS[type] }}</span>
            <span style="font-size: 0.75rem; color: var(--clr-text-faint)">
              ({{ sumServings(entries).toFixed(1) }} porc.)
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
                  class="w-10 h-10 rounded-lg object-cover shrink-0"
                  loading="lazy"
                />
                <div class="min-w-0">
                  <p class="text-sm font-medium truncate" style="color: var(--clr-text)">
                    {{ entry.food.name }}
                  </p>
                  <p style="font-size: 0.75rem; color: var(--clr-text-faint)">
                    {{ formatCalorieEntry(entry.food.calories, entry.servings) }}
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
