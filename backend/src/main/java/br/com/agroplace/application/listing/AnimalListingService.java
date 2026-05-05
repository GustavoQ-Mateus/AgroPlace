package br.com.agroplace.application.listing;

import br.com.agroplace.application.listing.dto.ListingSummaryResponse;
import java.util.List;

public interface AnimalListingService {
    List<ListingSummaryResponse> findActiveListings(String category);
    ListingSummaryResponse findById(Long id);
}
