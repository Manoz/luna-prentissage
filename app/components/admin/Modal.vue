<template>
  <dialog
    ref="dialogRef"
    :role="alert ? 'alertdialog' : undefined"
    :aria-labelledby="titleId"
    class="m-auto w-full bg-transparent p-0 backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    :class="maxWidthClass"
    @close="emit('close')"
    @click="onBackdropClick"
  >
    <div
      v-if="open"
      class="bg-white rounded-2xl shadow-2xl p-8"
      :class="{ 'text-center': centered }"
    >
      <slot name="icon" />
      <h2 :id="titleId" class="text-2xl font-serif font-bold text-deep-teal mb-6">
        {{ title }}
      </h2>
      <slot />
    </div>
  </dialog>
</template>

<script setup lang="ts">
interface Props {
  open: boolean
  title: string
  /** Use role="alertdialog" for destructive confirmations */
  alert?: boolean
  centered?: boolean
  size?: 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  alert: false,
  centered: false,
  size: 'lg',
})

const emit = defineEmits<{
  close: []
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)
const titleId = useId()

const maxWidthClass = computed(() => (props.size === 'md' ? 'max-w-md' : 'max-w-lg'))

// showModal() gives focus trapping, Escape handling, aria-modal and
// focus restoration for free; we only mirror the `open` prop onto it.
function syncDialog(open: boolean) {
  const dialog = dialogRef.value
  if (!dialog) return
  if (open && !dialog.open) {
    dialog.showModal()
  } else if (!open && dialog.open) {
    dialog.close()
  }
}

watch(() => props.open, syncDialog, { flush: 'post' })
onMounted(() => syncDialog(props.open))

function onBackdropClick(event: MouseEvent) {
  // Clicks on the ::backdrop are dispatched on the dialog element itself;
  // clicks inside the panel target its descendants.
  if (event.target === dialogRef.value) {
    emit('close')
  }
}
</script>
