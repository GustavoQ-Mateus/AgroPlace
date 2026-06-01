// Re-exports for backward compatibility
export { formatCurrency, formatDate } from '../lib/utils'

export function formatNumber(value) {
  return new Intl.NumberFormat('pt-BR').format(value)
}
