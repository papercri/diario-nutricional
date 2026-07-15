import { ref } from 'vue'
import { useFoodStore } from '../stores/foodStore'
import type { FoodItem, MealType } from '../types/food'

export function useAddFood() {
  const foodStore = useFoodStore()

  const showAddModal = ref(false)
  const selectedFood = ref<FoodItem | null>(null)
  const servings = ref(1)
  const mealType = ref<MealType>('snack')

  function openAddModal(food: FoodItem) {
    selectedFood.value = food
    servings.value = 1
    mealType.value = 'snack'
    showAddModal.value = true
  }

  function confirmAdd() {
    if (!selectedFood.value) return
    foodStore.addEntry(selectedFood.value, servings.value, mealType.value)
    showAddModal.value = false
    selectedFood.value = null
  }

  function closeModal() {
    showAddModal.value = false
  }

  return { showAddModal, selectedFood, servings, mealType, openAddModal, confirmAdd, closeModal }
}
