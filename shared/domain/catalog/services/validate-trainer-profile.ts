import { BRAZILIAN_STATES } from '../constants/brazilian-states'
import { CATALOG_MODALITIES, CATALOG_SPECIALTIES } from '../constants/catalog-options'
import { isValidCrefFormat } from '../../../utils/format-cref'
import type {
  TrainerInfoPayload,
  TrainerInfoValidationErrors,
  TrainerProfileValidationResult,
  TrainerPromotionActivationPayload,
  TrainerPromotionPayload,
  TrainerPromotionValidationErrors,
} from '../entities/trainer-profile-payloads'

const PHONE_DIGITS_MIN = 10
const PHONE_DIGITS_MAX = 11
const MIN_DISCOUNT_PERCENT = 5
const MAX_DISCOUNT_PERCENT = 80

function countPhoneDigits(phone: string): number {
  return phone.replace(/\D/g, '').length
}

function isValidDateString(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const date = new Date(`${value}T12:00:00`)
  return !Number.isNaN(date.getTime())
}

function validateRequiredText(
  value: string,
  minLength = 1,
): 'required' | 'tooShort' | undefined {
  const trimmed = value.trim()
  if (!trimmed) {
    return 'required'
  }

  if (trimmed.length < minLength) {
    return 'tooShort'
  }

  return undefined
}

function validateContactPhone(phone: string): TrainerInfoValidationErrors['contactPhone'] {
  const trimmed = phone.trim()
  if (!trimmed) {
    return 'required'
  }

  const digits = countPhoneDigits(trimmed)
  if (digits < PHONE_DIGITS_MIN || digits > PHONE_DIGITS_MAX) {
    return 'invalid'
  }

  return undefined
}

function validateCatalogOptions<T extends string>(
  values: string[],
  allowed: readonly T[],
): 'required' | 'invalid' | undefined {
  if (!values.length) {
    return 'required'
  }

  if (values.some(value => !allowed.includes(value as T))) {
    return 'invalid'
  }

  return undefined
}

function validateTrainerLocation(
  city: string,
  state: string,
): Pick<TrainerInfoValidationErrors, 'city' | 'state'> {
  const errors: Pick<TrainerInfoValidationErrors, 'city' | 'state'> = {}
  const trimmedCity = city.trim()

  if (!trimmedCity) {
    errors.city = 'required'
  }

  const normalizedState = state.trim().toUpperCase()
  if (!normalizedState) {
    errors.state = 'required'
  } else if (!BRAZILIAN_STATES.has(normalizedState)) {
    errors.state = 'invalid'
  }

  return errors
}

export function validateTrainerInfo(
  payload: TrainerInfoPayload,
): TrainerProfileValidationResult<TrainerInfoValidationErrors> {
  const errors: TrainerInfoValidationErrors = {}

  const nameError = validateRequiredText(payload.name, 2)
  if (nameError) {
    errors.name = nameError
  }

  const contactPhoneError = validateContactPhone(payload.contactPhone)
  if (contactPhoneError) {
    errors.contactPhone = contactPhoneError
  }

  if (!payload.profession.trim()) {
    errors.profession = 'required'
  }

  const descriptionError = validateRequiredText(payload.description, 20)
  if (descriptionError) {
    errors.description = descriptionError
  }

  const specialtiesError = validateCatalogOptions(payload.specialties, CATALOG_SPECIALTIES)
  if (specialtiesError) {
    errors.specialties = specialtiesError
  }

  const modalitiesError = validateCatalogOptions(payload.modalities, CATALOG_MODALITIES)
  if (modalitiesError) {
    errors.modalities = modalitiesError
  }

  Object.assign(errors, validateTrainerLocation(payload.city, payload.state))

  if (!Number.isFinite(payload.servicePrice) || payload.servicePrice <= 0) {
    errors.servicePrice = 'invalid'
  }

  const cref = payload.cref.trim()
  if (!cref) {
    errors.cref = 'required'
  } else if (!isValidCrefFormat(cref)) {
    errors.cref = 'invalid'
  }

  if (!payload.availability.trim()) {
    errors.availability = 'required'
  }

  if (!Number.isFinite(payload.experienceYears) || payload.experienceYears < 0 || payload.experienceYears > 60) {
    errors.experienceYears = 'invalid'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

function validatePromotionDates(
  startsAt: string,
  endsAt: string,
): Pick<TrainerPromotionValidationErrors, 'startsAt' | 'endsAt'> {
  const errors: Pick<TrainerPromotionValidationErrors, 'startsAt' | 'endsAt'> = {}
  const startsAtValid = Boolean(startsAt && isValidDateString(startsAt))
  const endsAtValid = Boolean(endsAt && isValidDateString(endsAt))

  if (!startsAtValid) {
    errors.startsAt = 'invalid'
  }

  if (!endsAtValid) {
    errors.endsAt = 'invalid'
  } else if (startsAtValid && endsAt < startsAt) {
    errors.endsAt = 'beforeStart'
  }

  return errors
}

function validateMaxRedemptions(
  maxRedemptions: number | null | undefined,
): TrainerPromotionValidationErrors['maxRedemptions'] {
  if (maxRedemptions == null) {
    return undefined
  }

  if (!Number.isFinite(maxRedemptions) || maxRedemptions < 1) {
    return 'invalid'
  }

  return undefined
}

export function validateTrainerPromotion(
  payload: TrainerPromotionPayload,
  servicePrice: number,
): TrainerProfileValidationResult<TrainerPromotionValidationErrors> {
  const errors: TrainerPromotionValidationErrors = {}

  if (!payload.active) {
    return { valid: true, errors }
  }

  if (servicePrice <= 0) {
    errors.active = 'noServicePrice'
  }

  if (
    !Number.isFinite(payload.discountPercent)
    || payload.discountPercent < MIN_DISCOUNT_PERCENT
    || payload.discountPercent > MAX_DISCOUNT_PERCENT
  ) {
    errors.discountPercent = 'invalid'
  }

  if (!payload.label.trim()) {
    errors.label = 'required'
  }

  Object.assign(errors, validatePromotionDates(payload.startsAt, payload.endsAt))

  const maxRedemptionsError = validateMaxRedemptions(payload.maxRedemptions)
  if (maxRedemptionsError) {
    errors.maxRedemptions = maxRedemptionsError
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateTrainerPromotionActivation(
  payload: TrainerPromotionActivationPayload,
  servicePrice: number,
): TrainerProfileValidationResult<TrainerPromotionValidationErrors> {
  const errors: TrainerPromotionValidationErrors = {}

  if (payload.templateId === null) {
    return { valid: true, errors }
  }

  if (!payload.templateId?.trim()) {
    errors.templateId = 'required'
  }

  if (servicePrice <= 0) {
    errors.templateId = 'noServicePrice'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
