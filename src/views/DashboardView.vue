<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useFoodStore } from '@/stores/foodStore'
import CalorieRing from '@/components/CalorieRing.vue'
import NutrientCard from '@/components/NutrientCard.vue'
import Modal from '@/components/ui/Modal.vue'
import { useToast } from '@/composables/useToast'
import { useAddFood } from '@/composables/useAddFood'
import { groupEntriesByMealType } from '@/utils/nutrition'
import { formatDateEs } from '@/utils/formatting'
import { MEAL_TYPE_LABELS, MEAL_TYPE_ICONS, MEAL_TYPE_OPTIONS } from '@/utils/constants'
import type { MealType } from '@/types/user'

const userStore = useUserStore()
const foodStore = useFoodStore()
const toast = useToast()
const { showAddModal, selectedFood, servings, mealType, confirmAdd, closeModal } = useAddFood()

const todayDate = computed(() => formatDateEs(new Date()))
const groupedEntries = computed(() => groupEntriesByMealType(foodStore.todayEntries))

const mealsOpen = ref(true)
const openMealTypes = ref<Set<MealType>>(new Set(['breakfast', 'lunch', 'dinner', 'snack']))

const deleteEntryId = ref<string | null>(null)
const deleteEntryName = ref('')
const showClearModal = ref(false)

function confirmDeleteEntry(id: string, name: string) {
  deleteEntryId.value = id
  deleteEntryName.value = name
}

function executeDeleteEntry() {
  if (deleteEntryId.value) {
    foodStore.removeEntry(deleteEntryId.value)
    toast.show('Elemento eliminado')
    deleteEntryId.value = null
    deleteEntryName.value = ''
  }
}

function cancelDeleteEntry() {
  deleteEntryId.value = null
  deleteEntryName.value = ''
}

