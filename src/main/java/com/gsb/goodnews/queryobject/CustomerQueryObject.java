package com.gsb.goodnews.queryobject;

import com.gsb.goodnews.domain.QCustomer;
import com.gsb.goodnews.dto.person.CustomerDto;
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
public class CustomerQueryObject {

    private final JPAQueryFactory jpaQueryFactory;

    public SearchResponseDto<CustomerDto> search(CustomerSearchDto dto) {
        QCustomer qCustomer = QCustomer.customer;

        BooleanBuilder where = getWhere(dto, qCustomer);

        List<CustomerDto> result = jpaQueryFactory
                .get()
                .select(getProjection(qCustomer))
                .from(qCustomer)
                .where(where)
                .orderBy(JPAQueryOrderHelper.getSortedColumn(qCustomer, dto.getSort(), dto.getOrder()))
                .limit(JPAQueryPageSizeHelper.getLimit(dto.getSize()))
                .offset(JPAQueryPageSizeHelper.getOffset(dto.getPage(), dto.getSize()))
                .fetch();


        long total = jpaQueryFactory
                .get()
                .from(qCustomer)
                .where(where)
                .fetch()
                .size();

        return new SearchResponseDto<>(total, result);
    }

    private QBean<CustomerDto> getProjection(QCustomer qCustomer) {
        return Projections.fields(CustomerDto.class,
                qCustomer.id,
                qCustomer.createdAt,
                qCustomer.lastUpdated,
                qCustomer.name,
                qCustomer.email,
                qCustomer.phone,
                qCustomer.balance,
                qCustomer.notes);
    }

    private BooleanBuilder getWhere(CustomerSearchDto dto, QCustomer qCustomer) {
        BooleanBuilder booleanBuilder = new BooleanBuilder();
        if (dto.getId() != 0) {
            booleanBuilder.and(qCustomer.id.eq(dto.getId()));
        }

        if (!StringUtils.isBlank(dto.getName())) {
            booleanBuilder.and(qCustomer.name.containsIgnoreCase(dto.getName()));
        }

        if (!StringUtils.isBlank(dto.getEmail())) {
            booleanBuilder.and(qCustomer.email.containsIgnoreCase(dto.getEmail()));
        }

        return booleanBuilder;
    }
}
