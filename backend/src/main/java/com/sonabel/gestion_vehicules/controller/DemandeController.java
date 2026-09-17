package com.sonabel.gestion_vehicules.controller;

import com.sonabel.gestion_vehicules.Demande;
import com.sonabel.gestion_vehicules.service.DemandeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/demandes")
@CrossOrigin(origins = "*")
public class DemandeController {

    @Autowired
    private DemandeService demandeService;

    // GET /api/demandes - Toutes les demandes
    @GetMapping
    public List<Demande> getAllDemandes() {
        return demandeService.getAllDemandes();
    }

    // GET /api/demandes/{id} - Une demande par ID
    @GetMapping("/{id}")
    public ResponseEntity<Demande> getDemandeById(@PathVariable Long id) {
        return demandeService.getDemandeById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/demandes/statut/{statut} - Demandes par statut
    @GetMapping("/statut/{statut}")
    public List<Demande> getDemandesByStatut(@PathVariable String statut) {
        return demandeService.getDemandesByStatut(statut);
    }

    // GET /api/demandes/utilisateur/{id} - Demandes d'un utilisateur
    @GetMapping("/utilisateur/{id}")
    public List<Demande> getDemandesByUtilisateur(@PathVariable Long id) {
        return demandeService.getDemandesByUtilisateur(id);
    }

    // GET /api/demandes/en-cours - Demandes en cours
    @GetMapping("/en-cours")
    public List<Demande> getDemandesEnCours() {
        return demandeService.getDemandesEnCours();
    }

    // GET /api/demandes/verifier/{immatriculation} - Vérifier anti-doublon
    @GetMapping("/verifier/{immatriculation}")
    public ResponseEntity<Boolean> verifierVehicule(@PathVariable String immatriculation) {
        boolean enCours = demandeService.verifierVehiculeEnCours(immatriculation);
        return ResponseEntity.ok(enCours);
    }

    // POST /api/demandes - Créer une demande
    @PostMapping
    public Demande createDemande(@RequestBody Demande demande) {
        return demandeService.createDemande(demande);
    }

    // PUT /api/demandes/{id} - Modifier une demande
    @PutMapping("/{id}")
    public Demande updateDemande(@PathVariable Long id, @RequestBody Demande demande) {
        return demandeService.updateDemande(id, demande);
    }

    // PUT /api/demandes/{id}/statut/{statut} - Changer le statut
    @PutMapping("/{id}/statut/{statut}")
    public ResponseEntity<Demande> changerStatut(
            @PathVariable Long id, 
            @PathVariable String statut) {
        Demande demande = demandeService.changerStatut(id, statut);
        if (demande != null) {
            return ResponseEntity.ok(demande);
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE /api/demandes/{id} - Supprimer une demande
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDemande(@PathVariable Long id) {
        demandeService.deleteDemande(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/demandes/recherche?immatriculation=...&debut=...&fin=...
    @GetMapping("/recherche")
    public List<Demande> rechercher(
            @RequestParam String immatriculation,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime debut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return demandeService.rechercherParImmatriculationEtDates(immatriculation, debut, fin);
    }
}
