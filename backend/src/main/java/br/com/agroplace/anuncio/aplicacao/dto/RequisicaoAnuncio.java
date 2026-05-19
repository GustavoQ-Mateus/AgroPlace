package br.com.agroplace.anuncio.aplicacao.dto;

import br.com.agroplace.anuncio.dominio.SexoAnimal;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record RequisicaoAnuncio(
    @NotBlank @Size(max = 200) String titulo,
    @NotBlank @Size(max = 60) String especie,
    @Size(max = 120) String raca,
    @Min(1) int quantidade,
    BigDecimal pesoMedioKg,
    Integer idadeMediaMeses,
    @NotNull SexoAnimal sexo,
    @NotNull @DecimalMin("0.01") BigDecimal precoUnitario,
    @NotBlank @Size(max = 120) String cidade,
    @NotBlank @Size(min = 2, max = 2) String estado,
    String descricao
) {}
