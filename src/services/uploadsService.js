const ALLOWED_EXTS = ['jpg', 'jpeg', 'png', 'webp']

export async function uploadListingPhoto(file, _sellerId, _anuncioId) {
  const ext = file.name.split('.').pop().toLowerCase()
  if (!ALLOWED_EXTS.includes(ext)) throw new Error('Formato inválido. Use JPG, PNG ou WebP.')
  if (file.size > 5 * 1024 * 1024) throw new Error('Arquivo muito grande. Máximo 5MB.')
  // Em modo local, retorna URL temporária (object URL)
  const url = URL.createObjectURL(file)
  return { path: url, url }
}

export async function deleteListingPhoto(_storagePath) {
  // Noop em modo local
}

export function getPublicPhotoUrl(storagePath) {
  return storagePath
}
