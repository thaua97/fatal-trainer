<template>
  <div
    class="flex min-h-[120px] items-start gap-4 border-b border-slate-100/50 py-5 lg:min-h-[140px] lg:gap-6 lg:py-6 xl:rounded-2xl xl:border xl:border-slate-100/80 xl:border-b xl:px-4 [&_.animate-pulse]:bg-slate-200/50!"
    data-testid="trainer-card-skeleton"
    aria-hidden="true"
  >
    <USkeleton class="size-16 shrink-0 rounded-2xl lg:size-24 lg:rounded-3xl" />
    <div class="min-w-0 flex-1">
      <div class="flex items-start justify-between gap-3 lg:gap-4">
        <div class="min-w-0 flex-1">
          <USkeleton class="h-4 w-32 lg:h-5 lg:w-40" />
          <USkeleton class="mt-1 h-3 w-48 lg:h-4 lg:w-56" />
        </div>
        <USkeleton class="h-4 w-14 shrink-0 lg:h-5 lg:w-16" />
      </div>
      <USkeleton class="mt-2 h-4 w-20 lg:mt-3 lg:h-5 lg:w-24" />
      <div class="mt-2 flex gap-1 lg:mt-3 lg:gap-2">
        <USkeleton class="h-5 w-16 rounded-full" />
        <USkeleton class="h-5 w-14 rounded-full" />
      </div>
    </div>
  </div>
</template>
