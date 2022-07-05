package com.gsb.goodnews.repository;

import com.gsb.goodnews.domain.CustomerCommission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

@Component
public interface CustomerCommissionRepository extends JpaRepository<CustomerCommission, Long> {

}
