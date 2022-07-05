package com.gsb.goodnews.controller;

import com.gsb.goodnews.domain.transaction.ProviderCashDelivery;
import com.gsb.goodnews.dto.ProviderCashDeliveryDto;
import com.gsb.goodnews.queryobject.ProviderCashDeliverySearchDto;
import com.gsb.goodnews.queryobject.querydsl.SearchResponseDto;
import com.gsb.goodnews.service.ProviderCashDeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/providers/cash_delivery")
@RequiredArgsConstructor
@CrossOrigin
public class ProviderCashDeliveryController {

    private final ProviderCashDeliveryService providerCashDeliveryService;

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ProviderCashDelivery> getById(@PathVariable long id) {
        return new ResponseEntity<>(providerCashDeliveryService.get(id), HttpStatus.OK);
    }

    @PostMapping("/search")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<SearchResponseDto<ProviderCashDeliveryDto>> search(@RequestBody ProviderCashDeliverySearchDto dto) {
        final SearchResponseDto<ProviderCashDeliveryDto> responseDto = providerCashDeliveryService.search(dto);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ProviderCashDelivery> create(@RequestBody ProviderCashDeliveryDto dto) {
        return new ResponseEntity<>(providerCashDeliveryService.create(dto), HttpStatus.OK);
    }
}
