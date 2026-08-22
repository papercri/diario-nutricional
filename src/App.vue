<script setup lang="ts">
import { onMounted } from 'vue'
import { initAuth } from '@/composables/useAuth'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import Toast from '@/components/ui/Toast.vue'
import { Analytics } from '@vercel/analytics/vue'

onMounted(() => {
  initAuth()
})
</script>

<template>
  <div class="flex flex-col min-h-screen" style="background: var(--clr-bg)">
    <a href="#main" class="skip-link">Saltar al contenido</a>
    <AppHeader />
    <Toast />

    <main id="main" class="flex-1">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <AppFooter />
  </div>
  <Analytics />
</template>

<style>
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  z-index: 9999;
  padding: 0.75rem 1.25rem;
  background: var(--clr-primary);
  color: var(--clr-text-inverse);
  font-weight: var(--weight-semibold);
  font-size: var(--text-sm);
  text-decoration: none;
  border-radius: 0 0 var(--radius-md) 0;
  transition: top 0.15s ease;
}
.skip-link:focus {
  top: 0;
}

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
