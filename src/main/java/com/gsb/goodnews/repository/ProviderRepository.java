package com.gsb.goodnews.repository;

import com.gsb.goodnews.domain.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

@Component
public interface ProviderRepository extends JpaRepository<Provider, Long> {
    boolean existsByEmail(String email);

    boolean existsByName(String name);
}
