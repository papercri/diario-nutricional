<script setup lang="ts">
import { useAddFood } from '@/composables/useAddFood'
import { MEAL_TYPE_OPTIONS } from '@/utils/constants'
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import type { FoodItem } from '@/types/food'

const { showAddModal, selectedFood, servings, mealType, openAddModal, confirmAdd, closeModal } = useAddFood()

defineExpose({
  open: (food: FoodItem) => openAddModal(food)
})
</script>

<template>
  <Modal :open="showAddModal" size="sm" title="Añadir a mi día" @close="closeModal">
    <p class="text-sm font-medium" style="color: var(--clr-text)">
      {{ selectedFood?.name }}
    </p>

    <fieldset class="space-y-2 border-0 p-0 m-0 mt-3">
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

    <div class="space-y-2 mt-3">
      <label
        for="servings-input-modal"
        class="block text-sm font-medium"
        style="color: var(--clr-text-muted)"
      >
        Porciones (100g c/u)
      </label>
      <Input
        id="servings-input-modal"
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

    <template #footer>
      <Button variant="secondary" @click="closeModal">Cancelar</Button>
      <Button variant="primary" @click="confirmAdd">Añadir</Button>
    </template>
  </Modal>
</template>
