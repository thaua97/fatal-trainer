<script setup lang="ts">
export type FTModalVariant = 'hero' | 'plain' | 'media'

const props = withDefaults(defineProps<{
  tile?: string
  title?: string
  subtitle?: string
  variant?: FTModalVariant
  testId?: string
  titleId?: string
  dismissible?: boolean
  compactOnMobile?: boolean
  fullscreen?: boolean
  ui?: Record<string, string>
}>(), {
  variant: 'hero',
  dismissible: true,
  compactOnMobile: false,
  fullscreen: undefined,
})

const open = defineModel<boolean>('open', { default: false })

defineOptions({ inheritAttrs: false })

const emit = defineEmits<{
  'after:enter': []
  'after:leave': []
  'close:prevent': []
}>()

const attrs = useAttrs()

const resolvedTitleId = computed(() => props.titleId ?? 'ft-modal-title')

const isHero = computed(() => props.variant === 'hero')
const isMedia = computed(() => props.variant === 'media')
const isFullscreen = computed(() => props.fullscreen ?? isMedia.value)

const maxWidthClass = computed(() => {
  if (isHero.value) {
    return props.compactOnMobile ? 'max-w-lg lg:max-w-2xl' : 'max-w-2xl'
  }

  return 'max-w-lg'
})

const baseModalUi = computed(() => {
  if (isFullscreen.value) {
    return {
      content: 'overflow-hidden rounded-none border-0 bg-transparent p-0 shadow-none ring-0 divide-y-0',
      overlay: 'bg-slate-950/90',
      close: 'z-20',
    }
  }

  return {
    content: [
      `w-[calc(100vw-2rem)] ${maxWidthClass.value} overflow-hidden p-0`,
      'rounded-3xl border-0 bg-transparent shadow-none ring-0 divide-y-0',
    ].join(' '),
    close: 'z-20 top-4 end-4 bg-white/80 backdrop-blur-sm hover:bg-white',
  }
})

const mergedUi = computed(() => ({
  ...baseModalUi.value,
  ...props.ui,
  content: [baseModalUi.value.content, props.ui?.content].filter(Boolean).join(' '),
  overlay: props.ui?.overlay ?? baseModalUi.value.overlay,
  close: props.ui?.close ?? baseModalUi.value.close,
}))

</script>

<template>
  <UModal
    v-model:open="open"
    v-bind="attrs"
    :fullscreen="isFullscreen"
    :dismissible="dismissible"
    :ui="mergedUi"
    @after:enter="emit('after:enter')"
    @after:leave="emit('after:leave')"
    @close:prevent="emit('close:prevent')"
  >
    <slot name="trigger" />

    <template #content>
      <div
        :class="[
          'relative overflow-hidden',
          isHero
            ? 'ft-modal-card rounded-3xl'
            : isMedia
              ? 'h-full min-h-full w-full rounded-none bg-slate-950 p-0 shadow-none ring-0'
              : 'rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200/80',
        ]"
        :data-testid="testId"
      >
        <FTIconButton
          v-if="dismissible"
          size="md"
          variant="neutral"
          :class="[
            'absolute z-20',
            isMedia
              ? 'border-white/20! bg-white/10! text-white! shadow-none! backdrop-blur-sm hover:bg-white/20!'
              : 'bg-white/80 backdrop-blur-sm hover:bg-white',
            isMedia
              ? 'top-[max(1rem,env(safe-area-inset-top))] end-[max(1rem,env(safe-area-inset-right))]'
              : compactOnMobile
                ? 'top-3 end-3 lg:top-4 lg:end-4'
                : 'top-4 end-4',
          ]"
          aria-label="Fechar"
          data-testid="ft-modal-close"
          @click="open = false"
        >
          <UIcon
            name="i-lucide-x"
            :class="[
              compactOnMobile ? 'size-4 lg:size-5' : 'size-5',
              isMedia && 'text-white',
            ]"
          />
        </FTIconButton>

        <template v-if="isHero">
          <FTGradientBubbles scope="contained" />
          <FTGradientOrbs variant="card" />
        </template>

        <div
          :class="[
            'relative',
            isHero
              ? compactOnMobile
                ? 'flex w-full flex-col items-center gap-3 px-8 py-10 text-center lg:gap-4 lg:px-10 lg:py-16'
                : 'flex w-full flex-col items-center gap-4 px-10 py-16 text-center'
              : isMedia
                ? 'flex h-full min-h-full w-full flex-col'
                : '',
          ]"
        >
          <p
            v-if="tile && !isMedia"
            :class="[
              'font-semibold uppercase tracking-[0.2em] text-violet-600',
              isHero
                ? compactOnMobile
                  ? 'text-xs tracking-[0.16em] lg:text-sm lg:tracking-[0.2em]'
                  : 'text-sm'
                : 'text-xs',
            ]"
          >
            {{ tile }}
          </p>

          <h2
            v-if="title"
            :id="resolvedTitleId"
            :class="[
              isMedia
                ? 'sr-only'
                : 'font-display font-extrabold tracking-tight text-slate-900',
              isHero && !isMedia
                ? compactOnMobile
                  ? 'mt-2 text-2xl lg:mt-3 lg:text-4xl'
                  : 'mt-3 text-4xl'
                : !isMedia
                  ? 'text-xl font-bold'
                  : '',
            ]"
          >
            {{ title }}
          </h2>

          <p
            v-if="subtitle && !isMedia"
            :class="[
              'leading-relaxed text-slate-500',
              isHero
                ? compactOnMobile
                  ? 'mx-auto mt-3 max-w-sm text-xs leading-relaxed lg:mt-5 lg:max-w-xl lg:text-base lg:leading-7'
                  : 'mx-auto mt-5 max-w-xl text-base leading-7'
                : 'mt-2 text-sm',
            ]"
          >
            {{ subtitle }}
          </p>

          <section
            v-if="$slots.default"
            :class="[
              isHero
                ? compactOnMobile
                  ? 'mx-auto mt-6 flex w-full max-w-md flex-col text-left lg:mt-8 lg:max-w-xl'
                  : 'mx-auto mt-8 flex w-full max-w-xl flex-col text-left'
                : isMedia
                  ? 'flex h-full w-full flex-1 flex-col'
                  : 'mt-6',
            ]"
          >
            <slot />
          </section>

          <footer
            v-if="$slots.footer"
            :class="isHero ? 'mt-8 w-full' : 'mt-4'"
          >
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.ft-modal-card {
  border: 1px solid rgba(167, 139, 250, 0.599);
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 0.72) inset,
    0 0 0 1px rgb(221 214 254 / 0.55),
    0 24px 48px -20px rgb(var(--ft-primary-rgb) / 0.22),
    0 8px 20px -12px rgb(139 92 246 / 0.1);
  background-color: rgb(255 255 255 / 0.96);
  background-image:
    radial-gradient(circle at 14% 12%, rgb(221 214 254 / 0.9) 0%, transparent 46%),
    radial-gradient(circle at 88% 10%, rgb(186 230 253 / 0.82) 0%, transparent 42%),
    radial-gradient(circle at 50% 95%, rgb(251 207 232 / 0.72) 0%, transparent 48%),
    radial-gradient(circle at 78% 55%, rgb(196 181 253 / 0.68) 0%, transparent 40%),
    linear-gradient(
      165deg,
      rgb(var(--ft-primary-rgb) / 0.04) 0%,
      rgb(255 255 255 / 0.98) 45%,
      rgb(255 255 255) 100%
    );
}
</style>
