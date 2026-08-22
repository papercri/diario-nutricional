<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSavedRecipesStore } from '@/stores/savedRecipesStore'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

import SavedItemCard from '@/components/SavedItemCard.vue'
import AddFoodModal from '@/components/AddFoodModal.vue'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'
import ItemDetailModal from '@/components/ItemDetailModal.vue'
import Paginator from '@/components/ui/Paginator.vue'
import ListFilters from '@/components/ui/ListFilters.vue'
import type { SortOption } from '@/components/ui/ListFilters.vue'
import type { SavedItemProps } from '@/components/SavedItemCard.vue'
import type { DetailItem } from '@/components/ItemDetailModal.vue'

const ITEMS_PER_PAGE = 10

const savedRecipesStore = useSavedRecipesStore()
const { user } = useAuth()
const toast = useToast()

const selectedRecipe = ref<DetailItem | null>(null)
const showRecipeModal = ref(false)

const showDeleteConfirm = ref(false)
const recipeToDelete = ref<SavedItemProps | null>(null)

const addFoodModalRef = ref<InstanceType<typeof AddFoodModal> | null>(null)


const disableDelete = computed(() => {
  return user.value?.email === 'test@test.com' && savedRecipesStore.recipes.length < 12
})


const currentPage = ref(1)
const searchQuery = ref('')
const sortBy = ref<SortOption>('name-asc')

const filteredRecipes = computed(() => {
  let items = [...savedRecipesStore.recipes]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    items = items.filter(r => r.name.toLowerCase().includes(q))
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

const paginatedRecipes = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  return filteredRecipes.value.slice(start, start + ITEMS_PER_PAGE)
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
    await savedRecipesStore.loadRecipes()
  }
})

function openRecipeModal(recipe: any) {
  selectedRecipe.value = recipe as DetailItem
  showRecipeModal.value = true
}

function confirmDeleteRecipe(recipe: any) {
  recipeToDelete.value = recipe
  showDeleteConfirm.value = true
}

async function deleteRecipe() {
  if (!recipeToDelete.value) return
  await savedRecipesStore.deleteRecipe(recipeToDelete.value.id)
  showRecipeModal.value = false
  selectedRecipe.value = null
  showDeleteConfirm.value = false
  recipeToDelete.value = null
  toast.show('Receta eliminada')
}

function cancelDelete() {
  showDeleteConfirm.value = false
  recipeToDelete.value = null
}

function openAddRecipeToDay(recipe: any) {
  showRecipeModal.value = false
  if (addFoodModalRef.value) {
    addFoodModalRef.value.open({
      id: recipe.id,
      name: recipe.name,
      calories: recipe.calories ?? 0,
      protein: recipe.protein ?? 0,
      carbs: recipe.carbs ?? 0,
      fat: recipe.fat ?? 0,
    })
  }
}
</script>

<template>
  <main class="dash">
    <header class="dash__header">
      <div class="dash__title-row">
        <h1 class="text-display-lg">
          <font-awesome-icon
            :icon="['fas', 'cookie']"
            aria-hidden="true"
            style="color: var(--clr-primary)"
          />
          Mis recetas
        </h1>
        <router-link to="/nueva-receta" class="btn btn-primary btn-sm">
          <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" aria-hidden="true" />
          Nueva receta
        </router-link>
      </div>
      <p class="text-body-sm">Recetas que has generado y guardado</p>
    </header>

    <template v-if="savedRecipesStore.recipes.length > 0">

      <ListFilters
        :sort="sortBy"
        @update:search="onSearchUpdate"
        @update:sort="onSortUpdate"
      />

      <div
        v-if="filteredRecipes.length === 0"
        class="card-warm text-center py-2 px-2"
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
      </div>

      <div v-else class="saved-list">
        <SavedItemCard
          v-for="recipe in paginatedRecipes"
          :key="recipe.id"
          :item="recipe"

          :disable-delete="disableDelete"


          @view="openRecipeModal"
          @add="openAddRecipeToDay"
          @delete="confirmDeleteRecipe"
        />
      </div>

      <Paginator
        v-if="filteredRecipes.length > ITEMS_PER_PAGE"
        :total-items="filteredRecipes.length"
        :items-per-page="ITEMS_PER_PAGE"
        :current-page="currentPage"
        @update:current-page="currentPage = $event"
      />
    </template>

    <div v-else class="card-warm text-center py-2 px-2">
      <font-awesome-icon
        :icon="['fas', 'cookie']"
        class="text-3xl block mb-2"
        aria-hidden="true"
        style="color: var(--clr-primary); opacity: 0.3"
      />
      <p class="text-sm font-medium" style="color: var(--clr-text-muted)">
        No hay recetas guardadas
      </p>
      <p class="text-xs mt-1 mb-3" style="color: var(--clr-text-faint)">
        Genera una receta y guárdala aquí
      </p>
      <router-link to="/nueva-receta" class="btn btn-primary btn-sm">
        <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" aria-hidden="true" />
        Generar receta
      </router-link>
    </div>

    <!-- Recipe detail modal -->
    <ItemDetailModal
      :open="showRecipeModal"
      :item="selectedRecipe"
      :disable-delete="disableDelete"
      @close="showRecipeModal = false"
      @add="openAddRecipeToDay"
      @delete="confirmDeleteRecipe"
    />

    <!-- Add food modal -->
    <AddFoodModal ref="addFoodModalRef" />

    <!-- Delete confirmation modal -->
    <ConfirmDeleteModal
      :open="showDeleteConfirm"
      :item-name="recipeToDelete?.name"
      title="Eliminar receta"
      @close="cancelDelete"
      @confirm="deleteRecipe"
    />
  </main>
</template>

<style scoped>
.saved-list {
  display: flex;
  flex-direction: column;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-display);
  font-weight: var(--weight-bold);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  text-decoration: none;
}
.btn:focus-visible {
  outline: 2px solid var(--clr-primary);
  outline-offset: 2px;
}
.btn-primary {
  background: var(--clr-primary);
  color: #fff;
}
.btn-primary:hover {
  background: var(--clr-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}
.btn-primary:active {
  transform: translateY(0);
}
.btn-sm {
  padding: 0.5rem 0.75rem;
  font-size: var(--text-xs);
}

.card-warm {
  background: var(--clr-surface-alt);
  border-radius: var(--radius-xl);
  border: 1px solid var(--clr-border-subtle);
}
</style>
