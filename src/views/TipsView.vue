<script setup lang="ts">
import { useTip } from '../composables/useTip'

const { currentTip, isLoading, hasError, loadTip } = useTip()
</script>

<template>
  <main class="max-w-2xl mx-auto px-4 py-8 space-y-8">
    <header class="text-center">
      <h1 class="font-display" style="font-size: 1.75rem; color: var(--clr-text)">
        Consejos de bienestar
      </h1>
      <p style="font-size: 0.875rem; color: var(--clr-text-muted); margin-top: 4px">
        Pequeños cambios, grandes resultados
      </p>
    </header>

    <div v-if="isLoading" class="text-center py-16" role="status" aria-label="Cargando consejo">
      <i
        class="fa-solid fa-spinner fa-spin-pulse text-3xl block mb-2"
        aria-hidden="true"
        style="color: var(--clr-primary)"
      />
      <p style="color: var(--clr-text-faint)">Cargando consejo...</p>
    </div>

    <article
      v-else-if="currentTip"
      class="relative p-8 rounded-2xl shadow-sm"
      style="background: var(--clr-primary-light); border: 1px solid var(--clr-border)"
      aria-label="Consejo de bienestar"
    >
      <i
        class="fa-solid fa-lightbulb text-5xl block mb-4"
        aria-hidden="true"
        style="color: var(--clr-secondary)"
      />
      <p class="font-medium" style="font-size: 1.125rem; line-height: 1.7; color: var(--clr-text)">
        {{ currentTip.tip }}
      </p>
      <p style="font-size: 0.75rem; color: var(--clr-text-faint); margin-top: 16px">
        {{ currentTip.source === 'fallback' ? 'Consejo curado' : 'Consejo del día' }}
      </p>
    </article>

    <div
      v-else-if="hasError"
      class="p-8 rounded-2xl text-center"
      style="background: var(--clr-surface-alt); border: 1px solid var(--clr-border)"
      role="alert"
    >
      <i
        class="fa-solid fa-triangle-exclamation text-3xl mb-3 block"
        aria-hidden="true"
        style="color: var(--clr-secondary)"
      />
      <p style="color: var(--clr-text-muted)">No pudimos cargar un consejo</p>
    </div>

    <div class="flex justify-center">
      <button
        class="btn btn-primary px-8 py-4 text-base"
        :disabled="isLoading"
        :aria-busy="isLoading"
        @click="loadTip"
      >
        <i class="fa-solid fa-arrows-rotate" aria-hidden="true" />
        {{ isLoading ? 'Cargando...' : 'Nuevo consejo' }}
      </button>
    </div>

    <section
      class="p-6 rounded-2xl"
      style="background: var(--clr-surface-alt); border: 1px solid var(--clr-border)"
      aria-label="Categorías de consejos"
    >
      <h2
        class="text-sm font-semibold uppercase tracking-wide mb-3"
        style="color: var(--clr-text-muted)"
      >
        Categorías
      </h2>
      <div class="flex flex-wrap gap-2">
        <span
          class="px-3 py-1.5 rounded-lg text-xs font-medium"
          style="background: var(--clr-primary-light); color: var(--clr-primary)"
        >
          <i class="fa-solid fa-apple-whole mr-1" aria-hidden="true" />Nutrición
        </span>
        <span
          class="px-3 py-1.5 rounded-lg text-xs font-medium"
          style="background: var(--clr-accent-light); color: var(--clr-accent)"
        >
          <i class="fa-solid fa-dumbbell mr-1" aria-hidden="true" />Ejercicio
        </span>
        <span
          class="px-3 py-1.5 rounded-lg text-xs font-medium"
          style="background: var(--clr-secondary-light); color: #b8942e"
        >
          <i class="fa-solid fa-droplet mr-1" aria-hidden="true" />Hidratación
        </span>
        <span
          class="px-3 py-1.5 rounded-lg text-xs font-medium"
          style="background: #e0e8d8; color: #6b7c5a"
        >
          <i class="fa-solid fa-moon mr-1" aria-hidden="true" />Sueño
        </span>
        <span
          class="px-3 py-1.5 rounded-lg text-xs font-medium"
          style="background: #ede4d8; color: #8a7660"
        >
          <i class="fa-solid fa-brain mr-1" aria-hidden="true" />Mental
        </span>
      </div>
    </section>
  </main>
</template>
