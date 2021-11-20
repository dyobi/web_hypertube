package com.hypertube.controller;

import com.hypertube.model.RecoveryWrapper;
import com.hypertube.model.Response;
import com.hypertube.model.User;
import com.hypertube.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthService authService;

    @PostMapping("/signup")
    public Response signUp(@RequestBody User user) {
        return authService.signUp(user);
    }

    @PostMapping("/signin")
    public Response signIn(@RequestBody User user) {
        return authService.signIn(user);
    }

    @PostMapping("/social")
    public Response oAuth(@RequestBody User user) {
        return authService.oAuth(user);
    }

    @GetMapping("/userName/{userName}")
    public Response getUserName(@PathVariable("userName") String userName) {
        return authService.getUserName(userName);
    }

    @GetMapping("/email/{email}")
    public Response getEmail(@PathVariable("email") String email) {
        return authService.getEmail(email);
    }

    @GetMapping("/recovery/{email}")
    public Response recovery(@PathVariable("email") String email) {
        return authService.recovery(email);
    }

    @PutMapping("/recovery")
    public Response recoveryPassword(@RequestBody RecoveryWrapper wrapper) {
        return authService.recoveryPassword(wrapper.getPassword(), wrapper.getUuid());
    }

}
