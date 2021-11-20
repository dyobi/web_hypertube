package com.hypertube.model;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;

@Entity @DynamicUpdate @DynamicInsert @Getter @Setter
public class Verify {

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @OneToOne @JoinColumn(name = "userId")
    @OnDelete(action = OnDeleteAction.CASCADE)
    User user;

    @NotEmpty
    private String uuid;

}
