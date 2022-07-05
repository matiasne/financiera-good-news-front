package com.gsb.goodnews.repository;

import com.gsb.goodnews.domain.transaction.ProviderCashDelivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

@Component
public interface ProviderCashDeliveryRepository extends JpaRepository<ProviderCashDelivery, Long> {
}
