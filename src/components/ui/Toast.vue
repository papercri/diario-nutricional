<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, remove } = useToast()

function iconClass(type: string) {
  if (type === 'success') return 'fa-solid fa-check-circle'
  if (type === 'error') return 'fa-solid fa-exclamation-circle'
  return 'fa-solid fa-info-circle'
}

function bgColor(type: string) {
  if (type === 'success') return 'var(--clr-success)'
  if (type === 'error') return 'var(--clr-danger)'
  return 'var(--clr-info)'
}
</script>

<template>
  <Teleport to="body">
    <div class="toast-container" aria-live="polite" aria-atomic="true">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast-item"
          :style="{ borderLeftColor: bgColor(toast.type) }"
          role="status"
        >
          <i
            :class="iconClass(toast.type)"
            class="toast-icon"
            :style="{ color: bgColor(toast.type) }"
            aria-hidden="true"
          />
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" aria-label="Cerrar" @click="remove(toast.id)">
            <i class="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: var(--space-4);
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  pointer-events: none;
  width: 100%;
  max-width: 24rem;
  padding: 0 var(--space-4);
}

.toast-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--clr-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  border-left: 3px solid;
  pointer-events: auto;
}

.toast-icon {
  font-size: var(--text-sm);
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--clr-text);
}

.toast-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border: none;
  background: transparent;
  color: var(--clr-text-faint);
  border-radius: var(--radius-xs);
  cursor: pointer;
  flex-shrink: 0;
  transition: color var(--duration-fast) var(--ease-default);
}

.toast-close:hover {
  color: var(--clr-text-muted);
}

/* Transitions */
.toast-enter-active {
  transition: all var(--duration-slow) var(--ease-out);
}
.toast-leave-active {
  transition: all var(--duration-normal) var(--ease-in);
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-1rem) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem) scale(0.95);
}

@media (prefers-reduced-motion: reduce) {
  .toast-enter-active,
  .toast-leave-active {
    transition: opacity var(--duration-normal) var(--ease-default);
  }
  .toast-enter-from,
  .toast-leave-to {
    transform: none;
  }
}
</style>
