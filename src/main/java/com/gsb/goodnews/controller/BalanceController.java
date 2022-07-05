package com.gsb.goodnews.controller;

import com.gsb.goodnews.domain.Balance;
import com.gsb.goodnews.repository.BalanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/balances")
@RequiredArgsConstructor
@CrossOrigin
public class BalanceController {

    private final BalanceRepository balanceRepository;

    @GetMapping()
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<Balance>> getAll() {
        return new ResponseEntity<>(balanceRepository.findAll(), HttpStatus.OK);
    }
}
