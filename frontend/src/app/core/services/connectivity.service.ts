import { Injectable, NgZone, inject, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConnectivityService {
  private readonly zone = inject(NgZone);
  readonly online = signal(typeof navigator === 'undefined' ? true : navigator.onLine);

  constructor() {
    if (typeof window === 'undefined') {
      return;
    }
    window.addEventListener('online', () => this.zone.run(() => this.online.set(true)));
    window.addEventListener('offline', () => this.zone.run(() => this.online.set(false)));
  }
}
