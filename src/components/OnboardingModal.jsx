import { useState } from 'react'
import { CheckCircle2, ChevronRight, MapPin, Package, ShieldCheck, Truck, X } from 'lucide-react'
import Button from './ui/Button'

const STEPS = [
  {
    icon: Package,
    title: 'Publique seu lote',
    body: 'Cadastre animais em 5 etapas guiadas — espécie, localização, documentação sanitária, fotos e preço. Leva menos de 10 minutos.',
    cta: 'Criar anúncio',
  },
  {
    icon: ShieldCheck,
    title: 'Rastreabilidade gera confiança',
    body: 'Anúncios com score acima de 75% recebem 4× mais propostas. Adicione GTA, vacinações e certificados para destacar seu lote.',
    cta: 'Entendido',
  },
  {
    icon: MapPin,
    title: 'Compradores encontram você',
    body: 'Seu lote aparece no catálogo e no mapa interativo. Compradores filtram por estado, raça, preço e rastreabilidade em tempo real.',
    cta: 'Continuar',
  },
  {
    icon: Truck,
    title: 'Frete e contrato integrados',
    body: 'Após aceitar uma proposta, transportadoras parceiras cotam o frete automaticamente. O contrato digital é assinado direto na plataforma.',
    cta: 'Começar agora',
  },
]

export default function OnboardingModal({ role = 'vendedor', onClose }) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const Icon = current.icon
  const isLast = step === STEPS.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-emerald-950/60" onClick={onClose} />
      <div className="relative w-full max-w-md border border-slate-200 bg-white shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center text-slate-400 hover:text-slate-700"
        >
          <X size={16} />
        </button>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 px-6 pt-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 transition-all ${i === step ? 'w-6 bg-emerald-600' : i < step ? 'w-3 bg-emerald-300' : 'w-3 bg-slate-200'}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          <div className="mb-6 flex h-14 w-14 items-center justify-center bg-emerald-600">
            <Icon className="text-white" size={24} />
          </div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-600">
            Passo {step + 1} de {STEPS.length}
          </p>
          <h2 className="text-2xl font-black text-emerald-950">{current.title}</h2>
          <p className="mt-3 leading-7 text-slate-600">{current.body}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
          <button
            onClick={onClose}
            className="text-sm font-semibold text-slate-400 hover:text-slate-600"
          >
            Pular tutorial
          </button>
          <Button
            onClick={() => isLast ? onClose() : setStep((s) => s + 1)}
          >
            {current.cta}
            {!isLast && <ChevronRight size={15} />}
            {isLast && <CheckCircle2 size={15} />}
          </Button>
        </div>
      </div>
    </div>
  )
}
