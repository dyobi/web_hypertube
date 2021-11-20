package com.hypertube.controller;

import com.hypertube.model.HistoryWrapper;
import com.hypertube.model.Response;
import com.hypertube.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api")
public class HistoryController {

    @Autowired
    HistoryService historyService;

    @GetMapping("/histories/{userName}")
    public Response getHistories(@RequestParam String token, @PathVariable("userName") String userName) {
        return historyService.getHistories(token, userName);
    }

    @PostMapping("/history")
    public Response postHistory(@RequestBody HistoryWrapper historyWrapper) {
        return historyService.postHistory(historyWrapper.getToken(), historyWrapper.getMovieId(), historyWrapper.getCurrent(), historyWrapper.getDuration());
    }

}
