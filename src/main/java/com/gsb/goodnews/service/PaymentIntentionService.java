package com.gsb.goodnews.service;

import com.gsb.goodnews.command.paymentIntention.CreatePaymentIntentionCommand;
import com.gsb.goodnews.command.paymentIntention.DeletePaymentIntentionCommand;
import com.gsb.goodnews.domain.PaymentIntention;
import com.gsb.goodnews.dto.PaymentIntentionDto;
import com.gsb.goodnews.exception.NotFoundException;
import com.gsb.goodnews.queryobject.PaymentIntentionQueryObject;
import com.gsb.goodnews.queryobject.PaymentIntentionSearchDto;
import com.gsb.goodnews.queryobject.querydsl.SearchResponseDto;
import com.gsb.goodnews.repository.PaymentIntentionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class PaymentIntentionService {

    private final PaymentIntentionRepository paymentIntentionRepository;
    private final PaymentIntentionQueryObject paymentIntentionQueryObject;
    private final CreatePaymentIntentionCommand createPaymentIntentionCommand;
    private final DeletePaymentIntentionCommand deletePaymentIntentionCommand;

    public PaymentIntention get(long id) {
        return paymentIntentionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Provider not found with id " + id));
    }

    public SearchResponseDto<PaymentIntentionDto> search(PaymentIntentionSearchDto dto) {
        return paymentIntentionQueryObject.search(dto);
    }

    @Transactional
    public PaymentIntention create(PaymentIntentionDto dto) {
        return createPaymentIntentionCommand.create(dto);
    }

    @Transactional
    public void delete(long id) {
        deletePaymentIntentionCommand.delete(id);
    }
}
