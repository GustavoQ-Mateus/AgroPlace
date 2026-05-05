import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, CheckCircle2, LockKeyhole, Mail, Phone, ShieldCheck, Truck, UserRound } from 'lucide-react'
import Button from '../components/ui/Button'

const roles = [
  { id: 'vendedor', title: 'Produtor', text: 'Publique lotes, acompanhe propostas e documentos.', icon: UserRound },
  { id: 'comprador', title: 'Comprador', text: 'Salve buscas, negocie e acompanhe entregas.', icon: Building2 },
  { id: 'transportadora', title: 'Transportadora', text: 'Receba cotações compatíveis com sua frota.', icon: Truck },
]

export default function AuthPage() {
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') === 'register' ? 'register' : 'login'
  const selectedRole = params.get('role') || 'vendedor'

  function setTab(nextTab) {
    const next = new URLSearchParams(params)
    if (nextTab === 'register') next.set('tab', 'register')
    else next.delete('tab')
    setParams(next)
  }

  function setRole(role) {
    const next = new URLSearchParams(params)
    next.set('tab', 'register')
    next.set('role', role)
    setParams(next)
  }

  return (
    <section className="min-h-screen bg-slate-50 pt-24">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-wide text-emerald-600">Onboarding</p>
          <h1 className="max-w-[21rem] text-3xl font-black leading-tight text-emerald-950 sm:max-w-xl sm:text-5xl">
            Entre no AgroPlace com o perfil certo para sua operação
          </h1>
          <p className="mt-4 max-w-[21rem] text-base leading-7 text-slate-600 sm:max-w-xl">
            O acesso muda o painel, os documentos e o fluxo de negociação conforme o papel de cada participante.
          </p>

          <div className="mt-8 grid gap-3">
            {[
              'Verificação de fazenda, granja ou transportadora',
              'Histórico de propostas e contratos digitais',
              'Rastreabilidade visível desde o primeiro anúncio',
            ].map((item) => (
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-700" key={item}>
                <CheckCircle2 size={18} className="text-emerald-600" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="min-w-0 max-w-full rounded-lg border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 sm:p-6"
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35 }}
        >
          <div className="mb-6 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] rounded-lg bg-slate-100 p-1">
            <button
              className={`min-w-0 h-10 rounded-md text-sm font-bold transition ${tab === 'login' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setTab('login')}
            >
              Entrar
            </button>
            <button
              className={`min-w-0 h-10 rounded-md text-sm font-bold transition ${tab === 'register' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setTab('register')}
            >
              Criar conta
            </button>
          </div>

          {tab === 'register' && (
            <div className="mb-6">
              <p className="mb-3 text-sm font-bold text-emerald-950">Escolha o perfil principal</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {roles.map((role) => (
                  <button
                    className={`min-w-0 rounded-lg border p-4 text-left transition ${selectedRole === role.id ? 'border-emerald-300 bg-emerald-50 ring-2 ring-emerald-500/15' : 'border-slate-200 bg-white hover:border-emerald-200'}`}
                    key={role.id}
                    onClick={() => setRole(role.id)}
                  >
                    <role.icon className={selectedRole === role.id ? 'text-emerald-700' : 'text-slate-500'} size={22} />
                    <p className="mt-3 text-sm font-black text-emerald-950">{role.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{role.text}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form className="grid gap-4">
            {tab === 'register' && (
              <label className="grid gap-1.5">
                <span className="text-sm font-bold text-slate-700">Nome ou razão social</span>
                <input className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/15" placeholder="Fazenda Santa Cruz" />
              </label>
            )}
            <label className="grid gap-1.5">
              <span className="text-sm font-bold text-slate-700">E-mail</span>
              <span className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input className="h-11 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/15" placeholder="voce@empresa.com.br" type="email" />
              </span>
            </label>
            {tab === 'register' && (
              <label className="grid gap-1.5">
                <span className="text-sm font-bold text-slate-700">Telefone</span>
                <span className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input className="h-11 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/15" placeholder="(34) 99999-0000" />
                </span>
              </label>
            )}
            <label className="grid gap-1.5">
              <span className="text-sm font-bold text-slate-700">Senha</span>
              <span className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input className="h-11 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/15" placeholder="••••••••" type="password" />
              </span>
            </label>

            <Button className="mt-2 h-11" type="submit">
              {tab === 'register' ? 'Criar conta e continuar' : 'Entrar na conta'}
            </Button>
          </form>

          <div className="mt-5 flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
            <ShieldCheck size={16} className="text-emerald-600" />
            Dados protegidos e validação documental antes da primeira negociação.
          </div>

          <p className="mt-5 text-center text-sm text-slate-500">
            {tab === 'register' ? 'Já tem conta?' : 'Ainda não tem conta?'}{' '}
            <button className="font-bold text-emerald-700" onClick={() => setTab(tab === 'register' ? 'login' : 'register')}>
              {tab === 'register' ? 'Entrar agora' : 'Criar cadastro'}
            </button>
          </p>

          <Link className="mt-3 block text-center text-xs font-semibold text-slate-400 hover:text-slate-600" to="/">
            Voltar para a página inicial
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
