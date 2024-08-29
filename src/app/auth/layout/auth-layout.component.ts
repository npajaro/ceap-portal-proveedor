import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { CoreOverlaySpinnerComponent } from "../../shared/components/core-overlay-spinner/core-overlay-spinner.component";

@Component({
    selector: 'app-auth-layout',
    standalone: true,
    templateUrl: './auth-layout.component.html',
    styleUrl: './auth-layout.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavContainer,
    CoreOverlaySpinnerComponent
]
})
export class AuthLayoutComponent { }
