package com.gsb.goodnews.service;

import com.gsb.goodnews.dto.TransactionDto;
import com.gsb.goodnews.queryobject.TransactionQueryObject;
import com.gsb.goodnews.queryobject.TransactionSearchDto;
import com.gsb.goodnews.queryobject.querydsl.SearchResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionQueryObject transactionQueryObject;

    public SearchResponseDto<TransactionDto> search(TransactionSearchDto dto) {
        return transactionQueryObject.search(dto);
    }
}
