import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="text-9xl font-black text-emerald-500 opacity-20 select-none">404</div>
      <h1 className="text-3xl font-bold text-zinc-800 mt-2">Página não encontrada</h1>
      <p className="text-zinc-500 mt-2 mb-8">O caminho que você tentou acessar não existe.</p>
      <Link
        to="/"
        className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
      >
        Voltar para o início
      </Link>
    </div>
  )
}
