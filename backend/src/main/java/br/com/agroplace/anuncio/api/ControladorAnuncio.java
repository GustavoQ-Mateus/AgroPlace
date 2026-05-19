package br.com.agroplace.anuncio.api;

import br.com.agroplace.anuncio.aplicacao.ServicoAnuncio;
import br.com.agroplace.anuncio.aplicacao.dto.RequisicaoAnuncio;
import br.com.agroplace.anuncio.aplicacao.dto.RespostaAnuncio;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/anuncios")
public class ControladorAnuncio {

    private final ServicoAnuncio servico;

    public ControladorAnuncio(ServicoAnuncio servico) {
        this.servico = servico;
    }

    // público
    @GetMapping
    public Page<RespostaAnuncio> listar(
            @RequestParam(required = false) String especie,
            @PageableDefault(size = 12, sort = "criadoEm") Pageable pageable) {
        return servico.listar(especie, pageable);
    }

    @GetMapping("/{id}")
    public RespostaAnuncio buscar(@PathVariable Long id) {
        return servico.buscarPorId(id);
    }

    // autenticado
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RespostaAnuncio criar(@RequestBody @Valid RequisicaoAnuncio req, Authentication auth) {
        return servico.criar(auth.getName(), req);
    }

    @GetMapping("/meus")
    public Page<RespostaAnuncio> meus(
            @PageableDefault(size = 12, sort = "criadoEm") Pageable pageable,
            Authentication auth) {
        return servico.listarMeus(auth.getName(), pageable);
    }

    @PutMapping("/{id}")
    public RespostaAnuncio atualizar(@PathVariable Long id,
            @RequestBody @Valid RequisicaoAnuncio req, Authentication auth) {
        return servico.atualizar(id, auth.getName(), req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void encerrar(@PathVariable Long id, Authentication auth) {
        servico.encerrar(id, auth.getName());
    }
}
