import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Search, ShieldCheck, Truck } from 'lucide-react'
import Button from '../ui/Button'
import { ASSETS, STATS } from '../../data/mockAnimals'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function HeroSection() {
  return (
    <section className="relative min-h-[720px] overflow-hidden bg-emerald-950 pt-28 text-white sm:min-h-[760px] lg:min-h-[800px]">
      <img
        alt="Fazenda ao nascer do sol"
        className="absolute inset-0 h-full w-full object-cover"
        src={ASSETS.hero}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/60 to-slate-950/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/70" />

      <div className="relative mx-auto flex min-h-[620px] max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="grid flex-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="max-w-[21rem] sm:max-w-3xl">
            <motion.div
              animate="visible"
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-50 backdrop-blur"
              custom={0}
              initial="hidden"
              variants={fadeUp}
            >
              <ShieldCheck size={16} className="text-emerald-300" />
              Marketplace B2B/B2C de animais de produção
            </motion.div>

            <motion.h1
              animate="visible"
              className="max-w-4xl text-3xl font-black leading-[1.08] tracking-normal text-white sm:text-5xl lg:text-6xl xl:text-7xl"
              custom={0.08}
              initial="hidden"
              variants={fadeUp}
            >
              Compre e venda genética animal direto da fonte
            </motion.h1>

            <motion.p
              animate="visible"
              className="mt-6 max-w-2xl text-base leading-7 text-emerald-50/90 sm:text-xl sm:leading-8"
              custom={0.16}
              initial="hidden"
              variants={fadeUp}
            >
              Conecte fazendas, frigoríficos, granjas e transportadoras em um fluxo transparente com dados de genética, sanidade, nutrição e frete.
            </motion.p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/catalogo">
                <Button className="min-h-12 w-full bg-emerald-500 px-6 text-base hover:bg-emerald-400 sm:w-auto">
                  Buscar animais
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/vendedor">
                <Button className="min-h-12 w-full border-white/70 bg-white/10 px-6 text-base text-white hover:bg-white/20 sm:w-auto" variant="outline">
                  Anunciar lote
                </Button>
              </Link>
            </div>
          </div>

          <motion.div
            animate="visible"
            className="ml-auto hidden w-full max-w-md lg:block"
            custom={0.32}
            initial="hidden"
            variants={fadeUp}
          >
            <div className="rounded-lg border border-white/60 bg-white/90 p-4 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="h-12 w-full rounded-lg border border-white/70 bg-white pl-11 pr-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Raça, espécie, estado ou produtor"
                  type="search"
                />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {['Bovinos', 'Equinos', 'Aves'].map((item) => (
                  <Link
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-xs font-bold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                    key={item}
                    to={`/catalogo?cat=${item.toLowerCase()}`}
                  >
                    {item}
                  </Link>
                ))}
              </div>
              <div className="mt-4 space-y-3 rounded-lg bg-emerald-950/95 p-4 text-sm text-emerald-50">
                {[
                  ['Rastreabilidade', 'Genética, saúde e nutrição em uma ficha única'],
                  ['Contrato digital', 'Propostas, aceite e documentos em linha'],
                  ['Frete integrado', 'Cotação por rota, capacidade e manejo'],
                ].map(([title, text]) => (
                  <div className="flex gap-3" key={title}>
                    <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-300" size={17} />
                    <div>
                      <p className="font-bold">{title}</p>
                      <p className="text-xs leading-5 text-emerald-100/75">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate="visible"
          className="mb-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          custom={0.4}
          initial="hidden"
          variants={fadeUp}
        >
          {STATS.map((stat) => (
            <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-4 backdrop-blur" key={stat.label}>
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-emerald-100/80">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-7 right-7 hidden items-center gap-2 rounded-full border border-white/15 bg-slate-950/28 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur lg:flex">
        <Truck size={15} />
        Frete integrado na jornada
      </div>
    </section>
  )
}
