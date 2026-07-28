<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSavedPlatesStore } from '@/stores/savedPlatesStore'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'

import SavedItemCard from '@/components/SavedItemCard.vue'
import AddFoodModal from '@/components/AddFoodModal.vue'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'
import ItemDetailModal from '@/components/ItemDetailModal.vue'
import type { SavedItemProps } from '@/components/SavedItemCard.vue'
import type { DetailItem } from '@/components/ItemDetailModal.vue'

const savedPlatesStore = useSavedPlatesStore()
const { user } = useAuth()
const toast = useToast()

const selectedPlate = ref<DetailItem | null>(null)
const showPlateModal = ref(false)

const showDeleteConfirm = ref(false)
const plateToDelete = ref<SavedItemProps | null>(null)

const addFoodModalRef = ref<InstanceType<typeof AddFoodModal> | null>(null)

onMounted(async () => {
  if (user.value) {
    await savedPlatesStore.loadPlates()
  }
})

function openPlateModal(plate: any) {
  selectedPlate.value = plate as DetailItem
  showPlateModal.value = true
}

function openAddPlateToDay(plate: any) {
  showPlateModal.value = false
  if (addFoodModalRef.value) {
    addFoodModalRef.value.open({
      id: plate.id,
      name: plate.name,
      calories: plate.calories,
      protein: plate.protein,
      carbs: plate.carbs,
      fat: plate.fat,
      imageUrl: plate.imageUrl ?? undefined,
    })
  }
}

function confirmDeletePlate(plate: any) {
  plateToDelete.value = plate
  showDeleteConfirm.value = true
}

async function deletePlate() {
  if (!plateToDelete.value) return
  await savedPlatesStore.deletePlate(plateToDelete.value.id)
  showPlateModal.value = false
  selectedPlate.value = null
  showDeleteConfirm.value = false
  plateToDelete.value = null
  toast.show('Plato eliminado')
}

function cancelDelete() {
  showDeleteConfirm.value = false
  plateToDelete.value = null
}
</script>

<template>
  <main class="dash">
    <header class="dash__header">
      <div class="dash__title-row">
        <h1 class="text-display-lg">
          <font-awesome-icon
            :icon="['fas', 'bowl-food']"
            aria-hidden="true"
            style="color: var(--clr-accent)"
          />
          Mis platos
        </h1>
        <Button to="/analizar-plato" variant="primary" size="sm">
          <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" aria-hidden="true" />
          Analizar mi plato
        </Button>
      </div>
      <p class="text-body-sm">Platos que has analizado y guardado</p>
    </header>

    <Card v-if="savedPlatesStore.plates.length === 0" variant="warm" padding="none" class="text-center py-8 px-4">
      <font-awesome-icon
        :icon="['fas', 'bowl-food']"
        class="text-3xl block mb-2"
        aria-hidden="true"
        style="color: var(--clr-primary); opacity: 0.3"
      />
      <p class="text-sm font-medium" style="color: var(--clr-text-muted)">
        No hay platos guardados
      </p>
      <p class="text-xs mt-1 mb-3" style="color: var(--clr-text-faint)">
        Analiza un plato y guárdalo aquí
      </p>
      <Button to="/analizar-plato" variant="primary" size="sm">
        <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" aria-hidden="true" />
        Analizar mi plato
      </Button>
    </Card>

    <div v-else class="saved-list">
      <SavedItemCard
        v-for="plate in savedPlatesStore.plates"
        :key="plate.id"
        :item="plate"
        @view="openPlateModal"
        @add="openAddPlateToDay"
        @delete="confirmDeletePlate"
      />
    </div>

    <!-- Plate detail modal -->
    <ItemDetailModal
      :open="showPlateModal"
      :item="selectedPlate"
      @close="showPlateModal = false"
      @add="openAddPlateToDay"
      @delete="confirmDeletePlate"
    />

    <!-- Add food modal -->
    <AddFoodModal ref="addFoodModalRef" />

    <!-- Delete confirmation modal -->
    <ConfirmDeleteModal
      :open="showDeleteConfirm"
      :item-name="plateToDelete?.name"
      title="Eliminar plato"
      @close="cancelDelete"
      @confirm="deletePlate"
    />
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

.dash__header { text-align: center; margin-bottom: 0.125rem; }

.dash__title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.saved-list {
  display: flex;
  flex-direction: column;
}
</style>
