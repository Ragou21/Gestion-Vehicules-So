package com.sonabel.gestion_vehicules.service;

import com.sonabel.gestion_vehicules.Vehicule;
import com.sonabel.gestion_vehicules.repository.VehiculeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class VehiculeService {

    @Autowired
    private VehiculeRepository vehiculeRepository;

    // Liste tous les véhicules
    public List<Vehicule> getAllVehicules() {
        return vehiculeRepository.findAll();
    }

    // Liste les véhicules disponibles
    public List<Vehicule> getVehiculesDisponibles() {
        return vehiculeRepository.findByDisponibleTrue();
    }

    // Trouver un véhicule par ID
    public Optional<Vehicule> getVehiculeById(Long id) {
        return vehiculeRepository.findById(id);
    }

    // Trouver un véhicule par immatriculation
    public Optional<Vehicule> getVehiculeByImmatriculation(String immatriculation) {
        return vehiculeRepository.findByImmatriculation(immatriculation);
    }

    // Créer un véhicule
    public Vehicule createVehicule(Vehicule vehicule) {
        return vehiculeRepository.save(vehicule);
    }

    // Mettre à jour un véhicule
    public Vehicule updateVehicule(Long id, Vehicule vehicule) {
        vehicule.setId(id);
        return vehiculeRepository.save(vehicule);
    }

    // Supprimer un véhicule
    public void deleteVehicule(Long id) {
        vehiculeRepository.deleteById(id);
    }
}
