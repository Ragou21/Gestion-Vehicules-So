import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { BrouillonDemande, Demande } from '../models/demande.model';
import { Vehicule } from '../models/vehicule.model';

interface SuggestionRow {
  key: string;
  values: string[];
}

@Injectable({ providedIn: 'root' })
export class OfflineDb extends Dexie {
  demandes!: Table<Demande, number>;
  vehicules!: Table<Vehicule, number>;
  brouillons!: Table<BrouillonDemande, string>;
  suggestions!: Table<SuggestionRow, string>;

  constructor() {
    super('sonabel-vehicules');
    this.version(1).stores({
      demandes: 'id, statut, immatriculation',
      vehicules: 'id, immatriculation, disponible',
      brouillons: 'id',
      suggestions: 'key',
    });
  }
}
