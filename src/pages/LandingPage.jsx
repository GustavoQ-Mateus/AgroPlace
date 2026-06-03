import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, FileCheck2, MapPin, MessageSquare, Search, Shield, Truck, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { CATEGORIES } from '../data/mockAnimals'
import { formatCurrency } from '../lib/utils'
import { useAnimals } from '../hooks/useAnimals'

const HOW = [
  { icon: Shield,        n: '01', title: 'Verificação',    text: 'Documentos, vacinação, origem e score de rastreabilidade auditados antes da proposta.' },
  { icon: MessageSquare, n: '02', title: 'Proposta',       text: 'Negocie diretamente com o produtor: preço, sinal, data de retirada e frete em uma tela.' },
  { icon: FileCheck2,    n: '03', title: 'Contrato',       text: 'Contrato digital com condições de entrega, sanidade e responsabilidade de ambas as partes.' },
  { icon: Truck,         n: '04', title: 'Logística',      text: 'Cotação de frete integrada à proposta com transportadoras verificadas e rastreamento.' },
]


function HeroSection() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  function handleSearch(e) {
    e.preventDefault()
    navigate(`/catalogo${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`)
  }
  return (
    <section className="relative overflow-hidden min-h-[580px] lg:min-h-[640px] flex items-center bg-brand-900">

      {/* ── Farm image — full background ── */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src="/assets/hero-farm.jpg"
          alt="Fazenda com bovinos e ovinos ao pôr do sol"
          className="h-full w-full object-cover object-[65%_center] scale-[1.10] origin-center"
          loading="eager"
        />
      </motion.div>

      {/* ── Gradient overlay — desktop: esquerda para direita; mobile: tela toda ── */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            /* mobile: cobre tudo para legibilidade */
            'linear-gradient(to right,',
            '  hsl(120,24%,12%) 0%,',
            '  hsl(120,24%,12%) 30%,',
            '  hsla(120,24%,12%,0.85) 45%,',
            '  hsla(120,24%,12%,0.4) 62%,',
            '  hsla(120,24%,12%,0.05) 78%,',
            '  transparent 90%',
            ')',
          ].join(''),
        }}
      />
      {/* Mobile: reforça o escurecimento vertical */}
      <div className="absolute inset-0 bg-brand-900/60 lg:hidden" />

      {/* ── Content ── */}
      <div className="relative z-10 flex w-full flex-col justify-center px-6 py-20 sm:px-10 lg:w-[52%] lg:py-28 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
        <motion.div
          className="max-w-xl"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
            Compre e venda animais com{' '}
            <span className="text-brand-300">rastreabilidade total</span>
          </h1>
          <p className="mt-5 text-base leading-7 text-brand-200/80 sm:text-lg">
            Bovinos, equinos, aves e mais — com documentação, sanidade, frete e contrato digital em uma plataforma segura.
          </p>

          <form onSubmit={handleSearch} className="mt-8 flex max-w-md gap-2">
            <label className="relative flex-1">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" />
              <input
                type="search" value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="Raça, espécie, cidade…"
                className="h-11 w-full border border-brand-700 bg-brand-800/60 pl-9 pr-3 text-sm text-white placeholder-brand-400 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 rounded-sm"
              />
            </label>
            <Button type="submit" size="lg" className="shrink-0">
              Buscar <ArrowRight size={15} />
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {['Bovinos Nelore', 'Equinos Marchador', 'Aves Postura', 'Suínos F1'].map((tag) => (
              <Link key={tag} to={`/catalogo?q=${encodeURIComponent(tag)}`}
                className="text-sm text-brand-300 underline-offset-2 transition hover:text-white hover:underline">
                {tag}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}


function CategorySection() {
  return (
    <section className="py-16 border-b border-[hsl(var(--border))]">
      <div className="page-container">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="section-eyebrow mb-1">Navegue por espécie</p>
            <h2 className="section-title text-2xl">Categorias</h2>
          </div>
          <Link to="/catalogo"><Button variant="outline" size="sm">Ver tudo <ArrowRight size={13} /></Button></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} to={`/catalogo?cat=${cat.id}`}
              className="group card card-hover flex flex-col items-center gap-3 px-3 py-5 text-center transition">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-[hsl(var(--border))] group-hover:border-brand-400 transition">
                <img src={cat.image} alt={cat.label} className="h-full w-full object-cover" />
              </div>
              <p className="text-sm font-bold text-[hsl(var(--text))] group-hover:text-brand-600 transition">{cat.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedListings() {
  const { data: allAnimals = [], isLoading } = useAnimals({ limit: 6 })
  const animals = allAnimals.slice(0, 6)
  const [slide, setSlide] = useState(0)
  const perPage = 3
  const pages = Math.max(1, Math.ceil(animals.length / perPage))
  const visible = animals.slice(slide * perPage, slide * perPage + perPage)

  return (
    <section className="py-16 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]">
      <div className="page-container">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="section-eyebrow mb-1">Destaques</p>
            <h2 className="section-title text-2xl">Lotes em evidência</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSlide((s) => Math.max(0, s - 1))} disabled={slide === 0}
              className="flex h-8 w-8 items-center justify-center border border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--text))] transition hover:bg-brand-600 hover:text-white disabled:opacity-30 rounded-sm">
              <ChevronLeft size={15} />
            </button>
            <button onClick={() => setSlide((s) => Math.min(pages - 1, s + 1))} disabled={slide >= pages - 1}
              className="flex h-8 w-8 items-center justify-center border border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--text))] transition hover:bg-brand-600 hover:text-white disabled:opacity-30 rounded-sm">
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
        {isLoading && (
          <div className="text-center py-8 text-sm text-[hsl(var(--muted-fg))]">Carregando lotes…</div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((a) => (
            <Link key={a.id} to={`/anuncio/${a.id}`} className="group card card-hover block overflow-hidden">
              <div className="relative overflow-hidden h-48">
                <img src={a.image ?? '/assets/hero-farm.jpg'} alt={a.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-4">
                  <Button size="sm" className="w-full">Ver lote <ArrowRight size={13} /></Button>
                </div>
                <div className="absolute top-3 left-3">
                  <Badge variant={a.status === 'Disponível' ? 'active' : 'pending'}>{a.status}</Badge>
                </div>
              </div>
              <div className="p-4">
                <p className="font-bold text-[hsl(var(--text))] line-clamp-1">{a.title}</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-[hsl(var(--muted-fg))]">
                  <MapPin size={11} /> {a.location}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-[hsl(var(--muted-fg))] uppercase tracking-wide font-semibold">Preço total</p>
                    <p className="font-black text-brand-600">{formatCurrency(a.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-[hsl(var(--muted-fg))] uppercase tracking-wide font-semibold">Cabeças</p>
                    <p className="font-bold text-[hsl(var(--text))]">{a.quantity?.toLocaleString('pt-BR')}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex justify-center gap-1.5">
          {Array.from({ length: pages }).map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`h-2 rounded-full transition-all ${i === slide ? 'w-6 bg-brand-600' : 'w-2 bg-[hsl(var(--border))]'}`} />
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section className="py-16 border-b border-[hsl(var(--border))]">
      <div className="page-container">
        <div className="mb-10 text-center">
          <p className="section-eyebrow mb-2">Como funciona</p>
          <h2 className="section-title">Do anúncio ao frete em 4 etapas</h2>
          <p className="section-sub mt-3 max-w-lg mx-auto">Processo padronizado para produtores e compradores de qualquer porte.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOW.map(({ icon: Icon, n, title, text }) => (
            <div key={n} className="card p-6 relative overflow-hidden">
              <span className="absolute right-4 top-3 text-5xl font-black text-[hsl(var(--border))] leading-none select-none">{n}</span>
              <div className="mb-4 flex h-10 w-10 items-center justify-center bg-brand-50 border border-brand-200 rounded-sm">
                <Icon size={18} className="text-brand-600" />
              </div>
              <h3 className="font-bold text-[hsl(var(--text))]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-fg))]">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/catalogo"><Button size="lg">Explorar lotes <ArrowRight size={16} /></Button></Link>
        </div>
      </div>
    </section>
  )
}

function TrustSection() {
  const items = [
    [CheckCircle2, 'Documentação verificada', 'GTA, vacinas e rastreabilidade auditados antes do anúncio ser publicado.'],
    [Shield,       'Contrato digital',         'Cláusulas padronizadas de entrega, sanidade e responsabilidade civil.'],
    [Truck,        'Frete certificado',         'Transportadoras verificadas com licença MAPA e seguro de carga animal.'],
    [TrendingUp,   'Dados em tempo real',      'Preços de referência, volume negociado e radar de mercado atualizado.'],
  ]
  return (
    <section className="py-16 border-b border-[hsl(var(--border))] bg-brand-50">
      <div className="page-container">
        <div className="mb-10 text-center">
          <p className="section-eyebrow mb-2">Segurança</p>
          <h2 className="section-title">Confiança em cada etapa</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(([Icon, title, text]) => (
            <div key={title} className="card p-5">
              <Icon size={20} className="text-brand-600 mb-3" />
              <h3 className="font-bold text-[hsl(var(--text))] mb-1.5">{title}</h3>
              <p className="text-sm leading-6 text-[hsl(var(--muted-fg))]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


function CTASection() {
  return (
    <section className="py-20 bg-brand-900">
      <div className="page-container text-center">
        <h2 className="text-3xl font-black text-white sm:text-4xl">Pronto para negociar com segurança?</h2>
        <p className="mt-4 text-lg text-brand-200/80 max-w-md mx-auto">
          Crie sua conta gratuitamente e acesse os melhores lotes do Brasil.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link to="/auth?tab=register"><Button size="xl">Criar conta grátis <ArrowRight size={16} /></Button></Link>
          <Link to="/catalogo"><Button size="xl" variant="outline" className="border-brand-600 text-white hover:bg-brand-800">Ver catálogo</Button></Link>
        </div>
      </div>
    </section>
  )
}

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeaturedListings />
      <HowItWorks />
      <TrustSection />
      <CTASection />
    </>
  )
}
