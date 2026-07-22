<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer
    class="py-6 text-center text-xs"
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
</template>
