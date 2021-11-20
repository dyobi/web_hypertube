package com.hypertube.controller;

import com.hypertube.model.CommentWrapper;
import com.hypertube.model.Response;
import com.hypertube.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api")
public class CommentController {

    @Autowired
    CommentService commentService;

    @GetMapping("/comments/movieId/{movieId}")
    public Response getCommentByMovieId(@PathVariable("movieId") Long movieId) {
        return commentService.getCommentByMovieId(movieId);
    }

    @GetMapping("/comments/userId/{userId}")
    public Response getCommentByUserId(@RequestParam String token, @PathVariable("userId") Long userId) {
        return commentService.getCommentByUserId(token, userId);
    }

    @PostMapping("/comment")
    public Response postComment(@RequestBody CommentWrapper wrapper) {
        return commentService.postComment(wrapper.getToken(), wrapper.getMovieId(), wrapper.getContent());
    }

    @DeleteMapping("/comment/{commentId}")
    public Response deleteComment(@RequestParam String token, @PathVariable("commentId") Long commentId) {
        return commentService.deleteComment(token, commentId);
    }

}
