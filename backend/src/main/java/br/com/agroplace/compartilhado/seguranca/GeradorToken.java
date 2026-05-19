package br.com.agroplace.compartilhado.seguranca;

import br.com.agroplace.autenticacao.dominio.ContaUsuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class GeradorToken {

    private final SecretKey chave;
    private final long expiracaoMs;

    public GeradorToken(
            @Value("${jwt.secret}") String segredo,
            @Value("${jwt.expiracao-ms:86400000}") long expiracaoMs) {
        this.chave = Keys.hmacShaKeyFor(segredo.getBytes(StandardCharsets.UTF_8));
        this.expiracaoMs = expiracaoMs;
    }

    public String gerar(ContaUsuario conta) {
        return Jwts.builder()
                .subject(conta.getEmail())
                .claim("contaId", conta.getId())
                .claim("tipoConta", conta.getTipoConta().name())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiracaoMs))
                .signWith(chave)
                .compact();
    }

    public Claims validar(String token) {
        return Jwts.parser()
                .verifyWith(chave)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
