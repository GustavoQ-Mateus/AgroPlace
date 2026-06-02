import { AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { IPhoneFrame } from '../components/IOSSimulator'

export default function IOSPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-950 overflow-hidden">
      {/* Subtle radial glow behind the phone */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 50% 52%, rgba(34,197,94,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Back link */}
      <Link
        to="/"
        className="absolute top-5 left-6 flex items-center gap-2 text-white/40 hover:text-white/80 text-xs tracking-widest uppercase transition-colors"
      >
        <ArrowLeft size={13} />
        Voltar
      </Link>

      <AnimatePresence>
        <IPhoneFrame showClose={false} />
      </AnimatePresence>
    </div>
  )
}
