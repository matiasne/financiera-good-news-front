package com.gsb.goodnews.controller;

import com.gsb.goodnews.domain.PaymentIntention;
import com.gsb.goodnews.dto.PaymentIntentionDto;
import com.gsb.goodnews.queryobject.PaymentIntentionSearchDto;
import com.gsb.goodnews.queryobject.querydsl.SearchResponseDto;
import com.gsb.goodnews.service.PaymentIntentionService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment_intentions")
@RequiredArgsConstructor
@CrossOrigin
public class PaymentIntentionController {

    private final PaymentIntentionService paymentIntentionService;

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PaymentIntention> getById(@PathVariable long id) {
        return new ResponseEntity<>(paymentIntentionService.get(id), HttpStatus.OK);
    }

    @PostMapping("/search")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<SearchResponseDto<PaymentIntentionDto>> search(@RequestBody PaymentIntentionSearchDto dto) {
        final SearchResponseDto<PaymentIntentionDto> responseDto = paymentIntentionService.search(dto);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PaymentIntention> create(@RequestBody PaymentIntentionDto dto) {
        return new ResponseEntity<>(paymentIntentionService.create(dto), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> delete(@PathVariable long id) {
        paymentIntentionService.delete(id);
        return new ResponseEntity<>(StringUtils.EMPTY, HttpStatus.OK);
    }
}
