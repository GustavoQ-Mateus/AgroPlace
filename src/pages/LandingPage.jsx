import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, FileCheck2, MessageSquare, Shield, Truck } from 'lucide-react'
import AnimalCard from '../components/AnimalCard'
import CategoryGrid from '../components/sections/CategoryGrid'
import HeroSection from '../components/sections/HeroSection'
import Button from '../components/ui/Button'
import { FEATURED_ANIMALS } from '../data/mockAnimals'

function FeaturedSection() {
  return (
    <section className="border-b border-slate-200 bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="section-label mb-1">Lotes em destaque</p>
            <h2 className="text-2xl font-black text-emerald-950">Oportunidades prontas para análise</h2>
          </div>
          <Link to="/catalogo">
            <Button variant="outline" size="sm">
              Ver catálogo
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>

        <div className="border border-slate-200 bg-white">
          {/* Column headers */}
          <div className="hidden grid-cols-[56px_1fr_auto_auto_auto_auto] items-center gap-4 border-b border-slate-200 bg-slate-50 px-5 py-2.5 sm:grid">
            <span />
            <span className="prop-label">Lote / Produtor</span>
            <span className="prop-label text-right">Cabeças</span>
            <span className="prop-label text-right">Rastreab.</span>
            <span className="prop-label text-right">Preço total</span>
            <span />
          </div>
          <div>
            {FEATURED_ANIMALS.slice(0, 8).map((animal, index) => (
              <AnimalCard animal={animal} index={index} key={animal.id} />
            ))}
          </div>
          <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 text-center">
            <Link
              to="/catalogo"
              className="text-sm font-bold text-emerald-600 transition hover:text-emerald-800"
            >
              Ver todos os lotes disponíveis
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function WorkflowSection() {
  const steps = [
    {
      icon: Shield,
      title: 'Verificação',
      text: 'Documentos, vacinação, origem e score de rastreabilidade antes da proposta.',
    },
    {
      icon: MessageSquare,
      title: 'Negociação',
      text: 'Oferta, contraproposta e aceite com histórico organizado por lote.',
    },
    {
      icon: FileCheck2,
      title: 'Contrato',
      text: 'Condições comerciais, documentos fiscais e GTA em um fluxo único.',
    },
    {
      icon: Truck,
      title: 'Frete',
      text: 'Cotação por rota, capacidade, bem-estar animal e janela de retirada.',
    },
  ]

  return (
    <section className="border-b border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="section-label mb-1">Da busca à entrega</p>
          <h2 className="text-2xl font-black text-emerald-950">Fluxo comercial integrado em quatro etapas</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Cada etapa entrega dados e controles que eliminam a troca de arquivos fora da plataforma.
          </p>
        </div>

        <div className="border border-slate-200">
          <div className="grid divide-y divide-slate-200 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
            {steps.map((step, index) => (
              <div key={step.title} className="px-6 py-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center bg-emerald-600 text-white text-xs font-black">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-black text-emerald-950">{step.title}</h3>
                </div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center border border-slate-200 bg-slate-50 text-emerald-700">
                  <step.icon size={20} />
                </div>
                <p className="text-sm leading-6 text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TrustSection() {
  const testimonials = [
    ['Carlos Mendes', 'Produtor · Mato Grosso', 'Vendi meu lote em três dias porque o comprador conseguiu validar origem e vacinação sem pedir arquivo por fora.'],
    ['Ana Paula Rocha', 'Compradora · São Paulo', 'O catálogo ficou muito mais objetivo. Peso, genética, sanidade e frete aparecem no mesmo lugar.'],
    ['Rodrigo Fonseca', 'Transportadora · Goiás', 'As cotações chegam com rota, volume e janela de coleta. Fica bem mais fácil fechar frete.'],
  ]

  return (
    <section className="border-b border-slate-200 bg-emerald-950 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-emerald-400">Confiança operacional</p>
            <h2 className="text-2xl font-black text-white">Produtores, compradores e transportadoras no mesmo ritmo</h2>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
            <CheckCircle2 size={14} className="text-emerald-400" />
            Score médio de rastreabilidade 91%
          </div>
        </div>

        {/* Metric strip */}
        <div className="mb-6 grid grid-cols-3 gap-px bg-emerald-800">
          {[
            ['R$ 48M', 'Negociados/mês'],
            ['12.400', 'Produtores ativos'],
            ['91%', 'Score médio'],
          ].map(([value, label]) => (
            <div key={label} className="bg-emerald-950 px-6 py-5">
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-emerald-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Testimonial rows */}
        <div className="border border-emerald-800 divide-y divide-emerald-800">
          {testimonials.map(([name, role, text]) => (
            <div key={name} className="grid gap-4 px-5 py-4 sm:grid-cols-[180px_1fr] sm:items-center">
              <div>
                <p className="text-sm font-bold text-white">{name}</p>
                <p className="mt-0.5 text-xs text-emerald-400">{role}</p>
              </div>
              <p className="text-sm leading-6 text-emerald-100/80">"{text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 border border-slate-200 bg-slate-50 p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="section-label mb-1">Comece agora</p>
            <h2 className="text-2xl font-black text-emerald-950">
              Publique, negocie e entregue com menos atrito
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              O onboarding de perfil leva menos de 5 minutos. O catálogo com filtros completos já está disponível para acesso imediato.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link to="/auth?tab=register&role=vendedor">
              <Button size="lg">
                Criar conta vendedora
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/catalogo">
              <Button size="lg" variant="outline">
                Explorar catálogo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <FeaturedSection />
      <WorkflowSection />
      <TrustSection />
      <CtaSection />
    </>
  )
}
