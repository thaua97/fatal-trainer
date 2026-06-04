import { findFeaturedTrainers } from '../../services/trainer-repository'

export default defineEventHandler(() => {
  return {
    items: findFeaturedTrainers(),
  }
})
