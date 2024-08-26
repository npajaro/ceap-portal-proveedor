import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { TruncatePipe } from '@shared/pipes/truncate.pipe';
import { Subscription, filter } from 'rxjs';


@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TruncatePipe
],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private authSv = inject(AuthService);

  public currentUser = this.authSv.currentUser()

  public titleSection: string = '';
  public titleSub$!: Subscription;
  public icons: string = '';

  constructor() {
    this.activatedRoute.firstChild?.data.subscribe((dataRouter) => {
      this.titleSection = dataRouter["titleSections"];
      this.icons = dataRouter["icon"];
    });

    // También puedes mover la lógica de suscripción al evento de cambio de ruta aquí si es necesario.
    this.router.events.subscribe(() => {
      this.activatedRoute.firstChild?.data.subscribe((dataRouter) => {
        this.titleSection = dataRouter["titleSections"];
        this.icons = dataRouter["icon"];
      });
    });
   }

}
