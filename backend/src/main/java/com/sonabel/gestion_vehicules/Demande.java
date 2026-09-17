package com.sonabel.gestion_vehicules;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "demande")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Demande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateur utilisateur;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private Service service;

    @ManyToOne
    @JoinColumn(name = "vehicule_id")
    private Vehicule vehicule;

    @Column(length = 50, nullable = false)
    private String immatriculation;

    @Column(length = 100)
    private String agence;

    @Column(length = 100)
    private String departement;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String motifSortie;

    @Column(name = "date_heure_sortie", nullable = false)
    private LocalDateTime dateHeureSortie;

    @Column(name = "date_heure_retour_prevue")
    private LocalDateTime dateHeureRetourPrevue;

    @Column(name = "date_heure_retour")
    private LocalDateTime dateHeureRetour;

    @Column(columnDefinition = "TEXT")
    private String motifRetour;

    @Column(nullable = false, length = 20)
    private String statut = "EN_ATTENTE";

    @Column(name = "statut_vehicule", length = 20)
    private String statutVehicule = "FONCTIONNEL";

    @Column(name = "date_creation")
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Column(name = "date_modification")
    private LocalDateTime dateModification = LocalDateTime.now();
}
