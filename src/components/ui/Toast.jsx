import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { useUiStore } from '../../stores/uiStore'
import { cn } from '../../lib/utils'

const icons = {
  success: <CheckCircle2 size={16} className="text-brand-600 shrink-0" />,
  error:   <XCircle     size={16} className="text-red-500 shrink-0" />,
  info:    <Info        size={16} className="text-sky-500 shrink-0" />,
}

export default function ToastContainer() {
  const { toasts, removeToast } = useUiStore()
  return (
    <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{   opacity: 0, y: 8,   scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-auto flex items-center gap-3 border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-3 shadow-hover min-w-[280px] max-w-[360px] rounded-[var(--radius)]"
          >
            {icons[t.type] ?? icons.success}
            <span className="flex-1 text-sm font-medium text-[hsl(var(--text))]">{t.message}</span>
            <button onClick={() => removeToast(t.id)} className="ml-1 text-[hsl(var(--muted-fg))] hover:text-[hsl(var(--text))]">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
