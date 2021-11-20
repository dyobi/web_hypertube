package com.hypertube.service;

import com.hypertube.model.History;
import com.hypertube.model.Response;
import com.hypertube.model.User;
import com.hypertube.repository.HistoryRepository;
import com.hypertube.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

@Service
public class HistoryService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    HistoryRepository historyRepository;

    @Autowired
    TokenService tokenService;

    public Response getHistories(String token, String userName) {
        try {
            if (!tokenService.checkToken(token)) return new Response(401);
            else if (!userRepository.findById(tokenService.decodeToken(token)).isPresent()) return new Response(401);
            ArrayList<History> res = historyRepository.findByUserId(userRepository.findByUserName(userName).getId());
            for (History re : res) {
                re.getUser().setEmail("");
                re.getUser().setPassword("");
            } return new Response(200, res);
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(400);
        }
    }

    public Response postHistory(String token, Long movieId, int current, int duration) {
        try {
            if (!tokenService.checkToken(token)) return new Response(401);
            else if (!userRepository.findById(tokenService.decodeToken(token)).isPresent()) return new Response(401);
            User user = userRepository.findById(tokenService.decodeToken(token)).orElse(null);
            if (user == null) return new Response(400);
            History history = historyRepository.findByUserIdAndMovieId(user.getId(), movieId);
            if (history == null) {
                History res = new History();
                res.setUser(user);
                res.setMovieId(movieId);
                res.setCurrent(current);
                res.setDuration(duration);
                res.setTime(new SimpleDateFormat("yyyy-MM-dd kk:mm").format((new Date())));
                historyRepository.save(res);
            } else {
                history.setCurrent(current);
                history.setDuration(duration);
                history.setTime(new SimpleDateFormat("yyyy-MM-dd kk:mm").format((new Date())));
                historyRepository.save(history);
            } return new Response(200);
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(400);
        }
    }

}
