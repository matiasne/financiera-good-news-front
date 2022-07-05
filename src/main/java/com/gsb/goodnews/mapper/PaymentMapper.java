package com.gsb.goodnews.mapper;

import com.gsb.goodnews.domain.transaction.Payment;
import com.gsb.goodnews.dto.PaymentDto;
import org.mapstruct.InheritConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = BaseMapper.class)
public abstract class PaymentMapper implements BaseMapper<PaymentDto, Payment> {

    @InheritConfiguration(name = "map")
    @Mapping(source = "paymentIntentionId", target = "paymentIntention.id")
    @Mapping(source = "customerId", target = "customer.id")
    @Mapping(source = "customerId", target = "person.id")
    abstract Payment _map(PaymentDto dto);

    public Payment map(PaymentDto dto) {
        Payment payment = _map(dto);

        if (dto.getPaymentIntentionId() == null || dto.getPaymentIntentionId() == 0) {
            payment.setPaymentIntention(null);
        }

        return payment;
    }
}
