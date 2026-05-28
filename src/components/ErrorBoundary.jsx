import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center bg-zinc-50">
          <div className="text-5xl">⚠️</div>
          <h1 className="text-2xl font-bold text-zinc-800">Algo deu errado</h1>
          <p className="text-zinc-500 text-sm max-w-md">{this.state.error?.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Recarregar página
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
