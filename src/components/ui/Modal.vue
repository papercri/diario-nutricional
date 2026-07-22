<script setup lang="ts">
withDefaults(
  defineProps<{
    open: boolean
    size?: 'sm' | 'md' | 'lg' | 'xl'
    closable?: boolean
    title?: string
  }>(),
  {
    size: 'md',
    closable: true,
  },
)

const emit = defineEmits<{
  close: []
}>()

function onBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    emit('close')
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="ds-modal">
      <div
        v-if="open"
        class="ds-modal-overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        @click="onBackdropClick"
        @keydown="onKeydown"
      >
        <div :class="['ds-modal', `ds-modal--${size}`]">
          <header v-if="title || closable" class="ds-modal__header">
            <h2 v-if="title" class="ds-modal__title">{{ title }}</h2>
            <button
              v-if="closable"
              class="ds-modal__close"
              aria-label="Cerrar"
              @click="emit('close')"
            >
              ✕
            </button>
          </header>
          <div class="ds-modal__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="ds-modal__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.ds-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(45, 42, 38, 0.5);
  backdrop-filter: blur(4px);
  padding: var(--space-4);
}

.ds-modal {
  background: var(--clr-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  max-height: calc(100vh - 2rem);
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* ── Sizes ── */
.ds-modal--sm {
  max-width: 24rem;
}
.ds-modal--md {
  max-width: 32rem;
}
.ds-modal--lg {
  max-width: 40rem;
}
.ds-modal--xl {
  max-width: 56rem;
}

/* ── Header ── */
.ds-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6) 0;
  min-height: 0;
}
.ds-modal__title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--weight-bold);
  color: var(--clr-text);
  margin: 0;
  line-height: 1.2;
}
.ds-modal__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: none;
  background: var(--clr-surface-alt);
  color: var(--clr-text-muted);
  font-size: var(--text-lg);
  border-radius: var(--radius-full);
  cursor: pointer;
  flex-shrink: 0;
  margin-left: auto;
  margin-top: -0.25rem;
  margin-right: -0.25rem;
  transition: background var(--duration-normal) var(--ease-default),
    color var(--duration-normal) var(--ease-default);
}
.ds-modal__close:hover {
  background: var(--clr-border);
  color: var(--clr-text);
}

/* ── Body ── */
.ds-modal__body {
  padding: var(--space-5) var(--space-6);
  overflow-y: auto;
}

/* ── Footer ── */
.ds-modal__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: 0 var(--space-6) var(--space-5);
}

/* ── Transition ── */
.ds-modal-enter-active,
.ds-modal-leave-active {
  transition: opacity var(--duration-slow) var(--ease-default);
}
.ds-modal-enter-active .ds-modal,
.ds-modal-leave-active .ds-modal {
  transition: transform var(--duration-slow) var(--ease-out);
}
.ds-modal-enter-from,
.ds-modal-leave-to {
  opacity: 0;
}
.ds-modal-enter-from .ds-modal {
  transform: scale(0.95) translateY(8px);
}
.ds-modal-leave-to .ds-modal {
  transform: scale(0.95) translateY(8px);
}

@media (prefers-reduced-motion: reduce) {
  .ds-modal-enter-active,
  .ds-modal-leave-active {
    transition: opacity var(--duration-normal) var(--ease-default);
  }
  .ds-modal-enter-active .ds-modal,
  .ds-modal-leave-active .ds-modal {
    transition: none;
  }
}
</style>
