<script setup lang="ts">
import type { UserRole } from '#shared/domain/auth/entities/user'

const form = defineModel<{
  name: string
  email: string
  password: string
  role: UserRole
}>('form', { required: true })

const open = defineModel<boolean>('open', { required: true })

const { editing, pending } = defineProps<{
  editing: boolean
  pending: boolean
}>()

const emit = defineEmits<{ save: [] }>()

const roleItems = [
  { label: 'Aluno', value: 'student' },
  { label: 'Personal Trainer', value: 'personal-trainer' },
  { label: 'Admin', value: 'admin' },
]

const { fieldUi, selectUi, inputSize } = useFTFormFieldUi()
</script>

<template>
  <FTModal
    v-model:open="open"
    variant="plain"
    :title="editing ? 'Editar usuário' : 'Novo usuário'"
  >
    <form
      class="flex flex-col gap-4"
      @submit.prevent="emit('save')"
    >
      <UFormField
        label="Nome"
        required
      >
        <UInput
          v-model="form.name"
          class="w-full"
          :ui="fieldUi"
          :size="inputSize"
        />
      </UFormField>

      <UFormField
        label="E-mail"
        required
      >
        <UInput
          v-model="form.email"
          type="email"
          class="w-full"
          :ui="fieldUi"
          :size="inputSize"
        />
      </UFormField>

      <UFormField
        v-if="!editing"
        label="Senha"
        required
      >
        <UInput
          v-model="form.password"
          type="password"
          class="w-full"
          :ui="fieldUi"
          :size="inputSize"
        />
      </UFormField>

      <UFormField
        label="Papel"
        required
      >
        <USelect
          v-model="form.role"
          :items="roleItems"
          class="w-full"
          :ui="selectUi"
        />
      </UFormField>

      <div class="mt-2 flex justify-end gap-2">
        <UButton
          variant="ghost"
          color="neutral"
          @click="open = false"
        >
          Cancelar
        </UButton>
        <UButton
          type="submit"
          color="primary"
          class="rounded-full"
          :loading="pending"
        >
          Salvar
        </UButton>
      </div>
    </form>
  </FTModal>
</template>
