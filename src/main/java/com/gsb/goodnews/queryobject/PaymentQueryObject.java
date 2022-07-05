package com.gsb.goodnews.queryobject;

import com.gsb.goodnews.domain.QPaymentIntention;
import com.gsb.goodnews.domain.transaction.QPayment;
import com.gsb.goodnews.dto.PaymentDto;
import com.gsb.goodnews.queryobject.querydsl.JPAQueryFactory;
import com.gsb.goodnews.queryobject.querydsl.JPAQueryOrderHelper;
import com.gsb.goodnews.queryobject.querydsl.JPAQueryPageSizeHelper;
import com.gsb.goodnews.queryobject.querydsl.SearchResponseDto;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.QBean;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class PaymentQueryObject {

    private final JPAQueryFactory jpaQueryFactory;

    public SearchResponseDto<PaymentDto> search(PaymentSearchDto dto) {
        QPayment qPayment = QPayment.payment;
        QPaymentIntention qPaymentIntention = QPaymentIntention.paymentIntention;

        BooleanBuilder where = getWhere(dto, qPayment);

        List<PaymentDto> result = jpaQueryFactory
                .get()
                .select(getProjection(qPayment))
                .from(qPayment)
                .leftJoin(qPayment.paymentIntention, qPaymentIntention)
                .where(where)
                .orderBy(JPAQueryOrderHelper.getSortedColumn(qPayment, dto.getSort(), dto.getOrder()))
                .limit(JPAQueryPageSizeHelper.getLimit(dto.getSize()))
                .offset(JPAQueryPageSizeHelper.getOffset(dto.getPage(), dto.getSize()))
                .fetch();


        long total = jpaQueryFactory
                .get()
                .from(qPayment)
                .where(where)
                .fetch()
                .size();

        return new SearchResponseDto<>(total, result);
    }

    private QBean<PaymentDto> getProjection(QPayment q) {
        return Projections.fields(PaymentDto.class,
                q.id,
                q.customer.id.as("customerId"),
                q.customer.name.as("customerName"),
                q.paymentIntention.id.as("paymentIntentionId"),
                q.total,
                q.createdAt,
                q.lastUpdated,
                q.notes);
    }

    private BooleanBuilder getWhere(PaymentSearchDto dto, QPayment q) {
        BooleanBuilder booleanBuilder = new BooleanBuilder();
        if (dto.getId() != 0) {
            booleanBuilder.and(q.id.eq(dto.getId()));
        }

        if (dto.getId() != 0) {
            booleanBuilder.and(q.customer.id.eq(dto.getCustomerId()));
        }

        if (!StringUtils.isBlank(dto.getReceiverDocument())) {
            booleanBuilder.and(q.paymentIntention.receiverDocument.containsIgnoreCase(dto.getReceiverDocument()));
        }

        if (!StringUtils.isBlank(dto.getReceiverName())) {
            booleanBuilder.and(q.paymentIntention.receiverName.containsIgnoreCase(dto.getReceiverName()));
        }

        if (dto.getTotal() != null) {
            booleanBuilder.and(q.total.eq(dto.getTotal()));
        }

        return booleanBuilder;
    }
}
