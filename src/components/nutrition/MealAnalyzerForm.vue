<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Button from '@/components/ui/Button.vue'

const STORAGE_KEY = 'avocato-meal-history'
const MAX_HISTORY = 10

const emit = defineEmits<{
  submit: [description: string]
}>()

const textareaRef = ref<HTMLElement | null>(null)
const description = ref('')
const error = ref('')
const recentInputs = ref<string[]>([])
const historyOpen = ref(true)

onMounted(() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) recentInputs.value = JSON.parse(stored) as string[]
  } catch {
    /* ignore */
  }
})

function saveToHistory(text: string) {
  const trimmed = text.trim()
  const filtered = recentInputs.value.filter(i => i.toLowerCase() !== trimmed.toLowerCase())
  filtered.unshift(trimmed)
  recentInputs.value = filtered.slice(0, MAX_HISTORY)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recentInputs.value))
}

function clearHistory() {
  recentInputs.value = []
  localStorage.removeItem(STORAGE_KEY)
}

function selectRecent(text: string) {
  description.value = text
  autoResize()
}

function autoResize() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

function handleSubmit() {
  const trimmed = description.value.trim()

  if (!trimmed) {
    error.value = 'Escribe qué comiste para analizarlo'
    return
  }

  if (trimmed.length < 3) {
    error.value = 'La descripción es muy corta'
    return
  }

  error.value = ''
  saveToHistory(trimmed)
  emit('submit', trimmed)
}

function onInput() {
  autoResize()
  if (error.value) error.value = ''
}

defineProps<{
  loading?: boolean
}>()
</script>

<template>
  <form class="meal-form" @submit.prevent="handleSubmit" novalidate>
    <!-- <label for="meal-description" class="meal-form__label">Describe tu comida</label> -->
    <div class="meal-form__row">
      <textarea
        id="meal-description"
        ref="textareaRef"
        v-model="description"
        class="meal-form__textarea"
        :class="{ 'meal-form__textarea--error': error }"
        placeholder="Ej: Pollo a la plancha con arroz y ensalada"
        rows="1"
        :disabled="loading"
        aria-describedby="meal-description-error"
        @input="onInput"
        @keydown.enter.exact.prevent="handleSubmit"
      />
      <Button
        type="submit"
        variant="accent"
        size="sm"
        :loading="loading"
        :disabled="loading"
        :icon="['fas', 'wand-magic-sparkles']"
      >
        Analizar
      </Button>
    </div>
    <p id="meal-description-error" v-if="error" class="meal-form__error" role="alert">
      {{ error }}
    </p>
    <div v-if="recentInputs.length > 0" class="meal-form__history">
      <div class="meal-form__history-header">
        <button
          type="button"
          class="meal-form__history-toggle"
          :aria-expanded="historyOpen"
          :aria-label="historyOpen ? 'Ocultar búsquedas recientes' : 'Mostrar búsquedas recientes'"
          @click="historyOpen = !historyOpen"
        >
          <font-awesome-icon
            :icon="['fas', 'clock-rotate-left']"
            class="meal-form__history-icon"
            aria-hidden="true"
          />
          <span class="meal-form__history-label">Búsquedas recientes</span>
          <font-awesome-icon
            :icon="['fas', 'chevron-down']"
            class="meal-form__history-chevron"
            :class="{ 'meal-form__history-chevron--open': historyOpen }"
            aria-hidden="true"
          />
        </button>
        <button
          type="button"
          class="meal-form__history-clear"
          aria-label="Limpiar historial"
          @click="clearHistory"
        >
          <font-awesome-icon :icon="['fas', 'xmark']" aria-hidden="true" />
        </button>
      </div>
      <div v-show="historyOpen" class="meal-form__history-list">
        <button
          v-for="(item, idx) in recentInputs"
          :key="idx"
          type="button"
          class="meal-form__pin"
          :title="item"
          @click="selectRecent(item)"
        >
          <span class="meal-form__pin-text">{{ item }}</span>
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped>
.meal-form {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.meal-form__label {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--clr-text-muted);
}

.meal-form__row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meal-form__textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--clr-border);
  background: var(--clr-surface);
  color: var(--clr-text);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  resize: none;
  min-height: 4rem;
  transition:
    border-color var(--duration-normal) var(--ease-default),
    box-shadow var(--duration-normal) var(--ease-default);
}

.meal-form__row :deep(.meal-form__btn) {
  width: 100%;
}

@media (min-width: 640px) {
  .meal-form__row {
    flex-direction: row;
    align-items: stretch;
  }

  .meal-form__textarea {
    flex: 1;
    min-height: 2.25rem;
  }
}

.meal-form__textarea::placeholder {
  color: var(--clr-text-faint);
}

.meal-form__textarea:focus {
  outline: none;
  border-color: var(--clr-primary);
  box-shadow: 0 0 0 3px var(--clr-focus-ring);
}

.meal-form__textarea:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}

.meal-form__textarea--error {
  border-color: var(--clr-danger);
}

.meal-form__textarea--error:focus {
  box-shadow: 0 0 0 3px rgba(230, 62, 17, 0.2);
}

.meal-form__error {
  font-size: var(--text-xs);
  color: var(--clr-danger);
}

.meal-form__history {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.meal-form__history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.meal-form__history-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  border: none;
  background: none;
  color: var(--clr-text-faint);
  cursor: pointer;
  padding: 0.125rem;
  transition: color 0.15s ease;
}

.meal-form__history-toggle:hover {
  color: var(--clr-accent);
}

.meal-form__history-icon {
  font-size: 0.8rem;
}

.meal-form__history-label {
  font-size: 0.65rem;
  font-weight: var(--weight-medium);
  color: var(--clr-text-faint);
}

.meal-form__history-chevron {
  font-size: 0.7rem;
  transition: transform 0.2s ease;
}

.meal-form__history-chevron--open {
  transform: rotate(180deg);
}

.meal-form__history-clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border: none;
  background: none;
  color: var(--clr-text-faint);
  cursor: pointer;
  border-radius: var(--radius-full);
  flex-shrink: 0;
  transition:
    color 0.15s ease,
    background 0.15s ease;
}

.meal-form__history-clear:hover {
  color: var(--clr-accent);
  background: var(--clr-accent-light);
}

.meal-form__history-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.meal-form__pin {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--clr-border-subtle);
  background: var(--clr-surface);
  color: var(--clr-text-muted);
  font-size: 0.65rem;
  font-weight: var(--weight-medium);
  cursor: pointer;
  max-width: 100%;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.meal-form__pin:hover {
  background: var(--clr-primary-light);
  border-color: var(--clr-primary);
  color: var(--clr-primary);
}

.meal-form__pin-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
