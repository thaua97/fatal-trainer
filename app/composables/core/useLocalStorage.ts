import type { Ref } from 'vue'

export interface LocalStorageSerializer<T> {
  read: (raw: string) => T
  write: (value: T) => string
}

export interface UseLocalStorageOptions<T> {
  serializer?: LocalStorageSerializer<T>
}

function createDefaultSerializer<T>(): LocalStorageSerializer<T> {
  return {
    read: raw => JSON.parse(raw) as T,
    write: value => JSON.stringify(value),
  }
}

/**
 * SSR-safe, reactive wrapper around `localStorage`.
 *
 * On the server (or anywhere `window` is missing) it behaves like a plain ref
 * seeded with `defaultValue` and never touches storage. Read/write failures
 * (private mode, quota, corrupted JSON) are swallowed so the app keeps working.
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options: UseLocalStorageOptions<T> = {},
): Ref<T> {
  const serializer = options.serializer ?? createDefaultSerializer<T>()
  const state = ref(defaultValue) as Ref<T>

  if (typeof window === 'undefined' || !window.localStorage) {
    return state
  }

  try {
    const raw = window.localStorage.getItem(key)
    if (raw !== null) {
      state.value = serializer.read(raw)
    }
  }
  catch {
    // Corrupted payload or unavailable storage: keep the default value.
  }

  watch(
    state,
    (value) => {
      try {
        if (value === null || value === undefined) {
          window.localStorage.removeItem(key)
        }
        else {
          window.localStorage.setItem(key, serializer.write(value))
        }
      }
      catch {
        // Quota exceeded / private mode: ignore so the UI is not blocked.
      }
    },
    { deep: true },
  )

  return state
}
