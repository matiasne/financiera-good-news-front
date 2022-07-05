package com.gsb.goodnews.service;

import com.gsb.goodnews.dto.MovementDto;
import com.gsb.goodnews.queryobject.MovementQueryObject;
import com.gsb.goodnews.queryobject.MovementSearchDto;
import com.gsb.goodnews.queryobject.querydsl.SearchResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MovementService {

    private final MovementQueryObject movementQueryObject;

    public SearchResponseDto<MovementDto> search(MovementSearchDto dto) {
        return movementQueryObject.search(dto);
    }
}
