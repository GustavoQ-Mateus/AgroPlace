package br.com.agroplace.perfil.dominio.builder;

import br.com.agroplace.autenticacao.dominio.ContaUsuario;
import br.com.agroplace.perfil.dominio.PerfilProdutor;
import java.math.BigDecimal;

public interface PerfilProdutorBuilder {
    PerfilProdutorBuilder conta(ContaUsuario conta);
    PerfilProdutorBuilder nomePropriedade(String nomePropriedade);
    PerfilProdutorBuilder documentoRural(String documentoRural);
    PerfilProdutorBuilder inscricaoEstadual(String inscricaoEstadual);
    PerfilProdutorBuilder car(String car);
    PerfilProdutorBuilder areaHectares(BigDecimal areaHectares);
    PerfilProdutorBuilder cep(String cep);
    PerfilProdutorBuilder endereco(String endereco);
    PerfilProdutorBuilder cidade(String cidade);
    PerfilProdutorBuilder estado(String estado);
    PerfilProdutorBuilder descricao(String descricao);
    PerfilProdutor construir();
}
