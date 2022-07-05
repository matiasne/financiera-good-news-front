package com.gsb.goodnews.repository;

import com.gsb.goodnews.domain.ProviderAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface ProviderAccountRepository extends JpaRepository<ProviderAccount, Long> {

    boolean existsByAccountNumber(String accountNumber);

    ProviderAccount getByAccountNumber(String accountNumber);

    List<ProviderAccount> findAllByProviderId(long providerId);
}
