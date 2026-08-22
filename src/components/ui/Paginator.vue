<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  totalItems: number
  itemsPerPage: number
  currentPage: number
}>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

const pages = computed(() => {
  const total = totalPages.value
  const current = props.currentPage
  const result: (number | '...')[] = []

  if (total <= 5) {
    for (let i = 1; i <= total; i++) result.push(i)
    return result
  }

  result.push(1)

  if (current > 3) result.push('...')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) result.push(i)

  if (current < total - 2) result.push('...')

  result.push(total)
  return result
})

function goTo(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:currentPage', page)
  }
}
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="paginator"
    aria-label="Paginación"
  >
    <button
      class="paginator__btn"
      :disabled="currentPage === 1"
      aria-label="Página anterior"
      @click="goTo(currentPage - 1)"
    >
      <font-awesome-icon :icon="['fas', 'chevron-left']" class="text-xs" aria-hidden="true" />
    </button>

    <template v-for="(page, i) in pages" :key="i">
      <span v-if="page === '...'" class="paginator__ellipsis">...</span>
      <button
        v-else
        class="paginator__btn"
        :class="{ 'paginator__btn--active': page === currentPage }"
        :aria-current="page === currentPage ? 'page' : undefined"
        @click="goTo(page)"
      >
        {{ page }}
      </button>
    </template>

    <button
      class="paginator__btn"
      :disabled="currentPage === totalPages"
      aria-label="Página siguiente"
      @click="goTo(currentPage + 1)"
    >
      <font-awesome-icon :icon="['fas', 'chevron-right']" class="text-xs" aria-hidden="true" />
    </button>
  </nav>
</template>

<style scoped>
.paginator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.75rem 0;
}

.paginator__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.375rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--clr-border-subtle);
  background: var(--clr-surface);
  color: var(--clr-text-muted);
  font-size: 0.8125rem;
  font-weight: var(--weight-semibold);
  cursor: pointer;
  transition: all 0.15s ease;
}

.paginator__btn:hover:not(:disabled):not(.paginator__btn--active) {
  background: var(--clr-surface-alt);
  border-color: var(--clr-border);
}

.paginator__btn:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}

.paginator__btn--active {
  background: var(--clr-primary);
  border-color: var(--clr-primary);
  color: var(--clr-text-inverse);
}

.paginator__ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 2rem;
  color: var(--clr-text-faint);
  font-size: 0.8125rem;
}
</style>
