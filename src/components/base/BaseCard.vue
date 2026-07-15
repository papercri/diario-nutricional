<script setup lang="ts">
defineProps<{
  variant?: 'default' | 'elevated'
  tag?: string
}>()
</script>

<template>
  <component :is="tag ?? 'div'" :class="variant === 'elevated' ? 'card-elevated' : 'card'">
    <slot />
  </component>
</template>
