import type { Meta } from '@storybook/vue3'

export const promoDocsDescription = `
Exibe preço promocional com tokens verdes do tema (\`--ft-promo\`, \`--ft-promo-strong\`).
Quando \`promoPrice\` é menor que \`price\`, o valor original aparece riscado e o badge de desconto usa \`FTPromoBadge\`.
`.trim()

export const filterPanelDocsDescription = `
Painel de filtros do catálogo com especialidades (multi-select), modalidade, promoção e ordenação.
Sincroniza estado com a URL via \`useTrainerFilters\`.
`.trim()

export const priceLabelArgTypes: Meta['argTypes'] = {
  price: { control: 'number', description: 'Preço base por sessão (R$)' },
  promoPrice: { control: 'number', description: 'Preço promocional quando em oferta' },
  showDiscount: { control: 'boolean', description: 'Exibe badge percentual de desconto' },
  size: {
    control: 'select',
    options: ['md', 'lg', 'responsive'],
    description: 'Escala tipográfica do preço',
  },
}

export const promoBadgeArgTypes: Meta['argTypes'] = {
  label: { control: 'text', description: 'Texto customizado (ex.: Primeira sessão)' },
  percent: { control: 'number', description: 'Percentual de desconto (-X%)' },
  size: {
    control: 'select',
    options: ['sm', 'md'],
    description: 'Tamanho do badge',
  },
}
