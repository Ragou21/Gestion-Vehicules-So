package com.sonabel.gestion_vehicules.service;

import com.sonabel.gestion_vehicules.Utilisateur;
import com.sonabel.gestion_vehicules.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    // Liste tous les utilisateurs
    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepository.findAll();
    }

    // Trouver un utilisateur par ID
    public Optional<Utilisateur> getUtilisateurById(Long id) {
        return utilisateurRepository.findById(id);
    }

    // Trouver un utilisateur par email
    public Optional<Utilisateur> getUtilisateurByEmail(String email) {
        return utilisateurRepository.findByEmail(email);
    }

    // Créer un utilisateur
    public Utilisateur createUtilisateur(Utilisateur utilisateur) {
        return utilisateurRepository.save(utilisateur);
    }

    // Mettre à jour un utilisateur
    public Utilisateur updateUtilisateur(Long id, Utilisateur utilisateur) {
        utilisateur.setId(id);
        return utilisateurRepository.save(utilisateur);
    }

    // Supprimer un utilisateur
    public void deleteUtilisateur(Long id) {
        utilisateurRepository.deleteById(id);
    }

    // Vérifier si un email existe
    public boolean emailExists(String email) {
        return utilisateurRepository.existsByEmail(email);
    }
}

