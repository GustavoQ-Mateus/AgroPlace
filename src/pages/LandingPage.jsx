import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileCheck2,
  MessageSquare,
  Shield,
  Star,
  Truck,
} from 'lucide-react'
import AnimalCard from '../components/AnimalCard'
import CategoryGrid from '../components/sections/CategoryGrid'
import HeroSection from '../components/sections/HeroSection'
import Button from '../components/ui/Button'
import { FEATURED_ANIMALS } from '../data/mockAnimals'

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.08, duration: 0.42, ease: 'easeOut' },
  }),
}

function FeaturedSection() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-emerald-600">
              <BarChart3 size={16} />
              Lotes em destaque
            </p>
            <h2 className="text-3xl font-black text-emerald-950">Oportunidades prontas para análise</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Cards com imagem real, vendedor, rastreabilidade, localização e preço por cabeça para uma leitura rápida.
            </p>
          </div>
          <Link to="/catalogo">
            <Button variant="outline">
              Ver catálogo
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_ANIMALS.map((animal, index) => (
            <AnimalCard animal={animal} index={index} key={animal.id} />
          ))}
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
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-emerald-600">Da busca à entrega</p>
          <h2 className="text-3xl font-black text-emerald-950">Um marketplace feito para decisão, não para vitrine vazia</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              className="rounded-lg border border-slate-200 bg-slate-50 p-5"
              custom={index}
              initial="hidden"
              key={step.title}
              variants={fadeUp}
              viewport={{ once: true, margin: '-70px' }}
              whileInView="visible"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm">
                <step.icon size={22} />
              </div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">0{index + 1}</p>
              <h3 className="mt-1 text-lg font-black text-emerald-950">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TrustSection() {
  const testimonials = [
    ['Carlos Mendes', 'Produtor em MT', 'Vendi meu lote em três dias porque o comprador conseguiu validar origem e vacinação sem pedir arquivo por fora.'],
    ['Ana Paula Rocha', 'Compradora em SP', 'O catálogo ficou muito mais objetivo. Peso, genética, sanidade e frete aparecem no mesmo lugar.'],
    ['Rodrigo Fonseca', 'Transportadora em GO', 'As cotações chegam com rota, volume e janela de coleta. Fica bem mais fácil fechar frete.'],
  ]

  return (
    <section className="bg-emerald-950 py-16 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-wide text-emerald-300">Confiança operacional</p>
            <h2 className="text-3xl font-black">Produtores, compradores e frete no mesmo ritmo</h2>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-100">
            <CheckCircle2 size={17} className="text-emerald-300" />
            Score médio de rastreabilidade 91%
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map(([name, role, text], index) => (
            <motion.figure
              className="rounded-lg border border-white/10 bg-white/10 p-6 backdrop-blur"
              custom={index}
              initial="hidden"
              key={name}
              variants={fadeUp}
              viewport={{ once: true, margin: '-70px' }}
              whileInView="visible"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, star) => (
                  <Star className="fill-amber-400 text-amber-400" key={star} size={15} />
                ))}
              </div>
              <blockquote className="text-sm leading-6 text-emerald-50/90">"{text}"</blockquote>
              <figcaption className="mt-5">
                <p className="font-bold text-white">{name}</p>
                <p className="text-xs font-medium text-emerald-300">{role}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <p className="mb-3 text-sm font-bold uppercase tracking-wide text-emerald-600">Comece agora</p>
        <h2 className="text-3xl font-black leading-tight text-emerald-950 sm:text-5xl">
          Publique, negocie e entregue com menos atrito
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
          A próxima tela já leva você para o onboarding de perfil ou para o catálogo com filtros completos.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/auth?tab=register&role=vendedor">
            <Button size="lg">
              Criar conta vendedora
              <ArrowRight size={18} />
            </Button>
          </Link>
          <Link to="/catalogo">
            <Button size="lg" variant="outline">
              Explorar catálogo
            </Button>
          </Link>
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
