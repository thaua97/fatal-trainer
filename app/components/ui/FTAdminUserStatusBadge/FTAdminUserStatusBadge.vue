<script setup lang="ts">
withDefaults(defineProps<{
  active: boolean
  size?: 'sm' | 'md'
}>(), {
  size: 'md',
})
</script>

<template>
  <span
    :class="[
      $style.badge,
      active ? $style.active : $style.inactive,
      size === 'sm' ? $style.sm : $style.md,
    ]"
    data-testid="admin-user-status-badge"
  >
    {{ active ? 'Ativo' : 'Inativo' }}
  </span>
</template>

<style module>
.badge {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  font-weight: 600;
  letter-spacing: 0.01em;
  border: 1px solid transparent;
}

.md {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
}

.sm {
  padding: 0.125rem 0.5rem;
  font-size: 0.6875rem;
}

.active {
  background: linear-gradient(
    135deg,
    rgb(var(--ft-admin-badge-active-from-rgb) / 0.95) 0%,
    rgb(var(--ft-admin-badge-active-to-rgb) / 0.75) 100%
  );
  color: var(--ft-admin-badge-active-text);
  border-color: rgb(var(--ft-admin-badge-active-from-rgb) / 0.35);
}

.inactive {
  background: linear-gradient(
    135deg,
    rgb(var(--ft-admin-badge-inactive-from-rgb) / 0.95) 0%,
    rgb(var(--ft-admin-badge-inactive-to-rgb) / 0.75) 100%
  );
  color: var(--ft-admin-badge-inactive-text);
  border-color: rgb(var(--ft-admin-badge-inactive-from-rgb) / 0.35);
}
</style>
