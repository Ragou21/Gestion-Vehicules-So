import { Component, Input } from '@angular/core';
import { STATUT_CLASSES, STATUT_LABELS, StatutDemande } from '../core/models/demande.model';

@Component({
  selector: 'app-status-badge',
  template: `
    <span class="inline-flex rounded-md px-2.5 py-1 text-xs font-semibold" [class]="classes">
      {{ label }}
    </span>
  `,
})
export class StatusBadgeComponent {
  @Input({ required: true }) statut!: StatutDemande;

  get label(): string {
    return STATUT_LABELS[this.statut] ?? this.statut;
  }

  get classes(): string {
    return STATUT_CLASSES[this.statut] ?? 'bg-gray-100 text-gray-700';
  }
}
