package com.gsb.goodnews.controller;

import com.gsb.goodnews.domain.transaction.Deposit;
import com.gsb.goodnews.dto.DepositDto;
import com.gsb.goodnews.queryobject.DepositSearchDto;
import com.gsb.goodnews.queryobject.querydsl.SearchResponseDto;
import com.gsb.goodnews.service.DepositService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/deposits")
@RequiredArgsConstructor
@CrossOrigin
public class DepositController {

    private final DepositService depositService;

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_CUSTOMER')")
    public ResponseEntity<Deposit> getById(@PathVariable long id) {
        return new ResponseEntity<>(depositService.getById(id), HttpStatus.OK);
    }

    @GetMapping("/internalId/{internalId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_CUSTOMER')")
    public ResponseEntity<Deposit> getByCode(@PathVariable String internalId) {
        return new ResponseEntity<>(depositService.getByInternalId(internalId), HttpStatus.OK);
    }

    @PostMapping("/search")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_CUSTOMER')")
    public ResponseEntity<SearchResponseDto<DepositDto>> search(@RequestBody DepositSearchDto dto) {
        final SearchResponseDto<DepositDto> responseDto = depositService.search(dto);

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @PostMapping("/tickets/search")
    public ResponseEntity<SearchResponseDto<DepositDto>> searchTickets(@RequestBody DepositSearchDto dto) {
        final SearchResponseDto<DepositDto> responseDto = depositService.searchTickets(dto);

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_CUSTOMER')")
    public ResponseEntity<Deposit> create(@RequestBody DepositDto dto) {
        return new ResponseEntity<>(depositService.create(dto), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_CUSTOMER')")
    public ResponseEntity<Deposit> update(@PathVariable long id, @RequestBody DepositDto dto) {
        return new ResponseEntity<>(depositService.update(id, dto.getStatus()), HttpStatus.OK);
    }
}
