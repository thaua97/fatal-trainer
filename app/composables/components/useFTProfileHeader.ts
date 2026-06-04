export function useFTProfileHeader(id: MaybeRefOrGetter<string>) {
  const { trainer, pending, error } = useTrainerProfile(id)
  const hero = useFTProfileHero(trainer)

  return {
    trainer,
    pending,
    error,
    ...hero,
  }
}
