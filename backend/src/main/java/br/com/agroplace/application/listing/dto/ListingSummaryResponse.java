package br.com.agroplace.application.listing.dto;

import java.math.BigDecimal;

public record ListingSummaryResponse(
    Long id,
    String title,
    String category,
    String breed,
    Integer quantity,
    BigDecimal averageWeight,
    BigDecimal priceTotal,
    BigDecimal pricePerHead,
    BigDecimal pricePerArroba,
    String location,
    String seller,
    Integer traceabilityScore,
    String status
) {
}
