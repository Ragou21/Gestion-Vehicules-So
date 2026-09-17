package com.sonabel.gestion_vehicules.controller;

import com.sonabel.gestion_vehicules.Vehicule;
import com.sonabel.gestion_vehicules.service.VehiculeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vehicules")
@CrossOrigin(origins = "*")
public class VehiculeController {

    @Autowired
    private VehiculeService vehiculeService;

    // GET /api/vehicules - Tous les véhicules
    @GetMapping
    public List<Vehicule> getAllVehicules() {
        return vehiculeService.getAllVehicules();
    }

    // GET /api/vehicules/disponibles - Véhicules disponibles
    @GetMapping("/disponibles")
    public List<Vehicule> getVehiculesDisponibles() {
        return vehiculeService.getVehiculesDisponibles();
    }

    // GET /api/vehicules/{id} - Un véhicule par ID
    @GetMapping("/{id}")
    public ResponseEntity<Vehicule> getVehiculeById(@PathVariable Long id) {
        return vehiculeService.getVehiculeById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/vehicules - Créer un véhicule
    @PostMapping
    public Vehicule createVehicule(@RequestBody Vehicule vehicule) {
        return vehiculeService.createVehicule(vehicule);
    }

    // PUT /api/vehicules/{id} - Modifier un véhicule
    @PutMapping("/{id}")
    public Vehicule updateVehicule(@PathVariable Long id, @RequestBody Vehicule vehicule) {
        return vehiculeService.updateVehicule(id, vehicule);
    }

    // DELETE /api/vehicules/{id} - Supprimer un véhicule
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicule(@PathVariable Long id) {
        vehiculeService.deleteVehicule(id);
        return ResponseEntity.noContent().build();
    }
}
