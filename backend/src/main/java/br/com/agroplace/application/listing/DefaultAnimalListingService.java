package br.com.agroplace.application.listing;

import br.com.agroplace.application.listing.dto.ListingSummaryResponse;
import br.com.agroplace.domain.model.AnimalListing;
import br.com.agroplace.domain.model.ListingStatus;
import br.com.agroplace.domain.repository.AnimalListingRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class DefaultAnimalListingService implements AnimalListingService {
    private final AnimalListingRepository repository;

    public DefaultAnimalListingService(AnimalListingRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<ListingSummaryResponse> findActiveListings(String category) {
        List<AnimalListing> listings = category == null || category.isBlank()
            ? repository.findByStatusOrderByListedAtDesc(ListingStatus.ACTIVE)
            : repository.findByCategorySlugAndStatusOrderByListedAtDesc(category, ListingStatus.ACTIVE);
        return listings.stream().map(this::toSummary).toList();
    }

    @Override
    public ListingSummaryResponse findById(Long id) {
        return repository.findById(id).map(this::toSummary).orElseThrow();
    }

    private ListingSummaryResponse toSummary(AnimalListing listing) {
        String location = listing.getCity() + ", " + listing.getState();
        String breed = listing.getBreed() == null ? null : listing.getBreed().getName();
        return new ListingSummaryResponse(
            listing.getId(),
            listing.getTitle(),
            listing.getCategory().getName(),
            breed,
            listing.getQuantity(),
            listing.getAverageWeight(),
            listing.getPriceTotal(),
            listing.getPricePerHead(),
            listing.getPricePerArroba(),
            location,
            listing.getSeller().getName(),
            listing.getTraceabilityScore(),
            listing.getStatus().name()
        );
    }
}
