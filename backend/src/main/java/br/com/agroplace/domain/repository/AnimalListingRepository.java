package br.com.agroplace.domain.repository;

import br.com.agroplace.domain.model.AnimalListing;
import br.com.agroplace.domain.model.ListingStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnimalListingRepository extends JpaRepository<AnimalListing, Long> {
    List<AnimalListing> findByStatusOrderByListedAtDesc(ListingStatus status);
    List<AnimalListing> findByCategorySlugAndStatusOrderByListedAtDesc(String slug, ListingStatus status);
}
