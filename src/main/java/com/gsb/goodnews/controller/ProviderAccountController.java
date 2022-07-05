package com.gsb.goodnews.controller;

import com.gsb.goodnews.domain.ProviderAccount;
import com.gsb.goodnews.dto.ProviderAccountDto;
import com.gsb.goodnews.dto.ProviderAccountsDto;
import com.gsb.goodnews.queryobject.ProviderAccountSearchDto;
import com.gsb.goodnews.queryobject.querydsl.SearchResponseDto;
import com.gsb.goodnews.service.ProviderAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/providers/accounts")
@RequiredArgsConstructor
@CrossOrigin
public class ProviderAccountController {

    private final ProviderAccountService providerAccountService;

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ProviderAccount> getById(@PathVariable long id) {
        return new ResponseEntity<>(providerAccountService.get(id), HttpStatus.OK);
    }

    @PostMapping("/search")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_CUSTOMER')")
    public ResponseEntity<SearchResponseDto<ProviderAccountDto>> search(@RequestBody ProviderAccountSearchDto dto) {
        final SearchResponseDto<ProviderAccountDto> responseDto = providerAccountService.search(dto);

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @PutMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> create(@RequestBody ProviderAccountsDto dto) {
        providerAccountService.update(dto);
        return new ResponseEntity<>("", HttpStatus.OK);
    }
}
