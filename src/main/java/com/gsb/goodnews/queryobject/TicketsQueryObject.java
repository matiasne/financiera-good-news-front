package com.gsb.goodnews.queryobject;

import com.gsb.goodnews.domain.transaction.QDeposit;
import com.gsb.goodnews.dto.DepositDto;
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
public class TicketsQueryObject {

    private final JPAQueryFactory jpaQueryFactory;

    public SearchResponseDto<DepositDto> search(DepositSearchDto dto) {
        QDeposit qDeposit = QDeposit.deposit;

        BooleanBuilder where = getWhere(dto, qDeposit);

        List<DepositDto> result = jpaQueryFactory
                .get()
                .select(getProjection(qDeposit))
                .from(qDeposit)
                .where(where)
                .orderBy(JPAQueryOrderHelper.getSortedColumn(qDeposit, dto.getSort(), dto.getOrder()))
                .limit(JPAQueryPageSizeHelper.getLimit(dto.getSize()))
                .offset(JPAQueryPageSizeHelper.getOffset(dto.getPage(), dto.getSize()))
                .fetch();

        long total = jpaQueryFactory
                .get()
                .from(qDeposit)
                .where(where)
                .fetch()
                .size();

        return new SearchResponseDto<>(total, result);
    }

    private QBean<DepositDto> getProjection(QDeposit q) {
        return Projections.fields(DepositDto.class,
                q.id,
                q.createdAt,
                q.lastUpdated,
                q.internalId,
                q.status,
                q.customerFee,
                q.providerAccountFee,
                q.total,
                q.file,
                q.computable,
                q.notes,
                q.providerAccount.id.as("providerAccountId"),
                q.providerAccount.accountNumber.as("providerAccountNumber"),
                q.providerAccount.name.as("providerAccountName"),
                q.providerAccount.provider.id.as("providerId"),
                q.providerAccount.provider.name.as("providerName"),
                q.customer.id.as("customerId"),
                q.customer.name.as("customerName"),
                q.cuit);
    }

    private BooleanBuilder getWhere(DepositSearchDto dto, QDeposit q) {
        BooleanBuilder booleanBuilder = new BooleanBuilder();
        if (dto.getId() != 0) {
            booleanBuilder.and(q.id.eq(dto.getId()));
        }

        if (StringUtils.isNoneBlank(dto.getInternalId())) {
            booleanBuilder.and(q.internalId.eq(dto.getInternalId()));
        }

        if (StringUtils.isNotBlank(dto.getFrom())) {
            booleanBuilder.and(q.createdAt.goe(dto.getFrom()));
        }

        if (StringUtils.isNotBlank(dto.getTo())) {
            booleanBuilder.and(q.createdAt.loe(dto.getTo()));
        }

        if (dto.getProviderId() != 0) {
            booleanBuilder.and(q.providerAccount.provider.id.eq(dto.getProviderId()));
        }

        if (dto.getProviderAccountId() != 0) {
            booleanBuilder.and(q.providerAccount.id.eq(dto.getProviderAccountId()));
        }

        if (dto.getCustomerId() != 0) {
            booleanBuilder.and(q.customer.id.eq(dto.getCustomerId()));
        }

        if (!dto.getStatus().isEmpty()) {
            booleanBuilder.and(q.status.in(dto.getStatus()));
        }

        if (dto.getTotal() != null) {
            booleanBuilder.and(q.total.eq(dto.getTotal()));
        }

        return booleanBuilder;
    }
}
