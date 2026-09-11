<template>
  <fieldset class="m-0 border-0 p-0">
    <legend class="kicker mb-2">Thème</legend>
    <div class="grid grid-cols-3 gap-0.5 rounded border border-line p-0.5">
      <label v-for="option in options" :key="option.value" class="cursor-pointer">
        <input
          type="radio"
          name="theme"
          :value="option.value"
          :checked="preference === option.value"
          class="peer sr-only"
          @change="setPreference(option.value)"
        />
        <span
          class="block rounded py-1.5 text-center text-xs font-medium text-ink-soft transition-colors hover:text-ink peer-checked:bg-surface peer-checked:text-ink peer-checked:shadow-[0_0_0_1px_var(--line)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-accent"
        >
          {{ option.label }}
        </span>
      </label>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import type { ThemePreference } from '~/composables/useTheme'

const { preference, setPreference } = useTheme()

const options: { value: ThemePreference; label: string }[] = [
  { value: 'light', label: 'Clair' },
  { value: 'dark', label: 'Sombre' },
  { value: 'system', label: 'Système' },
]
</script>
