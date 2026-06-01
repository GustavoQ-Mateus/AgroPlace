import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-black text-brand-600 opacity-20 select-none leading-none">404</p>
      <h1 className="mt-4 text-2xl font-black text-[hsl(var(--text))]">Página não encontrada</h1>
      <p className="mt-2 text-sm text-[hsl(var(--muted-fg))]">O endereço que você tentou acessar não existe.</p>
      <div className="mt-8 flex gap-3">
        <Link to="/"><Button>Voltar ao início</Button></Link>
        <Link to="/catalogo"><Button variant="outline">Ver catálogo</Button></Link>
      </div>
    </div>
  )
}
