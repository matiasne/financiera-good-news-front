package com.gsb.goodnews.queryobject.querydsl;

import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.EntityPathBase;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQuery;

public class JPAQueryOrderHelper {

    /**
     * @param q              {@link JPAQuery} to add the order by
     * @param entityPathBase {@link EntityPathBase<T>} entityPathBase entity to sort by
     * @param fieldName      {@link String} name of property of {@param entityPathBase} entity
     * @param order          {@link String}
     */
    public static <T> void getSortedColumn(JPAQuery<T> q, EntityPathBase<T> entityPathBase, String fieldName, String order) {
        q.orderBy(getSortedColumn(entityPathBase, fieldName, order));
    }

    /**
     * @param q              {@link JPAQuery} to add the order by
     * @param entityPathBase {@link EntityPathBase<T>} entityPathBase entity to sort by
     * @param fieldName      {@link String} name of property of {@param entityPathBase} entity
     * @param order          {@link String}
     */
    public static <T> void getSortedColumn(T clazz, JPAQuery<T> q, EntityPathBase<T> entityPathBase, String fieldName, String order) {
        q.orderBy(getSortedColumn(entityPathBase, fieldName, order));
    }

    public static <T> OrderSpecifier<?> getSortedColumn(EntityPathBase<T> entityPathBase, String fieldName, String order) {

        if (fieldName == null) {
            fieldName = "";
        }

        switch (fieldName.trim()) {
            case "providerId":
                fieldName = "provider.id";
                break;
            case "providerName":
                fieldName = "provider.name";
                break;
            case "providerAccountNumber":
                fieldName = "providerAccount.accountNumber";
                break;
            case "providerAccountName":
                fieldName = "providerAccount.name";
                break;
        }

        Path<?> field = Expressions.path(Object.class, entityPathBase, fieldName);

        return getSortedColumn(field, order);
    }

    public static OrderSpecifier<?> getSortedColumn(Path<?> field, String order) {
        Order orderType = "desc".equalsIgnoreCase(order) ?
                Order.DESC :
                Order.ASC;

        return getSortedColumn(field, orderType);

    }

    public static OrderSpecifier<?> getSortedColumn(Path<?> field, Order order) {
        return new OrderSpecifier(
                order,
                field);
    }
}
