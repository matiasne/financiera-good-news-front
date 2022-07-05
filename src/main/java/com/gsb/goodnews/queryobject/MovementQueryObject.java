package com.gsb.goodnews.queryobject;

import com.gsb.goodnews.domain.QMovement;
import com.gsb.goodnews.domain.QPerson;
import com.gsb.goodnews.domain.QProviderAccount;
import com.gsb.goodnews.domain.transaction.QTransaction;
import com.gsb.goodnews.dto.MovementDto;
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
public class MovementQueryObject {

    private final JPAQueryFactory jpaQueryFactory;

    public SearchResponseDto<MovementDto> search(MovementSearchDto dto) {
        QMovement qMovement = QMovement.movement;
        QPerson qPerson = QPerson.person;
        QProviderAccount qProviderAccount = QProviderAccount.providerAccount;
        QTransaction qTransaction = QTransaction.transaction;

        BooleanBuilder where = getWhere(dto, qMovement);

        List<MovementDto> result = jpaQueryFactory
                .get()
                .select(getBean(qMovement))
                .from(qMovement)
                .leftJoin(qMovement.person, qPerson)
                .leftJoin(qMovement.providerAccount, qProviderAccount)
                .leftJoin(qMovement.transaction, qTransaction)
                .where(where)
                .orderBy(JPAQueryOrderHelper.getSortedColumn(qMovement, dto.getSort(), dto.getOrder()))
                .limit(JPAQueryPageSizeHelper.getLimit(dto.getSize()))
                .offset(JPAQueryPageSizeHelper.getOffset(dto.getPage(), dto.getSize()))
                .fetchAll()
                .fetch();

        long total = jpaQueryFactory
                .get()
                .from(qMovement)
                .where(where)
                .fetch()
                .size();

        return new SearchResponseDto<>(total, result);
    }

    private QBean<MovementDto> getBean(QMovement qMovement) {
        return Projections.bean(MovementDto.class,
                qMovement.id,
                qMovement.createdAt,
                qMovement.lastUpdated,
                qMovement.concept,
                qMovement.fee,
                qMovement.totalFee,
                qMovement.total,
                qMovement.prevBalance,
                qMovement.balance,
                qMovement.notes,
                qMovement.person.id.as("personId"),
                qMovement.person.name.as("personName"),
                qMovement.person.dtype.as("personDtype"),
                qMovement.person.email.as("personEmail"),
                qMovement.providerAccount.name.as("providerAccountName"),
                qMovement.providerAccount.accountNumber.as("providerAccountNumber"),
                qMovement.transaction.id.as("transactionId"),
                qMovement.transaction.dtype.as("transactionDtype"),
                qMovement.transaction.status.as("transactionStatus"));
    }

    private BooleanBuilder getWhere(MovementSearchDto dto, QMovement q) {
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

        if (StringUtils.isNotBlank(dto.getConcept())) {
            booleanBuilder.and(q.concept.containsIgnoreCase(dto.getConcept()));
        }

        if (StringUtils.isNotBlank(dto.getStatus())) {
            booleanBuilder.and(q.transaction.status.containsIgnoreCase(dto.getStatus()));
        }

        if (dto.getDtypes().size() > 0) {
            dto.getDtypes().forEach(dtype -> booleanBuilder.or(q.transaction.dtype.eq(dtype)));
        }

        if (dto.getPersonId() != 0) {
            booleanBuilder.and(q.person.id.eq(dto.getPersonId()));
        }

        if (!StringUtils.isBlank(dto.getPersonName())) {
            booleanBuilder.and(q.person.name.containsIgnoreCase(dto.getPersonName()));
        }

        if (!StringUtils.isBlank(dto.getPersonDtype())) {
            booleanBuilder.and(q.person.dtype.containsIgnoreCase(dto.getPersonDtype()));
        }

        if (dto.getProviderAccountId() != 0) {
            booleanBuilder.and(q.providerAccount.id.eq(dto.getProviderAccountId()));
        }


        return booleanBuilder;
    }
}
