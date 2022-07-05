package com.gsb.goodnews.controller;

import com.gsb.goodnews.domain.transaction.Payment;
import com.gsb.goodnews.dto.PaymentDto;
import com.gsb.goodnews.queryobject.PaymentSearchDto;
import com.gsb.goodnews.queryobject.querydsl.SearchResponseDto;
import com.gsb.goodnews.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@CrossOrigin
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Payment> getById(@PathVariable long id) {
        return new ResponseEntity<>(paymentService.get(id), HttpStatus.OK);
    }

    @PostMapping("/search")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<SearchResponseDto<PaymentDto>> search(@RequestBody PaymentSearchDto dto) {
        final SearchResponseDto<PaymentDto> responseDto = paymentService.search(dto);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Payment> create(@RequestBody PaymentDto dto) {
        return new ResponseEntity<>(paymentService.create(dto), HttpStatus.OK);
    }

//    @DeleteMapping("/{id}")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    public ResponseEntity<String> delete(@PathVariable long id) {
//        paymentService.delete(id);
//        return new ResponseEntity<>(StringUtils.EMPTY, HttpStatus.OK);
//    }
}
