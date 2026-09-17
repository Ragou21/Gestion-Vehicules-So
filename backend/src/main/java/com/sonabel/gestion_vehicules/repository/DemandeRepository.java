package com.sonabel.gestion_vehicules.repository;

import com.sonabel.gestion_vehicules.Demande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DemandeRepository extends JpaRepository<Demande, Long> {
    
    // Trouver les demandes par statut
    List<Demande> findByStatut(String statut);
    
    // Trouver les demandes d'un utilisateur
    List<Demande> findByUtilisateurId(Long utilisateurId);
    
    // Trouver les demandes d'un véhicule
    List<Demande> findByImmatriculation(String immatriculation);
    
    // Trouver les demandes en cours (non retournées)
    List<Demande> findByStatutIn(List<String> statuts);
    
    // Recherche par immatriculation et plage de dates
    List<Demande> findByImmatriculationAndDateHeureSortieBetween(
        String immatriculation, 
        LocalDateTime debut, 
        LocalDateTime fin
    );
    
    // Vérifier si un véhicule a une demande en cours
    boolean existsByImmatriculationAndStatutIn(
        String immatriculation, 
        List<String> statuts
    );
}
