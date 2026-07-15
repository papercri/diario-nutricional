<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const links = [
  { name: 'dashboard', path: '/', label: 'Inicio', icon: '📊' },
  { name: 'search', path: '/search', label: 'Buscar', icon: '🔍' },
  { name: 'profile', path: '/profile', label: 'Perfil', icon: '👤' },
  { name: 'tips', path: '/tips', label: 'Consejos', icon: '💡' },
]
</script>

<template>
  <header
    class="sticky top-0 z-50 backdrop-blur-md bg-amber-50/80 border-b border-amber-200/50 shadow-sm"
  >
    <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2 no-underline group">
        <span class="text-2xl">🥑</span>
        <span
          class="font-bold text-lg tracking-tight text-emerald-900 group-hover:text-emerald-700 transition-colors font-display"
        >
          Avocato
        </span>
      </router-link>

      <nav class="flex items-center gap-1">
        <router-link
          v-for="link in links"
          :key="link.name"
          :to="link.path"
          class="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-medium transition-all duration-200 no-underline"
          :class="
            route.name === link.name
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'text-emerald-800 hover:bg-emerald-100/70'
          "
        >
          <span class="hidden sm:inline">{{ link.label }}</span>
        </router-link>
      </nav>
    </div>
  </header>
</template>
