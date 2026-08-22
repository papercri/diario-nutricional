<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSavedPlatesStore } from '@/stores/savedPlatesStore'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Paginator from '@/components/ui/Paginator.vue'
import ListFilters from '@/components/ui/ListFilters.vue'
import type { SortOption } from '@/components/ui/ListFilters.vue'

import SavedItemCard from '@/components/SavedItemCard.vue'
import AddFoodModal from '@/components/AddFoodModal.vue'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'
import ItemDetailModal from '@/components/ItemDetailModal.vue'
import type { SavedItemProps } from '@/components/SavedItemCard.vue'
import type { DetailItem } from '@/components/ItemDetailModal.vue'

const ITEMS_PER_PAGE = 10

const savedPlatesStore = useSavedPlatesStore()
const { user } = useAuth()
const toast = useToast()

const selectedPlate = ref<DetailItem | null>(null)
const showPlateModal = ref(false)

const showDeleteConfirm = ref(false)
const plateToDelete = ref<SavedItemProps | null>(null)

const addFoodModalRef = ref<InstanceType<typeof AddFoodModal> | null>(null)


const disableDelete = computed(() => {
  return user.value?.email === 'test@test.com' && savedPlatesStore.plates.length < 12
})


const currentPage = ref(1)
const searchQuery = ref('')
const sortBy = ref<SortOption>('name-asc')

const filteredPlates = computed(() => {
  let items = [...savedPlatesStore.plates]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    items = items.filter(p => p.name.toLowerCase().includes(q))
  }

  items.sort((a, b) => {
    switch (sortBy.value) {
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'calories-asc':
        return (a.calories ?? 0) - (b.calories ?? 0)
      case 'calories-desc':
        return (b.calories ?? 0) - (a.calories ?? 0)
      default:
        return 0
    }
  })

  return items
})

const paginatedPlates = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  return filteredPlates.value.slice(start, start + ITEMS_PER_PAGE)
})

function onSearchUpdate(value: string) {
  searchQuery.value = value
  currentPage.value = 1
}

function onSortUpdate(value: SortOption) {
  sortBy.value = value
  currentPage.value = 1
}

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

    <template v-if="savedPlatesStore.plates.length > 0">

      <ListFilters
        :sort="sortBy"
        @update:search="onSearchUpdate"
        @update:sort="onSortUpdate"
      />

      <Card
        v-if="filteredPlates.length === 0"
        variant="warm"
        class="text-center py-2 px-2"
      >

        <font-awesome-icon
          :icon="['fas', 'magnifying-glass']"
          class="text-2xl block mb-2"
          aria-hidden="true"
          style="color: var(--clr-text-faint); opacity: 0.5"
        />
        <p class="text-sm font-medium" style="color: var(--clr-text-muted)">
          No se encontraron resultados
        </p>
        <p class="text-xs mt-1" style="color: var(--clr-text-faint)">
          Prueba con otro término de búsqueda
        </p>
      </Card>

      <div v-else class="saved-list">
        <SavedItemCard
          v-for="plate in paginatedPlates"
          :key="plate.id"
          :item="plate"
          :disable-delete="disableDelete"

          @view="openPlateModal"
          @add="openAddPlateToDay"
          @delete="confirmDeletePlate"
        />
      </div>

      <Paginator
        v-if="filteredPlates.length > ITEMS_PER_PAGE"
        :total-items="filteredPlates.length"
        :items-per-page="ITEMS_PER_PAGE"
        :current-page="currentPage"
        @update:current-page="currentPage = $event"
      />
    </template>


    <Card
      v-else
      variant="warm"
      class="text-center py-2 px-2"
    >

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

    <!-- Plate detail modal -->
    <ItemDetailModal
      :open="showPlateModal"
      :item="selectedPlate"
      :disable-delete="disableDelete"
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
.saved-list {
  display: flex;
  flex-direction: column;
}
</style>
