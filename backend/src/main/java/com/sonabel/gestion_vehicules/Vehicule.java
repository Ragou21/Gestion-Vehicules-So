package com.sonabel.gestion_vehicules;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vehicule")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String immatriculation;

    @Column(length = 50)
    private String marque;

    @Column(length = 50)
    private String modele;

    @Column(nullable = false)
    private Boolean disponible = true;

    @Column(length = 20)
    private String etat = "FONCTIONNEL";
}
