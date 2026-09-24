import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly message = signal<string | null>(null);
  readonly kind = signal<'info' | 'error' | 'success'>('info');
  private timer?: ReturnType<typeof setTimeout>;

  show(message: string, kind: 'info' | 'error' | 'success' = 'info'): void {
    this.message.set(message);
    this.kind.set(kind);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.message.set(null), 4200);
  }
}
