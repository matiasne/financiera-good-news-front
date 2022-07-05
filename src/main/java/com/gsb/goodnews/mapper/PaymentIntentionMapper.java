package com.gsb.goodnews.mapper;

import com.gsb.goodnews.domain.PaymentIntention;
import com.gsb.goodnews.dto.PaymentIntentionDto;
import org.mapstruct.InheritConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = BaseMapper.class)
public interface PaymentIntentionMapper extends BaseMapper<PaymentIntentionDto, PaymentIntention> {

    @InheritConfiguration(name = "map")
    @Mapping(source = "customerId", target = "customer.id")
    PaymentIntention map(PaymentIntentionDto dto);
}
