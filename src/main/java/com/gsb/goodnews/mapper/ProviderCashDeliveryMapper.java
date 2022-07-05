package com.gsb.goodnews.mapper;

import com.gsb.goodnews.domain.transaction.ProviderCashDelivery;
import com.gsb.goodnews.dto.ProviderCashDeliveryDto;
import org.mapstruct.InheritConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = BaseMapper.class)
public interface ProviderCashDeliveryMapper extends BaseMapper<ProviderCashDeliveryDto, ProviderCashDelivery> {

    @InheritConfiguration(name = "map")
    @Mapping(source = "providerId", target = "provider.id")
    @Mapping(source = "providerId", target = "person.id")
    ProviderCashDelivery map(ProviderCashDeliveryDto dto);
}
