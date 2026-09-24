import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ConnectivityService } from '../../core/services/connectivity.service';
import { DemandeService } from '../../core/services/demande.service';
import { ToastService } from '../../core/services/toast.service';
import { VehiculeService } from '../../core/services/vehicule.service';
import { Demande, DemandePayload } from '../../core/models/demande.model';
import { Vehicule } from '../../core/models/vehicule.model';
import { toApiDateTime, toDateTimeLocal } from '../../core/utils/dates';
import { canEditDemande } from '../../core/utils/permissions';

@Component({
  selector: 'app-demande-form',
  imports: [ReactiveFormsModule],
  templateUrl: './demande-form.component.html',
})
export class DemandeFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly api = inject(DemandeService);
  private readonly vehiculesApi = inject(VehiculeService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly connectivity = inject(ConnectivityService);

  vehicules: Vehicule[] = [];
  agences: string[] = [];
  departements: string[] = [];
  existing?: Demande;
  showConflit = false;
  pendingPayload?: DemandePayload;

  readonly loading = signal(false);
  readonly editId = signal<number | null>(null);

  readonly form = this.fb.nonNullable.group({
    vehiculeId: ['', Validators.required],
    agence: [''],
    departement: [''],
    motifSortie: ['', Validators.required],
    dateHeureSortie: ['', Validators.required],
    dateHeureRetourPrevue: [''],
  });

  async ngOnInit(): Promise<void> {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.vehicules = await this.vehiculesApi.list(true);
    this.agences = await this.api.suggestions('agences');
    this.departements = await this.api.suggestions('departements');

    if (idParam) {
      const id = Number(idParam);
      this.editId.set(id);
      const demande = await this.api.byId(id);
      if (!demande || !canEditDemande(demande, this.auth.utilisateur())) {
        this.toast.show('Modification impossible (délai de 5 minutes dépassé).', 'error');
        await this.router.navigate(['/demandes', id]);
        return;
      }
      this.existing = demande;
      if (demande.vehicule && !this.vehicules.some((v) => v.id === demande.vehicule?.id)) {
        this.vehicules = [demande.vehicule, ...this.vehicules];
      }
      this.form.patchValue({
        vehiculeId: String(demande.vehicule?.id ?? ''),
        agence: demande.agence ?? '',
        departement: demande.departement ?? '',
        motifSortie: demande.motifSortie,
        dateHeureSortie: toDateTimeLocal(demande.dateHeureSortie),
        dateHeureRetourPrevue: toDateTimeLocal(demande.dateHeureRetourPrevue),
      });
    } else {
      const brouillon = await this.api.loadBrouillon();
      if (brouillon?.payload) {
        const p = brouillon.payload;
        this.form.patchValue({
          vehiculeId: p.vehiculeId ? String(p.vehiculeId) : '',
          agence: p.agence ?? '',
          departement: p.departement ?? '',
          motifSortie: p.motifSortie ?? '',
          dateHeureSortie: toDateTimeLocal(p.dateHeureSortie),
          dateHeureRetourPrevue: toDateTimeLocal(p.dateHeureRetourPrevue),
        });
      }
    }

    this.form.valueChanges.subscribe((value) => {
      if (this.editId()) {
        return;
      }
      void this.api.saveBrouillon({
        vehiculeId: value.vehiculeId ? Number(value.vehiculeId) : undefined,
        agence: value.agence,
        departement: value.departement,
        motifSortie: value.motifSortie,
        dateHeureSortie: value.dateHeureSortie ? toApiDateTime(value.dateHeureSortie) : undefined,
        dateHeureRetourPrevue: value.dateHeureRetourPrevue
          ? toApiDateTime(value.dateHeureRetourPrevue)
          : undefined,
      });
    });
  }

  selectedVehicule(): Vehicule | undefined {
    const id = Number(this.form.controls.vehiculeId.value);
    return this.vehicules.find((v) => v.id === id);
  }

  buildPayload(): DemandePayload | null {
    const user = this.auth.utilisateur();
    const vehicule = this.selectedVehicule();
    const value = this.form.getRawValue();
    if (!user || !vehicule || !value.motifSortie.trim()) {
      return null;
    }
    return {
      utilisateur: { id: this.existing?.utilisateur?.id ?? user.id },
      vehicule: { id: vehicule.id },
      immatriculation: vehicule.immatriculation,
      agence: value.agence,
      departement: value.departement,
      motifSortie: value.motifSortie.trim(),
      dateHeureSortie: toApiDateTime(value.dateHeureSortie),
      dateHeureRetourPrevue: value.dateHeureRetourPrevue
        ? toApiDateTime(value.dateHeureRetourPrevue)
        : undefined,
      statut: this.existing?.statut ?? 'EN_ATTENTE',
      statutVehicule: 'FONCTIONNEL',
    };
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.connectivity.online()) {
      this.toast.show('La confirmation d’une demande exige une connexion (contrôle anti-doublon).', 'error');
      return;
    }
    const payload = this.buildPayload();
    if (!payload) {
      return;
    }
    this.loading.set(true);
    try {
      const enCours = await this.api.verifierEnCours(payload.immatriculation);
      const sameVehicle = this.existing?.immatriculation === payload.immatriculation;
      if (enCours && !sameVehicle) {
        this.pendingPayload = payload;
        this.showConflit = true;
        return;
      }
      await this.persist(payload);
    } catch (err) {
      this.handleError(err);
    } finally {
      this.loading.set(false);
    }
  }

  async confirmerMalgreConflit(): Promise<void> {
    if (!this.pendingPayload) {
      return;
    }
    this.loading.set(true);
    try {
      await this.persist(this.pendingPayload);
      this.showConflit = false;
    } catch (err) {
      this.handleError(err);
    } finally {
      this.loading.set(false);
    }
  }

  private async persist(payload: DemandePayload): Promise<void> {
    const id = this.editId();
    const saved = id ? await this.api.update(id, payload) : await this.api.create(payload);
    this.toast.show(id ? 'Demande mise à jour.' : 'Demande soumise.', 'success');
    await this.router.navigate(['/demandes', saved.id]);
  }

  private handleError(err: unknown): void {
    if (err instanceof Error && err.message === 'CONNEXION_REQUISE') {
      this.toast.show('Connexion requise pour confirmer.', 'error');
      return;
    }
    this.toast.show('Envoi impossible. Vérifiez le formulaire et réessayez.', 'error');
  }
}
