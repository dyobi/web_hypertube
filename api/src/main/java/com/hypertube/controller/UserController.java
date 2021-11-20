package com.hypertube.controller;

import com.hypertube.model.Response;
import com.hypertube.model.UserWrapper;
import com.hypertube.service.PictureService;
import com.hypertube.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController @RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    PictureService pictureService;

    @GetMapping("/token")
    public Response getUserByToken(@RequestParam String token) {
        return userService.getUserByToken(token);
    }

    @GetMapping("/{userName}")
    public Response getUserByUserName(@RequestParam String token, @PathVariable("userName") String userName) {
        return userService.getUserByUserName(token, userName);
    }

    @PutMapping
    public Response putUser(@RequestBody UserWrapper user) {
        return userService.putUser(user.getToken(), user.getUserName(), user.getPassword(), user.getEmail(), user.getFirstName(), user.getLastName());
    }

    @GetMapping("/picture/{picture}")
    public @ResponseBody byte[] picture(@PathVariable String picture) { return (pictureService.get(picture)); }

    @PutMapping("/picture")
    public Response putUserPicture(@RequestParam String token, @RequestParam MultipartFile picture) {
        return userService.putUserPicture(token, picture);
    }

    @DeleteMapping
    public Response deleteUser(@RequestParam String token) {
        return userService.deleteUser(token);
    }

}
