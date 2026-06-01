import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Building2, Eye, EyeOff, Leaf, LockKeyhole, Mail, ShieldCheck, Truck, UserRound } from 'lucide-react'
import Button from '../components/ui/Button'
import { FieldGroup } from '../components/ui/Input'
import { useAuthStore } from '../stores/authStore'

const ROLES = [
  { id: 'vendedor',       title: 'Produtor',       text: 'Publique lotes e acompanhe propostas.', Icon: UserRound },
  { id: 'comprador',      title: 'Comprador',       text: 'Negocie e acompanhe entregas.',         Icon: Building2 },
  { id: 'transportadora', title: 'Transportadora',  text: 'Receba cotações compatíveis.',           Icon: Truck },
]

const BENEFITS = [
  'Verificação de fazenda, granja ou transportadora',
  'Histórico de propostas e contratos digitais',
  'Rastreabilidade desde o primeiro anúncio',
]

export default function AuthPage() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const { login, register, loading } = useAuthStore()

  const tab  = params.get('tab') === 'register' ? 'register' : 'login'
  const role = params.get('role') || 'comprador'

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')

  function setTab(t) {
    const next = new URLSearchParams(params)
    if (t === 'register') next.set('tab', 'register'); else next.delete('tab')
    setParams(next)
    setError('')
  }

  function setRole(r) {
    const next = new URLSearchParams(params)
    next.set('role', r)
    setParams(next)
  }

  function field(k, v) { setForm((f) => ({ ...f, [k]: v })) }

  function validate() {
    if (!form.email.includes('@')) { setError('E-mail inválido'); return false }
    if (form.password.length < 6) { setError('Senha deve ter pelo menos 6 caracteres'); return false }
    if (tab === 'register' && !form.name.trim()) { setError('Nome é obrigatório'); return false }
    return true
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setError('')
    try {
      if (tab === 'login') {
        await login(form.email, form.password, role)
      } else {
        await register(form.name, form.email, form.password, role)
      }
      navigate(role === 'vendedor' ? '/vendedor' : role === 'transportadora' ? '/logistica' : '/comprador')
    } catch (err) {
      setError(err.message || 'Erro ao autenticar. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--bg))] flex">
      {/* Left panel */}
      <div className="hidden w-[420px] shrink-0 flex-col justify-between bg-brand-900 px-10 py-12 lg:flex">
        <div>
          <Link to="/" className="flex items-center gap-2.5 mb-12">
            <span className="flex h-8 w-8 items-center justify-center bg-brand-500 text-white rounded-sm">
              <Leaf size={17} />
            </span>
            <span className="text-lg font-black text-white">Agro<span className="text-brand-300">Place</span></span>
          </Link>
          <h2 className="text-2xl font-black text-white leading-tight">
            Marketplace de animais com rastreabilidade total
          </h2>
          <p className="mt-4 text-sm leading-7 text-brand-200/80">
            Conectamos produtores, compradores e transportadoras com segurança em cada etapa.
          </p>
          <ul className="mt-8 space-y-3">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm text-brand-200/80">
                <ShieldCheck size={15} className="mt-0.5 shrink-0 text-brand-400" />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-brand-400">© {new Date().getFullYear()} AgroPlace · LGPD compliant</p>
      </div>

      {/* Right: form */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-7 w-7 items-center justify-center bg-brand-600 text-white rounded-sm"><Leaf size={15} /></span>
            <span className="text-base font-black text-[hsl(var(--text))]">Agro<span className="text-brand-600">Place</span></span>
          </Link>

          <h1 className="text-2xl font-black text-[hsl(var(--text))]">
            {tab === 'register' ? 'Criar conta' : 'Entrar na plataforma'}
          </h1>
          <p className="mt-1.5 text-sm text-[hsl(var(--muted-fg))]">
            {tab === 'register' ? 'Preencha os dados abaixo para começar.' : 'Acesse sua conta para continuar.'}
          </p>

          {/* Tab switcher */}
          <div className="mt-6 flex border border-[hsl(var(--border))] rounded-sm overflow-hidden">
            {['login', 'register'].map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2.5 text-sm font-semibold transition ${tab === t ? 'bg-brand-600 text-white' : 'text-[hsl(var(--text-sub))] hover:bg-[hsl(var(--muted))]'}`}>
                {t === 'login' ? 'Entrar' : 'Cadastrar'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Role selector (register only) */}
            {tab === 'register' && (
              <div>
                <p className="field-label mb-2">Tipo de conta</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {ROLES.map(({ id, title, text, Icon }) => (
                    <button key={id} type="button" onClick={() => setRole(id)}
                      className={`flex flex-col items-center gap-2 border-2 p-3 text-center text-xs font-medium transition rounded-sm ${role === id ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-[hsl(var(--border))] text-[hsl(var(--text-sub))] hover:border-brand-300'}`}>
                      <Icon size={18} className={role === id ? 'text-brand-600' : 'text-[hsl(var(--muted-fg))]'} />
                      <span className="font-bold">{title}</span>
                      <span className="hidden sm:block text-[10px]">{text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tab === 'register' && (
              <FieldGroup label="Nome completo">
                <input className="field-input" type="text" placeholder="Seu nome completo" value={form.name} onChange={(e) => field('name', e.target.value)} required />
              </FieldGroup>
            )}

            <FieldGroup label="E-mail">
              <div className="relative">
                <Mail size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-fg))]" />
                <input className="field-input pl-9" type="email" placeholder="seu@email.com" value={form.email} onChange={(e) => field('email', e.target.value)} required />
              </div>
            </FieldGroup>

            <FieldGroup label="Senha">
              <div className="relative">
                <LockKeyhole size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-fg))]" />
                <input className="field-input pl-9 pr-10" type={showPw ? 'text' : 'password'} placeholder="Mínimo 6 caracteres" value={form.password} onChange={(e) => field('password', e.target.value)} required />
                <button type="button" onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-fg))] hover:text-[hsl(var(--text))]">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </FieldGroup>

            {error && (
              <p className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              {!loading && (tab === 'login' ? 'Entrar' : 'Criar conta')}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-[hsl(var(--muted-fg))]">
            {tab === 'login' ? 'Não tem conta?' : 'Já tem conta?'}{' '}
            <button onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
              className="font-semibold text-brand-600 hover:underline">
              {tab === 'login' ? 'Cadastrar' : 'Entrar'}
            </button>
          </p>

          <div className="mt-6 rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-4 py-3 text-xs text-[hsl(var(--muted-fg))]">
            <span className="font-semibold text-[hsl(var(--text))]">Modo demo:</span> qualquer e-mail e senha funcionam — você entra na plataforma sem precisar de cadastro real.
          </div>

          <p className="mt-4 text-center text-[11px] text-[hsl(var(--muted-fg))]">
            Ao continuar, você concorda com os <Link to="/#termos" className="text-brand-600 hover:underline">termos de uso</Link> e a{' '}
            <Link to="/#privacidade" className="text-brand-600 hover:underline">política de privacidade (LGPD)</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
