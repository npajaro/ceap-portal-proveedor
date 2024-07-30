import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';

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
   					<!-- <div
						class="cf-turnstile"
						data-sitekey="0x4AAAAAAAevxgekk8WbuO2S"
						data-callback="javascriptCallback"
						data-theme="light"
						data-language="es"
					></div> -->
          <div class="cf-turnstile" data-sitekey="0x4AAAAAAAevxgekk8WbuO2S" data-callback="onTurnstileSuccess" data-theme="light"></div>
  `,
  styles: [
    `.cf-turnstile { margin: 0px 0; }`
  ],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptchaTurnstileComponent implements AfterViewInit{
  @Output() tokenReceived = new EventEmitter<string>();

  ngAfterViewInit(): void {
    this.loadScript();
    // console.log('ngAfterViewInit')
  }

  private loadScript() {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = false;
    script.defer = false;
    script.onload = () => {
      this.initializeTurnstile();
    };
    document.body.appendChild(script);
  }

  private initializeTurnstile() {
    (window as any).onTurnstileSuccess = (token: string) => {
      this.tokenReceived.emit(token);
    };
  }

  // ngAfterViewInit(): void {
  //   (window as any).onTurnstileSuccess = (token: string) => {
  //     this.tokenReceived.emit(token);
  //   };
  // }
}

