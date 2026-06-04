# Design — Fatal Trainer

Mockups hi-fi UI flat (backgrounds apenas em botões), alinhados ao [PRD de Design](../docs/prd-design.md) v1.2 e à [Especificação de componentes FT](../docs/arquitetura/especificacao-componentes-ft.md).

## Arquivo

- **[fatal-trainer.pen](./fatal-trainer.pen)** — abrir no editor [Pencil](https://pencil.dev)

## Sincronização com o código (obrigatório)

Componentes da biblioteca **FT** devem existir **no Vue e no `.pen`**, com o **mesmo nome** (`FTAvatar`, `FTTrainerCard`, …).

| Direção | O que fazer |
|---------|-------------|
| Código → `.pen` | Após criar/alterar em `app/components/ui/` ou `composite/`, atualizar o reusable no Pencil |
| `.pen` → Código | Após desenhar no Pencil, criar pasta `FT<Nome>/` com `.vue`, `.spec.ts`, `.stories.ts` |
| PR | Preferir commit único com `fatal-trainer.pen` + arquivos Vue |

Regras completas: [docs/arquitetura/especificacao-componentes-ft.md](../docs/arquitetura/especificacao-componentes-ft.md) §8.

**Importante:** não editar o `.pen` como texto no IDE; usar o Pencil ou Pencil MCP. O script abaixo regenera estrutura base, mas não substitui o fluxo manual para novos componentes FT.

## Identidade visual (v1.2)

| Token | Valor |
|-------|-------|
| primary | `#7C3AED` (violet) |
| surface | `#FFFFFF` |
| search pill | `#F1F5F9` |
| font | Plus Jakarta Sans |

## Regenerar estrutura base

```bash
node design/generate-pen.mjs
```

Use após mudanças estruturais grandes; para cada componente FT novo, atualize também o reusable correspondente no Pencil.
