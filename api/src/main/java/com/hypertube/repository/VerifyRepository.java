package com.hypertube.repository;

import com.hypertube.model.Verify;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VerifyRepository extends JpaRepository<Verify, Long> {

    // Verify Database

    Verify findByUuid(String uuid);

}
