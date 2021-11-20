package com.hypertube.service;

import com.hypertube.model.Response;
import com.hypertube.model.User;
import com.hypertube.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.HashMap;
import java.util.Map;
import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class TokenService {

    @Autowired
    UserRepository userRepository;

    private String secretKey = "secretKey";
    private Logger logger = LoggerFactory.getLogger(TokenService.class);

    public String createToken(User user) {
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS512;
        byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(this.secretKey);
        SecretKeySpec signingKey = new SecretKeySpec(apiKeySecretBytes, signatureAlgorithm.getJcaName());

        try {
            Long id = this.userRepository.findByUserName(user.getUserName()).getId();
            Map<String, Object> headerMap = new HashMap();
            headerMap.put("typ", "JWT");
            headerMap.put("alg", "HS512");
            Map<String, Object> map = new HashMap();
            map.put("id", id);
            JwtBuilder builder = Jwts.builder().setHeader(headerMap).setClaims(map).signWith(signatureAlgorithm, signingKey);
            return builder.compact();
        } catch (Exception var9) {
            var9.printStackTrace();
            return null;
        }
    }

    public Boolean checkToken(String token) {
        if (token == null) return false;
        try {
            Claims claims = (Claims)Jwts.parser().setSigningKey(DatatypeConverter.parseBase64Binary(this.secretKey)).parseClaimsJws(token).getBody();
            this.logger.info("id :" + claims.get("id"));
            return true;
        } catch (JwtException var3) {
            this.logger.info("Falsified token");
            return false;
        }
    }

    public Response checkTokenResponse(String token) {
        if (token == null) return new Response(401);
        try {
            Claims claims = (Claims)Jwts.parser().setSigningKey(DatatypeConverter.parseBase64Binary(this.secretKey)).parseClaimsJws(token).getBody();
            this.logger.info("id :" + claims.get("id"));
            return new Response(200);
        } catch (JwtException var3) {
            this.logger.info("Falsified token");
            return new Response(401);
        }
    }

    public Long decodeToken(String token) {
        try {
            if (this.checkToken(token)) {
                Claims claims = (Claims)Jwts.parser().setSigningKey(DatatypeConverter.parseBase64Binary(this.secretKey)).parseClaimsJws(token).getBody();
                String[] part = claims.toString().split("[^\\w]");
                return Long.parseLong(part[2]);
            }
        } catch (JwtException var4) {
            var4.printStackTrace();
        }

        return null;
    }
}