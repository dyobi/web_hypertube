package com.hypertube.repository;

import com.hypertube.model.History;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;

public interface HistoryRepository extends JpaRepository<History, Long> {

    // History Database

    ArrayList<History> findByUserId(Long userId);
    History findByUserIdAndMovieId(Long userId, Long movieId);

}
