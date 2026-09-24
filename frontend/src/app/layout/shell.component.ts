import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { ConnectivityService } from '../core/services/connectivity.service';
import { DemandeService } from '../core/services/demande.service';
import { ToastService } from '../core/services/toast.service';
import { Demande } from '../core/models/demande.model';
import { isVehiculeNonRetourne } from '../core/utils/permissions';
import { AlertBannerComponent } from '../shared/alert-banner.component';
import { LogoComponent } from '../shared/logo.component';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LogoComponent, AlertBannerComponent],
  templateUrl: './shell.component.html',
})
export class ShellComponent {
  readonly auth = inject(AuthService);
  readonly connectivity = inject(ConnectivityService);
  readonly toast = inject(ToastService);
  private readonly demandesApi = inject(DemandeService);
  private readonly router = inject(Router);

  alertes: Demande[] = [];

  readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  constructor() {
    void this.refreshAlertes();
  }

  async refreshAlertes(): Promise<void> {
    const list = await this.demandesApi.list();
    this.alertes = list.filter((d) => isVehiculeNonRetourne(d));
  }
}