function executeClearToday() {
  foodStore.clearToday()
  toast.show('Elemento eliminado')
  showClearModal.value = false
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

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
            ? `¡Bienvenid${userStore.profile.sex === 'female' ? 'a' : 'o'}, ${capitalize(userStore.profile.name)}!`
            : '¡Bienvenid@ a Avocato!'
        }}
      </h1>
      <p class="text-body-sm capitalize">{{ todayDate }}</p>
    </header>

    <section
      v-if="!userStore.isProfileComplete"
      class="card-surface p-6 text-center"
      aria-label="Completa tu perfil"
    >
      <p class="text-body mb-3">
        Cuéntanos sobre ti para calcular tus metas calóricas personalizadas.
      </p>
      <router-link to="/profile" class="btn btn-primary" role="button">
        Completa tu perfil
      </router-link>
    </section>

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

    <section aria-label="Comidas registradas hoy">
      <button
        class="dash__meals-toggle"
        :aria-expanded="mealsOpen"
        @click="mealsOpen = !mealsOpen"
      >
        <div class="flex items-center gap-1 min-w-0">
          <h2 class="text-xs font-semibold truncate uppercase" style="color: var(--clr-text)">
            Comidas de hoy
          </h2>
          <span
            v-if="foodStore.todayEntries.length > 0"
            class="text-[12px] font-bold shrink-0 px-1 py-1 rounded"
            style="color: var(--clr-text-muted); background: var(--clr-surface-alt)"
          >
            {{ foodStore.todayEntries.length }}
          </span>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <font-awesome-icon
            :icon="['fas', 'chevron-down']"
            class="text-[13px] transition-transform duration-200"
            :class="{ 'rotate-180': mealsOpen }"
            aria-hidden="true"
            style="color: var(--clr-text-faint)"
          />
        </div>
      </button>

      <div v-if="mealsOpen">
        <div
          v-if="foodStore.todayEntries.length === 0"
          class="card-warm text-center py-6 px-4 mt-1.5"
          role="status"
        >
          <font-awesome-icon
            :icon="['fas', 'utensils']"
            class="text-2xl block mb-1.5"
            aria-hidden="true"
            style="color: var(--clr-primary); opacity: 0.4"
          />
          <p class="text-xs font-medium" style="color: var(--clr-text-muted)">
            Tu día está vacío
          </p>
          <p class="text-[10px] mt-0.5" style="color: var(--clr-text-faint)">
            Registra tu primera comida para comenzar
          </p>
        </div>

        <div v-else class="mt-1.5 flex flex-col gap-1.5">
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
                <font-awesome-icon
                  :icon="MEAL_TYPE_ICONS[type]"
                  aria-hidden="true"
                  class="text-[10px]"
                  style="color: var(--clr-primary)"
                />
                <span class="text-sm font-semibold" style="color: var(--clr-text)">{{
                  MEAL_TYPE_LABELS[type]
                }}</span>
                <span class="text-[13px] font-medium" style="color: var(--clr-text-faint)">
                  {{ entries.length }} · {{ mealTypeTotalCalories(entries) }} kcal
                </span>
              </div>
              <font-awesome-icon
                :icon="['fas', 'chevron-down']"
                class="text-[13px] transition-transform duration-200"
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
                  <div
                    v-else
                    class="w-7 h-7 rounded flex items-center justify-center shrink-0"
                    style="background: var(--clr-primary-light)"
                  >
                    <font-awesome-icon
                      :icon="['fas', 'utensils']"
                      class="text-[10px]"
                      aria-hidden="true"
                      style="color: var(--clr-primary); opacity: 0.5"
                    />
                  </div>
                  <p class="text-[14px] font-medium truncate" style="color: var(--clr-text)">
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
                    @click="confirmDeleteEntry(entry.id, entry.food.name)"
                    @mouseenter="($event.target as HTMLElement).style.color = 'var(--clr-accent)'"
                    @mouseleave="
                      ($event.target as HTMLElement).style.color = 'var(--clr-text-faint)'
                    "
                  >
                    <font-awesome-icon
                      :icon="['fas', 'xmark']"
                      class="text-[13px]"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </li>
            </ul>
          </article>
        </div>
      </div>

      <div class="dash__actions">
        <div class="dash__actions-row">
          <router-link
            to="/search"
            class="btn btn-primary text-[10px] py-1 px-2 whitespace-nowrap"
            role="button"
          >
            <font-awesome-icon :icon="['fas', 'magnifying-glass']" aria-hidden="true" />
            Buscar
          </router-link>
          <router-link
            to="/nutrition-ai"
            class="btn btn-accent text-[10px] py-1 px-2 whitespace-nowrap"
            role="button"
          >
            <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" aria-hidden="true" />
            Mis platos
          </router-link>
        </div>
        <button
          v-if="foodStore.todayEntries.length > 0"
          class="btn btn-secondary py-1 px-2 text-[10px] whitespace-nowrap dash__btn-clear"
          aria-label="Eliminar todas las comidas de hoy"
          @click.stop="showClearModal = true"
        >
          <font-awesome-icon :icon="['fas', 'broom']" aria-hidden="true" />
          Limpiar
        </button>
      </div>
    </section>

    <!-- Delete entry modal -->
    <Modal
      :open="deleteEntryId !== null"
      size="sm"
      title="Eliminar plato"
      @close="cancelDeleteEntry"
    >
      <p class="text-sm" style="color: var(--clr-text-muted)">
        ¿Eliminar <strong style="color: var(--clr-text)">{{ deleteEntryName }}</strong> de tus
        comidas de hoy?
      </p>
      <template #footer>
        <button class="btn btn-secondary" @click="cancelDeleteEntry">Cancelar</button>
        <button class="btn btn-primary" @click="executeDeleteEntry">Eliminar</button>
      </template>
    </Modal>

    <!-- Clear all modal -->
    <Modal :open="showClearModal" size="sm" title="Limpiar día" @close="showClearModal = false">
      <p class="text-sm" style="color: var(--clr-text-muted)">
        ¿Eliminar todas las comidas registradas hoy? Esta acción no se puede deshacer.
      </p>
      <template #footer>
        <button class="btn btn-secondary" @click="showClearModal = false">Cancelar</button>
        <button class="btn btn-primary" @click="executeClearToday">Eliminar todo</button>
      </template>
    </Modal>

    <!-- Add food modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      :aria-label="`Añadir ${selectedFood?.name}`"
      @click.self="closeModal"
      @keydown.escape="closeModal"
    >
      <div
        class="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-xl space-y-5 animate-slide-up"
        style="background: var(--clr-surface)"
      >
        <h2 class="font-display" style="font-size: 1.25rem; color: var(--clr-text)">
          Añadir alimento
        </h2>

        <p class="font-medium" style="font-size: 0.875rem; color: var(--clr-text)">
          {{ selectedFood?.name }}
        </p>

        <fieldset class="space-y-2 border-0 p-0 m-0">
          <legend class="block text-sm font-medium" style="color: var(--clr-text-muted)">
            Tipo de comida
          </legend>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="opt in MEAL_TYPE_OPTIONS"
              :key="opt.value"
              type="button"
              class="btn text-sm"
              :class="mealType === opt.value ? 'btn-primary' : 'btn-secondary'"
              :aria-pressed="mealType === opt.value"
              @click="mealType = opt.value"
            >
              <font-awesome-icon :icon="opt.icon" aria-hidden="true" />
              {{ opt.label }}
            </button>
          </div>
        </fieldset>

        <div class="space-y-2">
          <label
            for="servings-input-dash"
            class="block text-sm font-medium"
            style="color: var(--clr-text-muted)"
          >
            Porciones (100g c/u)
          </label>
          <input
            id="servings-input-dash"
            v-model.number="servings"
            type="number"
            min="0.25"
            max="20"
            step="0.25"
            class="input-field"
          />
          <p style="font-size: 0.75rem; color: var(--clr-text-faint)" aria-live="polite">
            Total: ~{{ Math.round((selectedFood?.calories ?? 0) * servings) }} kcal
          </p>
        </div>

        <div class="flex gap-3 pt-2">
          <button class="btn btn-secondary flex-1" @click="closeModal">Cancelar</button>
          <button class="btn btn-primary flex-1" @click="confirmAdd">Añadir</button>
        </div>
      </div>
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
  padding: 0.5rem 0.6rem;
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
  padding: 0.45rem 0.6rem;
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
  padding: 0.3rem 0.5rem;
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
  gap: 0.2rem;
  font-size: 0.8rem;
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
  margin: 0 0.07rem;
}

@media (max-width: 380px) {
  .dash__macros {
    display: none;
  }
}

.dash__actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem;
  margin-top: 1rem;
}

.dash__actions-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.dash__btn-clear {
  width: 100%;
}

@media (min-width: 400px) {
  .dash__actions {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.375rem;
    align-items: center;
  }

  .dash__actions-row {
    gap: 0.375rem;
  }

  .dash__btn-clear {
    width: auto;
  }
}
</style>
