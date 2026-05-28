import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, Building2, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, Phone, ShieldCheck, Truck, UserRound } from 'lucide-react'
import Button from '../components/ui/Button'
import { useApp } from '../context/AppContext'
import * as authSvc from '../services/authService'

const roles = [
  { id: 'vendedor',       title: 'Produtor',        text: 'Publique lotes, acompanhe propostas e documentos.', icon: UserRound },
  { id: 'comprador',      title: 'Comprador',        text: 'Salve buscas, negocie e acompanhe entregas.', icon: Building2 },
  { id: 'transportadora', title: 'Transportadora',   text: 'Receba cotações compatíveis com sua frota.', icon: Truck },
]

const benefits = [
  'Verificação de fazenda, granja ou transportadora',
  'Histórico de propostas e contratos digitais',
  'Rastreabilidade visível desde o primeiro anúncio',
]

const DEMO_HINT = {
  vendedor:       'vendedor@demo.com',
  comprador:      'comprador@demo.com',
  transportadora: 'frete@demo.com',
}

export default function AuthPage() {
  const [params, setParams]       = useSearchParams()
  const navigate                  = useNavigate()
  const { login, register }       = useApp()
  const tab                       = params.get('tab') === 'register' ? 'register' : 'login'
  const selectedRole              = params.get('role') || 'vendedor'

  const [form, setForm]           = useState({ name: '', email: '', phone: '', password: '' })
  const [errors, setErrors]       = useState({})
  const [showPass, setShowPass]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [serverError, setServerError] = useState('')
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)

  function setTab(nextTab) {
    const next = new URLSearchParams(params)
    if (nextTab === 'register') next.set('tab', 'register')
    else next.delete('tab')
    setParams(next)
    setErrors({})
    setServerError('')
  }

  function setRole(role) {
    const next = new URLSearchParams(params)
    next.set('tab', 'register')
    next.set('role', role)
    setParams(next)
  }

  function field(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
    setServerError('')
  }

  function validate() {
    const errs = {}
    if (tab === 'register' && !form.name.trim()) errs.name = 'Informe o nome ou razão social'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'E-mail inválido'
    if (tab === 'register' && !form.phone.trim()) errs.phone = 'Informe o telefone'
    if (!form.password || form.password.length < 6) errs.password = 'Senha deve ter pelo menos 6 caracteres'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setServerError('')
    try {
      let u
      if (tab === 'register') {
        u = await register({ email: form.email, password: form.password, name: form.name, phone: form.phone, role: selectedRole })
      } else {
        u = await login(form.email, form.password, selectedRole)
      }
      const role = u?.user_metadata?.role || selectedRole
      const dest = role === 'produtor' || role === 'vendedor' ? '/vendedor'
                 : role === 'transportadora' ? '/logistica'
                 : '/comprador'
      navigate(dest)
    } catch (err) {
      const msg = err?.message || ''
      if (msg.includes('Invalid login credentials')) setServerError('E-mail ou senha incorretos.')
      else if (msg.includes('already registered'))   setServerError('Este e-mail já está cadastrado.')
      else if (msg.includes('Email not confirmed'))  setServerError('Confirme seu e-mail antes de entrar.')
      else setServerError(msg || 'Erro ao processar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const hintEmail = DEMO_HINT[selectedRole]

  return (
    <section className="min-h-screen bg-slate-50 pt-14">
      <div className="mx-auto grid max-w-7xl min-h-[calc(100vh-56px)] lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left: brand panel */}
        <div className="hidden border-r border-slate-200 bg-emerald-950 px-12 py-16 lg:flex lg:flex-col lg:justify-center">
          <Link to="/" className="mb-10 flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-white">
              Agro<span className="text-emerald-400">Place</span>
            </span>
          </Link>

          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-400">Onboarding</p>
          <h1 className="text-3xl font-black leading-tight text-white">
            Entre com o perfil certo para sua operação
          </h1>
          <p className="mt-4 text-base leading-7 text-emerald-100/70">
            O acesso muda o painel, os documentos e o fluxo de negociação conforme o papel de cada participante.
          </p>

          <div className="mt-10 divide-y divide-emerald-800 border border-emerald-800">
            {benefits.map((item) => (
              <div className="flex items-center gap-3 px-4 py-4" key={item}>
                <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
                <p className="text-sm font-semibold text-emerald-100">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 border border-emerald-800/60 bg-emerald-900/40 px-4 py-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-400">Demo rápida</p>
            <p className="text-sm text-emerald-200">Use qualquer e-mail ou experimente:</p>
            <div className="mt-2 space-y-1">
              {Object.entries(DEMO_HINT).map(([role, email]) => (
                <p key={role} className="text-xs font-mono text-emerald-300">{email} / qualquer senha</p>
              ))}
            </div>
          </div>
        </div>

        {/* Right: form panel */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-16">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto w-full max-w-md"
            initial={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6 border border-slate-200 bg-white">
              {/* Tab switcher */}
              <div className="grid grid-cols-2 border-b border-slate-200">
                <button
                  className={`py-3 text-sm font-bold transition ${tab === 'login' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}
                  onClick={() => setTab('login')}
                >
                  Entrar
                </button>
                <button
                  className={`py-3 text-sm font-bold transition ${tab === 'register' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}
                  onClick={() => setTab('register')}
                >
                  Criar conta
                </button>
              </div>

              <div className="p-6">
                {tab === 'register' && (
                  <div className="mb-5">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Perfil de acesso</p>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {roles.map((role) => (
                        <button
                          className={`flex flex-col gap-2 border p-3 text-left transition ${selectedRole === role.id ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                          key={role.id}
                          onClick={() => setRole(role.id)}
                        >
                          <role.icon
                            className={selectedRole === role.id ? 'text-emerald-700' : 'text-slate-400'}
                            size={18}
                          />
                          <p className={`text-sm font-bold ${selectedRole === role.id ? 'text-emerald-950' : 'text-slate-700'}`}>
                            {role.title}
                          </p>
                          <p className="text-xs leading-4 text-slate-500">{role.text}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {serverError && (
                  <div className="mb-4 flex items-center gap-2 border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700">
                    <AlertCircle size={14} className="shrink-0" />
                    {serverError}
                  </div>
                )}

                <form className="grid gap-4" onSubmit={handleSubmit}>
                  {tab === 'register' && (
                    <label className="grid gap-1.5">
                      <span className="prop-label">Nome ou razão social *</span>
                      <input
                        className={`h-10 border px-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15 ${errors.name ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                        placeholder="Fazenda Santa Cruz"
                        value={form.name}
                        onChange={(e) => field('name', e.target.value)}
                      />
                      {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
                    </label>
                  )}

                  <label className="grid gap-1.5">
                    <span className="prop-label">E-mail *</span>
                    <span className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input
                        className={`h-10 w-full border pl-9 pr-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15 ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                        placeholder={hintEmail || 'voce@empresa.com.br'}
                        type="email"
                        value={form.email}
                        onChange={(e) => field('email', e.target.value)}
                      />
                    </span>
                    {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                  </label>

                  {tab === 'register' && (
                    <label className="grid gap-1.5">
                      <span className="prop-label">Telefone *</span>
                      <span className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                          className={`h-10 w-full border pl-9 pr-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15 ${errors.phone ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                          placeholder="(34) 99999-0000"
                          value={form.phone}
                          onChange={(e) => field('phone', e.target.value)}
                        />
                      </span>
                      {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
                    </label>
                  )}

                  <label className="grid gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="prop-label">Senha *</span>
                      {tab === 'login' && (
                        <button type="button" onClick={() => setShowReset(true)} className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">
                          Esqueci a senha
                        </button>
                      )}
                    </div>
                    <span className="relative">
                      <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input
                        className={`h-10 w-full border pl-9 pr-10 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15 ${errors.password ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                        placeholder="••••••••"
                        type={showPass ? 'text' : 'password'}
                        value={form.password}
                        onChange={(e) => field('password', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </span>
                    {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
                  </label>

                  {tab === 'login' && showReset && (
                    <div className="grid gap-2 border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Recuperar senha</p>
                      <input
                        className="h-10 border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15"
                        placeholder="Digite seu e-mail"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                      />
                      <button
                        type="button"
                        className="h-10 border border-emerald-500 bg-emerald-50 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                        onClick={async () => {
                          try {
                            await authSvc.resetPassword(resetEmail)
                            setResetSent(true)
                          } catch (err) {
                            setServerError(err?.message || 'Erro ao enviar link.')
                          }
                        }}
                      >
                        Enviar link de recuperação
                      </button>
                      {resetSent && (
                        <p className="text-sm font-semibold text-emerald-600">&#10003; Link enviado para seu e-mail!</p>
                      )}
                    </div>
                  )}

                  <Button className="mt-1 h-11 w-full" type="submit" loading={loading}>
                    {tab === 'register' ? 'Criar conta e continuar' : 'Entrar na conta'}
                  </Button>
                </form>

                <div className="mt-4 flex items-center gap-2 border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-semibold text-slate-600">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  Dados protegidos e validação documental antes da primeira negociação.
                </div>

                <p className="mt-4 text-center text-sm text-slate-500">
                  {tab === 'register' ? 'Já tem conta?' : 'Ainda não tem conta?'}{' '}
                  <button
                    className="font-bold text-emerald-700 hover:text-emerald-800"
                    onClick={() => setTab(tab === 'register' ? 'login' : 'register')}
                  >
                    {tab === 'register' ? 'Entrar agora' : 'Criar cadastro'}
                  </button>
                </p>
              </div>
            </div>

            <Link
              className="block text-center text-xs font-semibold text-slate-400 transition hover:text-slate-600"
              to="/"
            >
              Voltar para a página inicial
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
