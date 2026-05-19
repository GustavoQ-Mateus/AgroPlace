package br.com.agroplace.perfil.api;

import br.com.agroplace.perfil.aplicacao.ServicoPerfil;
import br.com.agroplace.perfil.aplicacao.dto.RequisicaoPerfilCorporativa;
import br.com.agroplace.perfil.aplicacao.dto.RequisicaoPerfilProdutor;
import br.com.agroplace.perfil.aplicacao.dto.RequisicaoPerfilTransportadora;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/perfis")
public class ControladorPerfil {

    private final ServicoPerfil servico;

    public ControladorPerfil(ServicoPerfil servico) {
        this.servico = servico;
    }

    @GetMapping("/meu")
    public Map<String, Object> meuPerfil(Authentication auth) {
        return servico.buscarMeuPerfil(auth.getName());
    }

    @PostMapping("/produtor")
    public Map<String, Object> salvarProdutor(@RequestBody @Valid RequisicaoPerfilProdutor req,
            Authentication auth) {
        return servico.salvarProdutor(auth.getName(), req);
    }

    @PostMapping("/corporativa")
    public Map<String, Object> salvarCorporativa(@RequestBody @Valid RequisicaoPerfilCorporativa req,
            Authentication auth) {
        return servico.salvarCorporativa(auth.getName(), req);
    }

    @PostMapping("/transportadora")
    public Map<String, Object> salvarTransportadora(
            @RequestBody @Valid RequisicaoPerfilTransportadora req, Authentication auth) {
        return servico.salvarTransportadora(auth.getName(), req);
    }
}
