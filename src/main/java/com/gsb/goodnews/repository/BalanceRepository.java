package com.gsb.goodnews.repository;

import com.gsb.goodnews.domain.Balance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public interface BalanceRepository extends JpaRepository<Balance, Long> {
    Optional<Balance> findByType(String type);
}
