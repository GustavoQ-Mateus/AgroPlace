package br.com.agroplace.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "animal_listings")
public class AnimalListing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "breed_id")
    private Breed breed;

    @Column(nullable = false, length = 180)
    private String title;

    private String description;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "average_weight")
    private BigDecimal averageWeight;

    @Column(name = "price_total", nullable = false)
    private BigDecimal priceTotal;

    @Column(name = "price_per_head")
    private BigDecimal pricePerHead;

    @Column(name = "price_per_arroba")
    private BigDecimal pricePerArroba;

    @Column(nullable = false, length = 120)
    private String city;

    @Column(nullable = false, length = 2)
    private String state;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ListingStatus status = ListingStatus.DRAFT;

    @Column(name = "traceability_score", nullable = false)
    private Integer traceabilityScore = 0;

    @Column(name = "listed_at")
    private LocalDateTime listedAt;

    public Long getId() {
        return id;
    }

    public User getSeller() {
        return seller;
    }

    public Category getCategory() {
        return category;
    }

    public Breed getBreed() {
        return breed;
    }

    public String getTitle() {
        return title;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getAverageWeight() {
        return averageWeight;
    }

    public BigDecimal getPriceTotal() {
        return priceTotal;
    }

    public BigDecimal getPricePerHead() {
        return pricePerHead;
    }

    public BigDecimal getPricePerArroba() {
        return pricePerArroba;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public ListingStatus getStatus() {
        return status;
    }

    public Integer getTraceabilityScore() {
        return traceabilityScore;
    }
}
