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

const currentPage = ref(1)

const paginatedRecipes = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  return savedRecipesStore.recipes.slice(start, start + ITEMS_PER_PAGE)
})

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

    <div v-if="savedRecipesStore.recipes.length === 0" class="card-warm text-center py-8 px-4">
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

    <div v-else class="saved-list">
      <SavedItemCard
        v-for="recipe in paginatedRecipes"
        :key="recipe.id"
        :item="recipe"
        @view="openRecipeModal"
        @add="openAddRecipeToDay"
        @delete="confirmDeleteRecipe"
      />
    </div>

    <Paginator
      v-if="savedRecipesStore.recipes.length > ITEMS_PER_PAGE"
      :total-items="savedRecipesStore.recipes.length"
      :items-per-page="ITEMS_PER_PAGE"
      :current-page="currentPage"
      @update:current-page="currentPage = $event"
    />

    <!-- Recipe detail modal -->
    <ItemDetailModal
      :open="showRecipeModal"
      :item="selectedRecipe"
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
