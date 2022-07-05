package com.gsb.goodnews.queryobject;

import com.gsb.goodnews.domain.QPerson;
import com.gsb.goodnews.domain.transaction.QTransaction;
import com.gsb.goodnews.dto.TransactionDto;
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
public class TransactionQueryObject {

    private final JPAQueryFactory jpaQueryFactory;

    public SearchResponseDto<TransactionDto> search(TransactionSearchDto dto) {
        QTransaction qTransaction = QTransaction.transaction;
        QPerson qPerson = QPerson.person;

        BooleanBuilder where = getWhere(dto, qTransaction);

        List<TransactionDto> result = jpaQueryFactory
                .get()
                .select(getProjection(qTransaction))
                .from(qTransaction)
                .where(where)
                .leftJoin(qTransaction.person, qPerson)
                .orderBy(JPAQueryOrderHelper.getSortedColumn(qTransaction, dto.getSort(), dto.getOrder()))
                .limit(JPAQueryPageSizeHelper.getLimit(dto.getSize()))
                .offset(JPAQueryPageSizeHelper.getOffset(dto.getPage(), dto.getSize()))
                .fetch();

        long total = jpaQueryFactory
                .get()
                .from(qTransaction)
                .where(where)
                .fetch()
                .size();

        return new SearchResponseDto<>(total, result);
    }

    private QBean<TransactionDto> getProjection(QTransaction q) {
        return Projections.fields(TransactionDto.class,
                q.id,
                q.createdAt,
                q.lastUpdated,
                q.dtype,
                q.total,
                q.person.name.as("personName"),
                q.notes);
    }

    private BooleanBuilder getWhere(TransactionSearchDto dto, QTransaction q) {
        BooleanBuilder booleanBuilder = new BooleanBuilder();
        if (dto.getId() != 0) {
            booleanBuilder.and(q.id.eq(dto.getId()));
        }

        if (StringUtils.isNotBlank(dto.getFrom())) {
            booleanBuilder.and(q.createdAt.goe(dto.getFrom()));
        }

        if (StringUtils.isNotBlank(dto.getTo())) {
            booleanBuilder.and(q.createdAt.loe(dto.getTo()));
        }

        if (dto.getTotal() != null) {
            booleanBuilder.and(q.total.eq(dto.getTotal()));
        }

        if (StringUtils.isNotBlank(dto.getDtype())) {
            booleanBuilder.and(q.dtype.equalsIgnoreCase(dto.getDtype()));
        }

        return booleanBuilder;
    }
}
