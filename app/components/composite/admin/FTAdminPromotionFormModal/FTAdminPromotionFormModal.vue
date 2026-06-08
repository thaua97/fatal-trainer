<script setup lang="ts">
const form = defineModel<{
  name: string
  label: string
  discountPercent: number
  startsAt: string
  endsAt: string
  maxRedemptions: number | null
  unlimitedRedemptions: boolean
  isActive: boolean
}>('form', { required: true })

const open = defineModel<boolean>('open', { required: true })

const { editing, pending } = defineProps<{
  editing: boolean
  pending: boolean
}>()

const emit = defineEmits<{ save: [] }>()

const { fieldUi, selectUi, inputSize } = useFTFormFieldUi()
</script>

<template>
  <FTModal
    v-model:open="open"
    variant="plain"
    :title="editing ? 'Editar promoção' : 'Nova promoção'"
  >
    <form
      class="flex flex-col gap-4"
      data-testid="admin-promotion-form-modal"
      @submit.prevent="emit('save')"
    >
      <UFormField
        label="Nome interno"
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
        label="Label de exibição"
        required
      >
        <UInput
          v-model="form.label"
          class="w-full"
          :ui="fieldUi"
          :size="inputSize"
        />
      </UFormField>

      <UFormField
        label="Desconto (%)"
        required
      >
        <UInput
          v-model.number="form.discountPercent"
          type="number"
          min="5"
          max="80"
          class="w-full"
          :ui="fieldUi"
          :size="inputSize"
        />
      </UFormField>

      <div class="grid gap-4 sm:grid-cols-2">
        <UFormField
          label="Início"
          required
        >
          <UInput
            v-model="form.startsAt"
            type="date"
            class="w-full"
            :ui="fieldUi"
            :size="inputSize"
          />
        </UFormField>

        <UFormField
          label="Fim"
          required
        >
          <UInput
            v-model="form.endsAt"
            type="date"
            class="w-full"
            :ui="fieldUi"
            :size="inputSize"
          />
        </UFormField>
      </div>

      <div class="space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-sm font-medium text-slate-900">
              Resgates ilimitados
            </p>
            <p class="text-xs text-slate-500">
              Quando desativado, defina um limite máximo de resgates.
            </p>
          </div>
          <USwitch v-model="form.unlimitedRedemptions" />
        </div>

        <UFormField
          v-if="!form.unlimitedRedemptions"
          label="Limite de resgates"
        >
          <UInput
            v-model.number="form.maxRedemptions"
            type="number"
            min="1"
            class="w-full"
            :ui="fieldUi"
            :size="inputSize"
          />
        </UFormField>
      </div>

      <div class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
        <div>
          <p class="text-sm font-medium text-slate-900">
            Habilitada para personais
          </p>
          <p class="text-xs text-slate-500">
            Promoções desabilitadas não aparecem na seleção do perfil.
          </p>
        </div>
        <USwitch v-model="form.isActive" />
      </div>

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
