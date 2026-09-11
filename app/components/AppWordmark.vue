<template>
  <NuxtLink :to="to" class="inline-block text-[15px] font-bold tracking-[0.02em] text-ink">
    LUNA<span class="text-ink-faint" aria-hidden="true">·</span>PRENTISSAGE
  </NuxtLink>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ to?: string }>(), { to: '/' })
</script>
