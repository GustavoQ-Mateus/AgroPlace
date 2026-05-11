package br.com.agroplace.autenticacao.aplicacao.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RequisicaoEntrada(
    @Email @NotBlank String email,
    @NotBlank String senha
) {
}
