package br.com.agroplace.interfaces.http;

import br.com.agroplace.application.listing.AnimalListingService;
import br.com.agroplace.application.listing.dto.ListingSummaryResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/listings")
public class AnimalListingController {
    private final AnimalListingService service;

    public AnimalListingController(AnimalListingService service) {
        this.service = service;
    }

    @GetMapping
    public List<ListingSummaryResponse> findAll(@RequestParam(required = false) String category) {
        return service.findActiveListings(category);
    }

    @GetMapping("/{id}")
    public ListingSummaryResponse findById(@PathVariable Long id) {
        return service.findById(id);
    }
}
