package br.com.agroplace.anuncio.dominio.builder;

import br.com.agroplace.anuncio.dominio.Anuncio;
import br.com.agroplace.anuncio.dominio.SexoAnimal;
import br.com.agroplace.autenticacao.dominio.ContaUsuario;
import java.math.BigDecimal;

public interface AnuncioBuilder {
    AnuncioBuilder conta(ContaUsuario conta);
    AnuncioBuilder titulo(String titulo);
    AnuncioBuilder especie(String especie);
    AnuncioBuilder raca(String raca);
    AnuncioBuilder quantidade(int quantidade);
    AnuncioBuilder pesoMedioKg(BigDecimal pesoMedioKg);
    AnuncioBuilder idadeMediaMeses(Integer idadeMediaMeses);
    AnuncioBuilder sexo(SexoAnimal sexo);
    AnuncioBuilder precoUnitario(BigDecimal precoUnitario);
    AnuncioBuilder cidade(String cidade);
    AnuncioBuilder estado(String estado);
    AnuncioBuilder descricao(String descricao);
    Anuncio construir();
}
