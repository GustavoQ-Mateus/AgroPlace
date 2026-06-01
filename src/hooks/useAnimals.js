import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { searchListings, getListing, createListing, updateListing, deleteListing, getMyListings } from '../services/listingsService'
import { FEATURED_ANIMALS } from '../data/mockAnimals'

export function useAnimals(filters = {}) {
  return useQuery({
    queryKey: ['animals', filters],
    queryFn: async () => {
      try {
        const data = await searchListings(filters)
        return data?.length ? data : FEATURED_ANIMALS
      } catch {
        return FEATURED_ANIMALS
      }
    },
  })
}

export function useAnimal(id) {
  return useQuery({
    queryKey: ['animal', id],
    queryFn: async () => {
      try {
        return await getListing(id)
      } catch {
        return FEATURED_ANIMALS.find((a) => String(a.id) === String(id)) ?? null
      }
    },
    enabled: !!id,
  })
}

export function useMyListings() {
  return useQuery({
    queryKey: ['my-listings'],
    queryFn: async () => {
      try {
        return await getMyListings()
      } catch {
        return FEATURED_ANIMALS.slice(0, 5)
      }
    },
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
