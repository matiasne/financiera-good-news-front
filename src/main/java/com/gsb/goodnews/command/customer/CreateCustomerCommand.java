package com.gsb.goodnews.command.customer;

import com.gsb.goodnews.domain.Customer;
import com.gsb.goodnews.dto.person.CustomerDto;
import com.gsb.goodnews.mapper.CustomerMapper;
import com.gsb.goodnews.repository.CustomerRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@AllArgsConstructor
public class CreateCustomerCommand {

    private final CustomerMapper customerMapper;
    private final CustomerValidator customerValidator;
    private final CustomerRepository customerRepository;

    public Customer create(CustomerDto dto) {
        customerValidator.validateCreate(dto);
        Customer customer = customerMapper.map(dto);
        customer.setPrevBalance(BigDecimal.ZERO);
        customer.setBalance(BigDecimal.ZERO);

        return customerRepository.save(customer);
    }
}
