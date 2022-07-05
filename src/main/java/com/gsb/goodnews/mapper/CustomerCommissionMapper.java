package com.gsb.goodnews.mapper;

import com.gsb.goodnews.domain.CustomerCommission;
import com.gsb.goodnews.dto.CustomerCommissionDto;
import org.mapstruct.InheritConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = BaseMapper.class)
public interface CustomerCommissionMapper {

    @InheritConfiguration(name = "map")
    @Mapping(source = "customerId", target = "customer.id")
    @Mapping(source = "providerAccountId", target = "providerAccount.id")
    CustomerCommission map(CustomerCommissionDto dto);
}
