import { api } from '../lib/api'

export async function sendProposal(data) {
  return api.post('/api/proposals', data)
}

export async function getMyProposals() {
  return api.get('/api/proposals')
}

export async function getProposalsForSeller() {
  return api.get('/api/proposals/seller')
}

export async function acceptProposal(propostaId, sellerNote = '') {
  return api.put(`/api/proposals/${propostaId}/accept`, { note: sellerNote })
}

export async function rejectProposal(propostaId, sellerNote = '') {
  return api.put(`/api/proposals/${propostaId}/reject`, { note: sellerNote })
}
