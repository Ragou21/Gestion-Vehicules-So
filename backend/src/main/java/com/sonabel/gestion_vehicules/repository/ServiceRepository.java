package com.sonabel.gestion_vehicules.repository;

import com.sonabel.gestion_vehicules.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
}
