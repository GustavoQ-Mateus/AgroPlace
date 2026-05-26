package br.com.agroplace.anuncio.dominio.builder;

import br.com.agroplace.anuncio.aplicacao.dto.RequisicaoAnuncio;
import br.com.agroplace.anuncio.dominio.Anuncio;
import br.com.agroplace.autenticacao.dominio.ContaUsuario;

public class DiretorAnuncio {

    private final AnuncioBuilder builder;

    public DiretorAnuncio(AnuncioBuilder builder) {
        this.builder = builder;
    }

    public Anuncio construirDaRequisicao(ContaUsuario conta, RequisicaoAnuncio req) {
        return builder
                .conta(conta)
                .titulo(req.titulo())
                .especie(req.especie())
                .raca(req.raca())
                .quantidade(req.quantidade())
                .pesoMedioKg(req.pesoMedioKg())
                .idadeMediaMeses(req.idadeMediaMeses())
                .sexo(req.sexo())
                .precoUnitario(req.precoUnitario())
                .cidade(req.cidade())
                .estado(req.estado())
                .descricao(req.descricao())
                .construir();
    }
}
