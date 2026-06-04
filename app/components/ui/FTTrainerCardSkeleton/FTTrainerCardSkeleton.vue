<template>
  <div
    class="flex min-h-[120px] items-start gap-4 border-b border-slate-100/50 py-5 [&_.animate-pulse]:bg-slate-200/50!"
    data-testid="trainer-card-skeleton"
    aria-hidden="true"
  >
    <USkeleton class="size-18 shrink-0 rounded-2xl" />
    <div class="relative min-w-0 flex-1 pr-16">
      <USkeleton class="h-3 w-24" />
      <USkeleton class="mt-1 h-5 w-40" />
      <USkeleton class="mt-1 h-3 w-32" />
      <USkeleton class="mt-2 h-4 w-20" />
      <div class="mt-2 flex gap-1">
        <USkeleton class="h-5 w-16 rounded-full" />
        <USkeleton class="h-5 w-14 rounded-full" />
      </div>
      <USkeleton class="absolute right-0 top-0 h-4 w-12" />
    </div>
  </div>
</template>
