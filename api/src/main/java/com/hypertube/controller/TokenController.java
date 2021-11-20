package com.hypertube.controller;

import com.hypertube.model.Response;
import com.hypertube.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController @RequestMapping("/api/token")
public class TokenController {

    @Autowired
    TokenService tokenService;

    @GetMapping
    public Response checkToken(@RequestParam String token) {
        return tokenService.checkTokenResponse(token);
    }

}
