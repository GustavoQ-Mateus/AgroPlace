import { useEffect, useRef, useState } from 'react'
import { MessageSquare, Send, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Button from './ui/Button'
import { useAuthStore } from '../stores/authStore'
import { useUiStore } from '../stores/uiStore'
import * as msgSvc from '../services/messagesService'

export default function MessageModal({ anuncio, sellerId, onClose }) {
  const user    = useAuthStore((s) => s.user)
  const addToast = useUiStore((s) => s.addToast)
  const [messages, setMessages] = useState([])
  const [text, setText]         = useState('')
  const [sending, setSending]   = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (!anuncio?.id) return
    msgSvc.getConversation(anuncio.id).then(setMessages).catch(() => setMessages([]))
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
      setMessages((prev) => [...prev, { id: Date.now(), sender_id: user?.id || 'demo', content, created_at: new Date().toISOString(), _local: true }])
      setSending(false)
      return
    }
    try {
      const msg = await msgSvc.sendMessage({ anuncio_id: anuncio.id, receiver_id: sellerId, content })
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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:items-center sm:justify-center">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2 }}
          className="relative flex w-full max-w-lg flex-col card shadow-hover sm:max-h-[600px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-5 py-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="text-brand-600 shrink-0" size={17} />
              <div>
                <p className="font-bold text-[hsl(var(--text))] text-sm">Mensagem ao vendedor</p>
                <p className="text-xs text-[hsl(var(--muted-fg))] truncate max-w-56">{anuncio?.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center text-[hsl(var(--muted-fg))] transition hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--text))] rounded-sm"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-48 max-h-80">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <MessageSquare size={28} className="mb-2 text-[hsl(var(--border))]" />
                <p className="text-sm font-semibold text-[hsl(var(--text))]">Nenhuma mensagem ainda</p>
                <p className="text-xs text-[hsl(var(--muted-fg))] mt-1">Inicie a conversa com o vendedor.</p>
              </div>
            )}
            {messages.map((msg) => {
              const isMine = msg.sender_id === myId || msg._local
              return (
                <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-sm px-3 py-2 text-sm leading-5 ${
                    isMine
                      ? 'bg-brand-600 text-white'
                      : 'border border-[hsl(var(--border))] bg-[hsl(var(--muted))] text-[hsl(var(--text))]'
                  }`}>
                    <p>{msg.content}</p>
                    <p className={`mt-1 text-[10px] ${isMine ? 'text-brand-200' : 'text-[hsl(var(--muted-fg))]'}`}>
                      {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="flex gap-2 border-t border-[hsl(var(--border))] p-4">
            <input
              className="field-input flex-1"
              placeholder="Digite sua mensagem…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={sending}
            />
            <Button type="submit" loading={sending} size="md">
              {!sending && <Send size={14} />}
            </Button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
