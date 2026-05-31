import { supabase } from '../lib/supabase'

export async function sendMessage({ anuncio_id, receiver_id, content }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')
  const { data, error } = await supabase
    .from('mensagens')
    .insert({ anuncio_id, sender_id: user.id, receiver_id, content })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getConversation(anuncio_id) {
  const { data, error } = await supabase
    .from('mensagens')
    .select('*')
    .eq('anuncio_id', anuncio_id)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data || []
}

export function subscribeToConversation(anuncio_id, onMessage) {
  const channel = supabase
    .channel(`mensagens:${anuncio_id}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'mensagens',
      filter: `anuncio_id=eq.${anuncio_id}`,
    }, (payload) => onMessage(payload.new))
    .subscribe()
  return () => supabase.removeChannel(channel)
}
