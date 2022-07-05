package com.gsb.goodnews.queryobject;

import com.gsb.goodnews.domain.QProvider;
import com.gsb.goodnews.domain.QProviderAccount;
import com.gsb.goodnews.dto.ProviderAccountDto;
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
public class ProviderAccountQueryObject {

    private final JPAQueryFactory jpaQueryFactory;

    public SearchResponseDto<ProviderAccountDto> search(ProviderAccountSearchDto dto) {
        QProviderAccount qProviderAccount = QProviderAccount.providerAccount;
        QProvider qProvider = QProvider.provider;

        BooleanBuilder where = getWhere(dto, qProviderAccount);

        List<ProviderAccountDto> result = jpaQueryFactory
                .get()
                .select(getProjection(qProviderAccount))
                .from(qProviderAccount)
                .leftJoin(qProviderAccount.provider, qProvider)
                .where(where)
                .orderBy(JPAQueryOrderHelper.getSortedColumn(qProviderAccount, dto.getSort(), dto.getOrder()))
                .limit(JPAQueryPageSizeHelper.getLimit(dto.getSize()))
                .offset(JPAQueryPageSizeHelper.getOffset(dto.getPage(), dto.getSize()))
                .fetch();


        long total = jpaQueryFactory
                .get()
                .from(qProviderAccount)
                .where(where)
                .fetch()
                .size();

        return new SearchResponseDto<>(total, result);
    }

    private QBean<ProviderAccountDto> getProjection(QProviderAccount q) {
        return Projections.fields(ProviderAccountDto.class,
                q.id,
                q.createdAt,
                q.lastUpdated,
                q.active,
                q.name,
                q.accountNumber,
                q.provider.id.as("providerId"),
                q.provider.name.as("providerName"),
                q.bank,
                q.type,
                q.fee,
                q.cbu,
                q.quota);
    }

    private BooleanBuilder getWhere(ProviderAccountSearchDto dto, QProviderAccount q) {
        BooleanBuilder booleanBuilder = new BooleanBuilder();
        if (dto.getId() != 0) {
            booleanBuilder.and(q.id.eq(dto.getId()));
        }

        if (dto.isActive()) {
            booleanBuilder.and(q.active.isTrue());
        } else {
            booleanBuilder.and(q.active.isFalse());
        }

        if (!StringUtils.isBlank(dto.getProviderName())) {
            booleanBuilder.and(q.provider.name.containsIgnoreCase(dto.getProviderName()));
        }

        if (dto.getProviderId() != 0) {
            booleanBuilder.and(q.provider.id.eq(dto.getProviderId()));
        }

        if (!StringUtils.isBlank(dto.getAccountNumber())) {
            booleanBuilder.and(q.accountNumber.containsIgnoreCase(dto.getAccountNumber()));
        }

        if (!StringUtils.isBlank(dto.getType())) {
            booleanBuilder.and(q.type.containsIgnoreCase(dto.getType()));
        }

        if (!StringUtils.isBlank(dto.getBank())) {
            booleanBuilder.and(q.bank.containsIgnoreCase(dto.getBank()));
        }

        return booleanBuilder;
    }
}
