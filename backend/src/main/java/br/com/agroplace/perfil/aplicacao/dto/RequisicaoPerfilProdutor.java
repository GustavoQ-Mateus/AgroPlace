package br.com.agroplace.perfil.aplicacao.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record RequisicaoPerfilProdutor(
    @NotBlank @Size(max = 180) String nomePropriedade,
    @Size(max = 60) String documentoRural,
    @Size(max = 60) String inscricaoEstadual,
    @Size(max = 80) String car,
    BigDecimal areaHectares,
    @Size(max = 12) String cep,
    @Size(max = 220) String endereco,
    @NotBlank @Size(max = 120) String cidade,
    @NotBlank @Size(min = 2, max = 2) String estado,
    String descricao
) {}
