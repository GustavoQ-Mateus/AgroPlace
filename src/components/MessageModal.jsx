import { useEffect, useRef, useState } from 'react'
import { X, Send, MessageSquare } from 'lucide-react'
import Button from './ui/Button'
import { useApp } from '../context/AppContext'
import * as msgSvc from '../services/messagesService'

export default function MessageModal({ anuncio, sellerId, onClose }) {
  const { user, addToast } = useApp()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (!anuncio?.id) return
    msgSvc.getConversation(anuncio.id)
      .then(setMessages)
      .catch(() => setMessages([]))

    const unsub = msgSvc.subscribeToConversation(anuncio.id, (msg) => {
      setMessages((prev) => [...prev, msg])
    })
    return unsub
  }, [anuncio?.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e) {
    e.preventDefault()
    if (!text.trim()) return
    setSending(true)
    const content = text.trim()
    setText('')

    if (!user || user.id?.startsWith('demo-')) {
      // Fallback local sem Supabase
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender_id: user?.id || 'demo',
          content,
          created_at: new Date().toISOString(),
          _local: true,
        },
      ])
      setSending(false)
      return
    }

    try {
      const msg = await msgSvc.sendMessage({
        anuncio_id:  anuncio.id,
        receiver_id: sellerId,
        content,
      })
      setMessages((prev) => [...prev, msg])
    } catch {
      addToast('Erro ao enviar mensagem.', 'error')
      setText(content)
    } finally {
      setSending(false)
    }
  }

  const myId = user?.id

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative flex w-full max-w-lg flex-col border border-slate-200 bg-white shadow-2xl sm:max-h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="text-emerald-600" size={18} />
            <div>
              <p className="font-black text-emerald-950 text-sm">Mensagem ao vendedor</p>
              <p className="text-xs text-slate-500 truncate max-w-56">{anuncio?.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
            <X size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-48 max-h-80">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <MessageSquare size={28} className="text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-500">Nenhuma mensagem ainda</p>
              <p className="text-xs text-slate-400 mt-1">Inicie a conversa com o vendedor.</p>
            </div>
          )}
          {messages.map((msg) => {
            const isMine = msg.sender_id === myId || msg._local
            return (
              <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 text-sm leading-5 ${
                  isMine
                    ? 'bg-emerald-600 text-white'
                    : 'border border-slate-200 bg-slate-50 text-slate-800'
                }`}>
                  <p>{msg.content}</p>
                  <p className={`mt-1 text-xs ${isMine ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="border-t border-slate-200 p-4 flex gap-2">
          <input
            className="flex-1 h-10 border border-slate-200 px-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15"
            placeholder="Digite sua mensagem..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={sending}
          />
          <Button type="submit" loading={sending} className="h-10 px-4">
            {!sending && <Send size={14} />}
          </Button>
        </form>
      </div>
    </div>
  )
}
