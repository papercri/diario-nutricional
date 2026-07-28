<script setup lang="ts">
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import type { AllergenType } from '@/types/nutrition'

export interface DetailItem {
  id: string
  name: string
  imageUrl?: string | null
  description?: string
  servingSize?: string | number
  prepTime?: string
  nutritionScore?: {
    value: number
    reason?: string
  }
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  isVegan?: boolean
  isVegetarian?: boolean
  allergens?: AllergenType[]
  ingredients?: Array<{
    name: string
    quantity?: string | number
    calories?: number
  }>
}

defineProps<{
  open: boolean
  item: DetailItem | null
}>()

const emit = defineEmits<{
  close: []
  add: [item: DetailItem]
  delete: [item: DetailItem]
}>()
</script>

<template>
  <Modal
    :open="open"
    size="lg"
    @close="emit('close')"
  >
    <template v-if="item">
      <div class="modal-detail">
        <div v-if="item.imageUrl" class="modal-detail__img">
          <img :src="item.imageUrl" :alt="item.name" />
        </div>
        <h3 class="modal-detail__name">{{ item.name }}</h3>
        <p v-if="item.description" class="modal-detail__desc">{{ item.description }}</p>

        <div v-if="item.servingSize || item.prepTime" class="modal-detail__serving">
          <span v-if="item.servingSize">
            <font-awesome-icon :icon="['fas', 'scale-balanced']" aria-hidden="true" />
            Porción: {{ item.servingSize }}
          </span>
          <span v-if="item.prepTime">
            <font-awesome-icon :icon="['fas', 'clock']" aria-hidden="true" />
            Tiempo: {{ item.prepTime }}
          </span>
        </div>

        <div class="modal-detail__score" v-if="item.nutritionScore">
          <div class="score-ring">
            <svg viewBox="0 0 80 80" class="score-ring__svg">
              <circle cx="40" cy="40" r="34" fill="none" stroke="var(--clr-surface-alt)" stroke-width="6" />
              <circle
                cx="40" cy="40" r="34" fill="none"
                :stroke="item.nutritionScore.value >= 70 ? 'var(--clr-success)' : item.nutritionScore.value >= 40 ? 'var(--clr-accent)' : 'var(--clr-danger)'"
                stroke-width="6"
                stroke-linecap="round"
                :stroke-dasharray="213.6"
                :stroke-dashoffset="213.6 - (213.6 * item.nutritionScore.value / 100)"
                transform="rotate(-90 40 40)"
                class="score-ring__fill"
              />
            </svg>
            <span class="score-ring__value">{{ item.nutritionScore.value }}</span>
          </div>
          <div class="score-ring__info">
            <span class="score-ring__label">Score nutricional</span>
            <span v-if="item.nutritionScore.reason" class="score-ring__reason">{{ item.nutritionScore.reason }}</span>
          </div>
        </div>

        <div class="modal-detail__macros">
          <div class="modal-macro">
            <span class="modal-macro__value">{{ item.calories ?? 0 }}</span>
            <span class="modal-macro__label">kcal</span>
          </div>
          <div class="modal-macro modal-macro--protein">
            <span class="modal-macro__value">{{ item.protein ?? 0 }}g</span>
            <span class="modal-macro__label">Proteínas</span>
          </div>
          <div class="modal-macro modal-macro--carbs">
            <span class="modal-macro__value">{{ item.carbs ?? 0 }}g</span>
            <span class="modal-macro__label">Carbos</span>
          </div>
          <div class="modal-macro modal-macro--fat">
            <span class="modal-macro__value">{{ item.fat ?? 0 }}g</span>
            <span class="modal-macro__label">Grasas</span>
          </div>
        </div>

        <div class="modal-detail__macro-bar">
          <div
            class="modal-detail__macro-bar-seg modal-detail__macro-bar-seg--protein"
            :style="{ flex: item.protein || 0.1 }"
          />
          <div
            class="modal-detail__macro-bar-seg modal-detail__macro-bar-seg--carbs"
            :style="{ flex: item.carbs || 0.1 }"
          />
          <div
            class="modal-detail__macro-bar-seg modal-detail__macro-bar-seg--fat"
            :style="{ flex: item.fat || 0.1 }"
          />
        </div>
        <div class="modal-detail__macro-legend">
          <span class="modal-detail__legend-item">
            <span class="modal-detail__legend-dot modal-detail__legend-dot--protein" />
            Proteínas {{ Math.round((item.protein ?? 0) * 4) }} kcal
          </span>
          <span class="modal-detail__legend-item">
            <span class="modal-detail__legend-dot modal-detail__legend-dot--carbs" />
            Carbos {{ Math.round((item.carbs ?? 0) * 4) }} kcal
          </span>
          <span class="modal-detail__legend-item">
            <span class="modal-detail__legend-dot modal-detail__legend-dot--fat" />
            Grasas {{ Math.round((item.fat ?? 0) * 9) }} kcal
          </span>
        </div>

        <div class="modal-detail__dietary" v-if="item.isVegan || item.isVegetarian">
          <span v-if="item.isVegan" class="modal-detail__badge modal-detail__badge--vegan">
            <font-awesome-icon :icon="['fas', 'leaf']" aria-hidden="true" />
            Vegano
          </span>
          <span v-else-if="item.isVegetarian" class="modal-detail__badge modal-detail__badge--vegetarian">
            <font-awesome-icon :icon="['fas', 'carrot']" aria-hidden="true" />
            Vegetariano
          </span>
        </div>

        <div v-if="item.allergens?.length" class="modal-detail__section">
          <h4 class="modal-detail__section-title">
            <font-awesome-icon :icon="['fas', 'triangle-exclamation']" aria-hidden="true" />
            Alérgenos
          </h4>
          <div class="modal-detail__tags">
            <span v-for="a in item.allergens" :key="a" class="modal-detail__tag modal-detail__tag--allergen">
              {{ a }}
            </span>
          </div>
        </div>

        <div v-if="item.ingredients?.length" class="modal-detail__section">
          <h4 class="modal-detail__section-title">
            <font-awesome-icon :icon="['fas', 'list-check']" aria-hidden="true" />
            Ingredientes
          </h4>
          <ul class="modal-detail__list">
            <li v-for="(ing, idx) in item.ingredients" :key="idx" class="modal-detail__ing">
              <span class="modal-detail__ing-name">{{ ing.name }}</span>
              <span class="modal-detail__ing-right">
                <span v-if="ing.quantity" class="modal-detail__ing-qty">{{ ing.quantity }}</span>
                <span v-if="ing.calories" class="modal-detail__ing-cal">{{ ing.calories }} kcal</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <template #footer>
      <Button variant="secondary" @click="emit('close')">Cerrar</Button>
      <Button variant="primary" @click="item && emit('add', item)">
        <font-awesome-icon :icon="['fas', 'plus']" aria-hidden="true" />
        Añadir
      </Button>
      <Button variant="danger" @click="item && emit('delete', item)">
        <font-awesome-icon :icon="['fas', 'xmark']" aria-hidden="true" />
        Eliminar
      </Button>
    </template>
  </Modal>
