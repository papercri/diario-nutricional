<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: string | number
    type?: 'text' | 'number' | 'email' | 'password' | 'search' | 'tel' | 'url'
    placeholder?: string
    label?: string
    helper?: string
    error?: string
    disabled?: boolean
    required?: boolean
    readonly?: boolean
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    type: 'text',
    size: 'md',
    disabled: false,
    required: false,
    readonly: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()
</script>

<template>
  <div
    :class="['ds-input-wrapper', `ds-input-wrapper--${size}`, { 'ds-input-wrapper--error': error }]"
  >
    <label v-if="label" class="ds-input__label">
      {{ label }}
      <span v-if="required" class="ds-input__required" aria-hidden="true">*</span>
    </label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :readonly="readonly"
      class="ds-input"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
    />
    <p v-if="error" class="ds-input__error">{{ error }}</p>
    <p v-else-if="helper" class="ds-input__helper">{{ helper }}</p>
  </div>
</template>

<style scoped>
.ds-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.ds-input__label {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--clr-text-muted);
}

.ds-input__required {
  color: var(--clr-accent);
}

.ds-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--clr-border);
  background: var(--clr-surface);
  color: var(--clr-text);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  transition:
    border-color var(--duration-normal) var(--ease-default),
    box-shadow var(--duration-normal) var(--ease-default);
}
.ds-input::placeholder {
  color: var(--clr-text-faint);
}
.ds-input:focus {
  outline: none;
  border-color: var(--clr-primary);
  box-shadow: 0 0 0 3px var(--clr-focus-ring);
}
.ds-input:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}

/* ── Sizes ── */
.ds-input-wrapper--sm .ds-input {
  padding: 0.375rem 0.625rem;
  font-size: var(--text-xs);
}
.ds-input-wrapper--lg .ds-input {
  padding: 0.75rem 1rem;
  font-size: var(--text-base);
}

/* ── Error state ── */
.ds-input-wrapper--error .ds-input {
  border-color: var(--clr-danger);
}
.ds-input-wrapper--error .ds-input:focus {
  box-shadow: 0 0 0 3px rgba(230, 62, 17, 0.2);
}
.ds-input__error {
  font-size: var(--text-xs);
  color: var(--clr-danger);
}
.ds-input__helper {
  font-size: var(--text-xs);
  color: var(--clr-text-faint);
}
</style>
