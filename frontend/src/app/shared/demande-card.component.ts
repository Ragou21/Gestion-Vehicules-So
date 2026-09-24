import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Demande } from '../core/models/demande.model';
import { formatDateTime } from '../core/utils/dates';
import { StatusBadgeComponent } from './status-badge.component';

@Component({
  selector: 'app-demande-card',
  imports: [RouterLink, StatusBadgeComponent],
  template: `
    <a
      [routerLink]="['/demandes', demande.id]"
      class="block rounded-md border border-gray-200 bg-white p-4 shadow-sm transition hover:border-accent/40 hover:shadow"
    >
      <div class="mb-2 flex items-start justify-between gap-3">
        <div>
          <p class="text-sm font-semibold text-ink">{{ demande.immatriculation }}</p>
          <p class="text-sm text-gray-500">
            {{ demande.utilisateur?.prenom }} {{ demande.utilisateur?.nom }}
          </p>
        </div>
        <app-status-badge [statut]="demande.statut" />
      </div>
      <p class="line-clamp-2 text-sm text-gray-700">{{ demande.motifSortie }}</p>
      <p class="mt-3 text-xs text-gray-500">
        Sortie {{ format(demande.dateHeureSortie) }}
        @if (demande.dateHeureRetourPrevue) {
          · Retour prévu {{ format(demande.dateHeureRetourPrevue) }}
        }
      </p>
    </a>
  `,
})
export class DemandeCardComponent {
  @Input({ required: true }) demande!: Demande;
  format = formatDateTime;
}
