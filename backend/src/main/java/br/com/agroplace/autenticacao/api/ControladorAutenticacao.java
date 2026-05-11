package br.com.agroplace.autenticacao.api;

import br.com.agroplace.autenticacao.aplicacao.ServicoAutenticacao;
import br.com.agroplace.autenticacao.aplicacao.dto.RequisicaoCadastro;
import br.com.agroplace.autenticacao.aplicacao.dto.RequisicaoEntrada;
import br.com.agroplace.autenticacao.aplicacao.dto.RespostaAutenticacao;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/autenticacao")
public class ControladorAutenticacao {
    private final ServicoAutenticacao servico;

    public ControladorAutenticacao(ServicoAutenticacao servico) {
        this.servico = servico;
    }

    @PostMapping("/cadastro")
    public RespostaAutenticacao cadastrar(@RequestBody @Valid RequisicaoCadastro requisicao) {
        return servico.cadastrar(requisicao);
    }

    @PostMapping("/entrada")
    public RespostaAutenticacao entrar(@RequestBody @Valid RequisicaoEntrada requisicao) {
        return servico.entrar(requisicao);
    }
}
