package com.gsb.goodnews.queryobject.querydsl;

import com.querydsl.jpa.impl.JPAQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Component
@RequiredArgsConstructor
public class JPAQueryFactory {
    private final @PersistenceContext
    EntityManager em;

    public JPAQuery<Void> get() {
        return new JPAQuery<>(em);
    }
}
