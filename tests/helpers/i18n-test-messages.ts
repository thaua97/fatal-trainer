import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { discoverColocatedLocaleFiles, type FTLocaleCode } from '../../i18n/locale-files'
import { mergeLocaleMessages } from '../../shared/utils/merge-locale-messages'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..')

function loadLocaleCode(code: FTLocaleCode): Record<string, unknown> {
  const rootDir = process.cwd()

  return discoverColocatedLocaleFiles(code, rootDir).reduce<Record<string, unknown>>((messages, file) => {
    const content = JSON.parse(readFileSync(join(rootDir, file), 'utf8')) as Record<string, unknown>
    return mergeLocaleMessages(messages, content)
  }, {})
}

export const testI18nMessages = {
  'pt-BR': loadLocaleCode('pt-BR'),
  'es-ES': loadLocaleCode('es-ES'),
  'en-US': loadLocaleCode('en-US'),
}
