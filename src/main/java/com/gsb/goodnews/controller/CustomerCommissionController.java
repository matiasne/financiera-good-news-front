package com.gsb.goodnews.controller;

import com.gsb.goodnews.domain.CustomerCommission;
import com.gsb.goodnews.dto.CustomerCommissionsDto;
import com.gsb.goodnews.service.CustomerCommissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers/commissions")
@RequiredArgsConstructor
@CrossOrigin
public class CustomerCommissionController {

    private final CustomerCommissionService customerCommissionService;

    @GetMapping("/{customerId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_CUSTOMER')")
    public ResponseEntity<List<CustomerCommission>> getById(@PathVariable long customerId) {
        return new ResponseEntity<>(customerCommissionService.getByCustomerId(customerId), HttpStatus.OK);
    }

    @PutMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> update(@RequestBody CustomerCommissionsDto dto) {
        customerCommissionService.update(dto);
        return new ResponseEntity<>("", HttpStatus.OK);
    }
}
