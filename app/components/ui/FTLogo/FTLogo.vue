<script setup lang="ts">
withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>(), {
  size: 'md',
})

const sizeClasses = {
  sm: 'text-base gap-1',
  md: 'text-lg gap-1.5',
  lg: 'text-xl gap-2',
} as const
</script>

<template>
  <span
    class="inline-flex items-center font-bold"
    :class="sizeClasses[size]"
    aria-label="FatalTrainer"
  >
    <svg
      class="shrink-0 text-violet-600 transition-transform duration-300 ease-out group-hover:-rotate-[18deg] -rotate-[42deg]"
      :class="size === 'sm' ? 'size-4' : size === 'lg' ? 'size-6' : 'size-5'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line x1="2" y1="12" x2="22" y2="12" />
      <rect x="3.5" y="9.5" width="2" height="5" rx="0.5" />
      <rect x="5.5" y="7.5" width="3" height="9" rx="0.5" />
      <rect x="15.5" y="7.5" width="3" height="9" rx="0.5" />
      <rect x="18.5" y="9.5" width="2" height="5" rx="0.5" />
    </svg>
    <span>
      <span class="text-violet-600">Fatal</span><span class="text-slate-900">Trainer</span>
    </span>
  </span>
</template>
