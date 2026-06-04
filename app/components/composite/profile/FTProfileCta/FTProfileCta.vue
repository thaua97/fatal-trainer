<script setup lang="ts">
const { label, disabled } = useFTProfileCta()
</script>

<template>
  <div
    class="fixed inset-x-0 bottom-0 z-40 border-t border-slate-100 bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
    data-testid="trainer-profile-cta"
  >
    <button
      type="button"
      :class="$style.ctaPill"
      :disabled="disabled"
      :aria-label="$t('profile.comingSoon', { label })"
    >
      {{ label }}
    </button>
  </div>
</template>

<style module>
.ctaPill {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: var(--ft-primary);
  padding: 1rem 1.5rem;
  font-weight: 700;
  color: var(--ft-primary-foreground);
  transition: background-color 0.15s ease;
}

.ctaPill:hover:not(:disabled) {
  background: var(--ft-primary-hover);
}

.ctaPill:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
