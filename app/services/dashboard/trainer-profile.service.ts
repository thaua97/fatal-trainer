import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import type {
  MyTrainerResponse,
  UpdateTrainerProfileRequest,
  UploadGalleryResponse,
} from '#shared/types/api'
import { apiFetch } from '~/services/api/create-api-client'

export async function getMe(): Promise<MyTrainerResponse> {
  return apiFetch('/personal-trainers/me')
}

export async function update(payload: UpdateTrainerProfileRequest): Promise<{ trainer: PersonalTrainer }> {
  return apiFetch('/personal-trainers/me', {
    method: 'PATCH',
    body: payload,
  })
}

export async function uploadGallery(formData: FormData): Promise<UploadGalleryResponse> {
  return apiFetch('/personal-trainers/me/gallery', {
    method: 'POST',
    body: formData,
  })
}

export async function deleteGallery(index: number): Promise<{ trainer: PersonalTrainer }> {
  return apiFetch(`/personal-trainers/me/gallery/${index}`, {
    method: 'DELETE',
  })
}

export async function setCover(imageUrl: string): Promise<{ trainer: PersonalTrainer }> {
  return apiFetch('/personal-trainers/me/gallery/cover', {
    method: 'PATCH',
    body: { imageUrl },
  })
}

export const trainerProfileService = {
  getMe,
  update,
  uploadGallery,
  deleteGallery,
  setCover,
}
