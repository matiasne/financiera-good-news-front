package com.gsb.goodnews.repository;

import com.gsb.goodnews.domain.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface RoleRepository extends JpaRepository<Role, Long> {

    List<Role> findAllByNameIn(Iterable<String> name);
}
