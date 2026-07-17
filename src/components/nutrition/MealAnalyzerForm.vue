<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/Button.vue'

const emit = defineEmits<{
  submit: [description: string]
}>()

const description = ref('')
const error = ref('')

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

function clearError() {
  if (error.value) error.value = ''
}

defineProps<{
  loading?: boolean
}>()
</script>

<template>
  <form class="meal-form" @submit.prevent="handleSubmit" novalidate>
    <div class="meal-form__field">
      <label for="meal-description" class="meal-form__label"> Describe tu comida </label>
      <textarea
        id="meal-description"
        v-model="description"
        class="meal-form__textarea"
        :class="{ 'meal-form__textarea--error': error }"
        placeholder="Ej: Pollo a la plancha con arroz y ensalada"
        rows="3"
        :disabled="loading"
        aria-describedby="meal-description-error"
        @input="clearError"
      />
      <p id="meal-description-error" v-if="error" class="meal-form__error" role="alert">
        {{ error }}
      </p>
    </div>
    <Button
      type="submit"
      variant="accent"
      size="md"
      :loading="loading"
      :disabled="loading"
      icon="fa-solid fa-wand-magic-sparkles"
    >
      {{ loading ? 'Analizando...' : 'Analizar comida' }}
    </Button>
  </form>
</template>

<style scoped>
.meal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.meal-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.meal-form__label {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--clr-text-muted);
}

.meal-form__textarea {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--clr-border);
  background: var(--clr-surface);
  color: var(--clr-text);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  resize: vertical;
  min-height: 5rem;
  transition:
    border-color var(--duration-normal) var(--ease-default),
    box-shadow var(--duration-normal) var(--ease-default);
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
