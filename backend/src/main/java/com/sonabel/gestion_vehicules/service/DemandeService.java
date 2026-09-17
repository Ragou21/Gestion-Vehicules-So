package com.sonabel.gestion_vehicules.service;

import com.sonabel.gestion_vehicules.Demande;
import com.sonabel.gestion_vehicules.repository.DemandeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class DemandeService {

    @Autowired
    private DemandeRepository demandeRepository;

    // Liste toutes les demandes
    public List<Demande> getAllDemandes() {
        return demandeRepository.findAll();
    }

    // Trouver une demande par ID
    public Optional<Demande> getDemandeById(Long id) {
        return demandeRepository.findById(id);
    }

    // Trouver les demandes par statut
    public List<Demande> getDemandesByStatut(String statut) {
        return demandeRepository.findByStatut(statut);
    }

    // Trouver les demandes d'un utilisateur
    public List<Demande> getDemandesByUtilisateur(Long utilisateurId) {
        return demandeRepository.findByUtilisateurId(utilisateurId);
    }

    // Trouver les demandes en cours (non retournées)
    public List<Demande> getDemandesEnCours() {
        return demandeRepository.findByStatutIn(
            Arrays.asList("EN_ATTENTE", "ACCEPTEE", "EXECUTEE")
        );
    }

    // === ANTI-DOUBLON ===
    // Vérifier si un véhicule a déjà une demande en cours
    public boolean verifierVehiculeEnCours(String immatriculation) {
        return demandeRepository.existsByImmatriculationAndStatutIn(
            immatriculation,
            Arrays.asList("EN_ATTENTE", "ACCEPTEE", "EXECUTEE")
        );
    }

    // Créer une demande
    public Demande createDemande(Demande demande) {
        demande.setDateCreation(LocalDateTime.now());
        demande.setDateModification(LocalDateTime.now());
        return demandeRepository.save(demande);
    }

    // Mettre à jour une demande
    public Demande updateDemande(Long id, Demande demande) {
        demande.setId(id);
        demande.setDateModification(LocalDateTime.now());
        return demandeRepository.save(demande);
    }

    // Changer le statut d'une demande
    public Demande changerStatut(Long id, String nouveauStatut) {
        Optional<Demande> demandeOpt = demandeRepository.findById(id);
        if (demandeOpt.isPresent()) {
            Demande demande = demandeOpt.get();
            demande.setStatut(nouveauStatut);
            demande.setDateModification(LocalDateTime.now());
            return demandeRepository.save(demande);
        }
        return null;
    }

    // Supprimer une demande
    public void deleteDemande(Long id) {
        demandeRepository.deleteById(id);
    }

    // Recherche par immatriculation et plage de dates
    public List<Demande> rechercherParImmatriculationEtDates(
            String immatriculation,
            LocalDateTime debut,
            LocalDateTime fin) {
        return demandeRepository.findByImmatriculationAndDateHeureSortieBetween(
            immatriculation, debut, fin
        );
    }
}
