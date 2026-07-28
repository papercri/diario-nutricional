<script setup lang="ts">
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'

defineProps<{
  open: boolean
  itemName?: string
  title?: string
}>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()
</script>

<template>
  <Modal :open="open" size="sm" :title="title || 'Eliminar elemento'" @close="emit('close')">
    <p class="text-sm" style="color: var(--clr-text-muted)">
      ¿Seguro que quieres eliminar <strong>{{ itemName }}</strong>?
    </p>
    <template #footer>
      <Button variant="secondary" @click="emit('close')">Cancelar</Button>
      <Button variant="danger" @click="emit('confirm')">
        Eliminar
      </Button>
    </template>
  </Modal>
</template>
