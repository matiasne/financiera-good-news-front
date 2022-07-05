package com.gsb.goodnews.repository;

import com.gsb.goodnews.domain.Movement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

@Component
public interface MovementRepository extends JpaRepository<Movement, Long> {

}
