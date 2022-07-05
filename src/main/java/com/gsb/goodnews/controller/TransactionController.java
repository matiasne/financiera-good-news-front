package com.gsb.goodnews.controller;

import com.gsb.goodnews.dto.TransactionDto;
import com.gsb.goodnews.queryobject.TransactionSearchDto;
import com.gsb.goodnews.queryobject.querydsl.SearchResponseDto;
import com.gsb.goodnews.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
@CrossOrigin
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/search")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<SearchResponseDto<TransactionDto>> search(@RequestBody TransactionSearchDto dto) {
        final SearchResponseDto<TransactionDto> responseDto = transactionService.search(dto);

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }
}
