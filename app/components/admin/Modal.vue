<template>
  <dialog
    ref="dialogRef"
    :role="alert ? 'alertdialog' : undefined"
    :aria-labelledby="titleId"
    class="m-auto w-full bg-transparent p-4 text-ink backdrop:bg-black/50"
    :class="maxWidthClass"
    @close="emit('close')"
    @click="onBackdropClick"
  >
    <div
      v-if="open"
      class="rounded border border-line bg-paper p-6 shadow-[0_16px_40px_-16px_rgb(0_0_0/0.4)] sm:p-7"
      :class="{ 'text-center': centered }"
    >
      <slot name="icon" />
      <h2 :id="titleId" class="mb-5 text-xl font-semibold tracking-tight">
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
