<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useFoodStore } from '../stores/foodStore'
import CalorieRing from '../components/CalorieRing.vue'
import NutrientCard from '../components/NutrientCard.vue'
import { groupEntriesByMealType } from '../utils/nutrition'
import { formatDateEs } from '../utils/formatting'
import { MEAL_TYPE_LABELS, MEAL_TYPE_ICONS } from '../utils/constants'
import type { MealType } from '../types/user'

const userStore = useUserStore()
const foodStore = useFoodStore()

const todayDate = computed(() => formatDateEs(new Date()))
const groupedEntries = computed(() => groupEntriesByMealType(foodStore.todayEntries))

const mealsOpen = ref(true)
const openMealTypes = ref<Set<MealType>>(new Set(['breakfast', 'lunch', 'dinner', 'snack']))

function toggleMealType(type: MealType) {
  if (openMealTypes.value.has(type)) {
    openMealTypes.value.delete(type)
  } else {
    openMealTypes.value.add(type)
  }
}

function mealTypeTotalCalories(entries: { food: { calories: number }; servings: number }[]) {
  return Math.round(entries.reduce((sum, e) => sum + e.food.calories * e.servings, 0))
}

function entryMacros(entry: {
  food: { calories: number; protein: number; carbs: number; fat: number }
  servings: number
}) {
  return {
    cal: Math.round(entry.food.calories * entry.servings),
    p: Math.round(entry.food.protein * entry.servings),
    c: Math.round(entry.food.carbs * entry.servings),
    f: Math.round(entry.food.fat * entry.servings),
  }
}
</script>

