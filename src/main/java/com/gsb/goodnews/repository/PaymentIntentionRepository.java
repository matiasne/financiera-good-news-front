package com.gsb.goodnews.repository;

import com.gsb.goodnews.domain.PaymentIntention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

@Component
public interface PaymentIntentionRepository extends JpaRepository<PaymentIntention, Long> {
}
