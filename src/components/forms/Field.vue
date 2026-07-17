<script setup lang="ts">
defineProps<{
  label?: string
  required?: boolean
  error?: string
  helper?: string
}>()
</script>

<template>
  <div class="ds-field">
    <label v-if="label" class="ds-field__label">
      {{ label }}
      <span v-if="required" class="ds-field__required" aria-hidden="true">*</span>
    </label>
    <div class="ds-field__control">
      <slot />
    </div>
    <p v-if="error" class="ds-field__error" role="alert">{{ error }}</p>
    <p v-else-if="helper" class="ds-field__helper">{{ helper }}</p>
  </div>
</template>

<style scoped>
.ds-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.ds-field__label {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--clr-text-muted);
}

.ds-field__required {
  color: var(--clr-accent);
}

.ds-field__control {
  display: flex;
  flex-direction: column;
}

.ds-field__error {
  font-size: var(--text-xs);
  color: var(--clr-danger);
  margin: 0;
}

.ds-field__helper {
  font-size: var(--text-xs);
  color: var(--clr-text-faint);
  margin: 0;
}
</style>