<template>
  <main class="dash">
    <header class="dash__header">
      <h1 class="text-display-lg">
        {{
          userStore.isProfileComplete
            ? `¡Bienvenid${userStore.profile.sex === 'female' ? 'a' : 'o'}, ${userStore.profile.name}!`
            : '¡Bienvenido a Avocato!'
        }}
      </h1>
      <p class="text-body-sm capitalize">{{ todayDate }}</p>
    </header>

    <!-- Profile incomplete prompt -->
    <section
      v-if="!userStore.isProfileComplete"
      class="card-surface p-6 text-center"
      aria-label="Completa tu perfil"
    >
      <p class="text-body mb-3">
        Cuéntanos sobre ti para calcular tus metas calóricas personalizadas.
      </p>
      <router-link to="/profile" class="btn btn-primary" role="button">
        Completar perfil
      </router-link>
    </section>

    <!-- Nutritional summary -->
    <section v-else aria-label="Resumen nutricional del día" class="dash__summary">
      <CalorieRing
        :consumed="foodStore.todaySummary.calories"
        :target="userStore.goals.targetCalories"
      />

      <div class="dash__nutrients">
        <NutrientCard
          label="Proteínas"
          :value="foodStore.todaySummary.protein"
          :target="userStore.goals.proteinGrams"
          unit="g"
          color="emerald"
        />
        <NutrientCard
          label="Carbos"
          :value="foodStore.todaySummary.carbs"
          :target="userStore.goals.carbGrams"
          unit="g"
          color="brown"
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

    <!-- Today's meals -->
    <section aria-label="Comidas registradas hoy">
      <button class="dash__meals-toggle" :aria-expanded="mealsOpen" @click="mealsOpen = !mealsOpen">
        <div class="flex items-center gap-1 min-w-0">
          <h2 class="text-sm font-semibold truncate" style="color: var(--clr-text)">
            Comidas de hoy
          </h2>
          <span
            v-if="foodStore.todayEntries.length > 0"
            class="text-[11px] font-bold shrink-0 px-1 py-0.5 rounded"
            style="color: var(--clr-text-muted); background: var(--clr-surface-alt)"
          >
            {{ foodStore.todayEntries.length }}
          </span>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <button
            v-if="foodStore.todayEntries.length > 0"
            class="btn btn-danger py-0 px-1 text-[10px]"
            aria-label="Eliminar todas las comidas de hoy"
            @click.stop="foodStore.clearToday()"
          >
            Limpiar
          </button>
          <i
            class="fa-solid fa-chevron-down text-[8px] transition-transform duration-200"
            :class="{ 'rotate-180': mealsOpen }"
            aria-hidden="true"
            style="color: var(--clr-text-faint)"
          />
        </div>
      </button>

      <div v-if="mealsOpen">
        <!-- Empty state -->
        <div
          v-if="foodStore.todayEntries.length === 0"
          class="card-warm text-center py-6 px-4 mt-1.5"
          role="status"
        >
          <i
            class="fa-solid fa-utensils text-2xl block mb-1.5"
            aria-hidden="true"
            style="color: var(--clr-primary); opacity: 0.4"
          />
          <p class="text-xs font-medium" style="color: var(--clr-text-muted)">Tu día está vacío</p>
          <p class="text-[10px] mt-0.5" style="color: var(--clr-text-faint)">
            Registra tu primera comida para comenzar
          </p>
        </div>

        <!-- Meal entries -->
        <div v-else class="mt-1.5 flex flex-col gap-0.5">
          <article
            v-for="(entries, type) in groupedEntries"
            :key="type"
            class="card overflow-hidden"
            :aria-label="MEAL_TYPE_LABELS[type]"
          >
            <button
              class="dash__meal-header"
              :aria-expanded="openMealTypes.has(type as MealType)"
              @click="toggleMealType(type as MealType)"
            >
              <div class="flex items-center gap-1 min-w-0">
                <i
                  :class="MEAL_TYPE_ICONS[type]"
                  aria-hidden="true"
                  class="text-[10px]"
                  style="color: var(--clr-primary)"
                />
                <span class="text-xs font-semibold" style="color: var(--clr-text)">{{
                  MEAL_TYPE_LABELS[type]
                }}</span>
                <span class="text-[10px] font-medium" style="color: var(--clr-text-faint)">
                  {{ entries.length }} · {{ mealTypeTotalCalories(entries) }} kcal
                </span>
              </div>
              <i
                class="fa-solid fa-chevron-down text-[7px] transition-transform duration-200"
                :class="{ 'rotate-180': openMealTypes.has(type as MealType) }"
                aria-hidden="true"
                style="color: var(--clr-text-faint)"
              />
            </button>

            <ul v-if="openMealTypes.has(type as MealType)" class="dash__food-list">
              <li v-for="entry in entries" :key="entry.id" class="dash__food-item">
                <div class="flex items-center gap-1.5 min-w-0 flex-1">
                  <img
                    v-if="entry.food.imageUrl"
                    :src="entry.food.imageUrl"
                    :alt="entry.food.name"
                    class="w-7 h-7 rounded object-cover shrink-0"
                    loading="lazy"
                  />
                  <p class="text-[13px] font-medium truncate" style="color: var(--clr-text)">
                    {{ entry.food.name }}
                  </p>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                  <div class="dash__macros">
                    <span class="dash__macro-value">{{ entryMacros(entry).cal }}</span>
                    <span class="dash__macro-label">kcal</span>
                    <span class="dash__macro-sep">·</span>
                    <span class="dash__macro-value">{{ entryMacros(entry).p }}g</span>
                    <span class="dash__macro-label">P</span>
                    <span class="dash__macro-sep">·</span>
                    <span class="dash__macro-value">{{ entryMacros(entry).c }}g</span>
                    <span class="dash__macro-label">C</span>
                    <span class="dash__macro-sep">·</span>
                    <span class="dash__macro-value">{{ entryMacros(entry).f }}g</span>
                    <span class="dash__macro-label">G</span>
                  </div>
                  <button
                    class="w-5 h-5 flex items-center justify-center rounded shrink-0 transition-colors"
                    style="color: var(--clr-text-faint)"
                    :aria-label="`Eliminar ${entry.food.name}`"
                    @click="foodStore.removeEntry(entry.id)"
                    @mouseenter="($event.target as HTMLElement).style.color = 'var(--clr-accent)'"
                    @mouseleave="
                      ($event.target as HTMLElement).style.color = 'var(--clr-text-faint)'
                    "
                  >
                    <i class="fa-solid fa-xmark text-[8px]" aria-hidden="true" />
                  </button>
                </div>
              </li>
            </ul>
          </article>
        </div>

        <div class="flex items-center justify-center gap-1 mt-1.5">
          <router-link to="/search" class="btn btn-primary text-[10px] py-1 px-2" role="button">
            <i class="fa-solid fa-magnifying-glass" aria-hidden="true" />
            Buscar
          </router-link>
          <router-link
            to="/nutrition-ai"
            class="btn btn-secondary text-[10px] py-1 px-2"
            role="button"
          >
            <i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true" />
            Mis platos
          </router-link>
        </div>
      </div>
    </section>
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

.dash__header {
  text-align: center;
  margin-bottom: 0.125rem;
}

.dash__summary {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dash__nutrients {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .dash__summary {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }

  .dash__nutrients {
    flex: 1;
    min-width: 0;
  }
}

.dash__meals-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.375rem 0.5rem;
  border-radius: var(--radius-md);
  background: var(--clr-surface);
  border: 1px solid var(--clr-border-subtle);
  cursor: pointer;
  transition: background 0.15s ease;
}

.dash__meals-toggle:hover {
  background: var(--clr-surface-alt);
}

.dash__meal-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease;
}

.dash__meal-header:hover {
  background: var(--clr-surface-alt);
}

.dash__food-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid var(--clr-border-subtle);
}

.dash__food-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.1875rem 0.5rem;
  gap: 0.25rem;
  transition: background 0.1s ease;
}

.dash__food-item:not(:last-child) {
  border-bottom: 1px solid var(--clr-border-subtle);
}

.dash__food-item:hover {
  background: var(--clr-surface-alt);
}

.dash__macros {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.6875rem;
  white-space: nowrap;
}

.dash__macro-value {
  font-weight: 600;
  color: var(--clr-text-muted);
}

.dash__macro-label {
  color: var(--clr-text-faint);
}

.dash__macro-sep {
  color: var(--clr-border);
  margin: 0 0.0625rem;
}

@media (max-width: 380px) {
  .dash__macros {
    display: none;
  }
}
</style>
