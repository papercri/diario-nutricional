<script setup lang="ts">
import { ref, computed } from 'vue'

export type SortOption = 'name-asc' | 'name-desc' | 'calories-asc' | 'calories-desc'

const props = defineProps<{
  sort: SortOption
}>()

const emit = defineEmits<{
  'update:sort': [value: SortOption]
  'update:search': [value: string]
}>()

const search = ref('')
const showSortMenu = ref(false)

const sortLabel = computed(() => {
  const labels: Record<SortOption, string> = {
    'name-asc': 'A → Z',
    'name-desc': 'Z → A',
    'calories-asc': 'Calorías ↑',
    'calories-desc': 'Calorías ↓',
  }
  return labels[props.sort]
})

function onSearchInput() {
  emit('update:search', search.value)
}

function selectSort(option: SortOption) {
  emit('update:sort', option)
  showSortMenu.value = false
}

function toggleSortMenu() {
  showSortMenu.value = !showSortMenu.value
}

function closeSortMenu() {
  showSortMenu.value = false
}
</script>

<template>
  <div class="filters">
    <!-- Search input -->
    <div class="filters__search">
      <font-awesome-icon
        :icon="['fas', 'magnifying-glass']"
        class="filters__search-icon"
        aria-hidden="true"
      />
      <input
        v-model="search"
        type="text"
        placeholder="Buscar..."
        class="filters__search-input"
        aria-label="Buscar por nombre"
        @input="onSearchInput"
      />
      <button
        v-if="search"
        class="filters__search-clear"
        aria-label="Limpiar búsqueda"
        @click="search = ''; onSearchInput()"
      >
        <font-awesome-icon :icon="['fas', 'xmark']" aria-hidden="true" />
      </button>
    </div>

    <!-- Sort dropdown -->
    <div class="filters__sort-wrapper">
      <button
        class="filters__sort-btn"
        :aria-expanded="showSortMenu"
        aria-haspopup="listbox"
        @click="toggleSortMenu"
      >
        <font-awesome-icon :icon="['fas', 'arrow-down-wide-short']" aria-hidden="true" />
        <span class="filters__sort-label">{{ sortLabel }}</span>
        <font-awesome-icon
          :icon="['fas', 'chevron-down']"
          class="filters__sort-chevron"
          :class="{ 'rotate-180': showSortMenu }"
          aria-hidden="true"
        />
      </button>
      <ul
        v-if="showSortMenu"
        class="filters__sort-menu"
        role="listbox"
        aria-label="Ordenar por"
      >
        <li
          v-for="option in (['name-asc', 'name-desc', 'calories-asc', 'calories-desc'] as SortOption[])"
          :key="option"
          class="filters__sort-option"
          :class="{ 'filters__sort-option--active': option === sort }"
          role="option"
          :aria-selected="option === sort"
          @click="selectSort(option)"
        >
          <font-awesome-icon
            v-if="option === 'name-asc'"
            :icon="['fas', 'arrow-down-a-z']"
            aria-hidden="true"
          />
          <font-awesome-icon
            v-else-if="option === 'name-desc'"
            :icon="['fas', 'arrow-up-z-a']"
            aria-hidden="true"
          />
          <font-awesome-icon
            v-else-if="option === 'calories-asc'"
            :icon="['fas', 'fire']"
            aria-hidden="true"
          />
          <font-awesome-icon
            v-else
            :icon="['fas', 'fire-flame-curved']"
            aria-hidden="true"
          />
          {{
            option === 'name-asc' ? 'A → Z' :
            option === 'name-desc' ? 'Z → A' :
            option === 'calories-asc' ? 'Menos calorías' :
            'Más calorías'
          }}
        </li>
      </ul>
    </div>

    <!-- Overlay to close sort menu -->
    <div v-if="showSortMenu" class="filters__overlay" @click="closeSortMenu" />
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0;
}

.filters__search {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.filters__search-icon {
  position: absolute;
  left: 0.75rem;
  font-size: 0.8125rem;
  color: var(--clr-text-faint);
  pointer-events: none;
}

.filters__search-input {
  width: 100%;
  padding: 0.5rem 2rem 0.5rem 2.25rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--clr-border-subtle);
  background: var(--clr-surface);
  color: var(--clr-text);
  font-size: 0.875rem;
  font-family: var(--font-body);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.filters__search-input::placeholder {
  color: var(--clr-text-faint);
}

.filters__search-input:focus {
  border-color: var(--clr-primary);
  box-shadow: 0 0 0 3px var(--clr-focus-ring);
}

.filters__search-clear {
  position: absolute;
  right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: var(--radius-full);
  border: none;
  background: var(--clr-surface-alt);
  color: var(--clr-text-faint);
  font-size: 0.625rem;
  cursor: pointer;
  transition: background 0.15s ease;
}

.filters__search-clear:hover {
  background: var(--clr-border);
}

.filters__sort-wrapper {
  position: relative;
}

.filters__sort-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--clr-border-subtle);
  background: var(--clr-surface);
  color: var(--clr-text-muted);
  font-size: 0.8125rem;
  font-weight: var(--weight-medium);
  font-family: var(--font-body);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.filters__sort-btn:hover {
  border-color: var(--clr-border);
  background: var(--clr-surface-alt);
}

.filters__sort-label {
  display: none;
}

@media (min-width: 380px) {
  .filters__sort-label {
    display: inline;
  }
}

.filters__sort-chevron {
  font-size: 0.625rem;
  transition: transform 0.2s ease;
}

.filters__sort-chevron.rotate-180 {
  transform: rotate(180deg);
}

.filters__sort-menu {
  position: absolute;
  top: calc(100% + 0.25rem);
  right: 0;
  z-index: var(--z-dropdown);
  min-width: 10rem;
  padding: 0.25rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--clr-border-subtle);
  background: var(--clr-surface);
  box-shadow: var(--shadow-lg);
  list-style: none;
  margin: 0;
  animation: slide-down 0.15s ease;
}

.filters__sort-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  color: var(--clr-text-muted);
  cursor: pointer;
  transition: background 0.1s ease;
}

.filters__sort-option:hover {
  background: var(--clr-surface-alt);
}

.filters__sort-option--active {
  background: var(--clr-primary-light);
  color: var(--clr-primary);
  font-weight: var(--weight-semibold);
}

.filters__overlay {
  position: fixed;
  inset: 0;
  z-index: calc(var(--z-dropdown) - 1);
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-0.25rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
