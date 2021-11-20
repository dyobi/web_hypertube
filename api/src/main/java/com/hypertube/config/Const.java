package com.hypertube.config;

import java.nio.file.Paths;

public class Const {

    static String absolutePath = Paths.get("").toAbsolutePath().toString();

    public static String PATH_PICTURE = absolutePath + "/pictures/";
}
