package com.gsb.goodnews.queryobject;

import com.gsb.goodnews.domain.QPaymentIntention;
import com.gsb.goodnews.dto.PaymentIntentionDto;
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
public class PaymentIntentionQueryObject {

    private final JPAQueryFactory jpaQueryFactory;

    public SearchResponseDto<PaymentIntentionDto> search(PaymentIntentionSearchDto dto) {
        QPaymentIntention qPaymentIntention = QPaymentIntention.paymentIntention;

        BooleanBuilder where = getWhere(dto, qPaymentIntention);

        List<PaymentIntentionDto> result = jpaQueryFactory
                .get()
                .select(getProjection(qPaymentIntention))
                .from(qPaymentIntention)
                .where(where)
                .orderBy(JPAQueryOrderHelper.getSortedColumn(qPaymentIntention, dto.getSort(), dto.getOrder()))
                .limit(JPAQueryPageSizeHelper.getLimit(dto.getSize()))
                .offset(JPAQueryPageSizeHelper.getOffset(dto.getPage(), dto.getSize()))
                .fetch();


        long total = jpaQueryFactory
                .get()
                .from(qPaymentIntention)
                .where(where)
                .fetch()
                .size();

        return new SearchResponseDto<>(total, result);
    }

    private QBean<PaymentIntentionDto> getProjection(QPaymentIntention q) {
        return Projections.fields(PaymentIntentionDto.class,
                q.id,
                q.customer.id.as("customerId"),
                q.customer.name.as("customerName"),
                q.receiverDocument,
                q.receiverName,
                q.total,
                q.payed,
                q.createdAt,
                q.lastUpdated,
                q.notes);
    }

    private BooleanBuilder getWhere(PaymentIntentionSearchDto dto, QPaymentIntention q) {
        BooleanBuilder booleanBuilder = new BooleanBuilder();
        if (dto.getId() != 0) {
            booleanBuilder.and(q.id.eq(dto.getId()));
        }

        if (dto.getCustomerId() != 0) {
            booleanBuilder.and(q.customer.id.eq(dto.getCustomerId()));
        }

        if (dto.getPayed() != null) {
            if (dto.getPayed()) {
                booleanBuilder.and(q.payed.isTrue());
            } else {
                booleanBuilder.and(q.payed.isFalse());
            }
        }

        if (!StringUtils.isBlank(dto.getReceiverDocument())) {
            booleanBuilder.and(q.receiverDocument.containsIgnoreCase(dto.getReceiverDocument()));
        }

        if (!StringUtils.isBlank(dto.getReceiverName())) {
            booleanBuilder.and(q.receiverName.containsIgnoreCase(dto.getReceiverName()));
        }

        return booleanBuilder;
    }
}
