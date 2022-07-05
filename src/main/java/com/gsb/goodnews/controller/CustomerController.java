package com.gsb.goodnews.controller;

import com.gsb.goodnews.domain.Customer;
import com.gsb.goodnews.dto.person.CustomerDto;
import com.gsb.goodnews.queryobject.CustomerSearchDto;
import com.gsb.goodnews.queryobject.querydsl.SearchResponseDto;
import com.gsb.goodnews.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
@CrossOrigin
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_CUSTOMER')")
    public ResponseEntity<Customer> getById(@PathVariable long id) {
        return new ResponseEntity<>(customerService.get(id), HttpStatus.OK);
    }

    @PostMapping("/search")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_CUSTOMER')")
    public ResponseEntity<SearchResponseDto<CustomerDto>> search(@RequestBody CustomerSearchDto dto) {
        final SearchResponseDto<CustomerDto> responseDto = this.customerService.search(dto);

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_CUSTOMER')")
    public ResponseEntity<Customer> create(@RequestBody CustomerDto dto) {
        return new ResponseEntity<>(this.customerService.create(dto), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_CUSTOMER')")
    public ResponseEntity<Customer> update(@RequestBody CustomerDto dto, @PathVariable long id) {
        return new ResponseEntity<>(this.customerService.update(dto, id), HttpStatus.OK);
    }
}
