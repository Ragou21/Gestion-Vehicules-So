import { Utilisateur } from './utilisateur.model';
import { Vehicule } from './vehicule.model';

export type StatutDemande =
  | 'EN_ATTENTE'
  | 'ACCEPTEE'
  | 'REFUSEE'
  | 'ANNULEE'
  | 'EXECUTEE';

export const STATUT_LABELS: Record<StatutDemande, string> = {
  EN_ATTENTE: 'En attente',
  ACCEPTEE: 'Acceptée',
  REFUSEE: 'Refusée',
  ANNULEE: 'Annulée',
  EXECUTEE: 'Exécutée',
};

export const STATUT_CLASSES: Record<StatutDemande, string> = {
  EN_ATTENTE: 'bg-amber-100 text-amber-800',
  ACCEPTEE: 'bg-emerald-100 text-emerald-800',
  REFUSEE: 'bg-red-100 text-red-800',
  ANNULEE: 'bg-gray-100 text-gray-600',
  EXECUTEE: 'bg-blue-100 text-blue-800',
};

export interface Demande {
  id: number;
  utilisateur?: Utilisateur;
  vehicule?: Vehicule;
  immatriculation: string;
  agence?: string;
  departement?: string;
  motifSortie: string;
  dateHeureSortie: string;
  dateHeureRetourPrevue?: string;
  dateHeureRetour?: string;
  motifRetour?: string;
  statut: StatutDemande;
  statutVehicule?: string;
  dateCreation?: string;
  dateModification?: string;
}

export interface DemandePayload {
  utilisateur?: { id: number };
  vehicule?: { id: number };
  immatriculation: string;
  agence?: string;
  departement?: string;
  motifSortie: string;
  dateHeureSortie: string;
  dateHeureRetourPrevue?: string;
  dateHeureRetour?: string;
  motifRetour?: string;
  statut?: StatutDemande;
  statutVehicule?: string;
}

export interface BrouillonDemande {
  id: string;
  payload: Partial<DemandePayload> & { vehiculeId?: number };
  updatedAt: string;
}
