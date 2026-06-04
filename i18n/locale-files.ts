import { readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

export const FT_LOCALE_CODES = ['pt-BR', 'es-ES', 'en-US'] as const

export type FTLocaleCode = typeof FT_LOCALE_CODES[number]

const LOCALE_NAMES: Record<FTLocaleCode, string> = {
  'pt-BR': 'Português (BR)',
  'es-ES': 'Español',
  'en-US': 'English (US)',
}

function getRootDir(): string {
  try {
    if (import.meta.url?.startsWith('file:')) {
      return fileURLToPath(new URL('..', import.meta.url))
    }
  }
  catch {
    // Vitest and other runners may expose a non-file import.meta.url.
  }

  return process.cwd()
}

function discoverLocaleFilesInDir(
  dir: string,
  code: FTLocaleCode,
  rootDir: string,
  files: string[] = [],
): string[] {
  for (const entry of readdirSync(dir)) {
    const absolutePath = join(dir, entry)

    if (statSync(absolutePath).isDirectory()) {
      if (entry === 'locales') {
        const localeFile = join(absolutePath, `${code}.json`)
        try {
          statSync(localeFile)
          files.push(relative(rootDir, localeFile))
        }
        catch {
          // locale file not present for this component/page
        }
      }
      else {
        discoverLocaleFilesInDir(absolutePath, code, rootDir, files)
      }
    }
  }

  return files
}

export function discoverColocatedLocaleFiles(
  code: FTLocaleCode,
  rootDir = getRootDir(),
): string[] {
  return discoverLocaleFilesInDir(join(rootDir, 'app'), code, rootDir).sort()
}

export function buildI18nLocales() {
  return FT_LOCALE_CODES.map(code => ({
    code,
    name: LOCALE_NAMES[code],
    files: discoverColocatedLocaleFiles(code),
  }))
}
