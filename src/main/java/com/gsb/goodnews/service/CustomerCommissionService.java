package com.gsb.goodnews.service;

import com.gsb.goodnews.command.customerCommission.UpdateCustomerCommissionCommand;
import com.gsb.goodnews.domain.CustomerCommission;
import com.gsb.goodnews.domain.QCustomerCommission;
import com.gsb.goodnews.dto.CustomerCommissionsDto;
import com.gsb.goodnews.queryobject.querydsl.JPAQueryFactory;
import com.querydsl.core.BooleanBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerCommissionService {

    private final UpdateCustomerCommissionCommand updateCustomerCommissionCommand;
    private final JPAQueryFactory jpaQueryFactory;

    public List<CustomerCommission> getByCustomerId(long customerId) {
        QCustomerCommission qCustomerCommission = QCustomerCommission.customerCommission;

        return jpaQueryFactory.get().select(qCustomerCommission).from(qCustomerCommission)
                .where(new BooleanBuilder()
                        .and(qCustomerCommission.active.isTrue())
                        .and(qCustomerCommission.providerAccount.active.isTrue())
                        .and(qCustomerCommission.customer.id.eq(customerId)))
                .fetch();
    }

    @Transactional
    public void update(CustomerCommissionsDto dto) {
        updateCustomerCommissionCommand.update(dto);
    }
}
