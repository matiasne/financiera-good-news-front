package com.gsb.goodnews.mapper;

import com.gsb.goodnews.domain.transaction.Deposit;
import com.gsb.goodnews.dto.DepositDto;
import org.mapstruct.InheritConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = BaseMapper.class)
public interface DepositMapper extends BaseMapper<DepositDto, Deposit> {

    @InheritConfiguration(name = "map")
    @Mapping(source = "providerAccountId", target = "providerAccount.id")
    @Mapping(source = "customerId", target = "customer.id")
    @Mapping(source = "customerId", target = "person.id")
    Deposit map(DepositDto dto);
}
