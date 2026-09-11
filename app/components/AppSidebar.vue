<template>
  <div class="flex h-full flex-col">
    <div class="px-5 pt-5 pb-5">
      <AppWordmark :to="home" />
    </div>

    <nav :aria-label="navLabel" class="flex flex-col gap-0.5 px-3">
      <NuxtLink
        v-for="item in nav"
        :key="item.to"
        :to="item.to"
        class="row font-medium"
        :class="{ 'row-active': isActive(item) }"
        :aria-current="isActive(item) ? 'page' : undefined"
      >
        {{ item.label }}
      </NuxtLink>
    </nav>

    <div v-if="$slots.default" class="mt-6 min-h-0 flex-1 overflow-y-auto px-3 pb-4">
      <slot />
    </div>
    <div v-else class="flex-1" />

    <div class="flex flex-col gap-4 border-t border-line px-5 py-4">
      <ThemeSwitch />
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
export interface NavItem {
  to: string
  label: string
  exact?: boolean
}

withDefaults(
  defineProps<{
    nav: NavItem[]
    navLabel?: string
    home?: string
  }>(),
  { navLabel: 'Navigation principale', home: '/' },
)

const route = useRoute()

function isActive(item: NavItem) {
  return item.exact ? route.path === item.to : route.path.startsWith(item.to)
}
</script>
