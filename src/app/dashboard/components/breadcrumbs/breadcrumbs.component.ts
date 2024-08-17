import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent {
  private router = inject(Router);

  public titleSection: string = '';
  public titleSub$!: Subscription;
  public icons: string = '';

  constructor() {
    this.titleSub$ = this.argumentoRuta()
    .subscribe((data) => {
      this.titleSection = data.snapshot.data['title'];
      this.icons = data.snapshot.data['icon'];
      // document.title = `Bread - ${this.titleSection}`;
    })
   }



  public argumentoRuta() {
    return this.router.events
    .pipe(
      filter((event: any) => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
    )
  }


}
