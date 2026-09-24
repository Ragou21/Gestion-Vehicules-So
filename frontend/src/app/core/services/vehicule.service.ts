import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_BASE } from '../constants';
import { Vehicule } from '../models/vehicule.model';
import { ConnectivityService } from './connectivity.service';
import { OfflineDb } from './offline-db.service';

@Injectable({ providedIn: 'root' })
export class VehiculeService {
  private readonly http = inject(HttpClient);
  private readonly db = inject(OfflineDb);
  private readonly connectivity = inject(ConnectivityService);

  async list(disponiblesOnly = false): Promise<Vehicule[]> {
    const path = disponiblesOnly ? `${API_BASE}/vehicules/disponibles` : `${API_BASE}/vehicules`;
    if (this.connectivity.online()) {
      try {
        const data = await firstValueFrom(this.http.get<Vehicule[]>(path));
        await this.db.vehicules.bulkPut(data);
        return disponiblesOnly ? data.filter((v) => v.disponible) : data;
      } catch {
        /* fallback cache */
      }
    }
    const cached = await this.db.vehicules.toArray();
    return disponiblesOnly ? cached.filter((v) => v.disponible) : cached;
  }
}
