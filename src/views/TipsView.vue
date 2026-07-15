<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchTip } from '../services/tipsService'
import type { TipResult } from '../services/tipsService'

const currentTip = ref<TipResult | null>(null)
const isLoading = ref(false)
const hasError = ref(false)

async function loadTip() {
  isLoading.value = true
  hasError.value = false
  try {
    currentTip.value = await fetchTip()
  } catch {
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(loadTip)
</script>

<template>
  <main class="max-w-2xl mx-auto px-4 py-8 space-y-8">
    <header class="text-center">
      <h1 class="text-2xl font-bold text-emerald-900 font-display">Consejos de bienestar</h1>
      <p class="text-sm text-slate-500 mt-1">Pequeños cambios, grandes resultados</p>
    </header>

    <div v-if="isLoading" class="text-center py-16" role="status" aria-label="Cargando consejo">
      <i class="fa-solid fa-spinner fa-spin-pulse text-3xl text-emerald-400" aria-hidden="true" />
      <p class="text-slate-400 mt-4">Cargando consejo...</p>
    </div>

    <article
      v-else-if="currentTip"
      class="relative p-8 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-lime-50 border border-emerald-200 shadow-sm"
      aria-label="Consejo de bienestar"
    >
      <i class="fa-solid fa-lightbulb text-5xl text-amber-400 block mb-4" aria-hidden="true" />
      <p class="text-lg leading-relaxed text-slate-700 font-medium">
        {{ currentTip.tip }}
      </p>
      <p class="text-xs text-slate-400 mt-4">
        {{ currentTip.source === 'fallback' ? 'Consejo curado' : 'Consejo del día' }}
      </p>
    </article>

    <div
      v-else-if="hasError"
      class="p-8 rounded-3xl text-center"
      style="background: var(--clr-surface-alt); border: 1px solid var(--clr-border)"
      role="alert"
    >
      <i
        class="fa-solid fa-triangle-exclamation text-3xl text-amber-400 mb-3 block"
        aria-hidden="true"
      />
      <p class="text-slate-600">No pudimos cargar un consejo</p>
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
      class="p-6 rounded-3xl"
      style="background: var(--clr-surface-alt); border: 1px solid var(--clr-border)"
      aria-label="Categorías de consejos"
    >
      <h2 class="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Categorías</h2>
      <div class="flex flex-wrap gap-2">
        <span class="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 text-xs font-medium">
          <i class="fa-solid fa-apple-whole mr-1" aria-hidden="true" />Nutrición
        </span>
        <span class="px-3 py-1.5 rounded-xl bg-lime-100 text-lime-700 text-xs font-medium">
          <i class="fa-solid fa-dumbbell mr-1" aria-hidden="true" />Ejercicio
        </span>
        <span class="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-700 text-xs font-medium">
          <i class="fa-solid fa-droplet mr-1" aria-hidden="true" />Hidratación
        </span>
        <span class="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 text-xs font-medium">
          <i class="fa-solid fa-moon mr-1" aria-hidden="true" />Sueño
        </span>
        <span class="px-3 py-1.5 rounded-xl bg-lime-100 text-lime-700 text-xs font-medium">
          <i class="fa-solid fa-brain mr-1" aria-hidden="true" />Mental
        </span>
      </div>
    </section>
  </main>
</template>
