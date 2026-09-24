import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Demande } from '../core/models/demande.model';

@Component({
  selector: 'app-alert-banner',
  imports: [RouterLink],
  template: `
    @if (demandes.length) {
      <div class="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <p class="font-semibold">Véhicules non retournés après 18h</p>
        <ul class="mt-1 space-y-1">
          @for (d of demandes; track d.id) {
            <li>
              <a class="underline" [routerLink]="['/demandes', d.id]">
                {{ d.immatriculation }} — {{ d.utilisateur?.prenom }} {{ d.utilisateur?.nom }}
              </a>
            </li>
          }
        </ul>
      </div>
    }
  `,
})
export class AlertBannerComponent {
  @Input() demandes: Demande[] = [];
}
