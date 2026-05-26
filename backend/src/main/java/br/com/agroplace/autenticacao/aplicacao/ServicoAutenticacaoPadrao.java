package br.com.agroplace.autenticacao.aplicacao;

import br.com.agroplace.autenticacao.aplicacao.dto.RequisicaoCadastro;
import br.com.agroplace.autenticacao.aplicacao.dto.RequisicaoEntrada;
import br.com.agroplace.autenticacao.aplicacao.dto.RespostaAutenticacao;
import br.com.agroplace.autenticacao.dominio.ContaUsuario;
import br.com.agroplace.autenticacao.dominio.TipoConta;
import br.com.agroplace.autenticacao.dominio.builder.ContaUsuarioConcretoBuilder;
import br.com.agroplace.autenticacao.dominio.builder.DiretorContaUsuario;
import br.com.agroplace.autenticacao.infra.RepositorioContaUsuario;
import br.com.agroplace.compartilhado.seguranca.GeradorToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ServicoAutenticacaoPadrao implements ServicoAutenticacao {

    private final RepositorioContaUsuario repositorio;
    private final PasswordEncoder codificadorSenha;
    private final GeradorToken geradorToken;

    public ServicoAutenticacaoPadrao(RepositorioContaUsuario repositorio,
            PasswordEncoder codificadorSenha, GeradorToken geradorToken) {
        this.repositorio = repositorio;
        this.codificadorSenha = codificadorSenha;
        this.geradorToken = geradorToken;
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
            throw new IllegalArgumentException("Nome da empresa obrigatório para este tipo de conta");
        }
        String nomeEmpresa = requisicao.tipoConta() == TipoConta.PRODUTOR ? null : requisicao.nomeEmpresa();
        DiretorContaUsuario diretor = new DiretorContaUsuario(new ContaUsuarioConcretoBuilder());
        ContaUsuario conta = diretor.construirConta(
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
                geradorToken.gerar(conta)
        );
    }

    private boolean estaEmBranco(String valor) {
        return valor == null || valor.isBlank();
    }
}
