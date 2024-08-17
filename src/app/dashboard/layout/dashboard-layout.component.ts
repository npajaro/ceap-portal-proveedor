import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
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

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  isActive: boolean;
}

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
    BreadcrumbsComponent
],
})
export class DashboardLayoutComponent {
  @ViewChild('subDrawer') subDrawer!: MatSidenav;
  public routes = DASHBOARD_ROUTES[0].children?.filter((route) => route.data);


  private breakpointObserver = inject(BreakpointObserver);
  isActive = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  public menuItem = signal<MenuItem[]>([
    { label: 'Servicio', icon: 'storage', route: './services', isActive: false },
    { label: 'Setting', icon: 'settings', route: './settings', isActive: false },
    // { label: 'Parametros', icon: 'tune', route: './parameters' },
    // { label: 'Ciudades', icon: 'location_city', route: './ciudad-unidad-negocio',},
    // { label: 'Línea negocio', icon: 'store', route: './lineas-negocio' },
  ]);

  selectItem(item: any): void {
    const newMenuItems = this.menuItem().map(menuItem => {
      if (menuItem === item) {
        return { ...menuItem, isActive: false };
      } else {
        return { ...menuItem, isActive: true };
      }
    });
    this.menuItem.set(newMenuItems);
  }

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
    // Lógica de logout
    console.log('logout')
  }

 }
