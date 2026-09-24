export type Role = 'AGENT' | 'RESPONSABLE';

export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  role: Role;
  motDePasse?: string;
  dateCreation?: string;
}

export interface AuthResponse {
  token: string;
  utilisateur: Utilisateur;
  role?: Role;
}

export interface RegisterPayload {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  role: Role;
  motDePasse: string;
}
