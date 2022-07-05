package com.gsb.goodnews.command.customer;

import com.gsb.goodnews.domain.Customer;
import com.gsb.goodnews.dto.person.CustomerDto;
import com.gsb.goodnews.exception.NotFoundException;
import com.gsb.goodnews.mapper.CustomerMapper;
import com.gsb.goodnews.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UpdateCustomerCommand {

    private final CustomerRepository customerRepository;
    private final CustomerValidator customerValidator;
    private final CustomerMapper customerMapper;

    public Customer update(CustomerDto customerDto, long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Customer not found with id " + id));

        customerValidator.validateUpdate(customerDto, customer);
        customerMapper.mapToEntity(customerDto, customer);

        return customerRepository.save(customer);
    }
}
