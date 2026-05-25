import { supabase } from '../lib/supabase'

const BUCKET_FOTOS  = 'anuncio-fotos'
const BUCKET_DOCS   = 'rastreabilidade-docs'

/**
 * Faz upload de uma foto de anúncio e retorna a URL pública.
 *
 * @param {File}   file       Arquivo de imagem
 * @param {string} sellerId   UUID do vendedor
 * @param {string} anuncioId  UUID do anúncio
 * @returns {{ path: string, url: string }}
 */
export async function uploadListingPhoto(file, sellerId, anuncioId) {
  const ext  = file.name.split('.').pop().toLowerCase()
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const path = `${sellerId}/${anuncioId}/${name}`

  const { error } = await supabase.storage
    .from(BUCKET_FOTOS)
    .upload(path, file, { cacheControl: '3600', upsert: false })

  if (error) throw error

  const { data } = supabase.storage.from(BUCKET_FOTOS).getPublicUrl(path)
  return { path, url: data.publicUrl }
}

/**
 * Remove uma foto de anúncio do storage.
 */
export async function deleteListingPhoto(storagePath) {
  const { error } = await supabase.storage
    .from(BUCKET_FOTOS)
    .remove([storagePath])

  if (error) throw error
}

/**
 * Faz upload de um documento de rastreabilidade.
 *
 * @param {File}   file       PDF ou imagem
 * @param {string} sellerId   UUID do vendedor
 * @param {string} anuncioId  UUID do anúncio
 * @returns {{ path: string, url: string }}
 */
export async function uploadTraceabilityDoc(file, sellerId, anuncioId) {
  const ext  = file.name.split('.').pop().toLowerCase()
  const name = `${Date.now()}.${ext}`
  const path = `${sellerId}/${anuncioId}/${name}`

  const { error } = await supabase.storage
    .from(BUCKET_DOCS)
    .upload(path, file, { cacheControl: '3600', upsert: false })

  if (error) throw error

  // Documento privado — gera URL com expiração de 1 hora
  const { data, error: urlErr } = await supabase.storage
    .from(BUCKET_DOCS)
    .createSignedUrl(path, 3600)

  if (urlErr) throw urlErr
  return { path, url: data.signedUrl }
}

/**
 * Gera URL pública de uma foto já armazenada.
 */
export function getPublicPhotoUrl(storagePath) {
  const { data } = supabase.storage.from(BUCKET_FOTOS).getPublicUrl(storagePath)
  return data.publicUrl
}
