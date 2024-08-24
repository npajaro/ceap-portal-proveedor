import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

declare global {
  interface Window {
    onTurnstileSuccess: (token: string) => void;
    turnstileLoaded: boolean;
  }
}

@Component({
  selector: 'app-captcha-turnstile',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `
  <div
    class="cf-turnstile"
    data-sitekey="0x4AAAAAAAhMe9pONagwCxLr"
    data-callback="onTurnstileSuccess"
    data-theme="light">
  </div>
  `,
  styles: [
    `.cf-turnstile {
      margin: 0px 0;
      aspect-ratio: 298/63;
      }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptchaTurnstileComponent {
  @Output() tokenReceived = new EventEmitter<string>();

  constructor() {
    this.loadScript();
  }

  private loadScript() {
    if (window.turnstileLoaded) {
      this.initializeTurnstile();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    script.onload = () => {
      window.turnstileLoaded = true;
      this.initializeTurnstile();
    };
  }

  private initializeTurnstile() {
    window.onTurnstileSuccess = (token: string) => {
      this.tokenReceived.emit(token);
    };
  }
}
