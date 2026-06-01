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
        <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-4 text-center bg-[hsl(var(--bg))]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-200 bg-red-50 text-2xl">⚠️</div>
          <div>
            <h1 className="text-xl font-black text-[hsl(var(--text))]">Algo deu errado</h1>
            <p className="mt-2 text-sm text-[hsl(var(--muted-fg))] max-w-sm">{this.state.error?.message}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="h-10 px-5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 transition rounded-sm"
          >
            Recarregar página
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
