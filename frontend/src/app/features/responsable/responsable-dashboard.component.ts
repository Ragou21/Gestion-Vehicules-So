import { Component, inject, signal } from '@angular/core';
import { DemandeService } from '../../core/services/demande.service';
import { ToastService } from '../../core/services/toast.service';
import { Demande, StatutDemande } from '../../core/models/demande.model';
import { formatDateTime } from '../../core/utils/dates';
import { StatusBadgeComponent } from '../../shared/status-badge.component';
import { RouterLink } from '@angular/router';

type Onglet = 'EN_ATTENTE' | 'ACCEPTEE' | 'EXECUTEE' | 'TOUTES';

@Component({
  selector: 'app-responsable-dashboard',
  imports: [StatusBadgeComponent, RouterLink],
  templateUrl: './responsable-dashboard.component.html',
})
export class ResponsableDashboardComponent {
  private readonly api = inject(DemandeService);
  private readonly toast = inject(ToastService);

  readonly onglet = signal<Onglet>('EN_ATTENTE');
  readonly loading = signal(true);
  demandes: Demande[] = [];
  format = formatDateTime;

  readonly onglets: { id: Onglet; label: string }[] = [
    { id: 'EN_ATTENTE', label: 'En attente' },
    { id: 'ACCEPTEE', label: 'Acceptées' },
    { id: 'EXECUTEE', label: 'Exécutées' },
    { id: 'TOUTES', label: 'Toutes' },
  ];

  constructor() {
    void this.load();
  }

  get filtered(): Demande[] {
    const o = this.onglet();
    if (o === 'TOUTES') {
      return this.demandes;
    }
    return this.demandes.filter((d) => d.statut === o);
  }

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      this.demandes = await this.api.list();
    } finally {
      this.loading.set(false);
    }
  }

  async changer(d: Demande, statut: StatutDemande): Promise<void> {
    try {
      await this.api.changerStatut(d.id, statut);
      this.toast.show(`Demande ${statut === 'ACCEPTEE' ? 'approuvée' : statut === 'REFUSEE' ? 'refusée' : 'mise à jour'}.`, 'success');
      await this.load();
    } catch {
      this.toast.show('Action impossible (connexion requise).', 'error');
    }
  }
}
