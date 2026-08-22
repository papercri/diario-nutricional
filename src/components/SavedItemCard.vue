<script setup lang="ts">
import { computed } from 'vue'
import type { AllergenType } from '@/types/nutrition'

export interface SavedItemProps {
  id: string
  name: string
  calories?: number | null
  protein?: number | null
  carbs?: number | null
  fat?: number | null
  allergens?: AllergenType[]
  isVegan?: boolean
  isVegetarian?: boolean
  prepTime?: string | null
}

const props = withDefaults(
  defineProps<{
    item: SavedItemProps
    disableDelete?: boolean
  }>(),
  {
    disableDelete: false,
  },
)

const emit = defineEmits<{
  view: [item: SavedItemProps]
  add: [item: SavedItemProps]
  delete: [item: SavedItemProps]
}>()

const ALLERGEN_ICONS: Record<AllergenType, [string, string]> = {
  gluten: ['fas', 'bread-slice'],
  milk: ['fas', 'glass-water'],
  eggs: ['fas', 'egg'],
  peanuts: ['fas', 'bowl-food'],
  tree_nuts: ['fas', 'bowl-food'],
  soy: ['fas', 'leaf'],
  fish: ['fas', 'fish'],
  shellfish: ['fas', 'shrimp'],
  sesame: ['fas', 'droplet'],
  mustard: ['fas', 'droplet'],
  celery: ['fas', 'carrot'],
  lupin: ['fas', 'seedling'],
}

const ALLERGEN_LABELS: Record<AllergenType, string> = {
  gluten: 'Gluten',
  milk: 'Lácteos',
  eggs: 'Huevo',
  peanuts: 'Cacahuetes',
  tree_nuts: 'Frutos secos',
  soy: 'Soja',
  fish: 'Pescado',
  shellfish: 'Marisco',
  sesame: 'Sésamo',
  mustard: 'Mostaza',
  celery: 'Apio',
  lupin: 'Altramuces',
}

const accentClass = computed(() => {
  if (props.item.isVegan || props.item.isVegetarian) return 'saved-card__accent--vegan'
  if (props.item.allergens?.includes('gluten')) return 'saved-card__accent--other'
  return 'saved-card__accent--gluten-free'
})
</script>

<template>
  <article class="saved-card" tabindex="0" :aria-label="`Ver detalles de ${item.name}`">
    <div class="saved-card__accent" :class="accentClass" />
    <div
      class="saved-card__body"
      role="button"
      @click="emit('view', item)"
      @keydown.enter="emit('view', item)"
    >
      <h3 class="saved-card__title">{{ item.name }}</h3>
      <div class="saved-card__macros">
        <span v-if="item.calories" class="saved-card__macro"
          ><strong>{{ item.calories }}</strong> kcal</span
        >
        <span v-if="item.protein" class="saved-card__macro">P {{ item.protein }}g</span>
        <span v-if="item.carbs" class="saved-card__macro">C {{ item.carbs }}g</span>
        <span v-if="item.fat" class="saved-card__macro">G {{ item.fat }}g</span>
        <span v-if="item.prepTime" class="saved-card__macro">
          <font-awesome-icon :icon="['fas', 'clock']" aria-hidden="true" />
          {{ item.prepTime }}
        </span>
      </div>
      <div
        v-if="item.allergens?.length || item.isVegan || item.isVegetarian"
        class="saved-card__tags"
      >
        <span v-for="a in item.allergens?.slice(0, 3)" :key="a" class="saved-card__tag">
          <font-awesome-icon :icon="ALLERGEN_ICONS[a]" aria-hidden="true" />
          {{ ALLERGEN_LABELS[a] }}
        </span>
        <span v-if="item.isVegan" class="saved-card__badge saved-card__badge--vegan">
          <font-awesome-icon :icon="['fas', 'leaf']" aria-hidden="true" />
          Vegano
        </span>
        <span v-else-if="item.isVegetarian" class="saved-card__badge saved-card__badge--vegetarian">
          <font-awesome-icon :icon="['fas', 'seedling']" aria-hidden="true" />
          Vegetariano
        </span>
      </div>
    </div>
    <div class="saved-card__actions">
      <button
        class="btn-slide btn-slide--primary"
        :aria-label="`Añadir ${item.name} al día`"
        @click.stop="emit('add', item)"
      >
        <span class="btn-slide__label">Añadir</span>
        <font-awesome-icon :icon="['fas', 'plus']" class="btn-slide__icon" aria-hidden="true" />
      </button>
      <button
        :disabled="disableDelete"
        class="btn-slide btn-slide--danger"
        :aria-label="`Eliminar ${item.name}`"
        @click.stop="emit('delete', item)"
      >
        <span class="btn-slide__label">Eliminar</span>
        <font-awesome-icon :icon="['fas', 'xmark']" class="btn-slide__icon" aria-hidden="true" />
      </button>
    </div>
  </article>
