import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { API_BASE, AUTH_STORAGE_KEY } from '../constants';
import { AuthResponse, RegisterPayload, Role, Utilisateur } from '../models/utilisateur.model';

interface StoredAuth {
  token: string;
  utilisateur: Utilisateur;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly stored = signal<StoredAuth | null>(this.readStorage());
  readonly utilisateur = computed(() => this.stored()?.utilisateur ?? null);
  readonly token = computed(() => this.stored()?.token ?? null);
  readonly role = computed(() => this.utilisateur()?.role ?? null);
  readonly isLoggedIn = computed(() => !!this.token());

  private readStorage(): StoredAuth | null {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as StoredAuth) : null;
    } catch {
      return null;
    }
  }

  private persist(value: StoredAuth | null): void {
    this.stored.set(value);
    if (value) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(value));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  async login(email: string, motDePasse: string): Promise<Utilisateur> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(`${API_BASE}/auth/login`, { email, motDePasse }),
    );
    const utilisateur = { ...response.utilisateur, role: (response.role ?? response.utilisateur.role) as Role };
    this.persist({ token: response.token, utilisateur });
    return utilisateur;
  }

  async register(payload: RegisterPayload): Promise<Utilisateur> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(`${API_BASE}/auth/register`, payload),
    );
    const utilisateur = { ...response.utilisateur, role: (response.role ?? response.utilisateur.role) as Role };
    this.persist({ token: response.token, utilisateur });
    return utilisateur;
  }

  homePath(role: Role | null = this.role()): string {
    return role === 'RESPONSABLE' ? '/responsable' : '/agent';
  }

  logout(): void {
    this.persist(null);
    void this.router.navigate(['/login']);
  }
}
