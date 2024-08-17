import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { SideMenuComponent } from "../side-menu/side-menu.component";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { delay, filter, map, Observable, shareReplay } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    SideMenuComponent,
    RouterModule,
],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  private observer            = inject(BreakpointObserver);
  private router              = inject(Router);
  private activatedRoute      = inject(ActivatedRoute);
  private breakpointObserver  = inject(BreakpointObserver);

  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  @Input() titleSeccion: string = '';
  @Input() iconUrl: string = '';
  @Input() urlActive: string = '';
  @Input() pathFather: string = '';
  @Input() pathChild: string = '';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.sidenav.close();
      }
    });

    this.activatedRoute.firstChild?.data.subscribe(dataRouter => {
      this.titleSeccion = dataRouter["title"];
      this.iconUrl = dataRouter["icon"];
    });

    this.router.events.subscribe(() => {
      this.activatedRoute.firstChild?.data.subscribe(dataRouter => {
        this.urlActive = this.router.url;
        this.pathFather = this.router.url.split('/')[1];
        this.pathChild = this.router.url.split('/')[2];
        this.titleSeccion = dataRouter["title"];
        this.iconUrl = dataRouter["icon"];
      });
    });
  }

  public ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 1270px)'])
      .pipe(delay(0), untilDestroyed(this))
      .subscribe((res: { matches: any; }) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });

    this.router.events
      .pipe(
        untilDestroyed(this),
        filter((e) => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        if (this.sidenav.mode === 'over') {
          this.sidenav.close();
        }
      });
  }

}
