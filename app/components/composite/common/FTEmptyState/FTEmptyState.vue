<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'search' | 'filters' | 'generic'
  title: string
  testId?: string
}>(), {
  variant: 'generic',
  testId: undefined,
})

const icon = computed(() => {
  switch (props.variant) {
    case 'search': return 'i-lucide-search-x'
    case 'filters': return 'i-lucide-sliders-horizontal'
    default: return 'i-lucide-inbox'
  }
})

const variantClass = computed(() => `ft-empty-state--${props.variant}`)
</script>

<template>
  <div
    class="ft-empty-state"
    :class="variantClass"
    role="status"
    :data-testid="testId"
  >
    <div
      class="ft-empty-state__atmosphere"
      aria-hidden="true"
    >
      <span class="ft-empty-state__orb ft-empty-state__orb--primary" />
      <span class="ft-empty-state__orb ft-empty-state__orb--secondary" />
    </div>

    <div class="ft-empty-state__card">
      <div class="ft-empty-state__icon-shell">
        <span
          class="ft-empty-state__ring"
          aria-hidden="true"
        />
        <UIcon
          :name="icon"
          class="ft-empty-state__icon"
        />
      </div>

      <p class="ft-empty-state__title">
        {{ title }}
      </p>

      <div
        v-if="$slots.default"
        class="ft-empty-state__actions"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.ft-empty-state {
  --empty-orb-primary: rgb(var(--ft-primary-rgb) / 0.18);
  --empty-orb-secondary: rgb(56 189 248 / 0.14);
  --empty-icon-bg: rgb(var(--ft-primary-rgb) / 0.08);
  --empty-icon-color: var(--ft-primary);
  --empty-ring-color: rgb(var(--ft-primary-rgb) / 0.22);

  position: relative;
  display: flex;
  justify-content: center;
  padding: 2rem 1rem 3rem;
  animation: ft-empty-enter 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.ft-empty-state--filters {
  --empty-orb-primary: rgb(244 114 182 / 0.16);
  --empty-orb-secondary: rgb(var(--ft-primary-rgb) / 0.12);
}

.ft-empty-state--generic {
  --empty-orb-primary: rgb(148 163 184 / 0.14);
  --empty-orb-secondary: rgb(var(--ft-primary-rgb) / 0.08);
  --empty-icon-bg: rgb(148 163 184 / 0.12);
  --empty-icon-color: rgb(71 85 105);
  --empty-ring-color: rgb(148 163 184 / 0.28);
}

.ft-empty-state__atmosphere {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.ft-empty-state__orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(40px);
  animation: ft-empty-float 8s ease-in-out infinite;
}

.ft-empty-state__orb--primary {
  top: 12%;
  left: 18%;
  width: 7.5rem;
  height: 7.5rem;
  background: var(--empty-orb-primary);
}

.ft-empty-state__orb--secondary {
  right: 16%;
  bottom: 8%;
  width: 6.5rem;
  height: 6.5rem;
  background: var(--empty-orb-secondary);
  animation-delay: -3s;
}

.ft-empty-state__card {
  position: relative;
  display: flex;
  width: min(100%, 22rem);
  flex-direction: column;
  align-items: center;
  border: 1px solid rgb(var(--ft-primary-rgb) / 0.08);
  border-radius: 1.75rem;
  background:
    linear-gradient(
      165deg,
      rgb(255 255 255 / 0.96) 0%,
      rgb(248 250 252 / 0.92) 55%,
      rgb(var(--ft-primary-rgb) / 0.04) 100%
    );
  padding: 2.25rem 1.75rem 2rem;
  text-align: center;
  box-shadow:
    0 1px 2px rgb(15 23 42 / 0.04),
    0 18px 40px rgb(var(--ft-primary-rgb) / 0.08);
  animation: ft-empty-card 0.75s cubic-bezier(0.22, 1, 0.36, 1) 0.08s both;
}

.ft-empty-state__icon-shell {
  position: relative;
  display: grid;
  place-items: center;
  width: 4.75rem;
  height: 4.75rem;
}

.ft-empty-state__ring {
  position: absolute;
  inset: 0;
  border: 1.5px dashed var(--empty-ring-color);
  border-radius: 9999px;
  animation: ft-empty-ring 6s linear infinite;
}

.ft-empty-state__icon {
  position: relative;
  display: grid;
  place-items: center;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 9999px;
  background: var(--empty-icon-bg);
  color: var(--empty-icon-color);
  font-size: 1.5rem;
}

.ft-empty-state__title {
  margin-top: 1.25rem;
  max-width: 16rem;
  font-size: 1.0625rem;
  font-weight: 600;
  line-height: 1.45;
  letter-spacing: -0.02em;
  color: rgb(15 23 42);
}

.ft-empty-state__actions {
  margin-top: 1.5rem;
  animation: ft-empty-actions 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.22s both;
}

@keyframes ft-empty-enter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes ft-empty-card {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes ft-empty-actions {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes ft-empty-float {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }

  50% {
    transform: translate3d(0, -10px, 0) scale(1.06);
  }
}

@keyframes ft-empty-ring {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ft-empty-state,
  .ft-empty-state__card,
  .ft-empty-state__actions,
  .ft-empty-state__orb,
  .ft-empty-state__ring {
    animation: none;
  }
}
</style>
