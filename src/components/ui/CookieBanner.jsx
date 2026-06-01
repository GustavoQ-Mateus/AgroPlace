import { useState } from 'react'
import { Cookie, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './Button'

const KEY = 'agroplace_cookie_consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => !localStorage.getItem(KEY))
  const [showDetails, setShowDetails] = useState(false)

  function accept(all = true) {
    localStorage.setItem(KEY, all ? 'all' : 'essential')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.22 }}
          className="fixed bottom-4 left-4 right-4 z-[150] sm:left-auto sm:right-6 sm:max-w-sm"
          role="dialog"
          aria-label="Aviso de cookies"
        >
          <div className="card shadow-hover">
            <div className="flex items-start justify-between gap-3 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <Cookie size={18} className="text-brand-600 shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-[hsl(var(--text))]">Cookies e privacidade</p>
              </div>
              <button
                onClick={() => accept('essential')}
                className="text-[hsl(var(--muted-fg))] hover:text-[hsl(var(--text))] transition shrink-0"
                aria-label="Fechar"
              >
                <X size={15} />
              </button>
            </div>

            <div className="px-5 pb-4">
              <p className="text-xs leading-5 text-[hsl(var(--muted-fg))]">
                Usamos cookies essenciais para funcionamento e, com seu consentimento, cookies analíticos para melhorar a experiência. Seus dados são protegidos conforme a{' '}
                <span className="font-semibold text-brand-700">LGPD — Lei 13.709/2018</span>.
              </p>

              {showDetails && (
                <div className="mt-3 space-y-2 rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-3 text-xs text-[hsl(var(--muted-fg))]">
                  <div>
                    <p className="font-bold text-[hsl(var(--text))]">Essenciais</p>
                    <p>Sessão, autenticação e preferências. Não podem ser desativados.</p>
                  </div>
                  <div>
                    <p className="font-bold text-[hsl(var(--text))]">Analíticos</p>
                    <p>Usados para entender como você navega na plataforma. Sem identificação pessoal.</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowDetails((v) => !v)}
                className="mt-2 text-[11px] font-semibold text-brand-600 hover:underline"
              >
                {showDetails ? 'Ocultar detalhes' : 'Ver detalhes'}
              </button>
            </div>

            <div className="flex gap-2 border-t border-[hsl(var(--border))] px-5 py-3">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => accept(false)}
              >
                Só essenciais
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs"
                onClick={() => accept(true)}
              >
                Aceitar todos
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
