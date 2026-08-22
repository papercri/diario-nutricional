<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer
    class="py-6 text-center text-xs"
    style="color: var(--clr-text-faint); border-top: 1px solid var(--clr-border-subtle)"
  >
    <nav aria-label="Enlaces del pie de página">
      <router-link
        to="/privacidad"
        class="font-medium underline"
        style="color: var(--clr-text-faint)"
      >
        Política de privacidad
      </router-link>
    </nav>
    <span class="mt-2 block">
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
</template>
