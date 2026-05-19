package br.com.agroplace.perfil.aplicacao.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RequisicaoPerfilCorporativa(
    @NotBlank @Size(max = 180) String razaoSocial,
    @Size(max = 180) String nomeFantasia,
    @NotBlank @Size(max = 20) String cnpj,
    @Size(max = 60) String inscricaoEstadual,
    @Size(max = 120) String segmento,
    @Size(max = 160) String responsavelComercial,
    @Size(max = 32) String telefoneComercial,
    @Size(max = 180) String site,
    @Size(max = 12) String cep,
    @Size(max = 220) String endereco,
    @NotBlank @Size(max = 120) String cidade,
    @NotBlank @Size(min = 2, max = 2) String estado,
    String descricao
) {}
