package com.sonabel.gestion_vehicules.repository;

import com.sonabel.gestion_vehicules.Vehicule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VehiculeRepository extends JpaRepository<Vehicule, Long> {
    
    Optional<Vehicule> findByImmatriculation(String immatriculation);
    
    List<Vehicule> findByDisponibleTrue();
    
    boolean existsByImmatriculation(String immatriculation);
}
