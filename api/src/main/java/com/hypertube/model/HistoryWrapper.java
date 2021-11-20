package com.hypertube.model;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class HistoryWrapper {

    private String token;

    private Long movieId;

    private int current;

    private int duration;

}
