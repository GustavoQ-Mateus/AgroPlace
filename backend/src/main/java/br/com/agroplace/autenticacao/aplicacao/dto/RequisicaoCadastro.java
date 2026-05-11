package br.com.agroplace.autenticacao.aplicacao.dto;

import br.com.agroplace.autenticacao.dominio.TipoConta;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RequisicaoCadastro(
    @NotBlank @Size(max = 160) String nome,
    @Email @NotBlank @Size(max = 180) String email,
    @NotBlank @Size(max = 32) String telefone,
    @NotBlank @Size(max = 32) String documento,
    @Size(max = 180) String nomeEmpresa,
    @NotBlank @Size(min = 6, max = 72) String senha,
    @NotNull TipoConta tipoConta
) {
}
