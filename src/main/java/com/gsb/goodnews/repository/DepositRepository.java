package com.gsb.goodnews.repository;

import com.gsb.goodnews.domain.transaction.Deposit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public interface DepositRepository extends JpaRepository<Deposit, Long> {
    boolean existsByInternalId(String internalId);

    Optional<Deposit> findByInternalId(String internalId);
}
