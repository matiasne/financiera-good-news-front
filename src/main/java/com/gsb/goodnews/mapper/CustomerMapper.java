package com.gsb.goodnews.mapper;

import com.gsb.goodnews.domain.Customer;
import com.gsb.goodnews.dto.person.CustomerDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CustomerMapper extends BaseMapper<CustomerDto, Customer> {

}
