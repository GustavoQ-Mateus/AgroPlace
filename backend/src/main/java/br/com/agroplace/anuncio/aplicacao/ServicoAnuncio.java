package br.com.agroplace.anuncio.aplicacao;

import br.com.agroplace.anuncio.aplicacao.dto.RequisicaoAnuncio;
import br.com.agroplace.anuncio.aplicacao.dto.RespostaAnuncio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ServicoAnuncio {
    RespostaAnuncio criar(String emailConta, RequisicaoAnuncio requisicao);
    RespostaAnuncio buscarPorId(Long id);
    Page<RespostaAnuncio> listar(String especie, Pageable pageable);
    Page<RespostaAnuncio> listarMeus(String emailConta, Pageable pageable);
    RespostaAnuncio atualizar(Long id, String emailConta, RequisicaoAnuncio requisicao);
    void encerrar(Long id, String emailConta);
}
