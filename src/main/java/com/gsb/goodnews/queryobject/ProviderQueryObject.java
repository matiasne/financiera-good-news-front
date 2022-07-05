package com.gsb.goodnews.queryobject;

import com.gsb.goodnews.domain.QProvider;
import com.gsb.goodnews.dto.person.ProviderDto;
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
public class ProviderQueryObject {

    private final JPAQueryFactory jpaQueryFactory;

    public SearchResponseDto<ProviderDto> search(ProviderSearchDto dto) {
        QProvider qProvider = QProvider.provider;

        BooleanBuilder where = getWhere(dto, qProvider);

        List<ProviderDto> result = jpaQueryFactory
                .get()
                .select(getProjection(qProvider))
                .from(qProvider)
                .where(where)
                .orderBy(JPAQueryOrderHelper.getSortedColumn(qProvider, dto.getSort(), dto.getOrder()))
                .limit(JPAQueryPageSizeHelper.getLimit(dto.getSize()))
                .offset(JPAQueryPageSizeHelper.getOffset(dto.getPage(), dto.getSize()))
                .fetch();


        long total = jpaQueryFactory
                .get()
                .from(qProvider)
                .where(where)
                .fetch()
                .size();

        return new SearchResponseDto<>(total, result);
    }

    private QBean<ProviderDto> getProjection(QProvider q) {
        return Projections.fields(ProviderDto.class,
                q.id,
                q.createdAt,
                q.lastUpdated,
                q.name,
                q.email,
                q.phone,
                q.notes,
                q.balance);
    }

    private BooleanBuilder getWhere(ProviderSearchDto dto, QProvider q) {
        BooleanBuilder booleanBuilder = new BooleanBuilder();
        if (dto.getId() != 0) {
            booleanBuilder.and(q.id.eq(dto.getId()));
        }

        if (!StringUtils.isBlank(dto.getName())) {
            booleanBuilder.and(q.name.containsIgnoreCase(dto.getName()));
        }

        if (!StringUtils.isBlank(dto.getEmail())) {
            booleanBuilder.and(q.email.containsIgnoreCase(dto.getEmail()));
        }

        return booleanBuilder;
    }
}
