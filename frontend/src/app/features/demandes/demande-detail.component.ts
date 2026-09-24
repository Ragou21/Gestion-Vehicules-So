import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DemandeService } from '../../core/services/demande.service';
import { ToastService } from '../../core/services/toast.service';
import { Demande, STATUT_LABELS, StatutDemande } from '../../core/models/demande.model';
import { formatDateTime, remainingEditMs, toApiDateTime } from '../../core/utils/dates';
import { EDIT_WINDOW_MS } from '../../core/constants';
import {
  canApprove,
  canCancel,
  canEditDemande,
  canMarkSortie,
  canRecordRetour,
} from '../../core/utils/permissions';
import { StatusBadgeComponent } from '../../shared/status-badge.component';

@Component({
  selector: 'app-demande-detail',
  imports: [StatusBadgeComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './demande-detail.component.html',
})
export class DemandeDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(DemandeService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  demande?: Demande;
  readonly loading = signal(true);
  showRetour = false;
  format = formatDateTime;
  labels = STATUT_LABELS;

  readonly retourForm = this.fb.nonNullable.group({
    dateHeureRetour: [''],
    motifRetour: [''],
  });

  get user() {
    return this.auth.utilisateur();
  }

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.demande = await this.api.byId(id);
    this.loading.set(false);
    if (this.route.snapshot.queryParamMap.get('retour') === '1') {
      this.showRetour = true;
    }
  }

  canApprove(): boolean {
    return !!this.demande && canApprove(this.demande, this.user?.role);
  }
  canRefuse(): boolean {
    return this.canApprove();
  }
  canCancel(): boolean {
    return !!this.demande && canCancel(this.demande, this.user);
  }
  canSortie(): boolean {
    return !!this.demande && canMarkSortie(this.demande, this.user);
  }
  canRetour(): boolean {
    return !!this.demande && canRecordRetour(this.demande, this.user?.role);
  }
  canEdit(): boolean {
    return !!this.demande && canEditDemande(this.demande, this.user);
  }

  editCountdown(): string {
    if (!this.demande || this.user?.role === 'RESPONSABLE') {
      return '';
    }
    const ms = remainingEditMs(this.demande.dateModification || this.demande.dateCreation, EDIT_WINDOW_MS);
    if (ms <= 0) {
      return 'Fenêtre de 5 minutes écoulée.';
    }
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `Modification possible encore ${min} min ${sec} s.`;
  }

  historique(): { label: string; date?: string }[] {
    if (!this.demande) {
      return [];
    }
    const steps: { label: string; date?: string }[] = [
      { label: 'Créée', date: this.demande.dateCreation },
    ];
    if (this.demande.statut !== 'EN_ATTENTE') {
      steps.push({ label: this.labels[this.demande.statut], date: this.demande.dateModification });
    }
    if (this.demande.dateHeureRetour) {
      steps.push({ label: 'Retour enregistré', date: this.demande.dateHeureRetour });
    }
    return steps;
  }

  async changer(statut: StatutDemande): Promise<void> {
    if (!this.demande) {
      return;
    }
    try {
      this.demande = await this.api.changerStatut(this.demande.id, statut);
      this.toast.show('Statut mis à jour.', 'success');
    } catch {
      this.toast.show('Action impossible.', 'error');
    }
  }

  async enregistrerRetour(): Promise<void> {
    if (!this.demande) {
      return;
    }
    const value = this.retourForm.getRawValue();
    try {
      this.demande = await this.api.update(this.demande.id, {
        utilisateur: this.demande.utilisateur ? { id: this.demande.utilisateur.id } : undefined,
        vehicule: this.demande.vehicule ? { id: this.demande.vehicule.id } : undefined,
        immatriculation: this.demande.immatriculation,
        agence: this.demande.agence,
        departement: this.demande.departement,
        motifSortie: this.demande.motifSortie,
        dateHeureSortie: this.demande.dateHeureSortie,
        dateHeureRetourPrevue: this.demande.dateHeureRetourPrevue,
        dateHeureRetour: value.dateHeureRetour
          ? toApiDateTime(value.dateHeureRetour)
          : toApiDateTime(new Date().toISOString().slice(0, 16)),
        motifRetour: value.motifRetour,
        statut: 'EXECUTEE',
        statutVehicule: this.demande.statutVehicule,
      });
      this.showRetour = false;
      this.toast.show('Retour enregistré.', 'success');
    } catch {
      this.toast.show('Enregistrement du retour impossible.', 'error');
    }
  }
}
