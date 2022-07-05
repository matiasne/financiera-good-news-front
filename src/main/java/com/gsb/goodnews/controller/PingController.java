package com.gsb.goodnews.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ping")
@CrossOrigin
public class PingController {

    @GetMapping
    public ResponseEntity<?> ping() {
        return ResponseEntity.ok("pong");
    }
}
