package br.com.agroplace.autenticacao.aplicacao;

import br.com.agroplace.autenticacao.aplicacao.dto.RequisicaoCadastro;
import br.com.agroplace.autenticacao.aplicacao.dto.RequisicaoEntrada;
import br.com.agroplace.autenticacao.aplicacao.dto.RespostaAutenticacao;
import br.com.agroplace.autenticacao.dominio.ContaUsuario;
import br.com.agroplace.autenticacao.dominio.TipoConta;
import br.com.agroplace.autenticacao.infra.RepositorioContaUsuario;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ServicoAutenticacaoPadrao implements ServicoAutenticacao {
    private final RepositorioContaUsuario repositorio;
    private final PasswordEncoder codificadorSenha;

    public ServicoAutenticacaoPadrao(RepositorioContaUsuario repositorio, PasswordEncoder codificadorSenha) {
        this.repositorio = repositorio;
        this.codificadorSenha = codificadorSenha;
    }

    @Override
    public RespostaAutenticacao cadastrar(RequisicaoCadastro requisicao) {
        if (repositorio.existsByEmail(requisicao.email())) {
            throw new IllegalArgumentException("E-mail já cadastrado");
        }
        if (repositorio.existsByDocumento(requisicao.documento())) {
            throw new IllegalArgumentException("Documento já cadastrado");
        }
        if (requisicao.tipoConta() != TipoConta.PRODUTOR && estaEmBranco(requisicao.nomeEmpresa())) {
            throw new IllegalArgumentException("Nome da empresa obrigatório");
        }
        String nomeEmpresa = requisicao.tipoConta() == TipoConta.PRODUTOR ? null : requisicao.nomeEmpresa();
        ContaUsuario conta = new ContaUsuario(
            requisicao.nome(),
            requisicao.email(),
            requisicao.telefone(),
            requisicao.documento(),
            nomeEmpresa,
            codificadorSenha.encode(requisicao.senha()),
            requisicao.tipoConta()
        );
        return montarResposta(repositorio.save(conta));
    }

    @Override
    public RespostaAutenticacao entrar(RequisicaoEntrada requisicao) {
        ContaUsuario conta = repositorio.findByEmail(requisicao.email())
            .filter(ContaUsuario::isAtivo)
            .orElseThrow(() -> new IllegalArgumentException("Credenciais inválidas"));
        if (!codificadorSenha.matches(requisicao.senha(), conta.getSenhaHash())) {
            throw new IllegalArgumentException("Credenciais inválidas");
        }
        return montarResposta(conta);
    }

    private RespostaAutenticacao montarResposta(ContaUsuario conta) {
        return new RespostaAutenticacao(
            conta.getId(),
            conta.getNome(),
            conta.getEmail(),
            conta.getTelefone(),
            conta.getDocumento(),
            conta.getNomeEmpresa(),
            conta.getTipoConta().name(),
            UUID.randomUUID().toString()
        );
    }

    private boolean estaEmBranco(String valor) {
        return valor == null || valor.isBlank();
    }
}
