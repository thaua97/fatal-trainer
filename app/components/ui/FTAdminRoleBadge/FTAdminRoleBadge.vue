<script setup lang="ts">
import type { UserRole } from '#shared/domain/auth/entities/user'

const props = withDefaults(defineProps<{
  role: UserRole
  label: string
  size?: 'sm' | 'md'
}>(), {
  size: 'md',
})

const toneClass = computed(() => {
  const map: Record<UserRole, string> = {
    admin: 'admin',
    student: 'student',
    'personal-trainer': 'trainer',
  }
  return map[props.role]
})
</script>

<template>
  <span
    :class="[
      $style.badge,
      $style[toneClass],
      size === 'sm' ? $style.sm : $style.md,
    ]"
    data-testid="admin-role-badge"
  >
    {{ label }}
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

.admin {
  background: linear-gradient(
    135deg,
    rgb(var(--ft-admin-badge-admin-from-rgb) / 0.95) 0%,
    rgb(var(--ft-admin-badge-admin-to-rgb) / 0.75) 100%
  );
  color: var(--ft-admin-badge-admin-text);
  border-color: rgb(var(--ft-admin-badge-admin-from-rgb) / 0.35);
}

.student {
  background: linear-gradient(
    135deg,
    rgb(var(--ft-admin-badge-student-from-rgb) / 0.95) 0%,
    rgb(var(--ft-admin-badge-student-to-rgb) / 0.75) 100%
  );
  color: var(--ft-admin-badge-student-text);
  border-color: rgb(var(--ft-admin-badge-student-from-rgb) / 0.35);
}

.trainer {
  background: linear-gradient(
    135deg,
    rgb(var(--ft-admin-badge-trainer-from-rgb) / 0.95) 0%,
    rgb(var(--ft-admin-badge-trainer-to-rgb) / 0.75) 100%
  );
  color: var(--ft-admin-badge-trainer-text);
  border-color: rgb(var(--ft-admin-badge-trainer-from-rgb) / 0.35);
}
</style>
