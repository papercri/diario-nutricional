<script setup lang="ts">
defineProps<{
  icon?: string
  color?: string
}>()
</script>

<template>
  <span
    class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium"
    :style="{ background: color ?? 'var(--clr-primary-light)', color: 'var(--clr-text)' }"
  >
    <i v-if="icon" :class="icon" class="mr-1" aria-hidden="true" />
    <slot />
  </span>
</template>
