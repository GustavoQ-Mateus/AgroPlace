import { supabase } from '../lib/supabase'

/**
 * Retorna notificações do usuário autenticado.
 * @param {{ unreadOnly?: boolean, limit?: number }} opts
 */
export async function getNotifications({ unreadOnly = false, limit = 30 } = {}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  let query = supabase
    .from('notificacoes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (unreadOnly) query = query.eq('read', false)

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

/**
 * Marca uma notificação como lida.
 */
export async function markRead(notifId) {
  const { error } = await supabase
    .from('notificacoes')
    .update({ read: true })
    .eq('id', notifId)

  if (error) throw error
}

/**
 * Marca todas como lidas.
 */
export async function markAllRead() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase
    .from('notificacoes')
    .update({ read: true })
    .eq('user_id', user.id)
    .eq('read', false)

  if (error) throw error
}

/**
 * Inscreve para receber notificações em tempo real.
 * Retorna função de cancelamento.
 *
 * @param {string} userId
 * @param {(notification: object) => void} onNew
 * @returns {() => void} unsubscribe
 */
export function subscribeNotifications(userId, onNew) {
  const channel = supabase
    .channel(`notifs:${userId}`)
    .on(
      'postgres_changes',
      {
        event:  'INSERT',
        schema: 'public',
        table:  'notificacoes',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => onNew(payload.new)
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}
