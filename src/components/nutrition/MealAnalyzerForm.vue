<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/Button.vue'

const emit = defineEmits<{
  submit: [description: string]
}>()

const textareaRef = ref<HTMLElement | null>(null)
const description = ref('')
const error = ref('')

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
        icon="fa-solid fa-wand-magic-sparkles"
      >
        Analizar
      </Button>
    </div>
    <p id="meal-description-error" v-if="error" class="meal-form__error" role="alert">
      {{ error }}
    </p>
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
</style>
