import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BadgeCheck, ClipboardCheck, MapPin } from 'lucide-react'
import Button from '../ui/Button'
import { CATEGORIES } from '../../data/mockAnimals'

const accentClasses = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  amber: 'bg-amber-50 text-amber-700 border-amber-100',
  sky: 'bg-sky-50 text-sky-700 border-sky-100',
  rose: 'bg-rose-50 text-rose-700 border-rose-100',
  lime: 'bg-lime-50 text-lime-700 border-lime-100',
  orange: 'bg-orange-50 text-orange-700 border-orange-100',
}

const fade = {
  hidden: { opacity: 0, y: 24 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.08, duration: 0.45, ease: 'easeOut' },
  }),
}

export default function CategoryGrid() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-wide text-emerald-600">Principais espécies</p>
          <h2 className="text-3xl font-black leading-tight text-emerald-950 sm:text-4xl">
            Um fluxo visual em Z para escanear oportunidades por espécie
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Cada bloco alterna imagem e conteúdo para guiar o olhar: primeiro o contexto produtivo, depois os critérios de compra, e então a chamada para navegar no catálogo.
          </p>
        </div>

        <div className="space-y-10 lg:space-y-14">
          {CATEGORIES.map((category, index) => {
            const reverse = index % 2 === 1
            return (
              <motion.article
                className="grid overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm lg:grid-cols-2"
                custom={index}
                initial="hidden"
                key={category.id}
                variants={fade}
                viewport={{ once: true, margin: '-80px' }}
                whileInView="visible"
              >
                <div className={reverse ? 'order-1 lg:order-2' : ''}>
                  <div className="h-72 overflow-hidden bg-slate-200 sm:h-80 lg:h-full lg:min-h-[430px]">
                    <img
                      alt={category.label}
                      className="h-full w-full object-cover transition duration-700 hover:scale-105"
                      loading="lazy"
                      src={category.image}
                    />
                  </div>
                </div>

                <div className={reverse ? 'order-2 lg:order-1' : ''}>
                  <div className="flex h-full flex-col justify-center p-6 sm:p-8 lg:p-10">
                    <span className={`mb-5 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${accentClasses[category.accent]}`}>
                      <BadgeCheck size={14} />
                      {category.count.toLocaleString('pt-BR')} anúncios
                    </span>
                    <h3 className="text-2xl font-black leading-tight text-emerald-950 sm:text-3xl">{category.headline}</h3>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">{category.body}</p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      {category.stats.map((stat, statIndex) => (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-3" key={stat}>
                          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                            {statIndex === 0 ? <ClipboardCheck size={16} /> : <MapPin size={16} />}
                          </div>
                          <p className="text-xs font-bold leading-4 text-slate-700">{stat}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <Link to={`/catalogo?cat=${category.id}`}>
                        <Button>
                          Ver {category.label.toLowerCase()}
                          <ArrowRight size={16} />
                        </Button>
                      </Link>
                      <p className="text-xs font-medium text-slate-500">{category.description}</p>
                    </div>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
