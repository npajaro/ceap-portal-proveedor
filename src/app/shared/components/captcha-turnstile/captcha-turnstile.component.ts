import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

declare global {
  interface Window {
    onTurnstileSuccess: (token: string) => void;
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
    data-sitekey="0x4AAAAAAAevxgekk8WbuO2S"
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
    this.loadScript()
  }

  private loadScript() {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    script.onload = () => {
      this.initializeTurnstile();
    }
  }

  private initializeTurnstile() {
    window.onTurnstileSuccess = (token: string) => {
      this.tokenReceived.emit(token);
    };
  }

}

