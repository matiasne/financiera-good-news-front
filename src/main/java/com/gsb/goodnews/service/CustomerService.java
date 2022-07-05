package com.gsb.goodnews.service;

import com.gsb.goodnews.command.customer.CreateCustomerCommand;
import com.gsb.goodnews.command.customer.UpdateCustomerCommand;
import com.gsb.goodnews.domain.Customer;
import com.gsb.goodnews.dto.person.CustomerDto;
import com.gsb.goodnews.exception.NotFoundException;
import com.gsb.goodnews.queryobject.CustomerQueryObject;
import com.gsb.goodnews.queryobject.CustomerSearchDto;
import com.gsb.goodnews.queryobject.querydsl.SearchResponseDto;
import com.gsb.goodnews.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CreateCustomerCommand createCustomerCommand;
    private final CustomerQueryObject customerQueryObject;
    private final UpdateCustomerCommand updateCustomerCommand;
    private final CustomerRepository customerRepository;

    public Customer get(long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Customer not found with id " + id));
    }

    public SearchResponseDto<CustomerDto> search(CustomerSearchDto dto) {
        return customerQueryObject.search(dto);
    }

    @Transactional
    public Customer create(CustomerDto dto) {
        return createCustomerCommand.create(dto);
    }

    @Transactional
    public Customer update(CustomerDto dto, long id) {
        return updateCustomerCommand.update(dto, id);
    }
}
