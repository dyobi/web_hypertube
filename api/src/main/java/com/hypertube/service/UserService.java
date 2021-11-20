package com.hypertube.service;

import com.hypertube.model.Response;
import com.hypertube.model.User;
import com.hypertube.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    TokenService tokenService;

    @Autowired
    BCryptPasswordEncoder passwordEncoder;

    public Response getUserByToken(String token) {
        try {
            if (!tokenService.checkToken(token)) return new Response(401);
            else if (!userRepository.findById(tokenService.decodeToken(token)).isPresent()) return new Response(401);
            User user = userRepository.findById(tokenService.decodeToken(token)).orElse(null);
            if (user == null) return new Response(400);
            else return new Response(200, user);
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(400);
        }
    }

    public Response getUserByUserName(String token, String userName) {
        try {
            if (!tokenService.checkToken(token)) return new Response(401);
            else if (!userRepository.findById(tokenService.decodeToken(token)).isPresent()) return new Response(401);
            User user = userRepository.findByUserName(userName);
            if (user == null) return new Response(400);
            else return new Response(200, user);
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(400);
        }
    }

    public Response putUser(String token, String userName, String password, String email, String firstName, String lastName) {
        try {
            if (!tokenService.checkToken(token)) return new Response(401);
            else if (!userRepository.findById(tokenService.decodeToken(token)).isPresent()) return new Response(401);
            User user = userRepository.findById(tokenService.decodeToken(token)).orElse(null);
            if (user == null) return new Response(400);
            if (userName != null) user.setUserName(userName);
            if (password != null) user.setPassword(passwordEncoder.encode(password));
            if (email != null) user.setEmail(email);
            if (firstName != null) user.setFirstName(firstName);
            if (lastName != null) user.setLastName(lastName);
            userRepository.save(user);
            return new Response(200);
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(400);
        }
    }

    public Response putUserPicture(String token, MultipartFile picture) {
        try {
            if (!tokenService.checkToken(token)) return new Response(401);
            else if (!userRepository.findById(tokenService.decodeToken(token)).isPresent()) return new Response(401);
            User user = userRepository.findById(tokenService.decodeToken(token)).orElse(null);
            PictureService pictureService = new PictureService();
            String fileName = pictureService.uploadWithFile(picture);
            user.setPicture("SERVER/" + fileName);
            userRepository.save(user);
            return new Response(200, "SERVER/" + fileName);
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(400);
        }
    }

    public Response deleteUser(String token) {
        try {
            if (!tokenService.checkToken(token)) return new Response(401);
            else if (!userRepository.findById(tokenService.decodeToken(token)).isPresent()) return new Response(401);
            userRepository.findById(tokenService.decodeToken(token)).ifPresent(user -> userRepository.deleteById(user.getId()));
            return new Response(200);
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(400);
        }
    }

}
