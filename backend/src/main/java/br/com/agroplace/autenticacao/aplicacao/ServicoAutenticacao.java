package br.com.agroplace.autenticacao.aplicacao;

import br.com.agroplace.autenticacao.aplicacao.dto.RequisicaoCadastro;
import br.com.agroplace.autenticacao.aplicacao.dto.RequisicaoEntrada;
import br.com.agroplace.autenticacao.aplicacao.dto.RespostaAutenticacao;

public interface ServicoAutenticacao {
    RespostaAutenticacao cadastrar(RequisicaoCadastro requisicao);
    RespostaAutenticacao entrar(RequisicaoEntrada requisicao);
}
