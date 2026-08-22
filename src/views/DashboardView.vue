<script setup lang="ts">
import { computed, ref, watch, nextTick, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useFoodStore } from '@/stores/foodStore'
import CalorieRing from '@/components/CalorieRing.vue'
import NutrientCard from '@/components/NutrientCard.vue'
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import FoodDetailModal from '@/components/FoodDetailModal.vue'
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

const detailFood = ref<import('@/types/food').FoodItem | null>(null)
const detailServings = ref<number | undefined>(undefined)
const detailMealType = ref<import('@/types/food').MealType | undefined>(undefined)

function openDetail(
  food: import('@/types/food').FoodItem,
  servings: number,
  mealType: import('@/types/food').MealType,
) {
  detailFood.value = food
  detailServings.value = servings
  detailMealType.value = mealType
}

function closeDetail() {
  detailFood.value = null
}

const draggedEntryId = ref<string | null>(null)
const dragOverType = ref<MealType | null>(null)

function onDragStart(entryId: string, e: DragEvent) {
  draggedEntryId.value = entryId
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', entryId)
  }
}

function onDragOver(type: MealType, e: DragEvent) {
  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
  dragOverType.value = type
}

function onDragLeave() {
  dragOverType.value = null
}

function onDrop(type: MealType) {
  if (draggedEntryId.value) {
    foodStore.moveEntry(draggedEntryId.value, type)
    toast.show(`Movido a ${MEAL_TYPE_LABELS[type]}`)
  }
  draggedEntryId.value = null
  dragOverType.value = null
}

function onDragEnd() {
  draggedEntryId.value = null
  dragOverType.value = null
}

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

const addModalRef = ref<HTMLElement | null>(null)
const addModalPreviousFocus = ref<HTMLElement | null>(null)

function getAddModalFocusable(): HTMLElement[] {
  if (!addModalRef.value) return []
  return Array.from(
    addModalRef.value.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  )
}

function onAddModalKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closeModal()
    return
  }
  if (e.key !== 'Tab') return
  const focusable = getAddModalFocusable()
  if (focusable.length === 0) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault()
      last.focus()
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

