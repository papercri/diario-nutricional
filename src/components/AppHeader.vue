<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMenuOpen = ref(false)

const links = [
  { name: 'dashboard', path: '/', label: 'Inicio', icon: ['fas', 'house'] as [string, string] },
  { name: 'search', path: '/search', label: 'Buscar', icon: ['fas', 'magnifying-glass'] as [string, string] },
  {
    name: 'nutrition-ai',
    path: '/nutrition-ai',
    label: 'Mis platos',
    icon: ['fas', 'wand-magic-sparkles'] as [string, string],
  },
  {
    name: 'recipes',
    path: '/recetas',
    label: 'Recetas',
    icon: ['fas', 'utensils'] as [string, string],
  },
  { name: 'profile', path: '/profile', label: 'Mi perfil', icon: ['fas', 'user'] as [string, string] },
]

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

watch(
  () => route.path,
  () => closeMenu(),
)
</script>

<template>
  <header
    class="sticky top-0 z-50 backdrop-blur-md"
    style="border-bottom: 1px solid var(--clr-border-subtle); background: rgba(250, 245, 235, 0.92)"
  >
    <div class="max-w-4xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
      <router-link
        to="/"
        class="flex items-center gap-2.5 no-underline group"
        aria-label="Avocato — ir al inicio"
      >
        <div
          class="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
          style="background: var(--clr-primary)"
        >
          <font-awesome-icon :icon="['fas', 'leaf']" class="text-sm" aria-hidden="true" style="color: #fff" />
        </div>
        <span class="font-display text-lg font-bold tracking-tight"> Avocato </span>
      </router-link>

      <!-- Desktop nav -->
      <nav class="hidden sm:flex items-center gap-1" aria-label="Navegación principal">
        <router-link
          v-for="link in links"
          :key="link.name"
          :to="link.path"
          class="btn btn-ghost text-sm"
          :aria-current="route.name === link.name ? 'page' : undefined"
          :class="route.name === link.name ? 'btn-primary' : ''"
        >
          <font-awesome-icon :icon="link.icon" aria-hidden="true" />
          <span class="hidden lg:inline">{{ link.label }}</span>
        </router-link>
      </nav>

      <!-- Hamburger -->
      <button
        class="sm:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg transition-colors hover:bg-black/5"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-menu"
        aria-label="Menú de navegación"
        @click="toggleMenu"
      >
        <span
          class="block w-5 h-0.5 rounded-full transition-all duration-300"
          :style="{ background: 'var(--clr-primary)' }"
          :class="isMenuOpen ? 'translate-y-[4px] rotate-45' : ''"
          aria-hidden="true"
        />
        <span
          class="block w-5 h-0.5 rounded-full transition-all duration-300 mt-1"
          :style="{ background: 'var(--clr-primary)' }"
          :class="isMenuOpen ? 'opacity-0' : ''"
          aria-hidden="true"
        />
        <span
          class="block w-5 h-0.5 rounded-full transition-all duration-300 mt-1"
          :style="{ background: 'var(--clr-primary)' }"
          :class="isMenuOpen ? '-translate-y-[6px] -rotate-45' : ''"
          aria-hidden="true"
        />
      </button>
    </div>

    <!-- Mobile nav -->
    <Transition name="menu">
      <nav
        id="mobile-menu"
        v-if="isMenuOpen"
        class="sm:hidden"
        style="
          border-top: 1px solid var(--clr-border-subtle);
          background: rgba(250, 245, 235, 0.98);
        "
        aria-label="Navegación principal"
      >
        <div class="max-w-4xl mx-auto px-4 py-3 space-y-1">
          <router-link
            v-for="link in links"
            :key="link.name"
            :to="link.path"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 no-underline"
            :aria-current="route.name === link.name ? 'page' : undefined"
            :class="route.name === link.name ? 'text-white shadow-sm' : 'hover:bg-black/5'"
            :style="
              route.name === link.name
                ? 'background: var(--clr-primary); color: #fff'
                : 'color: var(--clr-text)'
            "
          >
            <font-awesome-icon :icon="link.icon" aria-hidden="true" />
            {{ link.label }}
          </router-link>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  transform-origin: top;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: scaleY(0.95);
}

@media (prefers-reduced-motion: reduce) {
  .menu-enter-active,
  .menu-leave-active {
    transition: none;
  }
}
</style>
