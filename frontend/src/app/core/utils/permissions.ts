import { EDIT_WINDOW_MS } from '../constants';
import { Demande } from '../models/demande.model';
import { Role, Utilisateur } from '../models/utilisateur.model';
import { remainingEditMs } from './dates';

export function isResponsable(user?: Utilisateur | null): boolean {
  return user?.role === 'RESPONSABLE';
}

export function isOwner(demande: Demande, user?: Utilisateur | null): boolean {
  return !!user && demande.utilisateur?.id === user.id;
}

export function canCancel(demande: Demande, user?: Utilisateur | null): boolean {
  return (
    user?.role === 'AGENT' &&
    isOwner(demande, user) &&
    (demande.statut === 'EN_ATTENTE' || demande.statut === 'ACCEPTEE')
  );
}

export function canApprove(demande: Demande, role?: Role): boolean {
  return role === 'RESPONSABLE' && demande.statut === 'EN_ATTENTE';
}

export function canMarkSortie(demande: Demande, user?: Utilisateur | null): boolean {
  if (demande.statut !== 'ACCEPTEE') {
    return false;
  }
  return isResponsable(user) || isOwner(demande, user);
}

export function canRecordRetour(demande: Demande, role?: Role): boolean {
  return role === 'RESPONSABLE' && demande.statut === 'EXECUTEE' && !demande.dateHeureRetour;
}

export function canEditDemande(demande: Demande, user?: Utilisateur | null): boolean {
  if (!user) {
    return false;
  }
  if (demande.statut === 'ANNULEE' || demande.statut === 'REFUSEE') {
    return false;
  }
  if (user.role === 'RESPONSABLE') {
    return true;
  }
  const start = demande.dateModification || demande.dateCreation;
  return isOwner(demande, user) && remainingEditMs(start, EDIT_WINDOW_MS) > 0;
}

export function isVehiculeNonRetourne(demande: Demande, endHour = 18): boolean {
  if (demande.statut !== 'EXECUTEE' || demande.dateHeureRetour) {
    return false;
  }
  const sortie = new Date(demande.dateHeureSortie);
  if (Number.isNaN(sortie.getTime())) {
    return false;
  }
  const limit = new Date(sortie);
  limit.setHours(endHour, 0, 0, 0);
  if (sortie.getTime() > limit.getTime()) {
    return Date.now() > sortie.getTime();
  }
  return Date.now() > limit.getTime();
}
