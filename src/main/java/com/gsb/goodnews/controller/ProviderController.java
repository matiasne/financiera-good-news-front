package com.gsb.goodnews.controller;

import com.gsb.goodnews.domain.Provider;
import com.gsb.goodnews.dto.person.ProviderDto;
import com.gsb.goodnews.queryobject.ProviderSearchDto;
import com.gsb.goodnews.queryobject.querydsl.SearchResponseDto;
import com.gsb.goodnews.service.ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/providers")
@RequiredArgsConstructor
@CrossOrigin
public class ProviderController {

    private final ProviderService providerService;

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Provider> getById(@PathVariable long id) {
        return new ResponseEntity<>(providerService.get(id), HttpStatus.OK);
    }

    @PostMapping("/search")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_CUSTOMER')")
    public ResponseEntity<SearchResponseDto<ProviderDto>> search(@RequestBody ProviderSearchDto dto) {
        final SearchResponseDto<ProviderDto> responseDto = providerService.search(dto);

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Provider> create(@RequestBody ProviderDto dto) {
        return new ResponseEntity<>(providerService.create(dto), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Provider> update(@RequestBody ProviderDto dto, @PathVariable long id) {
        return new ResponseEntity<>(this.providerService.update(dto, id), HttpStatus.OK);
    }
}
