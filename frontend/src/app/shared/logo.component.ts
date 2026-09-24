import { Component } from '@angular/core';

@Component({
  selector: 'app-logo',
  template: `
    <svg viewBox="0 0 64 64" role="img" aria-label="Logo SONABEL" class="h-10 w-10 shrink-0">
      <title>SONABEL — Gestion des véhicules</title>
      <circle cx="32" cy="32" r="30" fill="#111827" />
      <circle cx="32" cy="32" r="22" fill="none" stroke="#facc15" stroke-width="4" />
      <path d="M32 10 A22 22 0 0 1 51.05 43 L32 32 Z" fill="#ef4444" opacity="0.9" />
      <path d="M51.05 43 A22 22 0 0 1 12.95 43 L32 32 Z" fill="#16a34a" opacity="0.9" />
      <path d="M12.95 43 A22 22 0 0 1 32 10 L32 32 Z" fill="#facc15" opacity="0.95" />
      <circle cx="32" cy="32" r="9" fill="#111827" stroke="#f8fafc" stroke-width="2" />
      <circle cx="32" cy="32" r="3" fill="#facc15" />
    </svg>
  `,
})
export class LogoComponent {}
