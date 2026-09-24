export interface Vehicule {
  id: number;
  immatriculation: string;
  marque?: string;
  modele?: string;
  disponible: boolean;
  etat?: string;
}
