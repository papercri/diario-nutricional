<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMenuOpen = ref(false)

const links = [
  { name: 'dashboard', path: '/', label: 'Inicio', icon: 'fa-solid fa-house' },
  { name: 'search', path: '/search', label: 'Buscar', icon: 'fa-solid fa-magnifying-glass' },
  { name: 'profile', path: '/profile', label: 'Perfil', icon: 'fa-solid fa-user' },
  { name: 'tips', path: '/tips', label: 'Consejos', icon: 'fa-solid fa-lightbulb' },
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
    class="sticky top-0 z-50 backdrop-blur-md border-b shadow-sm"
    style="background: rgba(255, 251, 235, 0.85); border-color: var(--clr-border-subtle)"
  >
    <div class="max-w-4xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
      <router-link
        to="/"
        class="flex items-center gap-2 no-underline group"
        aria-label="Avocato — ir al inicio"
      >
        <i class="fa-solid fa-leaf text-emerald-600 text-xl" aria-hidden="true" />
        <span
          class="font-bold text-lg tracking-tight text-emerald-900 group-hover:text-emerald-700 transition-colors font-display"
        >
          Avocato
        </span>
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
          <i :class="link.icon" aria-hidden="true" />
          <span class="hidden lg:inline">{{ link.label }}</span>
        </router-link>
      </nav>

      <!-- Hamburger -->
      <button
        class="sm:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl hover:bg-emerald-100/70 transition-colors"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-menu"
        aria-label="Menú de navegación"
        @click="toggleMenu"
      >
        <span
          class="block w-5 h-0.5 rounded-full transition-all duration-300"
          style="background-color: #059669"
          :class="isMenuOpen ? 'translate-y-[4px] rotate-45' : ''"
          aria-hidden="true"
        />
        <span
          class="block w-5 h-0.5 rounded-full transition-all duration-300 mt-1"
          style="background-color: #059669"
          :class="isMenuOpen ? 'opacity-0' : ''"
          aria-hidden="true"
        />
        <span
          class="block w-5 h-0.5 rounded-full transition-all duration-300 mt-1"
          style="background-color: #059669"
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
        class="sm:hidden border-t backdrop-blur-md"
        aria-label="Navegación principal"
        style="border-color: var(--clr-border-subtle); background: rgba(255, 251, 235, 0.95)"
      >
        <div class="max-w-4xl mx-auto px-4 py-3 space-y-1">
          <router-link
            v-for="link in links"
            :key="link.name"
            :to="link.path"
            class="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 no-underline"
            :aria-current="route.name === link.name ? 'page' : undefined"
            :class="
              route.name === link.name
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-emerald-800 hover:bg-emerald-100/70'
            "
          >
            <i :class="link.icon" aria-hidden="true" />
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
