import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/models/utilisateur.model';
import { LogoComponent } from '../../shared/logo.component';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, LogoComponent],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telephone: [''],
    role: ['AGENT' as Role, Validators.required],
    motDePasse: ['', [Validators.required, Validators.minLength(6)]],
    confirmation: ['', Validators.required],
  });

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    if (value.motDePasse !== value.confirmation) {
      this.error.set('Les mots de passe ne correspondent pas.');
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    try {
      const user = await this.auth.register({
        nom: value.nom,
        prenom: value.prenom,
        email: value.email,
        telephone: value.telephone || undefined,
        role: value.role,
        motDePasse: value.motDePasse,
      });
      await this.router.navigateByUrl(this.auth.homePath(user.role));
    } catch {
      this.error.set("Impossible de créer le compte. L'email est peut-être déjà utilisé.");
    } finally {
      this.loading.set(false);
    }
  }
}
