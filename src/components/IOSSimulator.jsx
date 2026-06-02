import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Smartphone } from 'lucide-react'

export const isEmbedded =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('embed') === 'true'

function SignalIcon() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor" className="text-black dark:text-white">
      <rect x="0" y="6" width="3" height="6" rx="1" />
      <rect x="4.5" y="4" width="3" height="8" rx="1" />
      <rect x="9" y="2" width="3" height="10" rx="1" />
      <rect x="13.5" y="0" width="3" height="12" rx="1" opacity="0.4" />
    </svg>
  )
}

function WifiIcon() {
  return (
    <svg width="15" height="12" viewBox="0 0 15 12" fill="none" className="text-black dark:text-white">
      <circle cx="7.5" cy="11" r="1.5" fill="currentColor" />
      <path d="M4.2 7.5a4.7 4.7 0 0 1 6.6 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M1.5 4.8a8.5 8.5 0 0 1 12 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function BatteryIcon() {
  return (
    <svg width="25" height="12" viewBox="0 0 25 12" fill="none" className="text-black dark:text-white">
      <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="1.5" y="1.5" width="15" height="9" rx="2.5" fill="currentColor" />
      <path d="M23 4v4a2 2 0 0 0 0-4z" fill="currentColor" fillOpacity="0.45" />
    </svg>
  )
}

export function IPhoneFrame({ onClose, showClose = true }) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const fmt = () =>
      setTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
    fmt()
    const t = setInterval(fmt, 15000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!showClose) return
    const fn = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose, showClose])

  return (
    <motion.div
      initial={{ scale: 0.88, opacity: 0, y: 32 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.88, opacity: 0, y: 32 }}
      transition={{ type: 'spring', damping: 24, stiffness: 300 }}
      className="relative"
      style={{ maxHeight: '95vh' }}
    >
      {/* Phone body */}
      <div
        style={{
          width: 390,
          height: 844,
          background: 'linear-gradient(160deg, #3d3d3f 0%, #1c1c1e 100%)',
          borderRadius: 54,
          boxShadow:
            '0 0 0 1px rgba(255,255,255,0.13),' +
            '0 60px 120px rgba(0,0,0,0.95),' +
            'inset 0 1px 0 rgba(255,255,255,0.08)',
          position: 'relative',
        }}
      >
        {/* Buttons */}
        <div style={{ position:'absolute', left:-3, top:126, width:3, height:28, background:'#4a4a4c', borderRadius:'2px 0 0 2px' }} />
        <div style={{ position:'absolute', left:-3, top:172, width:3, height:62, background:'#4a4a4c', borderRadius:'2px 0 0 2px' }} />
        <div style={{ position:'absolute', left:-3, top:250, width:3, height:62, background:'#4a4a4c', borderRadius:'2px 0 0 2px' }} />
        <div style={{ position:'absolute', right:-3, top:188, width:3, height:90, background:'#4a4a4c', borderRadius:'0 2px 2px 0' }} />

        {/* Screen */}
        <div
          style={{
            position: 'absolute',
            top: 10, left: 10, right: 10, bottom: 10,
            borderRadius: 46,
            overflow: 'hidden',
            background: '#fff',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)',
          }}
        >
          {/* Status bar */}
          <div
            style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: 54, zIndex: 10,
              background: 'linear-gradient(to bottom, rgba(255,255,255,1) 65%, rgba(255,255,255,0))',
              display: 'flex', alignItems: 'flex-end',
              justifyContent: 'space-between',
              padding: '0 28px 6px',
              pointerEvents: 'none',
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 600, color: '#000', lineHeight: 1, fontFamily: '-apple-system,BlinkMacSystemFont,sans-serif' }}>
              {time}
            </span>
            {/* Dynamic Island */}
            <div style={{
              position: 'absolute', top: 13, left: '50%',
              transform: 'translateX(-50%)',
              width: 124, height: 35,
              background: '#000', borderRadius: 50,
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <SignalIcon />
              <WifiIcon />
              <BatteryIcon />
            </div>
          </div>

          {/* App content */}
          <iframe
            src={window.location.origin + '/?embed=true'}
            title="AgroPlace App"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />

          {/* Home indicator */}
          <div style={{
            position: 'absolute', bottom: 8, left: '50%',
            transform: 'translateX(-50%)',
            width: 130, height: 5,
            background: 'rgba(0,0,0,0.2)', borderRadius: 10,
            zIndex: 10, pointerEvents: 'none',
          }} />
        </div>
      </div>

      {/* Model label below phone */}
      <div className="mt-4 text-center text-white/30 text-[10px] tracking-[0.2em] uppercase font-medium">
        iPhone 15 Pro · AgroPlace
      </div>
    </motion.div>
  )
}

function IPhoneModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/40 text-xs font-medium tracking-widest uppercase">
        Simulador — AgroPlace
      </div>
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
        title="Fechar (Esc)"
      >
        <X size={20} />
      </button>
      <IPhoneFrame onClose={onClose} showClose={true} />
    </motion.div>
  )
}

export function SimulatorButton() {
  const [open, setOpen] = useState(false)
  if (isEmbedded) return null

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.96 }}
        className="hidden md:flex fixed bottom-7 right-7 z-40 items-center gap-2.5 bg-zinc-900 text-white pl-4 pr-5 py-3 rounded-2xl shadow-2xl hover:bg-zinc-800 transition-colors border border-zinc-700"
      >
        <Smartphone size={18} strokeWidth={2} />
        <span className="text-sm font-semibold tracking-tight">Ver no iPhone</span>
      </motion.button>

      <AnimatePresence>
        {open && <IPhoneModal onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  )
}

export default SimulatorButton
