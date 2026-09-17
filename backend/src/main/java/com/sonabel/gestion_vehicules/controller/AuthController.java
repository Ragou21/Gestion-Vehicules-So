package com.sonabel.gestion_vehicules.controller;

import com.sonabel.gestion_vehicules.Utilisateur;
import com.sonabel.gestion_vehicules.repository.UtilisateurRepository;
import com.sonabel.gestion_vehicules.security.JwtUtil;
import com.sonabel.gestion_vehicules.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UtilisateurService utilisateurService;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // POST /api/auth/register - Inscription
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Utilisateur utilisateur) {
        // Vérifier si l'email existe déjà
        if (utilisateurService.emailExists(utilisateur.getEmail())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Cet email est déjà utilisé");
            return ResponseEntity.badRequest().body(error);
        }

        // Hacher le mot de passe
        utilisateur.setMotDePasse(passwordEncoder.encode(utilisateur.getMotDePasse()));

        // Sauvegarder
        Utilisateur saved = utilisateurService.createUtilisateur(utilisateur);

        // Générer le token
        String token = jwtUtil.generateToken(saved.getEmail(), saved.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("utilisateur", saved);

        return ResponseEntity.ok(response);
    }

    // POST /api/auth/login - Connexion
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String motDePasse = credentials.get("motDePasse");

        try {
            // Authentifier
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, motDePasse)
            );

            // Récupérer l'utilisateur
            Utilisateur utilisateur = utilisateurRepository.findByEmail(email).orElseThrow();

            // Générer le token
            String token = jwtUtil.generateToken(email, utilisateur.getRole());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("utilisateur", utilisateur);
            response.put("role", utilisateur.getRole());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Email ou mot de passe incorrect");
            return ResponseEntity.status(401).body(error);
        }
    }
}