watch(showAddModal, async isOpen => {
  if (isOpen) {
    addModalPreviousFocus.value = document.activeElement as HTMLElement
    document.body.style.overflow = 'hidden'
    await nextTick()
    const focusable = getAddModalFocusable()
    if (focusable.length > 0) focusable[0].focus()
  } else {
    document.body.style.overflow = ''
    addModalPreviousFocus.value?.focus()
    addModalPreviousFocus.value = null
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})

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
    <div v-if="!foodStore.loaded" class="dash__loading" role="status" aria-label="Cargando">
      <font-awesome-icon
        :icon="['fas', 'spinner']"
        spin
        aria-hidden="true"
        style="color: var(--clr-primary); font-size: 1.5rem"
      />
      <p style="font-size: 0.8125rem; color: var(--clr-text-muted)">Cargando...</p>
    </div>

    <template v-else>
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

      <Card
        v-if="!userStore.isProfileComplete"
        as="section"
        variant="surface"
        padding="sm"
        class="p-6 text-center"
        aria-label="Completa tu perfil"
      >
        <p class="text-sm font-medium mb-2">
          Cuéntanos sobre ti para calcular tus metas calóricas personalizadas.
        </p>
        <Button to="/profile" variant="primary"> Completa tu perfil </Button>
      </Card>

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
          <Card
            v-if="foodStore.todayEntries.length === 0"
            variant="warm"
            padding="sm"
            class="text-center py-6 px-4 mt-1.5"
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
          </Card>

          <div v-else class="mt-1.5 flex flex-col gap-1.5">
            <Card
              v-for="(entries, type) in groupedEntries"
              :key="type"
              as="article"
              padding="none"
              class="overflow-hidden"
              :class="{ 'dash__meal--drag-over': dragOverType === type }"
              :aria-label="MEAL_TYPE_LABELS[type]"
              @dragover="onDragOver(type as MealType, $event)"
              @dragleave="onDragLeave"
              @drop="onDrop(type as MealType)"
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
                <li
                  v-for="entry in entries"
                  :key="entry.id"
                  class="dash__food-item"
                  :class="{ 'dash__food-item--dragging': draggedEntryId === entry.id }"
                  draggable="true"
                  @dragstart="onDragStart(entry.id, $event)"
                  @dragend="onDragEnd"
                >
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
                      class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style="background: var(--clr-primary-light)"
                    >
                      <font-awesome-icon
                        :icon="['fas', 'utensils']"
                        class="text-[10px]"
                        aria-hidden="true"
                        style="color: var(--clr-primary)"
                      />
                    </div>
                    <p class="text-[14px] font-medium truncate" style="color: var(--clr-text)">
                      {{ entry.food.name }}
                    </p>
                  </div>
                  <div class="flex items-center gap-2 shrink-0 ml-2">
                    <div class="dash__macros">
                      <span class="dash__macro-kcal">{{ entryMacros(entry).cal }}</span>
                      <span class="dash__macro-unit">kcal</span>
                      <span class="dash__macro-sep">·</span>

                      <span class="dash__macro-value dash__macro-value--protein"
                        >{{ entryMacros(entry).p }}g</span
                      >
                      <span class="dash__macro-label">P</span>
                      <span class="dash__macro-sep">·</span>
                      <span class="dash__macro-value dash__macro-value--carbs"
                        >{{ entryMacros(entry).c }}g</span
                      >
                      <span class="dash__macro-label">C</span>
                      <span class="dash__macro-sep">·</span>
                      <span class="dash__macro-value dash__macro-value--fat"
                        >{{ entryMacros(entry).f }}g</span
                      >
=======
                      <span class="dash__macro-value dash__macro-value--protein">{{ entryMacros(entry).p }}g</span>
                      <span class="dash__macro-label">P</span>
                      <span class="dash__macro-sep">·</span>
                      <span class="dash__macro-value dash__macro-value--carbs">{{ entryMacros(entry).c }}g</span>
                      <span class="dash__macro-label">C</span>
                      <span class="dash__macro-sep">·</span>
                      <span class="dash__macro-value dash__macro-value--fat">{{ entryMacros(entry).f }}g</span>

                      <span class="dash__macro-label">G</span>
                    </div>
                    <button
                      class="dash__action-btn dash__action-btn--view"
                      :aria-label="`Ver detalles de ${entry.food.name}`"
                      @click.stop="openDetail(entry.food, entry.servings, entry.mealType)"
                    >
                      <font-awesome-icon
                        :icon="['fas', 'eye']"
                        class="text-[11px]"
                        aria-hidden="true"
                      />
                    </button>
                    <button
                      class="dash__action-btn dash__action-btn--delete"
                      :aria-label="`Eliminar ${entry.food.name}`"
                      @click="confirmDeleteEntry(entry.id, entry.food.name)"
                    >
                      <font-awesome-icon
                        :icon="['fas', 'xmark']"
                        class="text-[11px]"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        <div class="dash__actions">
          <div class="dash__actions-row">
            <Button
              to="/nueva-receta"
              variant="primary"
              class="text-[10px] py-1 px-2 whitespace-nowrap"
            >
              <font-awesome-icon :icon="['fas', 'utensils']" aria-hidden="true" />
              Añadir receta
            </Button>
            <Button
              to="/analizar-plato"
              variant="accent"
              class="text-[10px] py-1 px-2 whitespace-nowrap"
            >
              <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" aria-hidden="true" />
              Añadir plato
            </Button>
            <Button
              v-if="foodStore.todayEntries.length > 0"
              variant="secondary"
              class="py-1 px-2 text-[10px] whitespace-nowrap"
              aria-label="Eliminar todas las comidas de hoy"
              @click.stop="showClearModal = true"
            >
              <font-awesome-icon :icon="['fas', 'broom']" aria-hidden="true" />
              Limpiar
            </Button>
          </div>
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
          <Button variant="secondary" @click="cancelDeleteEntry">Cancelar</Button>
          <Button variant="primary" @click="executeDeleteEntry">Eliminar</Button>
        </template>
      </Modal>

      <!-- Clear all modal -->
      <Modal :open="showClearModal" size="sm" title="Limpiar día" @close="showClearModal = false">
        <p class="text-sm" style="color: var(--clr-text-muted)">
          ¿Eliminar todas las comidas registradas hoy? Esta acción no se puede deshacer.
        </p>
        <template #footer>
          <Button variant="secondary" @click="showClearModal = false">Cancelar</Button>
          <Button variant="primary" @click="executeClearToday">Eliminar todo</Button>
        </template>
      </Modal>

      <!-- Food detail modal -->
      <FoodDetailModal
        v-if="detailFood"
        :food="detailFood"
        :servings="detailServings"
        :meal-type="detailMealType"
        @close="closeDetail"
      />

      <!-- Add food modal -->
      <div
        v-if="showAddModal"
        ref="addModalRef"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-label="`Añadir ${selectedFood?.name}`"
        @click.self="closeModal"
        @keydown="onAddModalKeydown"
      >
        <div
          class="w-full sm:max-w-md rounded-xl p-6 shadow-xl space-y-5 animate-slide-up"
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
              <Button
                v-for="opt in MEAL_TYPE_OPTIONS"
                :key="opt.value"
                class="text-sm"
                :variant="mealType === opt.value ? 'primary' : 'secondary'"
                :aria-pressed="mealType === opt.value"
                @click="mealType = opt.value"
              >
                <font-awesome-icon :icon="opt.icon" aria-hidden="true" />
                {{ opt.label }}
              </Button>
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
            <Input
              id="servings-input-dash"
              v-model.number="servings"
              type="number"
              min="0.25"
              max="20"
              step="0.25"
            />
            <p style="font-size: 0.75rem; color: var(--clr-text-faint)" aria-live="polite">
              Total: ~{{ Math.round((selectedFood?.calories ?? 0) * servings) }} kcal
            </p>
          </div>

          <div class="flex gap-3 pt-2">
            <Button variant="secondary" class="flex-1" @click="closeModal">Cancelar</Button>
            <Button variant="primary" class="flex-1" @click="confirmAdd">Añadir</Button>
          </div>
        </div>
      </div>
    </template>
  </main>
</template>

<style scoped>
.dash__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 3rem 0;
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
  padding: 0.45rem 0.5rem;
  gap: 0.25rem;
  transition: background 0.15s ease;
}

