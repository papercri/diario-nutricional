<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-amber-50/30">
    <AppHeader />

    <main class="pb-16">
      <router-view />
    </main>

    <footer class="border-t border-amber-200/50 py-6 text-center text-xs text-slate-400">
      <p>Avocato 🥑 — Tu diario nutricional</p>
    </footer>
  </div>
</template>
