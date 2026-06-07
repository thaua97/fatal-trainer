<script setup lang="ts">
import type { ReportStatus } from '#shared/types/admin'

const props = withDefaults(defineProps<{
  status: ReportStatus
  label: string
  size?: 'sm' | 'md'
}>(), {
  size: 'md',
})

const toneClass = computed(() => {
  const map: Record<ReportStatus, string> = {
    pending: 'pending',
    in_review: 'review',
    resolved: 'resolved',
    archived: 'archived',
  }
  return map[props.status]
})
</script>

<template>
  <span
    :class="[
      $style.badge,
      $style[toneClass],
      size === 'sm' ? $style.sm : $style.md,
    ]"
    data-testid="admin-report-status-badge"
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

.pending {
  background: linear-gradient(
    135deg,
    rgb(var(--ft-admin-badge-pending-from-rgb) / 0.95) 0%,
    rgb(var(--ft-admin-badge-pending-to-rgb) / 0.75) 100%
  );
  color: var(--ft-admin-badge-pending-text);
  border-color: rgb(var(--ft-admin-badge-pending-from-rgb) / 0.35);
}

.review {
  background: linear-gradient(
    135deg,
    rgb(var(--ft-admin-badge-review-from-rgb) / 0.95) 0%,
    rgb(var(--ft-admin-badge-review-to-rgb) / 0.75) 100%
  );
  color: var(--ft-admin-badge-review-text);
  border-color: rgb(var(--ft-admin-badge-review-from-rgb) / 0.35);
}

.resolved {
  background: linear-gradient(
    135deg,
    rgb(var(--ft-admin-badge-resolved-from-rgb) / 0.95) 0%,
    rgb(var(--ft-admin-badge-resolved-to-rgb) / 0.75) 100%
  );
  color: var(--ft-admin-badge-resolved-text);
  border-color: rgb(var(--ft-admin-badge-resolved-from-rgb) / 0.35);
}

.archived {
  background: linear-gradient(
    135deg,
    rgb(var(--ft-admin-badge-archived-from-rgb) / 0.95) 0%,
    rgb(var(--ft-admin-badge-archived-to-rgb) / 0.75) 100%
  );
  color: var(--ft-admin-badge-archived-text);
  border-color: rgb(var(--ft-admin-badge-archived-from-rgb) / 0.35);
}
</style>
