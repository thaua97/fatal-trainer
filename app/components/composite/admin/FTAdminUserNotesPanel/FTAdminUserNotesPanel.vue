<script setup lang="ts">
import type { AdminUserNotesResponse } from '#shared/types/admin'

defineProps<{
  notes?: AdminUserNotesResponse | null
  pending?: boolean
  submitting?: boolean
}>()

const emit = defineEmits<{
  submit: [string]
}>()

const { user: adminUser } = useAdminAuth()
const showForm = ref(false)
const noteContent = ref('')

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function handleSubmit() {
  const content = noteContent.value.trim()
  if (!content) return
  emit('submit', content)
  noteContent.value = ''
  showForm.value = false
}

function cancelForm() {
  noteContent.value = ''
  showForm.value = false
}
</script>

<template>
  <article
    class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
    data-testid="admin-user-notes-panel"
  >
    <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
      <div>
        <h2 class="font-display text-base font-bold text-slate-900">
          Anotações
        </h2>
        <p class="text-xs text-slate-500">
          Detalhes importantes para referência da equipe
        </p>
      </div>
      <UButton
        v-if="!showForm"
        variant="outline"
        color="primary"
        size="xs"
        icon="i-lucide-plus"
        @click="showForm = true"
      >
        Adicionar
      </UButton>
    </div>

    <div
      v-if="showForm"
      class="border-b border-slate-100 px-5 py-4"
    >
      <div class="flex items-center gap-2.5">
        <UAvatar
          :alt="adminUser?.name"
          size="sm"
          icon="i-lucide-shield"
        />
        <div>
          <p class="text-sm font-semibold text-slate-900">
            {{ adminUser?.name }}
          </p>
          <UBadge
            color="primary"
            variant="subtle"
            size="sm"
          >
            Admin
          </UBadge>
        </div>
      </div>
      <UTextarea
        v-model="noteContent"
        class="mt-3 w-full"
        placeholder="Escreva uma nova anotação"
        :rows="3"
        data-testid="note-input"
      />
      <div class="mt-3 flex items-center gap-2">
        <UButton
          color="primary"
          size="sm"
          :loading="submitting"
          :disabled="!noteContent.trim()"
          data-testid="note-submit"
          @click="handleSubmit"
        >
          Adicionar anotação
        </UButton>
        <UButton
          variant="ghost"
          color="neutral"
          size="sm"
          @click="cancelForm"
        >
          Cancelar
        </UButton>
      </div>
    </div>

    <div
      v-if="pending"
      class="flex justify-center py-12"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="size-6 animate-spin text-slate-400"
      />
    </div>

    <p
      v-else-if="!notes?.items.length"
      class="px-5 py-10 text-center text-sm text-slate-400"
    >
      Nenhuma anotação ainda
    </p>

    <ul
      v-else
      class="divide-y divide-slate-100"
    >
      <li
        v-for="note in notes.items"
        :key="note.id"
        class="px-5 py-4"
      >
        <div class="flex items-start gap-2.5">
          <UAvatar
            :alt="note.authorName"
            size="sm"
            icon="i-lucide-user"
          />
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="text-sm font-semibold text-slate-900">
                {{ note.authorName }}
              </p>
              <UBadge
                color="primary"
                variant="subtle"
                size="sm"
              >
                Admin
              </UBadge>
              <span class="text-xs text-slate-400">
                {{ formatDate(note.createdAt) }}
              </span>
            </div>
            <p class="mt-2 text-sm leading-relaxed text-slate-700">
              {{ note.content }}
            </p>
          </div>
        </div>
      </li>
    </ul>
  </article>
</template>
