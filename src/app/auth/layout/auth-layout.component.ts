import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { LoadingSpinnerComponent } from "../../shared/components/loading-spinner/loading-spinner.component";

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
        LoadingSpinnerComponent
    ]
})
export class AuthLayoutComponent { }
