package com.gsb.goodnews.service;

import com.gsb.goodnews.command.transaction.payment.CreatePaymentCommand;
import com.gsb.goodnews.command.transaction.payment.DeletePaymentCommand;
import com.gsb.goodnews.domain.transaction.Payment;
import com.gsb.goodnews.dto.PaymentDto;
import com.gsb.goodnews.exception.NotFoundException;
import com.gsb.goodnews.queryobject.PaymentQueryObject;
import com.gsb.goodnews.queryobject.PaymentSearchDto;
import com.gsb.goodnews.queryobject.querydsl.SearchResponseDto;
import com.gsb.goodnews.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentQueryObject paymentQueryObject;
    private final CreatePaymentCommand createPaymentCommand;
    private final DeletePaymentCommand deletePaymentCommand;

    public Payment get(long id) {
        return paymentRepository.findById(id).orElseThrow(() -> new NotFoundException("Payment not found"));
    }

    public SearchResponseDto<PaymentDto> search(PaymentSearchDto dto) {
        return paymentQueryObject.search(dto);
    }

    @Transactional
    public Payment create(PaymentDto dto) {
        return createPaymentCommand.create(dto);
    }

    @Transactional
    public void delete(long id) {
        deletePaymentCommand.delete(id);
    }
}
