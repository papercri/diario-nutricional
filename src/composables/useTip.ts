import { ref, onMounted } from 'vue'
import { fetchTip } from '../services/tipsService'
import type { TipResult } from '../services/tipsService'

export function useTip() {
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

  return { currentTip, isLoading, hasError, loadTip }
}
