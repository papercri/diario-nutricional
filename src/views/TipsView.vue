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
  <div class="max-w-2xl mx-auto px-4 py-8 space-y-8">
    <header class="text-center">
      <h1 class="text-2xl font-bold text-emerald-900 font-display">Consejos de bienestar</h1>
      <p class="text-sm text-slate-500 mt-1">Pequeños cambios, grandes resultados</p>
    </header>

    <div v-if="isLoading" class="text-center py-16">
      <div
        class="inline-block w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"
      />
      <p class="text-slate-400 mt-4">Cargando consejo...</p>
    </div>

    <div
      v-else-if="currentTip"
      class="relative p-8 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-lime-50 border border-emerald-200 shadow-sm"
    >
      <span class="text-5xl block mb-4">💡</span>
      <p class="text-lg leading-relaxed text-slate-700 font-medium">
        {{ currentTip.tip }}
      </p>
      <p class="text-xs text-slate-400 mt-4">
        {{ currentTip.source === 'fallback' ? 'Consejo curado' : 'Consejo del día' }}
      </p>
    </div>

    <div
      v-else-if="hasError"
      class="p-8 rounded-3xl bg-amber-50 border border-amber-200 text-center"
    >
      <p class="text-slate-600">No pudimos cargar un consejo</p>
    </div>

    <div class="flex justify-center">
      <button
        class="px-8 py-4 rounded-2xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 active:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isLoading"
        @click="loadTip"
      >
        {{ isLoading ? 'Cargando...' : 'Nuevo consejo' }}
      </button>
    </div>

    <div class="p-6 rounded-3xl bg-amber-50 border border-amber-200 space-y-3">
      <h2 class="text-sm font-semibold text-slate-500 uppercase tracking-wide">Categorías</h2>
      <div class="flex flex-wrap gap-2">
        <span class="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 text-xs font-medium"
          >Nutrición</span
        >
        <span class="px-3 py-1.5 rounded-xl bg-lime-100 text-lime-700 text-xs font-medium"
          >Ejercicio</span
        >
        <span class="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-700 text-xs font-medium"
          >Hidratación</span
        >
        <span class="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 text-xs font-medium"
          >Sueño</span
        >
        <span class="px-3 py-1.5 rounded-xl bg-lime-100 text-lime-700 text-xs font-medium"
          >Mental</span
        >
      </div>
    </div>
  </div>
</template>
