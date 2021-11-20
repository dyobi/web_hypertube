package com.hypertube.model;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import java.util.ArrayList;
import java.util.List;

@Entity @DynamicInsert @DynamicUpdate @Getter @Setter
public class User {

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotEmpty @Column(unique = true)
    private String userName;

    @Email @NotEmpty @Column(unique = true)
    private String email;

    private String password;

    private String firstName;

    private String lastName;

    private String picture;

    private String socialType;

    // Transient

    @Transient @OneToMany(mappedBy = "user")
    private List<Comment> comments = new ArrayList();

    @Transient @OneToMany(mappedBy = "user")
    private List<History> histories = new ArrayList();

    @Transient @OneToOne(mappedBy = "user", orphanRemoval = true)
    private Verify verify;

}
