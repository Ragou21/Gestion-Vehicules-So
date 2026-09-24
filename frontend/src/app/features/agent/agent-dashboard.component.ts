import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DemandeService } from '../../core/services/demande.service';
import { Demande, StatutDemande } from '../../core/models/demande.model';
import { DemandeCardComponent } from '../../shared/demande-card.component';

type Filtre = 'TOUTES' | StatutDemande;

@Component({
  selector: 'app-agent-dashboard',
  imports: [RouterLink, DemandeCardComponent],
  templateUrl: './agent-dashboard.component.html',
})
export class AgentDashboardComponent {
  private readonly auth = inject(AuthService);
  private readonly api = inject(DemandeService);

  readonly loading = signal(true);
  readonly filtre = signal<Filtre>('TOUTES');
  demandes: Demande[] = [];

  readonly filtres: { id: Filtre; label: string }[] = [
    { id: 'TOUTES', label: 'Toutes' },
    { id: 'EN_ATTENTE', label: 'En attente' },
    { id: 'ACCEPTEE', label: 'Acceptées' },
    { id: 'EXECUTEE', label: 'Exécutées' },
  ];

  constructor() {
    void this.load();
  }

  get filtered(): Demande[] {
    const f = this.filtre();
    if (f === 'TOUTES') {
      return this.demandes;
    }
    return this.demandes.filter((d) => d.statut === f);
  }

  async load(): Promise<void> {
    const user = this.auth.utilisateur();
    if (!user) {
      return;
    }
    this.loading.set(true);
    try {
      this.demandes = await this.api.byUtilisateur(user.id);
    } finally {
      this.loading.set(false);
    }
  }
}
