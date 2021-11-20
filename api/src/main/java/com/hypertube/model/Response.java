package com.hypertube.model;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;

@Getter @Setter
public class Response {

    private int status;

    private Object obj;

    private ArrayList list;

    public Response(int status) {
        this.status = status;
    }

    public Response(int status, Object obj) {
        this.status = status;
        this.obj = obj;
    }

    public Response(int status, ArrayList list) {
        this.status = status;
        this.list = list;
    }

}
