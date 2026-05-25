import { Link } from 'react-router-dom'
import { Facebook, Instagram, Leaf, Mail, MapPin, Phone, Youtube } from 'lucide-react'

const footerGroups = [
  {
    title: 'Marketplace',
    links: [
      ['Catálogo de animais', '/catalogo'],
      ['Como comprar', '/comprador'],
      ['Como vender', '/vendedor'],
      ['Logística e frete', '/logistica'],
    ],
  },
  {
    title: 'Espécies',
    links: [
      ['Bovinos', '/catalogo?cat=bovinos'],
      ['Equinos', '/catalogo?cat=equinos'],
      ['Aves', '/catalogo?cat=aves'],
      ['Suínos', '/catalogo?cat=suinos'],
      ['Ovinos', '/catalogo?cat=ovinos'],
      ['Caprinos', '/catalogo?cat=caprinos'],
    ],
  },
]

export default function Footer() {
  return (
    <footer className="mt-0 border-t border-emerald-900 bg-emerald-950 text-emerald-100">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link className="mb-4 flex items-center gap-2" to="/">
              <span className="flex h-7 w-7 items-center justify-center bg-emerald-500 text-white">
                <Leaf size={15} />
              </span>
              <span className="text-base font-black tracking-tight text-white">
                Agro<span className="text-emerald-300">Place</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-6 text-emerald-200/80">
              Marketplace de animais de produção com compra direta, rastreabilidade e logística integrada.
            </p>
            <div className="mt-5 flex gap-2">
              {[Instagram, Facebook, Youtube].map((Icon, index) => (
                <a
                  aria-label={['Instagram', 'Facebook', 'YouTube'][index]}
                  className="flex h-8 w-8 items-center justify-center border border-emerald-800 text-emerald-300 transition hover:border-emerald-600 hover:text-white"
                  href="#"
                  key={Icon.displayName || index}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-emerald-400">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map(([label, to]) => (
                  <li key={label}>
                    <Link className="text-sm text-emerald-200/80 transition hover:text-white" to={to}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-emerald-400">Contato</h3>
            <ul className="space-y-3 text-sm text-emerald-200/80">
              <li className="flex items-center gap-2">
                <Phone size={14} />
                <span>(34) 3300-0000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} />
                <span>suporte@agroplace.com.br</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 shrink-0" size={14} />
                <span>
                  Av. do Agro, 1000
                  <br />
                  Uberlândia, MG
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-emerald-800 pt-6 text-xs text-emerald-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 AgroPlace. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <a className="transition hover:text-white" href="#">Privacidade</a>
            <a className="transition hover:text-white" href="#">Termos</a>
            <a className="transition hover:text-white" href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
