import { Link } from 'react-router-dom'
import { Leaf, Instagram, Facebook, Youtube } from 'lucide-react'

const LINKS = {
  Plataforma: [
    ['/catalogo',     'Catálogo'],
    ['/logistica',    'Frete & Logística'],
    ['/vendedor',     'Vender'],
    ['/criar-anuncio','Criar anúncio'],
  ],
  Suporte: [
    ['/auth',       'Login / Cadastro'],
    ['/comprador',  'Painel do comprador'],
    ['/#faq',       'Perguntas frequentes'],
  ],
  Legal: [
    ['/#privacidade', 'Privacidade (LGPD)'],
    ['/#termos',      'Termos de uso'],
    ['/#cookies',     'Cookies'],
  ],
}

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[hsl(var(--border))] bg-brand-900">
      <div className="page-container py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="mb-4 flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center bg-brand-500 text-white rounded-sm">
                <Leaf size={15} />
              </span>
              <span className="text-[15px] font-black tracking-tight text-white">
                Agro<span className="text-brand-300">Place</span>
              </span>
            </Link>
            <p className="text-sm leading-6 text-brand-200/80 max-w-[220px]">
              Rastreabilidade, segurança e logística integrada para produtores e compradores de todo o Brasil.
            </p>
            <div className="mt-5 flex gap-2">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" aria-label={['Instagram','Facebook','YouTube'][i]}
                  className="flex h-8 w-8 items-center justify-center border border-brand-700 text-brand-300 transition hover:border-brand-400 hover:text-white rounded-sm">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-brand-400">{group}</p>
              <ul className="space-y-2.5">
                {links.map(([to, label]) => (
                  <li key={to}>
                    <Link to={to} className="text-sm text-brand-200/80 transition hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-brand-800 pt-6 sm:flex-row">
          <p className="text-xs text-brand-400">© {new Date().getFullYear()} AgroPlace. Todos os direitos reservados.</p>
          <p className="text-xs text-brand-400">Dados protegidos conforme a <span className="font-semibold text-brand-300">LGPD — Lei 13.709/2018</span></p>
        </div>
      </div>
    </footer>
  )
}