</template>

<style scoped>
/* Modal detail styles extracted from PlatesView / RecipesView */
.modal-detail {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.modal-detail__img {
  width: 100%;
  height: 150px;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.modal-detail__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-detail__name {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: var(--weight-bold);
  color: var(--clr-text);
  margin: 0;
}

.modal-detail__desc {
  font-size: var(--text-xs);
  color: var(--clr-text-muted);
  margin: 0;
}

.modal-detail__serving {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: var(--text-xs);
  color: var(--clr-text-faint);
}

.modal-detail__macros {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.modal-detail__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.modal-detail__tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  border-radius: var(--radius-full);
}

.modal-detail__tag--allergen {
  background: var(--clr-accent-light);
  color: var(--clr-accent);
}

.modal-detail__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.modal-macro {
  text-align: center;
  padding: 0.375rem;
  background: var(--clr-surface-alt);
  border-radius: var(--radius-md);
}

.modal-macro__value {
  display: block;
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--clr-primary);
  line-height: 1;
  margin-bottom: 0.125rem;
}

.modal-macro__label {
  font-size: 0.625rem;
  color: var(--clr-text-faint);
}

.modal-macro--protein .modal-macro__value { color: var(--clr-primary); }
.modal-macro--carbs .modal-macro__value { color: var(--clr-accent); }
.modal-macro--fat .modal-macro__value { color: var(--clr-secondary); }

.modal-detail__macro-bar {
  display: flex;
  height: 0.5rem;
  border-radius: var(--radius-full);
  overflow: hidden;
  gap: 2px;
}

.modal-detail__macro-bar-seg {
  border-radius: var(--radius-full);
  transition: flex 0.6s var(--ease-default);
}

.modal-detail__macro-bar-seg--protein { background: var(--clr-primary); }
.modal-detail__macro-bar-seg--carbs { background: var(--clr-accent); }
.modal-detail__macro-bar-seg--fat { background: var(--clr-secondary); }

.modal-detail__macro-legend {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.modal-detail__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.675rem;
  color: var(--clr-text-muted);
}

.modal-detail__legend-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.modal-detail__legend-dot--protein { background: var(--clr-primary); }
.modal-detail__legend-dot--carbs { background: var(--clr-accent); }
.modal-detail__legend-dot--fat { background: var(--clr-secondary); }

.modal-detail__score {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--clr-surface-alt);
  border-radius: var(--radius-lg);
}

.score-ring {
  position: relative;
  width: 3.5rem;
  height: 3.5rem;
  flex-shrink: 0;
}

.score-ring__svg {
  width: 100%;
  height: 100%;
}

.score-ring__fill {
  transition: stroke-dashoffset 0.8s var(--ease-out);
}

.score-ring__value {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--clr-text);
}

.score-ring__info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.score-ring__label {
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--clr-text);
}

.score-ring__reason {
  font-size: 0.675rem;
  color: var(--clr-text-muted);
  line-height: 1.4;
}

.modal-detail__dietary {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.modal-detail__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
}

.modal-detail__badge--vegan {
  background: color-mix(in srgb, var(--clr-success) 15%, transparent);
  color: var(--clr-success);
}

.modal-detail__badge--vegetarian {
  background: color-mix(in srgb, var(--clr-primary) 15%, transparent);
  color: var(--clr-primary);
}

.modal-detail__section-title {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--clr-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0 0 0.375rem 0;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.modal-detail__section-title i {
  color: var(--clr-accent);
}

.modal-detail__ing {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.375rem 0.5rem;
  background: var(--clr-surface-alt);
  border-radius: var(--radius-md);
}

.modal-detail__ing + .modal-detail__ing {
  margin-top: 0.25rem;
}

.modal-detail__ing-name {
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  color: var(--clr-text);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.modal-detail__ing-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.modal-detail__ing-qty {
  font-size: 0.675rem;
  color: var(--clr-text-muted);
}

.modal-detail__ing-cal {
  font-size: 0.675rem;
  font-weight: var(--weight-semibold);
  color: var(--clr-primary);
}
</style>
