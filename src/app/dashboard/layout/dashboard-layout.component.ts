import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, Observable, shareReplay } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule, MatListItem } from '@angular/material/list';
import { RouterLinkActive, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { SideMenuComponent } from "../components/side-menu/side-menu.component";
import { DASHBOARD_ROUTES } from 'src/app/dashboard/dashboard.routes';
import {MatMenuModule} from '@angular/material/menu';
import { BreadcrumbsComponent } from "../components/breadcrumbs/breadcrumbs.component";
import { CoreDialogService } from '@services/core-dialog.service';
import { AuthService } from '@services/auth.service';
import { CoreOverlaySpinnerComponent } from '@shared/components/core-overlay-spinner/core-overlay-spinner.component';


@Component({
    selector: 'app-dashboard-layout',
    standalone: true,
    templateUrl: './dashboard-layout.component.html',
    styleUrl: './dashboard-layout.component.css',
    imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    DashboardLayoutComponent,
    RouterLinkActive,
    RouterLink,
    MatListItem,
    RouterModule,
    RouterOutlet,
    MatMenuModule,
    SideMenuComponent,
    BreadcrumbsComponent,
    CoreOverlaySpinnerComponent,
],
})
export class DashboardLayoutComponent {
  @ViewChild('subDrawer') subDrawer!: MatSidenav;
  public routes = DASHBOARD_ROUTES[0].children?.filter((route) => route.data);

  private coreDialogSv       = inject(CoreDialogService);
  private authSv             = inject(AuthService);
  private breakpointObserver = inject(BreakpointObserver);
  isActive = false;

  public currentUser = computed(() => this.authSv.currentUser());

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  trackByItem(index: number, item: any): any {
    return item.route;
  }

  showSubMenu = false;

  onMouseEnter() {
    this.showSubMenu = true;
  }

  onMouseLeave() {
    this.showSubMenu = false;
  }

  logout() {
    const dialog = this.coreDialogSv.openDialogAlert(
      'Cerrar sesión',
      '¿Está seguro que desea cerrar sesión?',
      'logout',
      'amarillo',
      'Cerrar sesión',
      'Cancelar'
    );
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.doLogout();
      }
    })
  }

  doLogout() {
    this.authSv.logout();
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

 }
