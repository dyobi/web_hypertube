package com.hypertube.model;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CommentWrapper {

    private String token;

    private Long movieId;

    private String content;

}
