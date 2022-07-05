package com.gsb.goodnews.command.paymentIntention;

import com.gsb.goodnews.domain.PaymentIntention;
import com.gsb.goodnews.dto.PaymentIntentionDto;
import com.gsb.goodnews.mapper.PaymentIntentionMapper;
import com.gsb.goodnews.repository.PaymentIntentionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CreatePaymentIntentionCommand {

    private final PaymentIntentionRepository paymentIntentionRepository;
    private final PaymentIntentionMapper paymentIntentionMapper;
    private final PaymentIntentionValidator paymentIntentionValidator;

    public PaymentIntention create(PaymentIntentionDto dto) {
        paymentIntentionValidator.validateCreate(dto);
        PaymentIntention paymentIntention = paymentIntentionMapper.map(dto);
        return paymentIntentionRepository.save(paymentIntention);
    }
}
