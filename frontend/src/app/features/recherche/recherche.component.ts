import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DemandeService } from '../../core/services/demande.service';
import { Demande } from '../../core/models/demande.model';
import { toApiDateTime } from '../../core/utils/dates';
import { DemandeCardComponent } from '../../shared/demande-card.component';

@Component({
  selector: 'app-recherche',
  imports: [ReactiveFormsModule, DemandeCardComponent],
  templateUrl: './recherche.component.html',
})
export class RechercheComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(DemandeService);

  resultats: Demande[] = [];
  readonly searched = signal(false);
  readonly loading = signal(false);

  readonly form = this.fb.nonNullable.group({
    immatriculation: ['', Validators.required],
    debut: ['', Validators.required],
    fin: ['', Validators.required],
  });

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { immatriculation, debut, fin } = this.form.getRawValue();
    this.loading.set(true);
    try {
      this.resultats = await this.api.rechercher(
        immatriculation.trim(),
        toApiDateTime(debut),
        toApiDateTime(fin),
      );
      this.searched.set(true);
    } finally {
      this.loading.set(false);
    }
  }
}
