import type { AdminUserActivityChange } from '#shared/types/admin'

const FIELD_LABELS: Record<string, string> = {
  name: 'Nome',
  email: 'E-mail',
  role: 'Papel',
  isActive: 'Status',
  phoneNumber: 'Telefone',
  contactPhone: 'Telefone de contato',
  profession: 'Profissão',
  description: 'Descrição',
  specialties: 'Especialidades',
  modalities: 'Modalidades',
  city: 'Cidade',
  state: 'Estado',
  servicePrice: 'Preço da sessão',
  cref: 'CREF',
  availability: 'Disponibilidade',
  experienceYears: 'Anos de experiência',
  featured: 'Destaque',
  discountPercent: 'Desconto',
  label: 'Rótulo da promoção',
  startsAt: 'Início da promoção',
  endsAt: 'Fim da promoção',
  maxRedemptions: 'Máx. resgates',
  active: 'Promoção ativa',
  promoPrice: 'Preço promocional',
}

const ROLE_LABELS: Record<string, string> = {
  student: 'Aluno',
  'personal-trainer': 'Personal',
  admin: 'Admin',
}

function formatValue(value: unknown): string | null {
  if (value === null || value === undefined || value === '') {
    return null
  }

  if (typeof value === 'boolean') {
    return value ? 'Ativo' : 'Inativo'
  }

  if (typeof value === 'number') {
    return String(value)
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : null
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  if (value === 'student' || value === 'personal-trainer' || value === 'admin') {
    return ROLE_LABELS[value] ?? String(value)
  }

  return String(value)
}

function valuesEqual(before: unknown, after: unknown): boolean {
  const beforeFormatted = formatValue(before)
  const afterFormatted = formatValue(after)
  return beforeFormatted === afterFormatted
}

function formatPriceValue(value: unknown, fallback: string | null): string | null {
  return typeof value === 'number'
    ? `R$ ${value.toFixed(2).replace('.', ',')}`
    : fallback
}

function formatFieldPair(
  field: string,
  beforeValue: unknown,
  afterValue: unknown,
): { before: string | null, after: string | null } {
  if (field === 'isActive' || field === 'featured' || field === 'active') {
    return {
      before: beforeValue ? 'Sim' : 'Não',
      after: afterValue ? 'Sim' : 'Não',
    }
  }

  let beforeFormatted = formatValue(beforeValue)
  let afterFormatted = formatValue(afterValue)

  if (field === 'role') {
    beforeFormatted = ROLE_LABELS[String(beforeValue)] ?? beforeFormatted
    afterFormatted = ROLE_LABELS[String(afterValue)] ?? afterFormatted
  }

  if (field === 'servicePrice' || field === 'promoPrice') {
    return {
      before: formatPriceValue(beforeValue, beforeFormatted),
      after: formatPriceValue(afterValue, afterFormatted),
    }
  }

  return { before: beforeFormatted, after: afterFormatted }
}

export function computeFieldChanges(
  before: Record<string, unknown>,
  after: Record<string, unknown>,
  fields: string[],
  labels: Record<string, string> = FIELD_LABELS,
): AdminUserActivityChange[] {
  const changes: AdminUserActivityChange[] = []

  for (const field of fields) {
    const beforeValue = before[field]
    const afterValue = after[field]

    if (valuesEqual(beforeValue, afterValue)) {
      continue
    }

    const { before: beforeFormatted, after: afterFormatted } = formatFieldPair(
      field,
      beforeValue,
      afterValue,
    )

    changes.push({
      field,
      label: labels[field] ?? field,
      before: beforeFormatted,
      after: afterFormatted,
    })
  }

  return changes
}
