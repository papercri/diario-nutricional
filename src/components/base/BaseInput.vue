<script setup lang="ts">
defineProps<{
  modelValue?: string | number
  label?: string
  hint?: string
  error?: string
  type?: string
  placeholder?: string
  min?: number | string
  max?: number | string
  step?: number | string
}>()

defineEmits<{
  'update:modelValue': [value: string]
  input: [event: Event]
}>()
</script>

<template>
  <div class="space-y-2">
    <label
      v-if="label"
      :for="$attrs.id as string"
      class="block text-sm font-medium"
      style="color: var(--clr-text-muted)"
    >
      {{ label }}
    </label>
    <input
      :id="$attrs.id as string"
      :type="type ?? 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      :step="step"
      class="input-field"
      :class="$attrs.class"
      :aria-describedby="hint ? `${$attrs.id}-hint` : error ? `${$attrs.id}-error` : undefined"
      @input="$emit('input', $event)"
    />
    <span
      v-if="hint"
      :id="`${$attrs.id}-hint`"
      class="text-xs"
      style="color: var(--clr-text-faint)"
    >
      {{ hint }}
    </span>
    <span
      v-if="error"
      :id="`${$attrs.id}-error`"
      class="text-xs"
      style="color: var(--clr-accent)"
      role="alert"
    >
      {{ error }}
    </span>
  </div>
</template>
