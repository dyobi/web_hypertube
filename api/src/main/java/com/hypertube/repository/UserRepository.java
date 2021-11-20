package com.hypertube.repository;

import com.hypertube.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    // User Database

    User findByUserName(String userName);
    User findByEmail(String email);

}
