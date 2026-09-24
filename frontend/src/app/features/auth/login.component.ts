import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LogoComponent } from '../../shared/logo.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, LogoComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', Validators.required],
  });

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    try {
      const { email, motDePasse } = this.form.getRawValue();
      const user = await this.auth.login(email, motDePasse);
      await this.router.navigateByUrl(this.auth.homePath(user.role));
    } catch {
      this.error.set('Email ou mot de passe incorrect.');
    } finally {
      this.loading.set(false);
    }
  }
}
