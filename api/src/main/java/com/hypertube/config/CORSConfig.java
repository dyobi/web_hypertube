package com.hypertube.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CORSConfig {
    public CORSConfig() {}

    @Bean
    public FilterRegistrationBean corsFilterRegistration() {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setFilter(new CORSFilter());
        registration.addUrlPatterns(new String[]{"/*"});
        registration.setName("coreFilter");
        registration.setOrder(1);
        registration.setEnabled(false);
        return registration;
    }
}