.dash__food-item:not(:last-child) {
  border-bottom: 1px solid var(--clr-border-subtle);
}

.dash__food-item:hover {
  background: var(--clr-surface-alt);
  border-radius: var(--radius-sm);
}

.dash__food-item--dragging {
  opacity: 0.4;
  cursor: grabbing;
}

.dash__food-item[draggable='true'] {
  cursor: grab;
}

.dash__meal--drag-over {
  box-shadow: inset 0 0 0 2px var(--clr-primary);
  background: var(--clr-primary-faint);
}

.dash__macros {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.8rem;
  white-space: nowrap;
  margin-right: 1rem;
}

.dash__macro-kcal {
  font-weight: 700;
  color: var(--clr-text);
}

.dash__macro-unit {
  font-size: 0.7rem;
  color: var(--clr-text-faint);
}

.dash__macro-value {
  font-weight: 700;
  color: var(--clr-text-muted);
}

.dash__macro-value--protein {
  color: var(--clr-primary);
}

.dash__macro-value--carbs {
  color: var(--clr-nutrient-brown-text);
}

.dash__macro-value--fat {
  color: var(--clr-secondary);
}

.dash__macro-label {
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--clr-text-faint);
}

.dash__macro-sep {
  color: var(--clr-border);
  margin: 0 0.07rem;
}

@media (max-width: 480px) {
  .dash__macros {
    display: none;
  }
}

.dash__actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.dash__actions-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

@media (min-width: 400px) {
  .dash__actions-row {
    gap: 0.375rem;
  }
}

.dash__action-btn {
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  border: none;
  cursor: pointer;
  transition: background 0.15s ease;
}

.dash__action-btn--view {
  color: var(--clr-primary);
  background: var(--clr-primary-light);
}

.dash__action-btn--view:hover {
  background: var(--clr-primary-faint);
}

.dash__action-btn--delete {
  color: var(--clr-accent);
  background: var(--clr-accent-light);
}

.dash__action-btn--delete:hover {
  background: #edd5ca;
}
</style>
