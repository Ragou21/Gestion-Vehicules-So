import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_BASE, BROUILLON_ID } from '../constants';
import { BrouillonDemande, Demande, DemandePayload, StatutDemande } from '../models/demande.model';
import { ConnectivityService } from './connectivity.service';
import { OfflineDb } from './offline-db.service';

@Injectable({ providedIn: 'root' })
export class DemandeService {
  private readonly http = inject(HttpClient);
  private readonly db = inject(OfflineDb);
  private readonly connectivity = inject(ConnectivityService);

  async list(): Promise<Demande[]> {
    if (this.connectivity.online()) {
      try {
        const data = await firstValueFrom(this.http.get<Demande[]>(`${API_BASE}/demandes`));
        await this.db.demandes.clear();
        await this.db.demandes.bulkPut(data);
        await this.refreshSuggestions(data);
        return data;
      } catch {
        /* fallback cache */
      }
    }
    return this.db.demandes.toArray();
  }

  async byUtilisateur(id: number): Promise<Demande[]> {
    if (this.connectivity.online()) {
      try {
        const data = await firstValueFrom(
          this.http.get<Demande[]>(`${API_BASE}/demandes/utilisateur/${id}`),
        );
        await this.db.demandes.bulkPut(data);
        return data;
      } catch {
        /* fallback */
      }
    }
    const all = await this.db.demandes.toArray();
    return all.filter((d) => d.utilisateur?.id === id);
  }

  async byId(id: number): Promise<Demande | undefined> {
    if (this.connectivity.online()) {
      try {
        const data = await firstValueFrom(this.http.get<Demande>(`${API_BASE}/demandes/${id}`));
        await this.db.demandes.put(data);
        return data;
      } catch {
        /* fallback */
      }
    }
    return this.db.demandes.get(id);
  }

  async verifierEnCours(immatriculation: string): Promise<boolean> {
    if (!this.connectivity.online()) {
      throw new Error('CONNEXION_REQUISE');
    }
    return firstValueFrom(
      this.http.get<boolean>(`${API_BASE}/demandes/verifier/${encodeURIComponent(immatriculation)}`),
    );
  }

  async create(payload: DemandePayload): Promise<Demande> {
    if (!this.connectivity.online()) {
      throw new Error('CONNEXION_REQUISE');
    }
    const created = await firstValueFrom(
      this.http.post<Demande>(`${API_BASE}/demandes`, payload),
    );
    await this.db.demandes.put(created);
    await this.db.brouillons.delete(BROUILLON_ID);
    return created;
  }

  async update(id: number, payload: DemandePayload): Promise<Demande> {
    const updated = await firstValueFrom(
      this.http.put<Demande>(`${API_BASE}/demandes/${id}`, { ...payload, id }),
    );
    await this.db.demandes.put(updated);
    return updated;
  }

  async changerStatut(id: number, statut: StatutDemande): Promise<Demande> {
    const updated = await firstValueFrom(
      this.http.put<Demande>(`${API_BASE}/demandes/${id}/statut/${statut}`, {}),
    );
    await this.db.demandes.put(updated);
    return updated;
  }

  async rechercher(immatriculation: string, debut: string, fin: string): Promise<Demande[]> {
    const params = new HttpParams()
      .set('immatriculation', immatriculation)
      .set('debut', debut)
      .set('fin', fin);
    if (this.connectivity.online()) {
      try {
        return await firstValueFrom(
          this.http.get<Demande[]>(`${API_BASE}/demandes/recherche`, { params }),
        );
      } catch {
        /* fallback */
      }
    }
    const all = await this.db.demandes.toArray();
    const start = new Date(debut).getTime();
    const end = new Date(fin).getTime();
    return all.filter((d) => {
      if (d.immatriculation.toLowerCase() !== immatriculation.toLowerCase()) {
        return false;
      }
      const t = new Date(d.dateHeureSortie).getTime();
      return t >= start && t <= end;
    });
  }

  async saveBrouillon(payload: BrouillonDemande['payload']): Promise<void> {
    await this.db.brouillons.put({
      id: BROUILLON_ID,
      payload,
      updatedAt: new Date().toISOString(),
    });
  }

  async loadBrouillon(): Promise<BrouillonDemande | undefined> {
    return this.db.brouillons.get(BROUILLON_ID);
  }

  async suggestions(key: 'agences' | 'departements'): Promise<string[]> {
    return (await this.db.suggestions.get(key))?.values ?? [];
  }

  private async refreshSuggestions(demandes: Demande[]): Promise<void> {
    const agences = [...new Set(demandes.map((d) => d.agence).filter(Boolean))] as string[];
    const departements = [...new Set(demandes.map((d) => d.departement).filter(Boolean))] as string[];
    await this.db.suggestions.bulkPut([
      { key: 'agences', values: agences },
      { key: 'departements', values: departements },
    ]);
  }
}