</template>

<style scoped>
.saved-card {
  display: flex;
  align-items: stretch;
  background: var(--clr-surface);
  border: 1px solid var(--clr-border-subtle);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: box-shadow 0.2s ease;
  margin-bottom: 8px;
}

.saved-card:hover {
  box-shadow: var(--shadow-lg);
  cursor: pointer;
}
.saved-card:focus-visible {
  outline: 2px solid var(--clr-primary);
  outline-offset: 2px;
}
.saved-card:hover { box-shadow: var(--shadow-lg); cursor: pointer; }
.saved-card:focus-visible { outline: 2px solid var(--clr-primary); outline-offset: 2px; }

.saved-card__accent {
  width: 4px;
  flex-shrink: 0;
  background: var(--clr-primary);
}
.saved-card__accent--vegan,
.saved-card__accent--vegetarian {
  background: var(--clr-success);
}
.saved-card__accent--gluten-free {
  background: var(--clr-warning);
}
.saved-card__accent--other {
  background: var(--clr-accent);
}

.saved-card__body {
  flex: 1;
  min-width: 0;
  padding: 0.75rem 1rem;
}

.saved-card__title {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--clr-text);
  margin: 0 0 0.25rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.saved-card__macros {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem 0.625rem;
  font-size: 0.675rem;
  color: var(--clr-text-muted);
}
.saved-card__macro {
  white-space: nowrap;
}

.saved-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.375rem;
}
.saved-card__tag {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-full);
  font-size: 0.6rem;
  font-weight: var(--weight-medium);
  background: var(--clr-accent-light);
  color: var(--clr-accent);
}
.saved-card__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-full);
  font-size: 0.6rem;
  font-weight: var(--weight-semibold);
}
.saved-card__badge--vegan {
  background: var(--clr-success-light);
  color: var(--clr-success);
}
.saved-card__badge--vegetarian {
  background: var(--clr-success-light);
  color: var(--clr-success);
}

.saved-card__actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-shrink: 0;
  padding: 0.75rem 0.75rem 0.75rem 0;
}

.btn-slide {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  overflow: visible;
  z-index: 1;
  color: #fff;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.15s ease;
}
.btn-slide::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-md);
  z-index: -1;
  transition: left 0.25s ease;
}

.btn-slide__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  font-size: 0.875rem;
}

.btn-slide__label {
  position: absolute;
  right: 2rem;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.7rem;
  font-weight: 700;
  white-space: nowrap;
  color: #fff;
  opacity: 0;
  transform: translateX(6px);
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
  pointer-events: none;
}
.btn-slide:hover .btn-slide__label {
  opacity: 1;
  transform: translateX(0);
}

.btn-slide--primary {
  background: var(--clr-primary);
}
.btn-slide--primary::before {
  background: var(--clr-primary);
}
.btn-slide--primary:hover::before {
  left: -3.5rem;
}
.btn-slide--primary:hover {
  background: var(--clr-primary-hover);
}

.btn-slide--danger {
  background: var(--clr-danger);
}
.btn-slide--danger::before {
  background: var(--clr-danger);
}
.btn-slide--danger:hover::before {
  left: -3.5rem;
}
.btn-slide--danger:hover {
  background: var(--clr-danger);
}

@media (hover: none) {
  .btn-slide__label {
    display: none;
  }
}
</style>
