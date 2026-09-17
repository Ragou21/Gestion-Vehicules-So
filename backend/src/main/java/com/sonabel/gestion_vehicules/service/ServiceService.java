package com.sonabel.gestion_vehicules.service;

import com.sonabel.gestion_vehicules.Service;
import com.sonabel.gestion_vehicules.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    // Liste tous les services
    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }

    // Trouver un service par ID
    public Optional<Service> getServiceById(Long id) {
        return serviceRepository.findById(id);
    }

    // Créer un service
    public Service createService(Service service) {
        return serviceRepository.save(service);
    }

    // Mettre à jour un service
    public Service updateService(Long id, Service service) {
        service.setId(id);
        return serviceRepository.save(service);
    }

    // Supprimer un service
    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }
}
