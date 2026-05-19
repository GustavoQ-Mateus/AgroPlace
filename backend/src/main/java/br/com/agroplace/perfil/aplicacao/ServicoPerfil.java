package br.com.agroplace.perfil.aplicacao;

import br.com.agroplace.perfil.aplicacao.dto.RequisicaoPerfilCorporativa;
import br.com.agroplace.perfil.aplicacao.dto.RequisicaoPerfilProdutor;
import br.com.agroplace.perfil.aplicacao.dto.RequisicaoPerfilTransportadora;
import java.util.Map;

public interface ServicoPerfil {
    Map<String, Object> salvarProdutor(String emailConta, RequisicaoPerfilProdutor requisicao);
    Map<String, Object> salvarCorporativa(String emailConta, RequisicaoPerfilCorporativa requisicao);
    Map<String, Object> salvarTransportadora(String emailConta, RequisicaoPerfilTransportadora requisicao);
    Map<String, Object> buscarMeuPerfil(String emailConta);
}
