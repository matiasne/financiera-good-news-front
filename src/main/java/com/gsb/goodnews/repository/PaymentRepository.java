package com.gsb.goodnews.repository;

import com.gsb.goodnews.domain.transaction.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

@Component
public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
