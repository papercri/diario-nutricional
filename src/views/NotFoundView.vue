<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
</script>

<template>
  <main class="dash">
    <div class="not-found">
      <span class="not-found__code">404</span>
      <h1 class="text-display-sm">Página no encontrada</h1>
      <p class="text-body" style="color: var(--clr-text-muted)">
        La página que buscas no existe o ha sido movida.
      </p>
      <Button to="/" variant="primary" size="md">
        <font-awesome-icon :icon="['fas', 'house']" aria-hidden="true" />
        Volver al inicio
      </Button>
    </div>
  </main>
</template>

<style scoped>
.dash {
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
  padding-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 1rem;
  gap: 1rem;
}

.not-found__code {
  font-family: var(--font-display);
  font-size: 6rem;
  font-weight: var(--weight-bold);
  line-height: 1;
  color: var(--clr-primary-faint);
  user-select: none;
}
</style>
