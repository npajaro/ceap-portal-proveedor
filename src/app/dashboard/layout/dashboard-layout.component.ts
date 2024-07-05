import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BreadcrumbsComponent } from "../components/breadcrumbs/breadcrumbs.component";

@Component({
    selector: 'app-dashboard-layout',
    standalone: true,
    templateUrl: './dashboard-layout.component.html',
    styleUrl: './dashboard-layout.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        BreadcrumbsComponent
    ]
})
export class DashboardLayoutComponent { }
