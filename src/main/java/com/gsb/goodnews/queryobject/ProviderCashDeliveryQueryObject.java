package com.gsb.goodnews.queryobject;

import com.gsb.goodnews.domain.transaction.QProviderCashDelivery;
import com.gsb.goodnews.dto.ProviderCashDeliveryDto;
import com.gsb.goodnews.queryobject.querydsl.JPAQueryFactory;
import com.gsb.goodnews.queryobject.querydsl.JPAQueryOrderHelper;
import com.gsb.goodnews.queryobject.querydsl.JPAQueryPageSizeHelper;
import com.gsb.goodnews.queryobject.querydsl.SearchResponseDto;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.QBean;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ProviderCashDeliveryQueryObject {

    private final JPAQueryFactory jpaQueryFactory;

    public SearchResponseDto<ProviderCashDeliveryDto> search(ProviderCashDeliverySearchDto dto) {
        QProviderCashDelivery qProviderCashDelivery = QProviderCashDelivery.providerCashDelivery;

        BooleanBuilder where = getWhere(dto, qProviderCashDelivery);

        List<ProviderCashDeliveryDto> result = jpaQueryFactory
                .get()
                .select(getProjection(qProviderCashDelivery))
                .from(qProviderCashDelivery)
                .where(where)
                .orderBy(JPAQueryOrderHelper.getSortedColumn(qProviderCashDelivery, dto.getSort(), dto.getOrder()))
                .limit(JPAQueryPageSizeHelper.getLimit(dto.getSize()))
                .offset(JPAQueryPageSizeHelper.getOffset(dto.getPage(), dto.getSize()))
                .fetch();


        long total = jpaQueryFactory
                .get()
                .from(qProviderCashDelivery)
                .where(where)
                .fetch()
                .size();

        return new SearchResponseDto<>(total, result);
    }

    private QBean<ProviderCashDeliveryDto> getProjection(QProviderCashDelivery q) {
        return Projections.fields(ProviderCashDeliveryDto.class,
                q.id,
                q.provider.id.as("providerId"),
                q.provider.name.as("providerName"),
                q.total,
                q.notes,
                q.createdAt,
                q.lastUpdated);
    }

    private BooleanBuilder getWhere(ProviderCashDeliverySearchDto dto, QProviderCashDelivery q) {
        BooleanBuilder booleanBuilder = new BooleanBuilder();
        if (dto.getId() != 0) {
            booleanBuilder.and(q.id.eq(dto.getId()));
        }

        if (dto.getTotal() != null) {
            booleanBuilder.and(q.total.eq(dto.getTotal()));
        }

        return booleanBuilder;
    }
}
