import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { AgentDashboardComponent } from './features/agent/agent-dashboard.component';
import { ResponsableDashboardComponent } from './features/responsable/responsable-dashboard.component';
import { DemandeFormComponent } from './features/demandes/demande-form.component';
import { DemandeDetailComponent } from './features/demandes/demande-detail.component';
import { RechercheComponent } from './features/recherche/recherche.component';
import { authGuard, guestGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Redirection par défaut
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Authentification
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [guestGuard]
  },
  { 
    path: 'register', 
    component: RegisterComponent,
    canActivate: [guestGuard]
  },

  // Agent
  {
    path: 'agent',
    component: AgentDashboardComponent,
    canActivate: [roleGuard('AGENT')]
  },
  {
    path: 'agent/nouvelle-demande',
    component: DemandeFormComponent,
    canActivate: [roleGuard('AGENT')]
  },

  // Responsable
  {
    path: 'responsable',
    component: ResponsableDashboardComponent,
    canActivate: [roleGuard('RESPONSABLE')]
  },

  // Détail d'une demande
  {
    path: 'demandes/:id',
    component: DemandeDetailComponent,
    canActivate: [authGuard]
  },

  // Recherche
  {
    path: 'recherche',
    component: RechercheComponent,
    canActivate: [authGuard]
  },

  // Page non trouvée
  { path: '**', redirectTo: '/login' }
];
