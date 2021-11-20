package com.hypertube.service;

import com.hypertube.model.Comment;
import com.hypertube.model.Response;
import com.hypertube.repository.CommentRepository;
import com.hypertube.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

@Service
public class CommentService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    CommentRepository commentRepository;

    @Autowired
    TokenService tokenService;

    public Response getCommentByMovieId(Long movieId) {
        try {
            ArrayList<Comment> res = commentRepository.findByMovieId(movieId, Sort.by("time").descending());
            for (Comment re : res) {
                re.getUser().setEmail("");
                re.getUser().setPassword("");
            } return new Response(200, res);
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(400);
        }
    }

    public Response getCommentByUserId(String token, Long userId) {
        try {
            if (!tokenService.checkToken(token)) return new Response(401);
            else if (!userRepository.findById(tokenService.decodeToken(token)).isPresent()) return new Response(401);
            ArrayList<Comment> res = commentRepository.findByUserId(userId, Sort.by("time").descending());
            for (Comment re : res) {
                re.getUser().setEmail("");
                re.getUser().setPassword("");
            } return new Response(200, res);
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(400);
        }
    }

    public Response postComment(String token, Long movieId, String content) {
        try {
            if (!tokenService.checkToken(token)) return new Response(401);
            else if (!userRepository.findById(tokenService.decodeToken(token)).isPresent()) return new Response(401);
            Comment comment = new Comment();
            comment.setUser(userRepository.findById(tokenService.decodeToken(token)).orElse(null));
            if (comment.getUser() == null) return new Response(400);
            comment.setMovieId(movieId);
            comment.setContent(content);
            comment.setTime(new SimpleDateFormat("yyyy-MM-dd kk:mm").format((new Date())));
            commentRepository.save(comment);
            return new Response(200, comment);
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(400);
        }
    }

    public Response deleteComment(String token, Long commentId) {
        try {
            if (!tokenService.checkToken(token)) return new Response(401);
            else if (!userRepository.findById(tokenService.decodeToken(token)).isPresent()) return new Response(401);
            commentRepository.deleteById(commentId);
            return new Response(200);
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(400);
        }
    }

}
