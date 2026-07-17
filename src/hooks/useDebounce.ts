import { ref, watch } from 'vue'

export function useDebounce<T>(value: { value: T }, delay = 300) {
  const debounced = ref<T>(value.value) as { value: T }

  let timeoutId: ReturnType<typeof setTimeout> | null = null

  watch(
    () => value.value,
    newVal => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        debounced.value = newVal
        timeoutId = null
      }, delay)
    },
  )

  return debounced
}
