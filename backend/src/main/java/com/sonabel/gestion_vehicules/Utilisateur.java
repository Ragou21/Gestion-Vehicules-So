package com.sonabel.gestion_vehicules;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "utilisateur")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(nullable = false, length = 100)
    private String prenom;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(length = 20)
    private String telephone;

    @Column(nullable = false, length = 20)
    private String role;

    @Column(nullable = false)
    private String motDePasse;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation = LocalDateTime.now();
}
