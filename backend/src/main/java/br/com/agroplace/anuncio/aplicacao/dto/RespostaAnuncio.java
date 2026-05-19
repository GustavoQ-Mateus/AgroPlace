package br.com.agroplace.anuncio.aplicacao.dto;

import br.com.agroplace.anuncio.dominio.Anuncio;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record RespostaAnuncio(
    Long id,
    String titulo,
    String especie,
    String raca,
    int quantidade,
    BigDecimal pesoMedioKg,
    Integer idadeMediaMeses,
    String sexo,
    BigDecimal precoUnitario,
    String cidade,
    String estado,
    String descricao,
    String status,
    Long vendedorId,
    String vendedorNome,
    LocalDateTime criadoEm
) {
    public static RespostaAnuncio de(Anuncio a) {
        return new RespostaAnuncio(
                a.getId(),
                a.getTitulo(),
                a.getEspecie(),
                a.getRaca(),
                a.getQuantidade(),
                a.getPesoMedioKg(),
                a.getIdadeMediaMeses(),
                a.getSexo().name(),
                a.getPrecoUnitario(),
                a.getCidade(),
                a.getEstado(),
                a.getDescricao(),
                a.getStatus().name(),
                a.getConta().getId(),
                a.getConta().getNome(),
                a.getCriadoEm()
        );
    }
}
