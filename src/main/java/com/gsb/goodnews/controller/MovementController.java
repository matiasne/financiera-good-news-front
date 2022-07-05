package com.gsb.goodnews.controller;

import com.gsb.goodnews.dto.MovementDto;
import com.gsb.goodnews.queryobject.MovementSearchDto;
import com.gsb.goodnews.queryobject.querydsl.SearchResponseDto;
import com.gsb.goodnews.service.MovementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/movements")
@RequiredArgsConstructor
@CrossOrigin
public class MovementController {

    private final MovementService movementService;

    @PostMapping("/search")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<SearchResponseDto<MovementDto>> search(@RequestBody MovementSearchDto dto) {
        final SearchResponseDto<MovementDto> responseDto = movementService.search(dto);

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }
}
