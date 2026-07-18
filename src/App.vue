<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import Toast from './components/ui/Toast.vue'
const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="flex flex-col min-h-screen" style="background: var(--clr-bg)">
    <AppHeader />
    <Toast />

    <main class="flex-1 pb-16">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer
      class="py-8 text-center text-xs"
      style="color: var(--clr-text-faint); border-top: 1px solid var(--clr-border-subtle)"
    >
      <span>
        &copy; {{ currentYear }} Avocato · Tu diario nutricional · by
        <a
          href="https://frontend-ux.website/"
          target="_blank"
          rel="noopener noreferrer"
          class="font-medium underline"
        >
          Cristiana Sollini
        </a>
      </span>
    </footer>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: none;
  }
}
</style>
