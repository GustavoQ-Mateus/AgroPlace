import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { searchListings, getListing, createListing, updateListing, deleteListing, getMyListings } from '../services/listingsService'

export function useAnimals(filters = {}) {
  return useQuery({
    queryKey: ['animals', filters],
    queryFn: () => searchListings(filters),
  })
}

export function useAnimal(id) {
  return useQuery({
    queryKey: ['animal', id],
    queryFn: () => getListing(id),
    enabled: !!id,
  })
}

export function useMyListings() {
  return useQuery({
    queryKey: ['my-listings'],
    queryFn: getMyListings,
  })
}

export function useDeleteListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteListing,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-listings'] }),
  })
}

export function useCreateListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createListing,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-listings'] }),
  })
}

export function useUpdateListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updateListing(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-listings'] }),
  })
}
